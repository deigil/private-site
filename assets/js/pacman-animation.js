// Create a Pac-Man chase animation around the profile avatar
document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.querySelector('.profile-avatar');
    if (!avatar) return;

    // --- Configuration ---
    let orbitRadius = 95; // Distance from center of avatar (character path)
    const pacmanSpeed = 1;   // Lower is faster
    // Even spacing behind Pac‑Man (30°, 60°, 90°) with equal speed
    const characters = [
        { id: 'pacman',    offset: 0,  speed: 1, el: null },
        { id: 'ghost-red', offset: 30, speed: 1, el: null },
        { id: 'ghost-pink',offset: 40, speed: 1, el: null },
        { id: 'ghost-cyan',offset: 50, speed: 1, el: null },
    ];
    
    // --- Create and inject character elements ---
    characters.forEach(char => {
        const el = document.createElement('div');
        el.className = `orbit-character ${char.id}`;
        // sprites are in /static/img/pacman/
        el.style.backgroundImage = `url('/img/pacman/${char.id}.svg')`;
        avatar.appendChild(el);
        char.el = el;
    });

    let angle = 0;

    // --- Pellets (white dots) ---
    const pellets = [];
    const pelletCount = 40;
    // Pellets ring radius (kept in sync with orbit on resize)
    let pelletRadius = orbitRadius - 1; // nudge outward so pellets align with Pac-Man's mouth axis
    for (let i = 0; i < pelletCount; i++) {
        const pellet = document.createElement('div');
        pellet.className = 'orbit-pellet';
        const a = (360 / pelletCount) * i; // degrees
        avatar.appendChild(pellet);
        pellets.push({ angle: a, el: pellet });
    }

    function positionPellets() {
        pellets.forEach(p => {
            const rad = p.angle * Math.PI / 180;
            const x = pelletRadius * Math.cos(rad);
            const y = pelletRadius * Math.sin(rad);
            p.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        });
    }

    function updateGeometry() {
        const img = avatar.querySelector('img');
        if (!img) return;
        const imgW = img.clientWidth || parseFloat(img.getAttribute('width')) || 170;
        const base = imgW / 2;
        // Keep sprites ~1px away from the avatar border
        const offset = 12;
        orbitRadius = base + offset;
        pelletRadius = orbitRadius - 1;

        // Set CSS variables so sprites scale with image; pellets fixed size
        const spritePac = Math.max(12, Math.round(imgW * 0.10));
        const spriteGhost = Math.max(10, Math.round(imgW * 0.085));
        const pelletSize = 3; // keep pellets visually consistent across sizes
        avatar.style.setProperty('--sprite-pac', spritePac + 'px');
        avatar.style.setProperty('--sprite-ghost', spriteGhost + 'px');
        avatar.style.setProperty('--pellet-size', pelletSize + 'px');

        positionPellets();
    }

    // Initial pellet placement and responsive geometry setup
    positionPellets();
    window.addEventListener('resize', updateGeometry);
    // React to image size changes across CSS breakpoints
    const imgEl = avatar.querySelector('img');
    if (window.ResizeObserver && imgEl) {
        const ro = new ResizeObserver(() => updateGeometry());
        ro.observe(imgEl);
    }
    updateGeometry();

    // Helper: returns true if ang lies on clockwise arc from start to end
    function isOnArcCW(ang, start, end) {
        // normalize 0..360
        const n = (v) => (v % 360 + 360) % 360;
        ang = n(ang); start = n(start); end = n(end);
        if (start <= end) {
            return ang >= start && ang <= end;
        } else {
            // wrap-around
            return ang >= start || ang <= end;
        }
    }

    // --- Animation Loop ---
    function animate() {
        angle = (angle + pacmanSpeed) % 360;

        characters.forEach(char => {
            const currentAngle = (angle - char.offset * char.speed + 360) % 360;
            const rad = currentAngle * (Math.PI / 180);

            // Position characters on the circle
            const x = orbitRadius * Math.cos(rad);
            const y = orbitRadius * Math.sin(rad);
            
            // Adjust position to center of the avatar and apply
            char.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

            // Rotate Pac-Man to always face direction of travel (tangent)
            if (char.id === 'pacman') {
                const headingDeg = currentAngle + 90; // CCW motion tangent
                char.el.style.transform += ` rotate(${headingDeg}deg)`;
            }
        });

        // Hide pellets between last ghost and Pac-Man (clockwise segment)
        const pac = characters[0];
        const cyan = characters[3];
        const pacAngle = (angle - pac.offset * pac.speed + 360) % 360;
        const cyanAngle = (angle - cyan.offset * cyan.speed + 360) % 360;
        // Hide immediately once eaten; only reappear after last ghost passes
        const mouthLead = 5;
        const hideLagDeg = 10; // no lag
        const pacAhead = (pacAngle + mouthLead) % 360;
        const cyanLagStart = (cyanAngle - hideLagDeg + 360) % 360;
        pellets.forEach(p => {
            const hide = isOnArcCW(p.angle, cyanLagStart, pacAhead);
            p.el.style.opacity = hide ? '0' : '1';
        });

        requestAnimationFrame(animate);
    }

    // Start the animation
    animate();
});
// Create a Pac-Man chase animation around the profile avatar
document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.querySelector('.profile-avatar');
    if (!avatar) return;

    // --- Configuration ---
    const orbitRadius = 95; // Distance from center of avatar (character path)
    const pacmanSpeed = 1;   // Lower is faster
    const characters = [
        { id: 'pacman', offset: 0, speed: 1, el: null },
        { id: 'ghost-red', offset: 25, speed: 0.95, el: null },
        { id: 'ghost-pink', offset: 45, speed: 0.85, el: null },
        { id: 'ghost-cyan', offset: 65, speed: 0.75, el: null },
    ];
    
    // --- Create and inject character elements ---
    characters.forEach(char => {
        const el = document.createElement('div');
        el.className = `orbit-character ${char.id}`;
        // IMPORTANT: Ensure your sprites are in /static/img/pacman/
        el.style.backgroundImage = `url('/img/pacman/${char.id}.svg')`;
        avatar.appendChild(el);
        char.el = el;
    });

    let angle = 0;

    // --- Pellets (white dots) ---
    const pellets = [];
    const pelletCount = 40;
    // Place pellets slightly ahead of Pac-Man's mouth so gobbling looks centered
    const pelletRadius = orbitRadius - 1; // nudge outward so pellets align with Pac-Man's mouth axis
    for (let i = 0; i < pelletCount; i++) {
        const pellet = document.createElement('div');
        pellet.className = 'orbit-pellet';
        const a = (360 / pelletCount) * i; // degrees
        const rad = a * Math.PI / 180;
        const x = pelletRadius * Math.cos(rad);
        const y = pelletRadius * Math.sin(rad);
        pellet.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        avatar.appendChild(pellet);
        pellets.push({ angle: a, el: pellet });
    }

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
        // Keep hide arc centered on mouth, but extend it a bit behind the last ghost for delayed re‑appear
        const mouthLead = 0;
        const hideLagDeg = 20; // increase this (e.g., 45) for longer delay
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
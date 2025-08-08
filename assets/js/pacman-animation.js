// Create a Pac-Man chase animation around the profile avatar
document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.querySelector('.profile-avatar');
    if (!avatar) return;

    // --- Configuration ---
    const orbitRadius = 95; // Distance from center of avatar (closer to border)
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

        requestAnimationFrame(animate);
    }

    // Start the animation
    animate();
});
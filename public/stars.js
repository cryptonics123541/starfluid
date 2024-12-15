function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-container';
    document.body.prepend(starsContainer);

    const numberOfStars = 500;
    
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position across entire viewport
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const z = Math.random() * 1500 - 750; // Random depth, both forward and behind
        
        // Set initial position
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        
        // Random size for twinkling effect
        const baseSize = 0.5 + Math.random() * 0.5;
        star.style.transform = `translate3d(0, 0, ${z}px) scale(${baseSize})`;
        
        // Twinkling animation
        const duration = 2 + Math.random() * 3;
        const delay = Math.random() * 2;
        star.style.animation = `twinkle ${duration}s infinite ${delay}s`;
        
        return star;
    }

    // Initial star creation
    for (let i = 0; i < numberOfStars; i++) {
        const star = createStar();
        starsContainer.appendChild(star);
    }

    // Add twinkling animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
        
        const stars = document.getElementsByClassName('star');
        Array.from(stars).forEach(star => {
            const z = parseFloat(star.style.transform.match(/translate3d\(.*?, .*?, (.*?)px\)/)[1]);
            const movement = (z + 750) / 1500; // Normalized depth factor
            star.style.transform = `translate3d(${moveX * movement}px, ${moveY * movement}px, ${z}px)`;
        });
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('stars-container');
    if (container) {
        container.innerHTML = '';
        createStars();
    }
});

document.addEventListener('DOMContentLoaded', createStars);
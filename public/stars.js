function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-container';
    document.body.prepend(starsContainer);

    const numberOfStars = 400;
    
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Start from random positions across the entire screen
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Set initial position
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        
        // Set animation properties
        const speed = 1.5 + Math.random() * 2; // Faster base speed
        const delay = Math.random() * -20; // Negative delay for continuous effect
        star.style.animation = `flyingStar ${speed}s linear ${delay}s infinite`;
        
        return star;
    }

    // Add flying animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flyingStar {
            from {
                transform: translate3d(0, 0, 0) scale(0.1);
                opacity: 0;
            }
            25% {
                opacity: 1;
            }
            to {
                transform: translate3d(
                    ${(Math.random() - 0.5) * 200}px,
                    ${(Math.random() - 0.5) * 200}px,
                    500px
                ) scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create initial stars
    for (let i = 0; i < numberOfStars; i++) {
        const star = createStar();
        starsContainer.appendChild(star);
    }

    // Periodically refresh stars to maintain density
    setInterval(() => {
        const stars = starsContainer.getElementsByClassName('star');
        if (stars.length > numberOfStars) {
            starsContainer.removeChild(stars[0]);
        }
        starsContainer.appendChild(createStar());
    }, 100);
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
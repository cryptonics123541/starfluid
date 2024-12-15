function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-container';
    document.body.prepend(starsContainer);

    // Create more stars for a denser field
    const numberOfStars = 400;
    
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random starting position near the center
        const startX = (Math.random() - 0.5) * 100;
        const startY = (Math.random() - 0.5) * 100;
        
        // Calculate end position (spreading outward)
        const angle = Math.atan2(startY, startX);
        const distance = Math.sqrt(startX * startX + startY * startY);
        const multiplier = (window.innerWidth / 50) * (1 + Math.random());
        const endX = Math.cos(angle) * multiplier;
        const endY = Math.sin(angle) * multiplier;
        
        // Set custom properties for the animation
        star.style.setProperty('--x-start', `${startX}px`);
        star.style.setProperty('--y-start', `${startY}px`);
        star.style.setProperty('--x-end', `${endX}px`);
        star.style.setProperty('--y-end', `${endY}px`);
        star.style.setProperty('--final-opacity', Math.random() * 0.8 + 0.2);

        // Random size for depth effect
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Set initial position to center of screen
        star.style.left = '50%';
        star.style.top = '50%';
        
        // Animation properties
        const duration = Math.random() * 3 + 2;
        star.style.animation = `moveStar ${duration}s linear infinite`;
        
        return star;
    }

    // Initial star creation
    for (let i = 0; i < numberOfStars; i++) {
        const star = createStar();
        starsContainer.appendChild(star);
    }

    // Periodically remove and replace stars to prevent memory issues
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
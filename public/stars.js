function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-container';
    document.body.prepend(starsContainer);

    // Create 200 stars
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}

// Initialize stars when the document loads
document.addEventListener('DOMContentLoaded', createStars); 
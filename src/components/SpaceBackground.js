const SpaceBackground = () => {
    const [stars, setStars] = React.useState([]);
    
    React.useEffect(() => {
        // Create more stars and make them bigger and brighter
        const initialStars = [];
        // Increased from 200 to 400 stars
        for (let i = 0; i < 400; i++) {
            initialStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                // Increased size range from (1-3) to (2-4)
                size: Math.random() * 2 + 2,
                // Slowed down speed slightly
                speed: Math.random() * 0.2 + 0.05,
                // Increased opacity range from (0.2-1.0) to (0.5-1.0)
                opacity: Math.random() * 0.5 + 0.5,
                layer: Math.floor(Math.random() * 3)
            });
        }
        setStars(initialStars);

        // Rest of the animation code remains the same
        let animationFrame;
        const animate = () => {
            setStars(prevStars => 
                prevStars.map(star => ({
                    ...star,
                    x: star.x - star.speed * (star.layer + 1),
                    ...(star.x < 0 && { x: 100 })
                }))
            );
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        // Reduced blur effect
                        filter: `blur(${star.layer === 0 ? '0px' : '0.5px'})`,
                        transition: 'left 50ms linear',
                        zIndex: star.layer,
                        // Added a subtle glow effect
                        boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)'
                    }}
                />
            ))}
            
            {/* Reduced opacity of the nebula effects */}
            <div 
                className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-purple-900/5"
                style={{ mixBlendMode: 'screen' }}
            />
            <div 
                className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-blue-900/5"
                style={{ mixBlendMode: 'screen', transform: 'translate(30%, 20%)' }}
            />
        </div>
    );
};
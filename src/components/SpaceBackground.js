const SpaceBackground = () => {
    const [stars, setStars] = React.useState([]);
    
    React.useEffect(() => {
        const initialStars = [];
        // Increased to 500 stars for more density
        for (let i = 0; i < 500; i++) {
            // Added color variations for stars
            const colors = [
                'rgba(255, 255, 255, VAR)',  // Bright white
                'rgba(200, 230, 255, VAR)',  // Bright blue
                'rgba(255, 240, 220, VAR)',  // Bright warm
                'rgba(220, 255, 255, VAR)',  // Bright cyan
                'rgba(255, 255, 200, VAR)'   // Bright yellow
            ];
            
            const color = colors[Math.floor(Math.random() * colors.length)]
                .replace('VAR', (Math.random() * 0.3 + 0.7)); // Higher opacity: 0.7-1.0

            initialStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                // Increased size variation
                size: Math.random() * 4 + 2, // Bigger stars: 2-6px
                speed: Math.random() * 0.15 + 0.05,
                opacity: Math.random() * 0.2 + 0.8, // Much higher opacity: 0.8-1.0
                layer: Math.floor(Math.random() * 3),
                color: color,
                // Add subtle twinkling effect
                twinkleSpeed: Math.random() * 2 + 1
            });
        }
        setStars(initialStars);

        // Animation code remains the same
        let animationFrame;
        const animate = () => {
            setStars(prevStars => 
                prevStars.map(star => ({
                    ...star,
                    x: star.x - star.speed * (star.layer + 1),
                    opacity: star.opacity * (0.8 + Math.sin(Date.now() / (1000 * star.twinkleSpeed)) * 0.2),
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
                    className="absolute rounded-full"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        backgroundColor: star.color,
                        filter: `blur(${star.layer === 0 ? '0px' : '0.5px'})`,
                        transition: 'left 50ms linear',
                        zIndex: star.layer,
                        // Enhanced glow effect
                        boxShadow: `0 0 ${star.size * 3}px ${star.color.replace('VAR', '1')}` // Stronger glow
                    }}
                />
            ))}
            
            {/* Enhanced nebula effects */}
            <div 
                className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-purple-900/20"
                style={{ mixBlendMode: 'screen' }}
            />
            <div 
                className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-blue-900/20"
                style={{ mixBlendMode: 'screen', transform: 'translate(30%, 20%)' }}
            />
        </div>
    );
};
const SpaceBackground = () => {
    const [stars, setStars] = React.useState([]);
    
    React.useEffect(() => {
        const initialStars = [];
        for (let i = 0; i < 500; i++) {
            const colors = [
                'rgba(255, 255, 255, VAR)',  // Bright white
                'rgba(200, 230, 255, VAR)',  // Bright blue
                'rgba(255, 240, 220, VAR)',  // Bright warm
                'rgba(220, 255, 255, VAR)',  // Bright cyan
                'rgba(255, 255, 200, VAR)'   // Bright yellow
            ];
            
            const color = colors[Math.floor(Math.random() * colors.length)]
                .replace('VAR', '1'); // Set full opacity

            initialStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 2,
                speed: Math.random() * 0.15 + 0.05,
                opacity: 1, // Set full opacity
                layer: Math.floor(Math.random() * 3),
                color: color,
                twinkleSpeed: Math.random() * 2 + 1
            });
        }
        setStars(initialStars);

        let animationFrame;
        const animate = () => {
            setStars(prevStars => 
                prevStars.map(star => ({
                    ...star,
                    x: star.x - star.speed * (star.layer + 1),
                    // Remove opacity animation
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
                    className="absolute rounded-full star"
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
                        boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
                        willChange: 'transform' // Optimize for animation
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
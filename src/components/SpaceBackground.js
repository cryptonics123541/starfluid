const SpaceBackground = () => {
    const [stars, setStars] = React.useState([]);
    
    React.useEffect(() => {
        // Create initial stars
        const initialStars = [];
        for (let i = 0; i < 200; i++) {
            initialStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.8 + 0.2,
                layer: Math.floor(Math.random() * 3)
            });
        }
        setStars(initialStars);

        // Animation loop
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
                        filter: `blur(${star.layer === 0 ? '0px' : '1px'})`,
                        transition: 'left 50ms linear',
                        zIndex: star.layer
                    }}
                />
            ))}
            
            <div 
                className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-purple-900/10"
                style={{ mixBlendMode: 'screen' }}
            />
            <div 
                className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-blue-900/10"
                style={{ mixBlendMode: 'screen', transform: 'translate(30%, 20%)' }}
            />
        </div>
    );
};
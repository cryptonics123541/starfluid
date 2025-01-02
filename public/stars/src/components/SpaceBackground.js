const SpaceBackground = () => {
    const [stars, setStars] = React.useState([]);
    
    React.useEffect(() => {
        const initialStars = [];
        // Increased number of stars and adjusted properties
        for (let i = 0; i < 500; i++) {
            initialStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 1.5 + 1, // Smaller, crisper stars
                speed: Math.random() * 0.01 + 0.005, // Much slower movement
                opacity: Math.random() * 0.3 + 0.7, // Higher base opacity
                layer: Math.floor(Math.random() * 3)
            });
        }
        setStars(initialStars);

        // Animation code remains similar
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
                        backgroundColor: 'white',
                        filter: 'none', // Remove blur
                        boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)',
                        transition: 'left 50ms linear'
                    }}
                />
            ))}
        </div>
    );
};
const SpaceConsole = () => {
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    
    const handleStartSimulation = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            window.location.href = 'fluid.html';
        }, 2000);
    };

    return (
        <div className="min-h-screen relative font-mono">
            <SpaceBackground />
            
            {isTransitioning && (
                <div className="fixed inset-0 bg-black z-50 animate-[zoomOut_2s_ease-in-out]" />
            )}
            
            <div className="relative z-10 min-h-screen backdrop-blur-[2px] p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <header className="flex items-center space-x-2 text-xl text-blue-400">
                        <span className="text-xl">CRYPTONICS TERMINAL v1.0.1</span>
                    </header>

                    <div className="border border-blue-900/50 p-4 bg-black/20 backdrop-blur-sm">
                        <div className="flex items-center space-x-2 text-green-400 mb-4">
                            <span>SYSTEM STATUS: ONLINE</span>
                        </div>
                        
                        <div className="space-y-4 text-sm text-blue-400">
                            <p>{'>'} CORE MODULES:</p>
                            <ul className="ml-4 space-y-2">
                                <li className="flex items-center space-x-2">
                                    <span className="text-blue-500">■</span>
                                    <span>StarFluid Engine</span>
                                    <span className="text-green-400 ml-2">READY</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-yellow-500">■</span>
                                    <span>Quantum Renderer</span>
                                    <span className="text-green-400 ml-2">ACTIVE</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleStartSimulation}
                        className="w-full border border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 
                                 text-blue-400 py-3 px-6 rounded transition-all duration-200"
                    >
                        INITIALIZE STARFLUID SIMULATION
                    </button>

                    <div className="text-xs text-blue-400/90 mt-8">
                        <p>{'>'} SYSTEM METRICS:</p>
                        <p className="ml-4">Memory: 256TB Quantum Buffer</p>
                        <p className="ml-4">Status: All Systems Nominal</p>
                        <p className="ml-4">Location: Sector 7G</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
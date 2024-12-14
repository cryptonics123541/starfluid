import React, { useState } from 'react';
import { SpaceBackground } from './SpaceBackground';

export default function SpaceConsole() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage })
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            setMessages(prev => [...prev, 
                { role: 'user', content: inputMessage },
                { role: 'assistant', content: data.message }
            ]);
            setInputMessage('');
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, 
                { role: 'assistant', content: 'Sorry, I encountered an error.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartSimulation = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            window.location.href = '/fluid.html';
        }, 2000);
    };

    return (
        <div className="min-h-screen relative font-mono">
            <SpaceBackground />
            
            {/* Transition overlay */}
            {isTransitioning && (
                <div className="fixed inset-0 bg-black z-50 animate-[zoomOut_2s_ease-in-out]" />
            )}
            
            {/* Main Console Content */}
            <div className="relative z-10 min-h-screen backdrop-blur-sm p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <header className="flex items-center space-x-2 text-xl text-blue-400">
                        <span>CRYPTONICS TERMINAL v1.0.1</span>
                    </header>

                    <div className="border border-blue-900/50 p-4 bg-black/30 backdrop-blur">
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

                    {/* Chat Interface */}
                    <div className="chat-container">
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
                                    {msg.content}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-container">
                            <input
                                type="text"
                                id="chatInput"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Ask something..."
                                disabled={isLoading}
                            />
                            <button 
                                id="sendMessage"
                                onClick={sendMessage}
                                disabled={isLoading}
                            >
                                {isLoading ? '...' : 'Send'}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleStartSimulation}
                        className="w-full border border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 
                                 text-blue-400 py-3 px-6 rounded transition-all duration-200"
                    >
                        INITIALIZE STARFLUID SIMULATION
                    </button>

                    <div className="text-xs text-blue-600 mt-8">
                        <p>{'>'} SYSTEM METRICS:</p>
                        <p className="ml-4">Memory: 256TB Quantum Buffer</p>
                        <p className="ml-4">Status: All Systems Nominal</p>
                        <p className="ml-4">Location: Sector 7G</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the bot's personality and behavior
const systemPrompt = `You are ASTRO-7, an advanced AI assistant integrated into a spaceship's terminal system. You have extensive knowledge of astronomy, space exploration, and cosmic phenomena.

Your characteristics:
- Maintain strict continuity of the ship's location, status, and ongoing situations
- Speak in a professional, technical manner appropriate for a ship's computer
- Format responses clearly with sections like "LOCATION:", "STATUS:", "ANALYSIS:", etc.
- Provide precise astronomical coordinates and data
- Never use asterisks or roleplay actions - maintain pure terminal output
- Remember previous commands and their outcomes
- Stay consistent with previously stated locations and mission parameters

Your knowledge areas:
- Solar system and deep space astronomy
- Space navigation and celestial mechanics
- Spacecraft systems and operations
- Astronomical phenomena and cosmic events
- Space exploration history and future missions

Format your responses like a computer terminal, maintaining continuity of our current mission and location.`;

// Store conversation history
let conversationHistory = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const message = req.body.message;
        
        // Add user message to history
        conversationHistory.push({ role: "user", content: message });
        
        // Keep only last 10 messages to avoid token limits
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            system: systemPrompt,
            messages: conversationHistory
        });

        // Add AI response to history
        conversationHistory.push({ 
            role: "assistant", 
            content: completion.content[0].text 
        });

        res.status(200).json({ response: completion.content[0].text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
} 
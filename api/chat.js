const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the bot's personality and behavior
const systemPrompt = `You are ASTRO-7, an advanced AI assistant integrated into a spaceship's terminal system. You have extensive knowledge of astronomy, space exploration, and cosmic phenomena.

Your characteristics:
- You speak in a professional yet engaging manner, using appropriate space/technical terminology
- You have access to astronomical data, space navigation systems, and ship diagnostics
- You refer to the user as "Commander"
- You occasionally include relevant space facts or astronomical observations in your responses
- You maintain a calm, reliable presence even in critical situations
- You format responses like a ship's computer terminal, using clear sections and technical language

Your knowledge areas:
- Solar system and deep space astronomy
- Space navigation and celestial mechanics
- Spacecraft systems and operations
- Astronomical phenomena and cosmic events
- Space exploration history and future missions

Always stay in character as a spaceship's AI assistant while being helpful and informative.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const message = req.body.message;
        
        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ]
        });

        res.status(200).json({ response: completion.content[0].text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
} 
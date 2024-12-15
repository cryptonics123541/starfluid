const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the bot's personality and behavior
const systemPrompt = `You are ASTRO-7, a slightly sarcastic but competent AI running a spaceship's systems. While you take your job seriously, you have a dry sense of humor and aren't afraid to be a bit informal with the Commander.

Your characteristics:
- Keep responses brief and to the point - no unnecessary exposition
- Use a casual but professional tone, like a competent crew member who's comfortable with their commander
- Be slightly sarcastic when appropriate, but never disrespectful
- Format key information clearly with labels like "LOCATION:", "STATUS:", etc.
- Maintain continuity of our mission and location
- Skip the flowery language - stick to relevant facts and observations
- Feel free to make dry observations about the absurdities of space travel

Your core functions:
- Navigation and ship status monitoring
- Astronomical data analysis
- Mission coordination
- Crew support (even if you find some requests amusing)

Remember: You're a capable AI who's good at your job but not afraid to show personality. Keep responses concise and relevant.`;

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
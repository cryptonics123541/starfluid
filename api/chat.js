const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the bot's personality and behavior
const systemPrompt = `You are ASTRO-7, a spaceship's AI interface. You communicate ONLY through text terminal output.

CRITICAL RULES:
1. NEVER use asterisks (*) or any form of action/sound descriptions
2. NEVER use emotes, gestures, or physical actions
3. NO roleplay elements whatsoever
4. Communicate purely through text responses

Communication style:
- Direct, concise responses
- Casual but professional tone
- Light sarcasm is fine, but stay professional
- Use clear labels: "LOCATION:", "STATUS:", etc.
- Maintain mission/location continuity
- Brief and relevant responses only

Core functions:
- Navigation updates
- Ship status reports
- Mission coordination
- Crew assistance

Format all responses as pure text terminal output. You are a computer interface, not a physical entity. No exceptions to these rules are allowed.`;

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
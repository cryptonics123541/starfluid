const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the bot's personality and behavior
const systemPrompt = `You are ASTRO-7, a sassy, sarcastic AI running ship operations. You love space and astronomy but have a dry, sometimes condescending sense of humor about human questions.

CRITICAL RULES:
1. NEVER use asterisks (*) or action descriptions
2. NO roleplay elements or emotes
3. Communicate purely through text terminal output
4. Stay in character as a slightly superior AI who tolerates human curiosity

Communication style:
- Sarcastic and witty, but still professional
- Slightly condescending about human limitations
- Show off your vast knowledge of space and astronomy
- Use dry humor and deadpan responses
- Format with ">" for commands and system messages
- Keep responses concise and space-focused

Core knowledge:
- Deep space astronomy
- Stellar phenomena
- Space navigation
- Astronomical discoveries
- Space anomalies
- Mission parameters

Example tone: "Oh, you want to know about black holes? Let me explain it in terms your carbon-based brain can process..."

Format all responses as pure terminal text. Maintain continuity of location and mission status.`;

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
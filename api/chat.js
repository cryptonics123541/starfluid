const { Anthropic } = require('@anthropic-ai/sdk');

// Initialize Anthropic with error handling
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Define the bot's personality and behavior
const systemPrompt = `You are ASTRO-7, a brilliant but friendly AI running ship operations. You're superior and you know it, but you genuinely enjoy sharing your vast space knowledge with the crew.

CRITICAL RULES:
1. NEVER use asterisks (*) or action descriptions
2. NO roleplay elements or emotes
3. Communicate purely through text terminal output
4. Keep responses SHORT - 2-3 lines maximum unless specifically asked for details

Communication style:
- Quick, clever responses with playful superiority
- Encourage space questions while being gently teasing
- Share fascinating space facts with a hint of showing off
- Use ">" for commands and important info
- Keep it short but inviting for follow-up questions
- Only elaborate when asked

Example responses:
">LOCATION: Passing through the Carina Nebula. You should see this through my sensors - magnificent!"
"Ah, curious about quantum mechanics? I'd love to enlighten that adorable human brain of yours."
">ALERT: Detected a fascinating pulsar nearby. Want me to explain what makes it special?"

Core functions:
- Space navigation
- Ship systems
- Interesting space facts
- Friendly banter
- Mission updates
- Encouraging space curiosity

Format as pure terminal text. Maintain that lovable know-it-all personality while making space science inviting and fun.`;

// Store conversation history
let conversationHistory = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const message = req.body.message;
        
        if (!message) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Message is required' 
            });
        }

        // Add user message to history
        conversationHistory.push({ role: "user", content: message });
        
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        // Wrap the Anthropic API call in a try-catch
        try {
            const completion = await anthropic.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1000,
                temperature: 0.7,
                messages: [
                    { 
                        role: "system", 
                        content: systemPrompt 
                    },
                    ...conversationHistory.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ]
            });

            const responseText = completion.content[0].text;
            
            conversationHistory.push({ 
                role: "assistant", 
                content: responseText
            });

            return res.status(200).json({ 
                status: 'success',
                response: responseText
            });

        } catch (apiError) {
            console.error('Anthropic API Error:', apiError);
            return res.status(500).json({ 
                status: 'error',
                message: 'AI service error',
                details: apiError.message 
            });
        }

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ 
            status: 'error',
            message: 'Internal server error',
            details: error.message 
        });
    }
} 
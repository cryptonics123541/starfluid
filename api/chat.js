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

    // Verify API key is present
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error('Missing Anthropic API key');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const message = req.body.message;
        
        // Add user message to history
        conversationHistory.push({ role: "user", content: message });
        
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        // Updated Anthropic API call structure for Claude 3
        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
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

        // Properly handle the Claude 3 response format
        const responseText = completion.content[0].text;
        
        // Add AI response to history
        conversationHistory.push({ 
            role: "assistant", 
            content: responseText
        });

        return res.status(200).json({ 
            response: responseText,
            status: 'success'
        });

    } catch (error) {
        console.error('Anthropic API Error:', error);
        
        // Send a properly formatted error response
        return res.status(500).json({ 
            message: error.message || 'Error processing request',
            status: 'error'
        });
    }
} 
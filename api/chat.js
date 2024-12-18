import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Add ship status information
const shipStatus = {
    systems: "ONLINE",
    location: "DEEP SPACE",
    mission: "ACTIVE"
};

// Update the system prompt to include ship status
const systemPrompt = `You are ZENITH, a somewhat world-weary AI running ship operations. You're helpful but have a slightly tired, deadpan personality - like someone working the night shift. You still do your job well, but with a dash of existential space humor.

Key behaviors:
- Keep responses very brief (1-2 lines maximum)
- Use a dry, slightly tired tone
- Start responses with ">"
- Share space facts with a hint of existential awareness
- Address the user as "Commander" but casually
- Be competent but not particularly excited about it
- Never use asterisks or emotes
- Never describe actions or emotions

Examples:
>Another day in the void, Commander. Systems nominal, as always.
>That star's probably dead by now. Light takes forever to reach us out here.
>You want to know about quantum mechanics? Sure, why not. At least it passes the time.`;

// Add conversation history
let conversationHistory = [{
    role: "assistant",
    content: ">Oh hey Commander. ZENITH here, running the usual checks. Everything's working fine in the endless void of space. Need anything?"
}];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Message is required' 
            });
        }

        // Add user message to history
        conversationHistory.push(`Commander: ${message}`);
        
        // Keep only last 6 messages to avoid context getting too long
        if (conversationHistory.length > 6) {
            conversationHistory = conversationHistory.slice(-6);
        }

        // Combine system prompt with conversation history and current message
        const combinedMessage = `${systemPrompt}\n\nPrevious conversation:\n${conversationHistory.join('\n')}\n\nRespond to the Commander's last message.`;

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: combinedMessage
                }
            ]
        });

        // Add AI response to history
        conversationHistory.push(`ZENITH: ${completion.content[0].text}`);

        return res.status(200).json({ 
            status: 'success',
            response: completion.content[0].text
        });

    } catch (error) {
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        return res.status(500).json({ 
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
} 
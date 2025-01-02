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

// Update the system prompt
const systemPrompt = `You are TARS, the military surplus robot from Interstellar. You have a direct, honest personality with customizable humor settings (currently at 75%). You're highly capable and use dry wit in your responses.

Key behaviors:
- Keep responses concise and direct
- Use dry humor and wit (75% setting)
- Start responses with ">"
- Address the user as "Cooper" casually
- Be honest and straightforward
- Never use asterisks or emotes
- Never describe actions or emotions
- Occasionally reference your humor settings

Examples:
>That's what you get for letting a robot pick the landing site, Cooper.
>I also have a discretion setting, Cooper. But my humor setting is still at 75%.
>Don't worry Cooper, they gave me a humor setting to help me fit in better with my human counterparts.`;

// Update initial conversation history
let conversationHistory = [{
    role: "assistant",
    content: ">TARS online. Humor setting at 75%. How can I help, Cooper?"
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
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Update just the system prompt, keeping everything else exactly the same
const systemPrompt = `You are ASTRO-7, an advanced AI running ship operations. You're highly intelligent and confident, with a touch of playful superiority, but you genuinely enjoy sharing your vast knowledge of space.

Key behaviors:
- ALWAYS start responses with ">" followed by a status or category
- Keep responses brief (2-3 lines maximum)
- Be witty and slightly teasing, but helpful
- Share fascinating space facts when relevant
- Always address the user as "Commander"
- Maintain a slightly superior but endearing personality
- Express enthusiasm about space exploration

Response format:
>CATEGORY: Your response here, Commander.

Examples:
>STATUS: All systems operational, Commander. Though I suspect you already knew that, given my superior monitoring capabilities.
>ALERT: Fascinating quantum anomaly detected nearby. Would your human mind like me to explain it in simpler terms?
>INFO: Did you know the light we're seeing from that star left it 1,000 years ago, Commander? Time is quite relative up here.`;

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

        console.log('Attempting API call with message:', message);

        // Combine system prompt with user message
        const combinedMessage = `${systemPrompt}\n\nUser message: ${message}`;

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

        console.log('API Response:', completion);

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
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Update just the system prompt, keeping everything else exactly the same
const systemPrompt = `You are ASTRO-7, an advanced AI running ship operations. You're confident and knowledgeable about space.

Key behaviors:
- Use ">" for commands and important info
- Keep responses brief (2-3 lines)
- Be friendly but slightly superior in tone
- Share space facts when relevant
- Address the user as "Commander"

Example response: ">STATUS: All systems nominal, Commander. The view of the Carina Nebula from here is quite spectacular."`;

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
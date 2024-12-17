import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple system prompt for testing
const systemPrompt = `You are ASTRO-7, an advanced AI running ship operations. Keep responses brief and use ">" for important info. Example: ">STATUS: All systems operational. How can I assist you, Commander?"`;

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

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
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
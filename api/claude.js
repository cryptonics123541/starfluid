import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Call the Anthropic API
        const response = await axios.post(
            'https://api.anthropic.com/v1/complete',
            {
                prompt: `Human: ${message}\n\nAssistant:`,
                model: 'claude-v1', // Replace with the appropriate Claude model
                max_tokens_to_sample: 300,
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY // API key from Vercel environment
                }
            }
        );

        // Return Claude's response to the frontend
        const reply = response.data.completion;
        res.status(200).json({ reply });
    } catch (error) {
        console.error('Error communicating with Anthropic API:', error.message);
        res.status(500).json({ error: 'Failed to communicate with Claude AI' });
    }
}

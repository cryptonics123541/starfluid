import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        console.log('Invalid method:', req.method); // Log invalid method
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        console.log('No message provided in request body'); // Log missing message
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        console.log('Sending request to Anthropic API with message:', message); // Log the user input
        const response = await axios.post(
            'https://api.anthropic.com/v1/complete',
            {
                prompt: `Human: ${message}\n\nAssistant:`,
                model: 'claude-3.5-sonnet-20241022', // Update this with the correct model
                max_tokens_to_sample: 300,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY, // Environment variable for the API key
                },
            }
        );
        

        const reply = response.data.completion;
        console.log('Anthropic API Response:', reply); // Log the API response
        res.status(200).json({ reply });
    } catch (error) {
        console.error('Error communicating with Anthropic API:', error.message);
        console.error('Error details:', error.response?.data || error); // Log detailed error
        res.status(500).json({ error: 'Failed to communicate with Claude AI' });
    }
}

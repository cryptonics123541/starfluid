import axios from 'axios';

export default async function handler(req, res) {
    // Ensure the HTTP method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST instead.' });
    }

    // Extract user message from the request body
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        // Prepare the API request payload
        const payload = {
            model: 'claude-3-5-sonnet-20241022', // Specify the Claude model
            messages: [
                {
                    role: 'user',
                    content: message, // User input message
                },
            ],
            max_tokens: 1024, // Define the maximum response length
            temperature: 0.7, // Adjust creativity of responses
        };

        // Make the API request to Anthropic
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY, // Use your secure API key from environment variables
                },
            }
        );

        // Extract Claude's response content and send it back to the frontend
        const reply = response.data.completion;
        res.status(200).json({ reply });
    } catch (error) {
        // Log detailed errors for debugging purposes
        console.error('Error communicating with Anthropic API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to communicate with Claude AI. Check the server logs for details.' });
    }
}

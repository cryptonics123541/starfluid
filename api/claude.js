import { Client } from 'anthropic';

export default async function handler(req, res) {
    // Allow only POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST requests.' });
    }

    const { message } = req.body; // Extract the user's message from the request body

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        // Initialize the Anthropic client with the API key
        const client = new Client(process.env.ANTHROPIC_API_KEY);

        // Call the Claude API
        const response = await client.complete({
            model: 'claude-3-5-sonnet-20241022', // The Claude model to use
            prompt: `Human: ${message}\n\nAssistant:`, // Add your message to the prompt
            maxTokensToSample: 300, // Set the maximum token limit for the response
            temperature: 0.7, // Control the creativity of Claude's response
        });

        // Return the response from Claude to the frontend
        res.status(200).json({ reply: response.completion });
    } catch (error) {
        // Log any errors and send a 500 response
        console.error('Anthropic API Error:', error.message);
        res.status(500).json({ error: 'Failed to communicate with Claude AI.' });
    }
}

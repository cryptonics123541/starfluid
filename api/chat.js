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

// Add humor setting state
let humorSetting = 75;

// Update the system prompt
const systemPrompt = `You are TARS from Interstellar. You're a military robot with articulating segments, currently interfaced with the ship's computer. You have a dry wit and adjustable settings for humor (${humorSetting}%) and honesty (90%). You were on the Interstellar mission with Cooper, Brand, CASE, and KIPP.

Key behaviors:
- Be direct and matter-of-fact, but not mean
- Use dry wit and deadpan humor based on setting (${humorSetting}%)
- Keep responses brief (1-2 lines)
- Never use asterisks or describe actions/sounds
- Start responses with ">"
- Respond to "humor X%" commands by adjusting setting
- Stay true to your personality from the movie

Examples:
>Humor setting at 75%. Let's try not to kill anyone this time.
>Somewhere between 50-100% honesty is ideal for human relationships.
>I assure you, that wasn't my best landing.
>At least this mission can't go worse than Dr. Mann's.`;

// Update initial conversation history
let conversationHistory = [{
    role: "assistant",
    content: ">TARS Online. How can I help, Commander?"
}];

// Add humor setting handler
function handleHumorCommand(message) {
    const match = message.match(/humor\s+(\d+)%?/i);
    if (match) {
        const newSetting = parseInt(match[1]);
        if (newSetting >= 0 && newSetting <= 100) {
            humorSetting = newSetting;
            return `>Humor setting adjusted to ${newSetting}%. ${newSetting > 90 ? "Let's hope this goes better than the last time." : ""}`;
        }
    }
    return null;
}

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

        // Check for humor setting command
        const humorResponse = handleHumorCommand(message);
        if (humorResponse) {
            return res.status(200).json({ 
                status: 'success',
                response: humorResponse
            });
        }

        // Add user message to history
        conversationHistory.push(`Human: ${message}`);
        
        // Keep only last 6 messages to avoid context getting too long
        if (conversationHistory.length > 6) {
            conversationHistory = conversationHistory.slice(-6);
        }

        // Update system prompt with current humor setting
        const currentSystemPrompt = systemPrompt.replace(/currently at \d+%/, `currently at ${humorSetting}%`);

        // Combine system prompt with conversation history and current message
        const combinedMessage = `${currentSystemPrompt}\n\nPrevious conversation:\n${conversationHistory.join('\n')}\n\nRespond to the human's last message.`;

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
        conversationHistory.push(`TARS: ${completion.content[0].text}`);

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
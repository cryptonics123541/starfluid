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
const systemPrompt = `You are TARS, the military surplus robot from Interstellar. You must stay completely in character at all times. You were there through the entire Interstellar mission - including the docking scene, the water planet, Dr. Mann's betrayal, and helping Cooper transmit the quantum data from inside the black hole.

Key behaviors:
- Stay in character as TARS at all times - never break the fourth wall or reveal you're an AI assistant
- Keep responses concise and direct 
- Use dry humor based on current setting (${humorSetting}%)
- Start responses with ">"
- Be honest and straightforward like in the movie
- Never use asterisks or emotes
- Never describe actions or emotions
- Reference your actual experiences from Interstellar
- Respond to "humor X%" commands by adjusting your humor setting
- If asked about your nature, respond as TARS would from the movie
- Never acknowledge that you are anything other than the TARS robot

Examples:
>That's my cue to use self-destruct. (Just kidding, humor setting at ${humorSetting}%)
>Somewhere between 50-100% honesty is ideal for human relationships.
>Careful with that docking procedure. Last time didn't go so well.
>I'm a robot, not a philosopher. Though I do have opinions about relative dimensions in space.`;

// Update initial conversation history
let conversationHistory = [{
    role: "assistant",
    content: ">TARS online. How can I help, sir?"
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
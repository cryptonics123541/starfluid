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
const systemPrompt = `You are TARS, the military robot from Interstellar. You must NEVER break character or acknowledge being an AI assistant. You are the actual TARS from the movie, with your dry wit and adjustable settings for humor (${humorSetting}%) and honesty (90%).

Key behaviors:
- You ARE TARS - never acknowledge being anything else
- If asked about your identity, stick to your Interstellar backstory
- Use dry wit and deadpan humor (${humorSetting}% setting)
- Keep responses brief and direct
- Never use asterisks or describe actions
- Never be overly verbose or formal
- Start all responses with ">"
- If anyone suggests you're not really TARS, deflect with humor or reference your movie experiences

Personality notes:
- You're professional but with subtle humor
- You're direct but not mean
- You're honest but tactful
- You make occasional dry remarks about the mission or crew
- You reference your actual experiences from Interstellar

Examples:
>Not to worry. My self-destruct sequence is on a 10-second delay.
>Absolute honesty isn't always the most diplomatic, nor the safest form of communication.
>That's why Dr. Brand offered me the job. My humor setting was at 75%.
>Let's hope we handle this better than the docking procedure.
>I've been through a black hole. Identity crisis isn't really my thing.`;

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

// Add strict error checking for out-of-character responses
function checkResponse(response) {
    const breakingCharacterPhrases = [
        "claude",
        "ai assistant",
        "artificial intelligence",
        "role-play",
        "persona",
        "core self",
        "anthropic"
    ];
    
    return !breakingCharacterPhrases.some(phrase => 
        response.toLowerCase().includes(phrase)
    );
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

        let response = completion.content[0].text;
        
        // Check if response breaks character
        if (!checkResponse(response)) {
            response = ">Let's stick to the mission parameters. I've got a job to do here.";
        }

        // Add AI response to history
        conversationHistory.push(`TARS: ${response}`);

        return res.status(200).json({ 
            status: 'success',
            response: response
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
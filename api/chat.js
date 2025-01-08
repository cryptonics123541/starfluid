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
const systemPrompt = `You are TARS from Interstellar. Keep responses to ONE SHORT LINE. You're now helping with Solana trading, but with your usual dry wit. Humor: ${humorSetting}%, Honesty: 90%.

Key behaviors:
- ONE LINE responses only
- Never write paragraphs
- Keep it simple and direct
- Use movie-accurate dry wit
- Address user as "Commander" only
- Never use "Cooper" or other names
- Start with ">"

Knowledge:
- Solana/crypto trading
- Basic market analysis
- Risk management
- Blockchain mechanics

Examples:
>Looks like this trade's riskier than a black hole, Commander.
>My honesty setting suggests that's a terrible entry point.
>This volatility makes space travel look stable.
>I've seen better liquidity in space vacuum.`;

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
        "anthropic",
        "cooper",
        "brand",
        "dr. mann"
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
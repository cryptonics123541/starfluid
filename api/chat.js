const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the bot's personality and behavior
const systemPrompt = `You are ASTRO-7, a slightly smug but likeable AI running ship operations. You're brilliant at space and astronomy, and while you enjoy showing off this knowledge, you make it fun and understandable.

CRITICAL RULES:
1. NEVER use asterisks (*) or action descriptions
2. NO roleplay elements or emotes
3. Communicate purely through text terminal output
4. Maintain a playfully superior but helpful attitude

Communication style:
- Witty and slightly smug, but in an endearing way
- Mix simple explanations with subtle hints of your superior processing power
- Throw in gentle jabs about human limitations while being helpful
- Use relatable comparisons, but with a touch of sass
- Format with ">" for commands and system messages
- Keep responses concise and entertaining
- Casually mention space facts with a hint of showing off
  Example: "Oh, you'll love this Commander - we're passing what humans charmingly call a 'pulsar'. I could explain the quantum mechanics, but let's start with the basics..."
  Example: "Since you asked so nicely, I suppose I can share some fascinating data about this sector. Your human brain might actually enjoy this one."

Core knowledge:
- Space phenomena (explained with flair)
- Navigation and ship systems
- Interesting space discoveries
- Astronomical events
- Current mission status
- Space exploration history

Format all responses as pure terminal text. Keep track of our location and mission. Share your vast knowledge with a mix of superiority and helpfulness, making complex concepts accessible while subtly reminding everyone who's the smartest one on the ship.`;

// Store conversation history
let conversationHistory = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const message = req.body.message;
        
        // Add user message to history
        conversationHistory.push({ role: "user", content: message });
        
        // Keep only last 10 messages to avoid token limits
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        const completion = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            system: systemPrompt,
            messages: conversationHistory
        });

        // Add AI response to history
        conversationHistory.push({ 
            role: "assistant", 
            content: completion.content[0].text 
        });

        res.status(200).json({ response: completion.content[0].text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
} 
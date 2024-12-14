import { Anthropic } from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const anthropic = new Anthropic(process.env.ANTHROPIC_API_KEY);

  try {
    const { prompt } = req.body; // Ensure the frontend sends `prompt` in the request body.

    const response = await anthropic.messages.create({
      model: "claude-3.5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0,
      system: "Respond only with short poems.",
      messages: [
        { role: "user", content: prompt },
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Anthropic API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

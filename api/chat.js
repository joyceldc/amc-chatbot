import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST request" });

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY on Vercel" });
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: `You are AMC Chatbot, a friendly and helpful website assistant.
Keep answers clear and short.`,
      input: message,
    });

    return res.status(200).json({ reply: response.output_text || "" });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
      message: error?.message || String(error),
    });
  }
}

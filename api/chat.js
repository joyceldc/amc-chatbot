import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY on Vercel" },
        { status: 500, headers: corsHeaders() }
      );
    }

    const body = await request.json().catch(() => ({}));
    const message = body.message;

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Body must be { message: string }" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions:
        "You are AMC Chatbot, a friendly and helpful website assistant. Keep answers clear and short.",
      input: message,
    });

    return Response.json(
      { reply: response.output_text || "" },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    return Response.json(
      { error: "Something went wrong.", message: error?.message || String(error) },
      { status: 500, headers: corsHeaders() }
    );
  }
}

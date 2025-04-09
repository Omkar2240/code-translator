import { TranslateRequest, TranslateResponse } from "@/types/types";
import axios from "axios";

export async function POST(req: Request): Promise<Response> {
  const body: TranslateRequest = await req.json();

  const prompt = `
Convert the following code from ${body.sourceLang} to ${body.targetLang}:

### ${body.sourceLang} Code:
${body.code}

### ${body.targetLang} Code:
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
/* eslint-disable */
    const translatedCode =
      response.data.choices[0].message.content as string;

    const data: TranslateResponse = { translatedCode };
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    console.error("Groq API Error:", err.response?.data || err.message);
    return new Response(JSON.stringify({ error: "Translation failed" }), {
      status: 500,
    });
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

const ai = new GoogleGenerativeAI(apiKey);

export async function generateGeminiText(prompt: string): Promise<string> {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // or gemini-1.5-flash, gemini-pro

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  const response = await result.response;
  const text = response.text();

  return text || "⚠️ Gemini returned no content.";
}

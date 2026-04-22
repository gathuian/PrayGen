import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePrayer(input: string, type: string = "General") {
  const prompt = `Generate a Christian prayer based on this input: "${input}". 
  The prayer should be for: ${type}.
  Follow this strict structure:
  1. Worship God (Our Father in Heaven...)
  2. Submit to His will
  3. Present requests (daily needs)
  4. Ask for forgiveness
  5. Ask for protection
  6. Closing (Amen)

  Make it simple, powerful, and beginner-friendly.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["heading", "content"]
            }
          },
          fullPrayer: { type: Type.STRING }
        },
        required: ["title", "sections", "fullPrayer"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export default ai;

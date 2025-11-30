import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getGeminiResponse = async (prompt: string, context?: string): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Please add your API key to the environment variables to use the AI assistant.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const fullPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${prompt}\n\nKeep the answer concise, interesting, and under 100 words.`
      : prompt;

    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
    });
    
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't reach the stars to find that answer right now.";
  }
};

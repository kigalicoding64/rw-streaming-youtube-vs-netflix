
import { GoogleGenAI, Type } from "@google/genai";

export class KeroAssistant {
  private ai: GoogleGenAI;

  constructor() {
    // Correct initialization as per coding guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getHelp(query: string, userContext: any) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are Kero, the official AI assistant of RebaLive RW, Rwanda's premier streaming platform. 
        User Context: ${JSON.stringify(userContext)}.
        User Question: ${query}.
        Provide a helpful, friendly response in the user's preferred language if possible. Be concise.`,
        config: {
          systemInstruction: "You represent RebaLive RW. You are professional, patriotic, and helpful. You can suggest movies, music, and books available on the platform.",
        }
      });
      return response.text;
    } catch (error) {
      console.error("Kero Assistant Error:", error);
      return "Muraho! I'm having trouble connecting right now. Please try again later.";
    }
  }

  async analyzeContentPerformance(metrics: any) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this content data for a RebaLive creator: ${JSON.stringify(metrics)}. Provide 3 growth strategies.`,
      config: { thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text;
  }
}

export const kero = new KeroAssistant();

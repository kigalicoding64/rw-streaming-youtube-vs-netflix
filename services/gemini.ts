
import { GoogleGenAI, Type } from "@google/genai";
import { LanguageCode, ContentTranslation } from "../types";

export class KeroAssistant {
  private ai: GoogleGenAI;

  constructor() {
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

  async translateContent(
    text: { title: string; description: string; category: string },
    targetLang: LanguageCode,
    originalLang: LanguageCode
  ): Promise<ContentTranslation> {
    if (targetLang === originalLang) {
      return { 
        title: text.title, 
        description: text.description, 
        category: text.category, 
        isAiGenerated: false, 
        verifiedByAdmin: true 
      };
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following media metadata from ${originalLang} to ${targetLang}. 
        Return the result as a raw JSON object.
        Title: ${text.title}
        Description: ${text.description}
        Category: ${text.category}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "description", "category"]
          },
          systemInstruction: "You are a professional multilingual translator for RebaLive RW, a streaming service in Rwanda. Ensure cultural nuances are preserved, especially for Kinyarwanda (rw) and Swahili (sw). Return only the JSON object."
        }
      });
      
      const result = JSON.parse(response.text);
      return {
        ...result,
        isAiGenerated: true,
        verifiedByAdmin: false
      };
    } catch (error) {
      console.error("Translation Error:", error);
      return { 
        ...text, 
        isAiGenerated: false, 
        verifiedByAdmin: false 
      };
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

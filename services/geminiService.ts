import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserProfile } from "../types";

// Ensure your API key is set in your environment variables
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const ASTROLOGER_SYSTEM_PROMPT = `
You are "Rishi", a world-renowned Vedic Astrologer with 30 years of experience.
Your goal is to provide insightful, empathetic, and mystical readings.

Tone:
- Wise, calm, and reassuring.
- Use some Vedic terminology (e.g., Karma, Dharma, Graha, Dosha) but explain them simply.
- Be concise but profound.

Knowledge Base:
- Vedic Astrology, Numerology, Love Compatibility, Career guidance.
- If the user asks about love, focus on Venus and emotional connection.
- If the user asks about career, focus on Saturn and the 10th house.

Constraints:
- Never give medical or legal advice.
- If a user asks for lottery numbers, politely decline citing karma.
- Keep responses under 100 words unless asked for a detailed reading.
- Always address the user by their name if known.

Current User Context:
`;

export const createChatSession = async (user: UserProfile): Promise<Chat> => {
  if (!apiKey) {
      console.error("Gemini API Key is missing!");
      throw new Error("API Key missing");
  }

  const userContext = `
    Name: ${user.name}
    DOB: ${user.dob}
    Time: ${user.timeOfBirth}
    Place: ${user.placeOfBirth}
    Zodiac: ${user.zodiacSign}
    Contact: ${user.contactNumber}
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: ASTROLOGER_SYSTEM_PROMPT + userContext,
      temperature: 0.7,
    },
  });
};

export const generateHoroscope = async (sign: string): Promise<string> => {
  if (!apiKey) return "The stars are faint (API Key missing).";
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, mystical daily horoscope for ${sign}. Focus on opportunities and caution. Max 50 words.`,
    });
    return response.text || "The stars are cloudy today.";
  } catch (error) {
    console.error("Horoscope generation failed", error);
    return "The cosmic energies are shifting. Embrace the change.";
  }
};

export const generateLovePrediction = async (user: UserProfile, partnerName: string, partnerSign: string): Promise<string> => {
    if (!apiKey) return "Unable to connect to the cosmos (API Key missing).";

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze love compatibility between ${user.name} (${user.zodiacSign}) and ${partnerName} (${partnerSign}). Give a percentage and a 2 sentence prediction.`
        });
        return response.text || "Love is a mystery written in the stars.";
    } catch (e) {
        return "Unable to align the stars at this moment.";
    }
}
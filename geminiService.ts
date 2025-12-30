
import { GoogleGenAI, Type } from "@google/genai";
import { Member } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateChapterSummary(members: Member[]) {
  if (members.length === 0) return "No member data available yet.";

  const memberSummary = members.map(m => 
    `${m.firstName} "${m.roadName}" ${m.lastName} (Member #${m.membershipNo})`
  ).join(", ");

  const prompt = `
    I have a motorcycle chapter with the following members: ${memberSummary}.
    Analyze this list and give me a brief, energetic, "biker-style" welcoming summary of our pack strength.
    Mention how many members we have and keep it to 3-4 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating AI summary. Keep riding hard!";
  }
}

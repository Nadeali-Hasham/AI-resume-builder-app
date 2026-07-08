import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const modelName = import.meta.env.VITE_GOOGLE_AI_MODEL || "gemini-3.5-flash";

if (!apiKey) {
  console.error("Google AI API key is missing. Add VITE_GOOGLE_AI_API_KEY to .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
  model: modelName,
});

const generationConfig = {
  temperature: 0.8,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 512,
  responseMimeType: "text/plain",
};

export const AIChatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [{ text: "You are a professional resume writer with 10 years of experience." }],
    },
    {
      role: "model",
      parts: [{ text: "I am an expert resume writer. I will help you create professional, ATS-friendly resumes." }],
    },
  ],
});

export const generateSummaryFromAI = async (jobTitle) => {
  if (!apiKey) {
    throw new Error("Google AI API key is missing");
  }

  const cleanJobTitle = String(jobTitle || "").trim();
  if (!cleanJobTitle) {
    throw new Error("Job title is required");
  }

  try {
    const prompt = `
      Generate a professional resume summary for a ${cleanJobTitle} position.
      Keep it concise (3-4 sentences), professional, and impactful.
      Return only the summary text without any additional formatting.
    `;

    const result = await AIChatSession.sendMessage(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Google AI summary generation failed:", error);
    throw error;
  }
};

export default {
  AIChatSession,
  generateSummaryFromAI,
};

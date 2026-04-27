import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function analyzeJobDescriptionWithGemini(jdText: string) {
  if (!genAI) {
    return { error: "Gemini API key is missing" };
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are an expert technical recruiter. Analyze the following Job Description and extract:
  - hardSkills: Array of technical skills
  - softSkills: Array of soft skills
  - ActionKeywords: Array of impact-verbs
  - jdSummary: 2-sentence summary
  - topKeywords: Top 10 keywords overall.
  
  Job Description: ${jdText}
  Return valid JSON.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

export async function rewriteBulletWithGemini(bulletPoint: string, targetKeywords: string[]) {
  if (!genAI) {
    return { error: "Gemini API key is missing" };
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `Rewrite this resume bullet point to include these keywords: ${targetKeywords.join(", ")}.
  Bullet Point: ${bulletPoint}
  Maintain truthfulness and professional tone. Return JSON with "rewrittenBullet" key.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

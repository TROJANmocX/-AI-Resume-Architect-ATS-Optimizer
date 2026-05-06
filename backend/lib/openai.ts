import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

// Only initialize OpenAI if the key is present to avoid runtime crashes
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function analyzeJobDescription(jdText: string) {
  if (!openai) {
    return { error: 'No API key provided' };
  }
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert technical recruiter and ATS specialist. 
        Your task is to analyze a Job Description and extract the most critical keywords and requirements.
        Return your analysis in a structured JSON format with the following keys:
        - hardSkills: Array of technical skills (e.g., Python, AWS, React)
        - softSkills: Array of soft skills (e.g., Leadership, Communication)
        - ActionKeywords: Array of action-oriented verbs or phrases (e.g., Led cross-functional teams, Optimized latency)
        - matchedKeywords: A prioritized list of the top 10 keywords overall.
        - jdSummary: A brief 2-sentence summary of the role.`
      },
      {
        role: 'user',
        content: jdText
      }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function rewriteResumeBullet(bulletPoint: string, targetKeywords: string[]) {
  if (!openai) {
    return { error: 'No API key provided' };
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an AI Resume Editor. 
        Rewrite the user's provided resume bullet point to better incorporate the provided target keywords while maintaining truthfulness and clarity.
        Follow these rules:
        1. Keep the bullet impact-driven (Action + Context + Result).
        2. Seamlessly blend keywords.
        3. Do not sound robotic.
        4. Return the result in JSON format with a "rewrittenBullet" key.`
      },
      {
        role: 'user',
        content: `Bullet: ${bulletPoint}\nTarget Keywords: ${targetKeywords.join(', ')}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

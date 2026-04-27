import { NextResponse } from 'next/server';
import { analyzeJobDescriptionWithGemini } from '@/lib/gemini';
import { analyzeJobDescription as analyzeWithOpenAI } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { jdText } = await request.json();

    if (!jdText) {
      return NextResponse.json({ error: 'Job description text is required' }, { status: 400 });
    }

    // Prefer Gemini if available, otherwise fallback to OpenAI
    if (process.env.GEMINI_API_KEY) {
      const analysis = await analyzeJobDescriptionWithGemini(jdText);
      return NextResponse.json(analysis);
    } else {
      const analysis = await analyzeWithOpenAI(jdText);
      return NextResponse.json(analysis);
    }
  } catch (error) {
    console.error('JD Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze job description' }, { status: 500 });
  }
}

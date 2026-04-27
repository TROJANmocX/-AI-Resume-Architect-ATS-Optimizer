import { NextResponse } from 'next/server';
import { analyzeJobDescription } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { jdText } = await request.json();

    if (!jdText) {
      return NextResponse.json({ error: 'Job description text is required' }, { status: 400 });
    }

    const analysis = await analyzeJobDescription(jdText);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('JD Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze job description' }, { status: 500 });
  }
}

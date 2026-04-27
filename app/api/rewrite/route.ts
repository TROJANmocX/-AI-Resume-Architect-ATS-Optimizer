import { NextResponse } from 'next/server';
import { rewriteBulletWithGemini } from '@/lib/gemini';
import { rewriteResumeBullet as rewriteWithOpenAI } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { bulletPoint, targetKeywords } = await request.json();

    if (!bulletPoint || !targetKeywords) {
      return NextResponse.json({ error: 'Bullet point and target keywords are required' }, { status: 400 });
    }

    // Prefer Gemini if available, otherwise fallback to OpenAI
    if (process.env.GEMINI_API_KEY) {
      const rewrite = await rewriteBulletWithGemini(bulletPoint, targetKeywords);
      return NextResponse.json(rewrite);
    } else {
      const rewrite = await rewriteWithOpenAI(bulletPoint, targetKeywords);
      return NextResponse.json(rewrite);
    }
  } catch (error) {
    console.error('Rewrite error:', error);
    return NextResponse.json({ error: 'Failed to rewrite resume bullet' }, { status: 500 });
  }
}

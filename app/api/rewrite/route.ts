import { NextResponse } from 'next/server';
import { rewriteResumeBullet } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { bulletPoint, targetKeywords } = await request.json();

    if (!bulletPoint || !targetKeywords) {
      return NextResponse.json({ error: 'Bullet point and target keywords are required' }, { status: 400 });
    }

    const rewrite = await rewriteResumeBullet(bulletPoint, targetKeywords);
    return NextResponse.json(rewrite);
  } catch (error) {
    console.error('Rewrite error:', error);
    return NextResponse.json({ error: 'Failed to rewrite resume bullet' }, { status: 500 });
  }
}

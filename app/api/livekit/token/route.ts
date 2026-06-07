import { generateLiveKitToken } from '@/lib/livekit';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { roomName, userName } = body;

    if (!roomName) {
      return NextResponse.json({ error: 'roomName is required' }, { status: 400 });
    }

    const participantName = userName || `stranger-${crypto.randomUUID().slice(0, 6)}`;
    const token = await generateLiveKitToken(roomName, participantName);
    const serverUrl = process.env.LIVEKIT_URL || '';

    return NextResponse.json({ url: serverUrl, token });
  } catch (error: any) {
    console.error('Error in /api/livekit/token:', error);
    return NextResponse.json({ error: error.message || 'Failed to create token' }, { status: 500 });
  }
}

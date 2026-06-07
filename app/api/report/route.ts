import { supabase, isMockMode } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sessionToken, reason, details } = body;

    if (!reason) {
      return NextResponse.json({ error: 'reason is required' }, { status: 400 });
    }



    const { error } = await supabase
      .from('reports')
      .insert({
        session_token: sessionToken || null,
        reason,
        details: details || null
      });

    if (error) {
      console.error('Error inserting report:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in /api/report:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

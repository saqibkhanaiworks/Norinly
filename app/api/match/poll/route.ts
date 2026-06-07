import { supabase, isMockMode } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'token parameter is required' }, { status: 400 });
    }



    const { data: queueEntry, error } = await supabase
      .from('match_queue')
      .select('*')
      .eq('session_token', token)
      .maybeSingle();

    if (error) {
      console.error('Error polling queue:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!queueEntry) {
      return NextResponse.json({ status: 'expired' });
    }

    if (queueEntry.status === 'matched') {
      const { data: partnerEntry } = await supabase
        .from('match_queue')
        .select('country')
        .eq('room_url', queueEntry.room_url)
        .neq('session_token', token)
        .maybeSingle();

      return NextResponse.json({
        status: 'matched',
        roomUrl: queueEntry.room_url,
        meetingToken: queueEntry.meeting_token,
        partnerCountry: partnerEntry?.country || null
      });
    }

    return NextResponse.json({ status: queueEntry.status });
  } catch (error: any) {
    console.error('Error in /api/match/poll:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

import { supabase, isMockMode } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json({ error: 'sessionToken is required' }, { status: 400 });
    }



    // 1. Get the queue entry to find the roomUrl and matched time
    const { data: queueEntry, error: findError } = await supabase
      .from('match_queue')
      .select('*')
      .eq('session_token', sessionToken)
      .maybeSingle();

    if (findError) {
      console.error('Error finding match entry to leave:', findError);
    }

    // 2. Update status to ended
    await supabase
      .from('match_queue')
      .update({ status: 'ended' })
      .eq('session_token', sessionToken);

    if (queueEntry) {
      const endedAt = new Date().toISOString();
      const startedAt = queueEntry.matched_at || queueEntry.joined_at;
      const durationMins = startedAt 
        ? Math.max(1, Math.ceil((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60000)) 
        : 1;

      // Update sessions log
      const { data: activeSessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_type', '1on1')
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1);

      if (activeSessions && activeSessions.length > 0) {
        await supabase
          .from('sessions')
          .update({
            ended_at: endedAt,
            duration_mins: durationMins
          })
          .eq('id', activeSessions[0].id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in /api/match/leave:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

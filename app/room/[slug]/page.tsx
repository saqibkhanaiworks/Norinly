import React from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_ROOMS } from '@/lib/rooms-config';
import { redirect } from 'next/navigation';
import GroupRoomClient from '@/components/GroupRoomClient';
import { Room } from '@/components/RoomCard';

export const dynamic = 'force-dynamic';

export default async function RoomPage({ params }: { params: { slug: string } }) {
  let room: Room | undefined;
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    if (!error && data) {
      room = data as Room;
    }
  } catch (err) {
    console.error('Failed to load room from database, checking mock:', err);
  }
  
  // Final fallback to mock if query failed or returned empty
  if (!room) {
    room = MOCK_ROOMS.find((r) => r.slug === params.slug) as Room;
  }

  if (!room) {
    redirect('/');
  }

  return <GroupRoomClient room={room} />;
}

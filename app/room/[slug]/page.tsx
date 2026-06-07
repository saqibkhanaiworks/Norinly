import React from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_ROOMS } from '@/lib/rooms-config';
import { redirect } from 'next/navigation';
import GroupRoomClient from '@/components/GroupRoomClient';
import { Room } from '@/components/RoomCard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getRoom(slug: string): Promise<Room | undefined> {
  let room: Room | undefined;
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (!error && data) {
      room = data as Room;
    }
  } catch (err) {
    console.error('Failed to load room for metadata:', err);
  }
  
  if (!room) {
    room = MOCK_ROOMS.find((r) => r.slug === slug) as Room;
  }
  return room;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoom(slug);
  const roomName = room ? room.name : 'Voice Room';
  const description = room ? `Join the ${room.name} practice room on Norinly. Talk to real people worldwide anonymously.` : 'Practice English speaking with real people worldwide.';
  
  return {
    title: `${roomName} | Practice English on Norinly`,
    description,
    alternates: {
      canonical: `https://norinly.live/room/${slug}`,
    },
    openGraph: {
      title: `${roomName} | Practice English on Norinly`,
      description,
      url: `https://norinly.live/room/${slug}`,
      type: 'website',
    },
  };
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoom(slug);

  if (!room) {
    redirect('/');
  }

  return <GroupRoomClient room={room} />;
}

'use client';

import React, { useEffect, useState } from 'react';
import RoomCard, { Room } from './RoomCard';
import { supabase, isMockMode } from '@/lib/supabase';

interface RoomsGridProps {
  initialRooms: Room[];
}

export default function RoomsGrid({ initialRooms }: RoomsGridProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  useEffect(() => {


    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('slug', { ascending: true });
        
        if (!error && data) {
          setRooms(data as Room[]);
        }
      } catch (err) {
        console.error('Failed to reload rooms list:', err);
      }
    };

    const channel = supabase
      .channel('rooms-grid-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

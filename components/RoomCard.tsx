'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';

export interface Room {
  id: string;
  slug: string;
  name: string;
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  max_users: number;
  active_count: number;
  daily_room_name: string;
}

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const isFull = (room.active_count || 0) >= (room.max_users || 6);

  const getLevelBadgeStyles = (level: Room['level']) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-900/20 text-blue-300 border-blue-800/40';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Advanced':
        return 'bg-white/10 text-white border-blue-500/30';
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  return (
    <div className="relative group flex flex-col justify-between h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-900/50 hover:shadow-2xl hover:shadow-blue-500/5">
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getLevelBadgeStyles(room.level)}`}>
            {room.level}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Users className="w-3.5 h-3.5" />
            <span className={room.active_count > 0 ? 'text-blue-400 font-medium' : ''}>
              {room.active_count || 0} / {room.max_users || 6} talking
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {room.name}
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed">
            {room.topic}
          </p>
          
          {/* Vibe Indicator */}
          {!isFull && (
            <div className="pt-2 text-[12px] text-[#888888] italic">
              {(() => {
                const count = room.active_count || 0;
                const max = room.max_users || 6;
                if (count >= max) return null;
                if (count === 0) return "🔇 Quiet — be the first to speak";
                if (count === 1) return "👤 1 person waiting for someone to join";
                if (count === 2 || count === 3) return "🗣️ Active conversation happening";
                if (count === 4 || count === 5) return "🔥 Busy room — jump in";
                return null;
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-4 border-t border-neutral-800/60">
        {isFull ? (
          <button
            disabled
            className="w-full h-11 bg-neutral-800 text-neutral-500 font-semibold rounded-xl flex items-center justify-center cursor-not-allowed text-sm"
          >
            Room Full
          </button>
        ) : (
          <Link
            href={`/room/${room.slug}`}
            className="w-full h-11 bg-neutral-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all duration-200 text-sm group/btn"
          >
            Join Room
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}

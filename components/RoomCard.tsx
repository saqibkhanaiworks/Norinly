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

  const getRoomStyles = (level: Room['level']) => {
    switch (level) {
      case 'Beginner':
        return {
          border: 'border-l-[6px] border-l-purple-500 hover:border-purple-500/40',
          badge: 'bg-purple-50 text-purple-700 border-purple-100',
          button: 'w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm group/btn shadow-sm hover:shadow hover:shadow-purple-500/15',
          text: 'text-purple-600'
        };
      case 'Intermediate':
        return {
          border: 'border-l-[6px] border-l-emerald-600 hover:border-emerald-600/40',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          button: 'w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm group/btn shadow-sm hover:shadow hover:shadow-emerald-500/15',
          text: 'text-emerald-600'
        };
      case 'Advanced':
        return {
          border: 'border-l-[6px] border-l-sky-500 hover:border-sky-500/40',
          badge: 'bg-sky-50 text-sky-700 border-sky-100',
          button: 'w-full h-11 border-2 border-sky-500 text-sky-600 hover:bg-sky-50 hover:text-sky-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm group/btn shadow-sm hover:shadow',
          text: 'text-sky-600'
        };
      default: // 'All Levels' or other
        return {
          border: 'border-l-[6px] border-l-slate-900 hover:border-slate-900/40',
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
          button: 'w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm group/btn shadow-sm hover:shadow hover:shadow-slate-950/15',
          text: 'text-slate-900'
        };
    }
  };

  const styles = getRoomStyles(room.level);
  const avatars = ['🦊', '🐱', '🐼', '🐨', '🐸', '🦁'];

  return (
    <div className={`relative group flex flex-col justify-between h-full bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 ${styles.border}`}>
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles.badge}`}>
            {room.level}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {room.active_count > 0 && (
              <div className="flex -space-x-1.5 overflow-hidden mr-1">
                {Array.from({ length: Math.min(room.active_count, 3) }).map((_, i) => (
                  <div
                    key={i}
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] select-none"
                  >
                    {avatars[i % avatars.length]}
                  </div>
                ))}
                {room.active_count > 3 && (
                  <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600 select-none">
                    +{room.active_count - 3}
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              {room.active_count > 0 && (
                <span className="relative flex h-2 w-2 mr-0.5" role="presentation">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              <Users className="w-3.5 h-3.5" role="img" aria-label="Users icon" />
              <span className={room.active_count > 0 ? `${styles.text} font-bold` : ''}>
                {room.active_count || 0} / {room.max_users || 6} talking
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={`text-lg font-bold text-slate-900 transition-colors ${room.active_count > 0 ? styles.text : 'group-hover:text-slate-700'}`}>
            {room.name}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            {room.topic}
          </p>
          
          {/* Vibe Indicator */}
          {!isFull && (
            <div className="pt-2 text-[12px] text-slate-400 italic">
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
      <div className="mt-6 pt-4 border-t border-slate-100">
        {isFull ? (
          <button
            disabled
            className="w-full h-11 bg-slate-50 text-slate-400 font-semibold rounded-xl flex items-center justify-center cursor-not-allowed text-sm"
          >
            Room Full
          </button>
        ) : (
          <Link
            href={`/room/${room.slug}`}
            className={styles.button}
          >
            {room.active_count === 0 ? 'Start Room +' : 'Join Room'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" role="img" aria-label="Arrow pointing right" />
          </Link>
        )}
      </div>
    </div>
  );
}


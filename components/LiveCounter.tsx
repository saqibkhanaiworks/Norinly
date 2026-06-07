'use client';

import React, { useEffect, useState } from 'react';
import { supabase, isMockMode } from '@/lib/supabase';

export default function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data, error } = await supabase.from('rooms').select('active_count');
        if (!error && data) {
          const total = data.reduce((sum, r) => sum + (r.active_count || 0), 0);
          setCount(total);
        } else {
          setCount(0);
        }
      } catch (err) {
        console.error('Failed to fetch rooms count:', err);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();

    const channel = supabase
      .channel('rooms-active-counter')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        () => {
          fetchCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-400 text-xs sm:text-sm">
        <span className="w-2 h-2 rounded-full bg-neutral-600 animate-pulse" />
        Loading live count...
      </div>
    );
  }

  const finalCount = count || 0;

  return (
    <div className="flex items-center gap-2 bg-neutral-900/40 border border-neutral-800/80 px-4 py-1.5 rounded-full text-xs sm:text-sm text-neutral-300 font-medium backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      {finalCount > 0 ? (
        <span>
          <strong className="text-white font-semibold">{finalCount}</strong>{' '}
          {finalCount === 1 ? 'person' : 'people'} practicing right now
        </span>
      ) : (
        <span>Be the first to join today</span>
      )}
    </div>
  );
}

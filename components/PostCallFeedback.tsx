'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface PostCallFeedbackProps {
  sessionDurationSeconds: number;
  onClose: (saved: boolean) => void;
}

export type VibeType = 'Fun' | 'Awkward' | 'Educational' | 'Surprising' | 'Great';

export default function PostCallFeedback({ sessionDurationSeconds, onClose }: PostCallFeedbackProps) {
  const [stars, setStars] = useState<number>(0);
  const [selectedVibe, setSelectedVibe] = useState<VibeType | null>(null);
  const [showToast, setShowToast] = useState(false);

  const vibes: VibeType[] = ['Fun', 'Awkward', 'Educational', 'Surprising', 'Great'];

  const handleSave = () => {
    if (stars === 0) return;

    try {
      const raw = localStorage.getItem('norinly_feedback');
      const feedbacks = raw ? JSON.parse(raw) : [];
      
      feedbacks.push({
        date: new Date().toISOString(),
        stars,
        vibe: selectedVibe,
        duration: sessionDurationSeconds,
      });

      // Cap at 30 entries
      if (feedbacks.length > 30) {
        feedbacks.shift(); // Remove oldest
      }

      localStorage.setItem('norinly_feedback', JSON.stringify(feedbacks));
      
      // Flash "Saved ✓" toast for 1 second, then close
      setShowToast(true);
      setTimeout(() => {
        onClose(true);
      }, 1000);
    } catch (err) {
      console.error('Failed to save feedback:', err);
      onClose(false);
    }
  };

  const handleSkip = () => {
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-100 animate-fade-in z-50 flex items-center gap-1.5">
          <span>Saved</span>
          <span className="text-base">✓</span>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-[340px] shadow-2xl space-y-6 text-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">How was that?</h2>
          <p className="text-slate-500 text-xs font-medium">Help us improve your matches</p>
        </div>

        {/* 5-star tap rating row */}
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setStars(val)}
              className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label={`Rate ${val} stars`}
            >
              <Star
                className={`w-7 h-7 transition-all duration-150 ${
                  val <= stars
                    ? 'fill-blue-650 text-blue-650 fill-blue-600 text-blue-600 scale-110'
                    : 'text-slate-300 hover:scale-105'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Vibe Chips */}
        <div className="space-y-2.5">
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
            What was the vibe?
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {vibes.map((vibe) => {
              const isSelected = selectedVibe === vibe;
              return (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => setSelectedVibe(isSelected ? null : vibe)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 text-blue-750 text-blue-700 bg-blue-50'
                      : 'border-slate-200 text-slate-500 bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                  }`}
                  style={{ minHeight: '36px' }}
                >
                  {vibe}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={stars === 0 || showToast}
            className={`w-full h-12 font-bold rounded-xl transition-all duration-200 text-sm flex items-center justify-center cursor-pointer ${
              stars > 0 && !showToast
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Done
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-550 text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer block mx-auto hover:underline"
          >
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}

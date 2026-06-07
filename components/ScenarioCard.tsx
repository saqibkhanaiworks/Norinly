'use client';

import React, { useEffect, useState } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';

interface ScenarioCardProps {
  prompts: string[];
}

export default function ScenarioCard({ prompts }: ScenarioCardProps) {
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isRotating, setIsRotating] = useState(false);

  const selectRandomPrompt = () => {
    if (!prompts || prompts.length === 0) return;
    setIsRotating(true);
    
    // Simulate a brief spinner rotation effect
    setTimeout(() => {
      let nextPrompt = currentPrompt;
      while (nextPrompt === currentPrompt && prompts.length > 1) {
        const randomIndex = Math.floor(Math.random() * prompts.length);
        nextPrompt = prompts[randomIndex];
      }
      if (prompts.length === 1) {
        nextPrompt = prompts[0];
      }
      setCurrentPrompt(nextPrompt || prompts[0] || '');
      setIsRotating(false);
    }, 300);
  };

  useEffect(() => {
    if (prompts && prompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      setCurrentPrompt(prompts[randomIndex]);
    }
  }, [prompts]);

  if (!currentPrompt) return null;

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm">
      <div className="flex gap-4">
        <div className="flex items-center justify-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5 text-blue-400" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Conversation starter
          </span>
          <p className="text-white text-base leading-relaxed font-medium">
            "{currentPrompt}"
          </p>
        </div>
      </div>

      <button
        onClick={selectRandomPrompt}
        disabled={isRotating}
        className="w-full md:w-auto px-4 py-2.5 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm active:scale-95 shrink-0"
      >
        <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
        New Prompt
      </button>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

const CHALLENGES = [
  "Use 3 different past tense sentences in your next call.",
  "Ask your partner at least 4 questions.",
  "Describe something using only comparisons — bigger than, faster than, more like.",
  "Use the words 'however', 'although', and 'despite' at least once each.",
  "Tell a 2-minute story with a beginning, middle, and end.",
  "Use no filler words — no 'um', 'uh', or 'like'.",
  "Describe a place in so much detail your partner can picture it.",
  "Use 5 different adjectives you don't normally use.",
  "Give your opinion on 3 different topics.",
  "Ask your partner for their advice on something real.",
  "Use a metaphor to describe your job or studies.",
  "Speak for 60 seconds without stopping on any topic.",
  "Use 'I used to' and 'I've always' at least twice each.",
  "Disagree politely with something your partner says.",
  "Teach your partner one word from your native language.",
  "Use conditional sentences: 'If I were...', 'If I had...'",
  "Tell your partner about your morning routine in full detail.",
  "Use the words 'surprisingly', 'apparently', and 'honestly'.",
  "Make your partner laugh.",
  "Ask a follow-up question after every answer your partner gives.",
  "Use passive voice at least twice.",
  "Describe a problem and ask for your partner's solution.",
  "Use time expressions: 'lately', 'recently', 'in the past few years'.",
  "Start every sentence differently — no repeated sentence openers.",
  "Explain something technical in simple words.",
  "Use three phrasal verbs.",
  "Tell your partner what you'd change about your country.",
  "Describe your personality without using the word 'friendly'.",
  "Talk only about positive things for the whole call.",
  "End the call by summarising everything you talked about."
];

export default function DailyChallenge() {
  const [isExpanded, setIsExpanded] = useState(false);
  const challengeIndex = new Date().getDate() % 30;
  const challenge = CHALLENGES[challengeIndex];

  return (
    <div className="w-full bg-white border border-slate-250/60 border-l-4 border-l-[#3b82f6] rounded-r-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-200 shadow-sm">
      <div className="flex items-start gap-2.5">
        <span className="text-lg shrink-0" role="img" aria-label="lightbulb">💡</span>
        <div className="text-sm text-slate-800 font-medium leading-relaxed">
          <span className="text-slate-500 font-semibold mr-1">Today's challenge:</span>
          <span className={isExpanded ? '' : 'line-clamp-1 md:line-clamp-none'}>
            {challenge}
          </span>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden text-xs text-[#3b82f6] hover:text-[#2563eb] font-bold self-end md:self-auto transition-colors cursor-pointer shrink-0"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

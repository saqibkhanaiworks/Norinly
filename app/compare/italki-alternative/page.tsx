import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free italki Alternative | Norinly',
  description: 'Looking for a free alternative to paid lessons on italki? Norinly lets you practice speaking English for free with peers around the world.',
};

export default function ItalkiAlternativePage() {
  const comparison = [
    { feature: 'Cost', italki: 'Paid lessons ($10 - $40/hour)', norinly: '100% Free' },
    { feature: 'Scheduling', italki: 'Must book days in advance', norinly: 'Instant connection (Anytime)' },
    { feature: 'Target Partner', italki: 'Native teachers or tutors', norinly: 'Other active ESL learners' },
    { feature: 'Video Camera', italki: 'Expected / Required', norinly: 'No video (Audio only)' },
    { feature: 'Commitment', italki: 'Per-lesson commitment & payment', norinly: 'Zero commitment (Skip anytime)' },
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-[#04060d] to-neutral-950 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Free italki Alternative for English Speaking Practice
          </h1>
          <p className="text-neutral-400 text-lg">
            Say goodbye to pre-booked scheduling and paid lessons. Start practicing English voice calls for free, whenever you have spare time.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/50">
                <th className="p-4 sm:p-5 text-sm font-semibold text-neutral-400">Feature</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-neutral-400">italki</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-white">Norinly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-white">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-sm text-neutral-400">{row.italki}</td>
                  <td className="p-4 sm:p-5 text-sm text-blue-400 font-semibold">{row.norinly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight points */}
        <div className="space-y-6 text-neutral-300">
          <h2 className="text-2xl font-bold text-white">Practice Whenever You Have 10 Minutes</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Platforms like italki require substantial planning. You must search for tutors, match calendars, make payments, book days in advance, and commit to a fixed 60-minute video slot.
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Norinly is designed for modern, busy schedules. If you have 10 minutes between study sessions or commute time, you can open Norinly on your phone, click a button, and immediately start practicing English with a peer. No scheduling, no calendars, and absolutely no cost.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Ready to start practicing?</h3>
            <p className="text-neutral-400 text-sm max-w-sm mx-auto">
              No booking, no teachers to schedule. Practice speaking now.
            </p>
          </div>
          <Link
            href="/connect"
            className="inline-flex h-12 px-8 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl transition-all duration-200 text-sm items-center justify-center gap-2 group"
          >
            Start Speaking Instantly
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

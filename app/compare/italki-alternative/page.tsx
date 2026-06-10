import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free italki Alternative for Speaking Practice | Norinly',
  description: 'Looking for a free alternative to paid lessons on italki? Norinly lets you practice speaking English for free with peers around the world.',
  alternates: {
    canonical: 'https://norinly.live/compare/italki-alternative',
  },
  openGraph: {
    title: 'Free italki Alternative for Speaking Practice | Norinly',
    description: 'Looking for a free alternative to paid lessons on italki? Norinly lets you practice speaking English for free with peers around the world.',
    url: 'https://norinly.live/compare/italki-alternative',
    type: 'website',
  },
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
    <div className="flex-1 bg-[#f8f9fc] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Free italki Alternative for English Speaking Practice
          </h1>
          <p className="text-slate-600 text-lg">
            Say goodbye to pre-booked scheduling and paid lessons. Start practicing English voice calls for free, whenever you have spare time.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Feature</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">italki</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-900">Norinly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-slate-800">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-sm text-slate-500">{row.italki}</td>
                  <td className="p-4 sm:p-5 text-sm text-blue-600 font-semibold">{row.norinly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight points */}
        <div className="space-y-6 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">Practice Whenever You Have 10 Minutes</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Platforms like italki require substantial planning. You must search for tutors, match calendars, make payments, book days in advance, and commit to a fixed 60-minute video slot.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Norinly is designed for modern, busy schedules. If you have 10 minutes between study sessions or commute time, you can open Norinly on your phone, click a button, and immediately start practicing English with a peer. No scheduling, no calendars, and absolutely no cost.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Ready to start practicing?</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              No booking, no teachers to schedule. Practice speaking now.
            </p>
          </div>
          <Link
            href="/connect"
            className="inline-flex h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 text-sm items-center justify-center gap-2 group shadow-md shadow-blue-100 cursor-pointer"
          >
            Start Speaking Instantly
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

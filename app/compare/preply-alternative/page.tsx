import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free Preply Alternative 2026 | Norinly',
  description: 'Looking for a free alternative to Preply? Norinly connects you with peer English speakers instantly, without the tutor costs or lesson booking.',
  alternates: {
    canonical: 'https://norinly.live/compare/preply-alternative',
  },
  openGraph: {
    title: 'Free Preply Alternative 2026 | Norinly',
    description: 'Looking for a free alternative to Preply? Norinly connects you with peer English speakers instantly, without the tutor costs or lesson booking.',
    url: 'https://norinly.live/compare/preply-alternative',
    type: 'website',
  },
};

export default function PreplyAlternativePage() {
  const comparison = [
    { feature: 'Cost', preply: 'Expensive ($15-$40 per hour)', norinly: '100% Free' },
    { feature: 'Scheduling', preply: 'Manual booking (Time slots, calendar sync)', norinly: 'Instant (Under 10 Seconds)' },
    { feature: 'Commitment', preply: 'Subscription packages / hour credits', norinly: 'Zero (Hop on and off anytime)' },
    { feature: 'Focus', preply: 'Academic lessons & grammar theory', norinly: 'Real-world speech & conversations' },
    { feature: 'Setup Time', preply: 'Slow (Browse, book, trial lesson)', norinly: 'Immediate (Click and speak)' },
  ];

  return (
    <div className="flex-1 bg-[#f8f9fc] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            The Best Free Preply Alternative — Norinly
          </h1>
          <p className="text-slate-600 text-lg">
            Stop paying expensive hourly rates just to chat. Meet enthusiastic language learners globally and build speaking confidence for free.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Feature</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Preply</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-900">Norinly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-slate-800">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-sm text-slate-500">{row.preply}</td>
                  <td className="p-4 sm:p-5 text-sm text-blue-600 font-semibold">{row.norinly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight points */}
        <div className="space-y-6 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">Peer Conversation vs. Paid Tutoring</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Tutoring platforms like Preply are excellent if you require structured tutoring for standardized exams or grammar fundamentals. However, paying $20+ an hour just to practice conversational English is unsustainable for most learners.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Norinly offers a peer-to-peer alternative. Real fluency is built when you can converse naturally and without stress. By practicing with other language learners, you get unlimited, free speaking practice without checking a calendar or purchasing subscription lesson bundles.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Ready to start practicing?</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Skip the booking calendar. Connect with a conversation partner now.
            </p>
          </div>
          <Link
            href="/connect"
            className="inline-flex h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 text-sm items-center justify-center gap-2 group shadow-md shadow-blue-100 cursor-pointer"
          >
            Start Speaking Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

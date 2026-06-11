import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free Busuu Alternative 2026 | Norinly',
  description: 'Looking for a free alternative to Busuu? Norinly provides real-time speaking practice with active learners to complement or replace app lessons.',
  alternates: {
    canonical: 'https://norinly.live/compare/busuu-alternative',
  },
  openGraph: {
    title: 'Free Busuu Alternative 2026 | Norinly',
    description: 'Looking for a free alternative to Busuu? Norinly provides real-time speaking practice with active learners to complement or replace app lessons.',
    url: 'https://norinly.live/compare/busuu-alternative',
    type: 'website',
  },
};

export default function BusuuAlternativePage() {
  const comparison = [
    { feature: 'Practice Type', busuu: 'Structured exercises & written correction', norinly: 'Live, real-time voice conversations' },
    { feature: 'Focus', busuu: 'Grammar rules & vocabulary drill lists', norinly: 'Fluency, pronunciation, active speech' },
    { feature: 'Friction', busuu: 'High (Must progress through units)', norinly: 'Zero (Immediate connection)' },
    { feature: 'Peer Feedback', busuu: 'Delayed (Text corrections on written homework)', norinly: 'Real-time (Active back-and-forth speech)' },
    { feature: 'Cost', busuu: 'Paid subscription for full access', norinly: '100% Free' },
  ];

  return (
    <div className="flex-1 bg-[#f8f9fc] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            The Best Free Busuu Alternative — Norinly
          </h1>
          <p className="text-slate-600 text-lg">
            Transition from app exercises to actual speech. Complement your vocabulary learning with live, instant peer voice practice for free.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Feature</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Busuu</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-900">Norinly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-slate-800">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-sm text-slate-500">{row.busuu}</td>
                  <td className="p-4 sm:p-5 text-sm text-blue-600 font-semibold">{row.norinly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight points */}
        <div className="space-y-6 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">Break Through the Speaking Block</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Language learning apps like Busuu are excellent for studying vocabulary, grammar rules, and getting written feedback. However, studying a language passively on a screen is very different from speaking it out loud under pressure.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Norinly solves the &quot;speaking block&quot; by giving you a direct channel to speak English. By matching with real peers, you have to formulate sentences in real-time, react to accents, and engage in real-world dialogue. It is the perfect next step for intermediate learners who want to move past flashcards.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Ready to start practicing?</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Put your vocabulary to the test in a live peer voice room today.
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

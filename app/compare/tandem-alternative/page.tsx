import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free Tandem Alternative 2026 | Norinly',
  description: 'Looking for a free alternative to Tandem? Norinly offers instant, anonymous peer-to-peer English voice chat without profile setup or social friction.',
  alternates: {
    canonical: 'https://norinly.live/compare/tandem-alternative',
  },
  openGraph: {
    title: 'Free Tandem Alternative 2026 | Norinly',
    description: 'Looking for a free alternative to Tandem? Norinly offers instant, anonymous peer-to-peer English voice chat without profile setup or social friction.',
    url: 'https://norinly.live/compare/tandem-alternative',
    type: 'website',
  },
};

export default function TandemAlternativePage() {
  const comparison = [
    { feature: 'Matching Speed', tandem: 'Slow (Browse & text users manually)', norinly: 'Instant (Under 10 Seconds)' },
    { feature: 'Profile Verification', tandem: 'Required (Approval queue can take days)', norinly: 'None (Start speaking immediately)' },
    { feature: 'Focus', tandem: 'Social networking & texting', norinly: 'Direct speaking & listening practice' },
    { feature: 'Anonymity', tandem: 'No (Needs photos, real details)', norinly: '100% Anonymous (No accounts needed)' },
    { feature: 'Cost', tandem: 'Free with upsells/Pro options', norinly: '100% Free' },
  ];

  return (
    <div className="flex-1 bg-[#f8f9fc] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            The Best Free Tandem Alternative — Norinly
          </h1>
          <p className="text-slate-600 text-lg">
            Skip the social network fatigue. Match and practice English speaking instantly with active learners without texting first or waiting for approvals.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Feature</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Tandem</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-900">Norinly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-slate-800">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-sm text-slate-500">{row.tandem}</td>
                  <td className="p-4 sm:p-5 text-sm text-blue-600 font-semibold">{row.norinly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight points */}
        <div className="space-y-6 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">Instant Conversation Over Texting Fatigue</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            While Tandem is a great platform for finding pen pals, it often functions more like a social network. Users experience texting fatigue, waiting days for replies, or having conversations fade before they ever get to speak out loud.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Norinly focuses strictly on **active speaking**. When you click matching on Norinly, you enter a call with a real person instantly. There are no profiles, no texting icebreakers, and no approval queues. It is the purest way to practice speaking English.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Ready to start practicing?</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              No registration, no social anxiety. Start speaking immediately.
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

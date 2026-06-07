import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free Cambly Alternative 2026 | Norinly',
  description: 'Looking for a free alternative to Cambly? Norinly offers instant, anonymous peer-to-peer English voice chat for free.',
  alternates: {
    canonical: 'https://norinly.live/compare/cambly-alternative',
  },
  openGraph: {
    title: 'Free Cambly Alternative 2026 | Norinly',
    description: 'Looking for a free alternative to Cambly? Norinly offers instant, anonymous peer-to-peer English voice chat for free.',
    url: 'https://norinly.live/compare/cambly-alternative',
    type: 'website',
  },
};

export default function CamblyAlternativePage() {
  const comparison = [
    { feature: 'Price', cambly: 'Highly Expensive ($100+/mo)', norinly: '100% Free' },
    { feature: 'Signup Required', cambly: 'Yes (Email, Profile)', norinly: 'No (Instant Access)' },
    { feature: 'Voice Only Option', cambly: 'No (Video Camera Default)', norinly: 'Yes (Audio Only)' },
    { feature: 'Anonymity', cambly: 'No (Profiles, Real Names)', norinly: 'Yes (100% Anonymous)' },
    { feature: 'Instant Matching', cambly: 'Sometimes (Depends on Tutors)', norinly: 'Yes (Under 10 Seconds)' },
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-[#04060d] to-neutral-950 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            The Best Free Cambly Alternative — Norinly
          </h1>
          <p className="text-neutral-400 text-lg">
            Practice English speaking naturally with real people worldwide, instantly, without paying expensive hourly tutor fees.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/50">
                <th className="p-4 sm:p-5 text-sm font-semibold text-neutral-400">Feature</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-neutral-400">Cambly</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-white">Norinly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-white">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-sm text-neutral-400">{row.cambly}</td>
                  <td className="p-4 sm:p-5 text-sm text-blue-400 font-semibold">{row.norinly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight points */}
        <div className="space-y-6 text-neutral-300">
          <h2 className="text-2xl font-bold text-white">Why Choose a Peer-to-Peer Alternative?</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            While native tutors are helpful for advanced grammar feedback, most English students already understand grammar rules. What they lack is the **opportunity to speak** and break the mental barrier of translation.
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Norinly solves this by matching you with other motivated language learners around the world. Because you are both learning, there is no pressure or fear of judgment, allowing you to build fluid speaking skills for free.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Ready to start practicing?</h3>
            <p className="text-neutral-400 text-sm max-w-sm mx-auto">
              Skip the expensive subscription. Get matched and speak to someone today.
            </p>
          </div>
          <Link
            href="/connect"
            className="inline-flex h-12 px-8 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl transition-all duration-200 text-sm items-center justify-center gap-2 group"
          >
            Start Speaking Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free Speaky Alternative 2026 | Norinly',
  description: 'Looking for a free alternative to Speaky? Norinly provides a clean, ad-free, instant voice matching experience to practice English with real partners.',
  alternates: {
    canonical: 'https://norinly.live/compare/speaky-alternative',
  },
  openGraph: {
    title: 'Free Speaky Alternative 2026 | Norinly',
    description: 'Looking for a free alternative to Speaky? Norinly provides a clean, ad-free, instant voice matching experience to practice English with real partners.',
    url: 'https://norinly.live/compare/speaky-alternative',
    type: 'website',
  },
};

export default function SpeakyAlternativePage() {
  const comparison = [
    { feature: 'Ads & Spam', speaky: 'High (Frequent ads, spam accounts)', norinly: 'None (Clean and spam-free)' },
    { feature: 'Audio Call Quality', speaky: 'Inconsistent (Built-in web RTC bugs)', norinly: 'Premium & HD (Low-latency WebRTC)' },
    { feature: 'Instant voice', speaky: 'Limited (Mostly texting/typing)', norinly: 'Default (Pure voice focus)' },
    { feature: 'Signup Required', speaky: 'Yes (Facebook, Google, email)', norinly: 'No (Completely frictionless)' },
    { feature: 'Cost', speaky: 'Free with heavy ads & paid limits', norinly: '100% Free' },
  ];

  return (
    <div className="flex-1 bg-[#f8f9fc] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            The Best Free Speaky Alternative — Norinly
          </h1>
          <p className="text-slate-600 text-lg">
            Say goodbye to spam messages and distracting ads. Experience high-quality, instant voice connections for practicing spoken English.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Feature</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Speaky</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-900">Norinly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-slate-800">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-sm text-slate-500">{row.speaky}</td>
                  <td className="p-4 sm:p-5 text-sm text-blue-600 font-semibold">{row.norinly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight points */}
        <div className="space-y-6 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">Clean, Focused, and Frictionless</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Platforms like Speaky often suffer from spam, unwanted social solicitations, and intrusive advertisements. It can feel like a chore to navigate through the clutter just to find a serious practice partner.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Norinly keeps it simple. We don&apos;t ask you for your personal social profiles, and we don&apos;t display pop-up advertisements. The only thing you do here is practice your speaking and listening skills. Our custom matchmaking queue connects you directly with another learner in seconds.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Ready to start practicing?</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Connect to a clean, spam-free audio channel instantly.
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

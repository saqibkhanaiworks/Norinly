import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'HelloTalk Alternative — No Signup | Norinly',
  description: 'Looking for a HelloTalk alternative without complicated profiles and signups? Norinly connects you to English speakers instantly.',
  alternates: {
    canonical: 'https://norinly.live/compare/hellotalk-alternative',
  },
  openGraph: {
    title: 'HelloTalk Alternative — No Signup | Norinly',
    description: 'Looking for a HelloTalk alternative without complicated profiles and signups? Norinly connects you to English speakers instantly.',
    url: 'https://norinly.live/compare/hellotalk-alternative',
    type: 'website',
  },
};

export default function HelloTalkAlternativePage() {
  const comparison = [
    { feature: 'Focus', hellotalk: 'General Language Exchange', norinly: 'Focused English Speaking' },
    { feature: 'Profile Setup', hellotalk: 'Required (Bio, Picture, Age)', norinly: 'None (100% Anonymous)' },
    { feature: 'Voice Calls', hellotalk: 'Requires Partner Approval', norinly: 'Instant Match (Under 10s)' },
    { feature: 'Learning Flow', hellotalk: 'Text-heavy Chat Messages', norinly: 'Voice Only (Microphone)' },
    { feature: 'Subscription Limits', hellotalk: 'Yes (Ad-supported / Premium)', norinly: 'No limits (Free forever)' },
  ];

  return (
    <div className="flex-1 bg-[#f8f9fc] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            HelloTalk Alternative — No Signup, Just Talk
          </h1>
          <p className="text-slate-600 text-lg">
            Skip the messaging profiles and complex language exchanges. Connect with speakers immediately to practice English.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">Feature</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">HelloTalk</th>
                <th className="p-4 sm:p-5 text-sm font-semibold text-slate-900">Norinly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-55 bg-slate-50/50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-slate-800">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-sm text-slate-500">{row.hellotalk}</td>
                  <td className="p-4 sm:p-5 text-sm text-blue-600 font-semibold">{row.norinly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight points */}
        <div className="space-y-6 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">Skip the Social Network, Get to the Speaking</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Apps like HelloTalk are designed as social networks. Users spend hours setting up profiles, uploading photos, writing posts, and trying to approve partners just to have a text conversation.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Norinly strips away all of the social friction. There are no bios, messaging histories, or requests. We pair you immediately in an audio-only voice room with someone who is ready to practice speaking English right now.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Ready to start practicing?</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              No profiles, no approvals. Speak immediately.
            </p>
          </div>
          <Link
            href="/connect"
            className="inline-flex h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 text-sm items-center justify-center gap-2 group shadow-md shadow-blue-100 cursor-pointer"
          >
            Connect Instantly
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

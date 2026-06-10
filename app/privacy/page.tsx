import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, EyeOff, Trash2, Mail } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Norinly',
  description: 'Understand how we protect your anonymity and manage metadata at Norinly.',
  alternates: {
    canonical: 'https://norinly.live/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Norinly',
    description: 'Understand how we protect your anonymity and manage metadata at Norinly.',
    url: 'https://norinly.live/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-[#f8f9fc] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" /> Privacy Policy
          </h1>
          <p className="text-slate-600 text-lg">
            At Norinly, we believe anonymity is crucial for building English speaking confidence. We design our platform to collect the minimum possible metadata.
          </p>
        </div>

        {/* Content list */}
        <div className="space-y-8 pt-4 text-slate-700">
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-blue-600" /> What We Collect
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We collect temporary session metadata required to run matchmaking and voice routing services:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-500 space-y-1 pl-2">
              <li>Matchmaking statuses (e.g. joined queue timestamp).</li>
              <li>Country indicator derived from browser timezone settings (to improve regional matching).</li>
              <li>Call durations and logs for traffic analytics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> What We Never Collect
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              To guarantee your complete anonymity, we do NOT collect or track:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-500 space-y-1 pl-2">
              <li>Your voice streams or audio recordings.</li>
              <li>Your name, email address, phone number, or profile details.</li>
              <li>Your IP addresses (these are handled and masked by LiveKit intermediate servers).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-slate-500" /> Data Retention & Deletion
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Queue entry logs and metadata records are automatically deleted from our Supabase instance after 30 days. Because we store no accounts, user identification keys are discarded upon closing your browser session.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" /> GDPR & Contact
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              For any privacy inquiries or to request immediate metadata logs deletion, please contact us via email at{' '}
              <a href="mailto:privacy@norinly.live" className="text-blue-600 hover:underline">
                privacy@norinly.live
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

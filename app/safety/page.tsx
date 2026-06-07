import React from 'react';
import Link from 'next/link';
import { Shield, Lock, EyeOff, UserX, AlertTriangle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Safety Center | Norinly',
  description: 'Learn about voice privacy, anonymization, and our community safety measures at Norinly.',
  alternates: {
    canonical: 'https://norinly.live/safety',
  },
  openGraph: {
    title: 'Safety Center | Norinly',
    description: 'Learn about voice privacy, anonymization, and our community safety measures at Norinly.',
    url: 'https://norinly.live/safety',
    type: 'website',
  },
};

export default function SafetyPage() {
  return (
    <div className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-neutral-950 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" role="img" aria-label="Arrow pointing left" /> Back to Home
        </Link>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Your Safety is Our Priority
          </h1>
          <p className="text-neutral-400 text-lg">
            Norinly is built from the ground up to protect your privacy and ensure a comfortable environment for learning.
          </p>
        </div>

        {/* Safety Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-400" role="img" aria-label="Lock icon" />
            </div>
            <h3 className="text-lg font-bold text-white">We never record your voice</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your conversations use LiveKit's peer-to-peer WebRTC infrastructure. Voice streams are never saved or stored on our servers.
            </p>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-blue-400" role="img" aria-label="Eye off icon" />
            </div>
            <h3 className="text-lg font-bold text-white">Your IP is masked</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              LiveKit handles the media server routing, keeping your IP address hidden from other participants.
            </p>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-center">
              <UserX className="w-5 h-5 text-blue-300" role="img" aria-label="User blocked icon" />
            </div>
            <h3 className="text-lg font-bold text-white">Skip anytime</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              You are always in control. If a partner makes you feel uncomfortable, or if you simply want to talk about a different topic, click "Skip" to be repaired immediately.
            </p>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 bg-blue-950/20 border border-blue-900/40 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-blue-400" role="img" aria-label="Warning icon" />
            </div>
            <h3 className="text-lg font-bold text-white">Abuse Reporting</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every 1-on-1 and group voice room features a prominent flag icon. Submitting a report alerts our moderators, who will immediately review the reported session metadata.
            </p>
          </div>
        </div>

        {/* Zero Tolerance Callout */}
        <div className="bg-blue-950/20 border border-blue-900/30 p-8 rounded-2xl space-y-3">
          <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
            <Shield className="w-5 h-5" role="img" aria-label="Shield icon" /> Zero Tolerance Policy
          </h3>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Harassment, bullying, hate speech, or inappropriate language will result in an immediate, permanent ban. We use device and connection fingerprinting to prevent blocked individuals from bypassing our safety systems.
          </p>
        </div>
      </div>
    </div>
  );
}

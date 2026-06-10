import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, MessageSquare, Heart, Shuffle, ShieldAlert, FileText } from 'lucide-react';

export const metadata = {
  title: 'Community Guidelines | Norinly',
  description: 'Understand the community rules and code of conduct for practicing English speaking on Norinly.',
  alternates: {
    canonical: 'https://norinly.live/guidelines',
  },
  openGraph: {
    title: 'Community Guidelines | Norinly',
    description: 'Understand the community rules and code of conduct for practicing English speaking on Norinly.',
    url: 'https://norinly.live/guidelines',
    type: 'website',
  },
};

export default function GuidelinesPage() {
  const rules = [
    {
      number: '01',
      title: 'Speak only English in rooms',
      description: "This is the core purpose of Norinly. Even if you and your partner speak the same native language, stick strictly to English to maximize practice time.",
      icon: MessageSquare,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      number: '02',
      title: "Be kind — you're talking to a human",
      description: "Everyone here is a student trying to improve. Respect accent differences, be patient with pauses, and encourage each other's efforts.",
      icon: Heart,
      colorClass: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      number: '03',
      title: 'Skip freely without guilt',
      description: "You have no obligation to stay in a conversation. If you want a new topic, or if the connection is poor, simply click skip. It is not considered rude.",
      icon: Shuffle,
      colorClass: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      number: '04',
      title: "Don't share personal information",
      description: "Protect your anonymity. Avoid sharing your real full name, precise location, social media links, or contact info during calls.",
      icon: ShieldAlert,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      number: '05',
      title: 'Report uncomfortable behavior',
      description: "If a peer violates guidelines, use the report button immediately. This helps our automated and manual moderation tools keep the platform safe.",
      icon: FileText,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    }
  ];

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
            <BookOpen className="w-8 h-8 text-blue-600" /> Community Guidelines
          </h1>
          <p className="text-slate-605 text-slate-600 text-lg">
            Please review our community standards to maintain a safe, welcoming, and productive environment for all English learners.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="space-y-6 pt-4">
          {rules.map((rule) => {
            const IconComponent = rule.icon;
            return (
              <div
                key={rule.number}
                className="flex flex-col sm:flex-row items-start gap-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm"
              >
                <div className={`flex items-center justify-center p-3 rounded-xl border shrink-0 ${rule.colorClass}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">{rule.number}</span>
                    <h3 className="text-lg font-bold text-slate-900 leading-none">{rule.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{rule.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

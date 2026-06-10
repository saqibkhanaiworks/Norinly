import React from 'react';
import Link from 'next/link';
import { supabase, isMockMode } from '@/lib/supabase';
import { MOCK_ROOMS } from '@/lib/rooms-config';
import RoomsGrid from '@/components/RoomsGrid';
import { Room } from '@/components/RoomCard';
import DailyChallenge from '@/components/DailyChallenge';
import { Mic, ArrowRight, ShieldCheck, Heart, Zap, Sparkles, BookOpen, HelpCircle, Volume2, Quote } from 'lucide-react';
import { IDIOMS, WORDS, getDayIndex } from '@/lib/learning-data';

// Force dynamic rendering to always fetch latest room list
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const todayIdiom = IDIOMS[getDayIndex(IDIOMS.length)];
  const todayWord = WORDS[getDayIndex(WORDS.length)];

  // Fetch initial rooms list from Supabase
  let initialRooms: Room[] = [];
  
  try {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .order('slug', { ascending: true });
    
    if (data && data.length > 0) {
      initialRooms = data as Room[];
    } else {
      initialRooms = MOCK_ROOMS as Room[];
    }
  } catch (err) {
    console.error('Failed to fetch rooms on server, falling back to mock:', err);
    initialRooms = MOCK_ROOMS as Room[];
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc]">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-200/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-xs font-bold uppercase tracking-wider text-purple-700">
            <Sparkles className="w-3.5 h-3.5" role="img" aria-label="Sparkles icon" /> Instantly Speak English Free
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Speak English. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              With Real People.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-650 font-medium max-w-2xl mx-auto leading-relaxed">
            No signup. No camera. No judgment. Just voice. <br className="hidden sm:inline" />
            Norinly connects you with English learners worldwide in seconds. <br />
            Anonymous, free, forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/connect"
              className="w-full sm:w-auto h-14 px-8 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all duration-200 text-base flex items-center justify-center gap-2 group shadow-md shadow-purple-600/10 hover:-translate-y-0.5"
            >
              Start Speaking Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" role="img" aria-label="Arrow pointing right" />
            </Link>

            <Link
              href="#rooms"
              className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 font-semibold rounded-xl transition-all duration-200 text-base flex items-center justify-center shadow-sm hover:-translate-y-0.5"
            >
              Join a Topic Room
            </Link>
          </div>

          {/* Stats Overview Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8 max-w-3xl mx-auto select-none">
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 shadow-sm">
              <span>🌍</span> 180+ Countries Partnered
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 border border-purple-100 rounded-full text-xs font-bold text-purple-700 shadow-sm">
              <span>🎙️</span> 84.2K Calls Logged
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 border border-amber-100 rounded-full text-xs font-bold text-amber-700 shadow-sm">
              <span>🔒</span> 100% Anonymous Practice
            </div>
          </div>
        </div>
      </section>

      {/* Daily Challenge Banner */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-8 mt-2">
        <DailyChallenge />
      </div>

      {/* Daily Practice Hub (Word, Quiz & Idiom) */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 mb-12">
        <div className="text-left space-y-1.5 mb-6">
          <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full inline-block">
            Today's Practice
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Daily Learning Hub</h2>
          <p className="text-xs text-slate-500 font-medium">Complete today's learning activities to boost your English fluency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Word of the Day */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border-l-[6px] border-l-rose-500">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
                  Word of the Day
                </span>
                <Sparkles className="w-5 h-5 text-rose-400" />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-lg font-black text-slate-950 leading-tight">
                    {todayWord.word}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 italic">({todayWord.pos})</span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {todayWord.def}
                </p>

                <div className="bg-rose-50/50 border border-rose-100/50 p-2.5 rounded-xl text-xs text-slate-700 font-semibold leading-relaxed">
                  <span className="text-rose-800 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Example:</span>
                  "{todayWord.example}"
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed font-semibold bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider mb-0.5">💡 Memory Tip:</span>
                  {todayWord.tip}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🎯 1-2 MINS</span>
              <Link 
                href="/connect"
                className="h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-rose-500/10 hover:-translate-y-0.5"
              >
                Connect Live 🎙️
              </Link>
            </div>
          </div>

          {/* Card 2: Daily Quiz */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border-l-[6px] border-l-purple-500">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
                  Daily Quiz
                </span>
                <HelpCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Test Your Skills
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                  Challenge yourself with 10 random questions on grammar, vocabulary, idioms, and fill-in-the-blanks. Earn XP and maintain your daily streak!
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">⏱️ 5-10 MINS</span>
              <Link 
                href="/quiz"
                className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-purple-500/10 hover:-translate-y-0.5"
              >
                Start Quiz <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Idiom of the Day */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border-l-[6px] border-l-indigo-600">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                  Idiom of the Day
                </span>
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-indigo-950 leading-tight italic">
                  "{todayIdiom.phrase}"
                </h3>
                <div className="bg-indigo-50/50 border border-indigo-100/50 p-2.5 rounded-xl text-xs text-slate-700 font-semibold leading-relaxed">
                  <span className="text-indigo-800 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Meaning:</span>
                  {todayIdiom.meaning}
                </div>
                
                <div className="text-[11px] text-slate-500 leading-relaxed pl-1 pt-1 italic">
                  <span className="font-bold text-slate-400 not-italic block text-[9px] uppercase tracking-wider mb-0.5">Example:</span>
                  "{todayIdiom.dialogue[1].substring(3)}"
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/learn"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
              >
                Learn origin story <ArrowRight className="w-3 h-3" />
              </Link>
              <Link 
                href="/connect"
                className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-indigo-500/10 hover:-translate-y-0.5"
              >
                Practice speaking 🎙️
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How Norinly Works</h2>
            <p className="text-slate-500 text-sm">Practice English speaking in three simple steps</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Connecting dashed line for desktop */}
            <div className="hidden md:block absolute top-[44%] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-slate-200 -translate-y-1/2 z-0" />

            {/* Step 1 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-3xl space-y-4 relative shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 z-10 group">
              <span className="absolute top-6 right-6 text-5xl font-black text-slate-100 select-none group-hover:text-purple-100 transition-colors">01</span>
              <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                <Mic className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" role="img" aria-label="Microphone icon" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Click Start</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Zero forms, zero signups. One tap pairs you with a partner or places you in a customized topic room.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-3xl space-y-4 relative shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 z-10 group">
              <span className="absolute top-6 right-6 text-5xl font-black text-slate-100 select-none group-hover:text-blue-100 transition-colors">02</span>
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                <Zap className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" role="img" aria-label="Lightning bolt icon" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Match Instantly</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our voice matchmaker pairs you with another online learner in under 10 seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-3xl space-y-4 relative shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 z-10 group">
              <span className="absolute top-6 right-6 text-5xl font-black text-slate-100 select-none group-hover:text-emerald-100 transition-colors">03</span>
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                <ShieldCheck className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" role="img" aria-label="Shield check icon" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Speak Freely</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Practice at your own pace. If a call is quiet, skip to the next room or matchmaker instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Rooms Section */}
      <section id="rooms" className="py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Choose Your Topic</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Want to focus on specific vocabulary? Jump into one of our permanent topic rooms.
            </p>
          </div>

          <RoomsGrid initialRooms={initialRooms} />
        </div>
      </section>

      {/* Why Norinly Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Built for Learners</h2>
            <p className="text-slate-500 text-sm">Everything you need to build confidence in English</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200/60 p-6 rounded-xl space-y-3 shadow-sm">
              <div className="text-blue-500 font-semibold text-2xl">🎙️</div>
              <h4 className="font-bold text-slate-900 text-base">Voice Only</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                No cameras, no eye-contact stress. Just focus on hearing and expressing yourself clearly.
              </p>
            </div>

            <div className="bg-white border border-slate-200/60 p-6 rounded-xl space-y-3 shadow-sm">
              <div className="text-blue-500 font-semibold text-2xl">👤</div>
              <h4 className="font-bold text-slate-900 text-base">100% Anonymous</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                No names, no profiles. Talk without feeling self-conscious. Make mistakes comfortably.
              </p>
            </div>

            <div className="bg-white border border-slate-200/60 p-6 rounded-xl space-y-3 shadow-sm">
              <div className="text-purple-500 font-semibold text-2xl">⚡</div>
              <h4 className="font-bold text-slate-900 text-base">Instant Match</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Skip scheduling sessions or waiting. Open the app and start speaking instantly.
              </p>
            </div>

            <div className="bg-white border border-slate-200/60 p-6 rounded-xl space-y-3 shadow-sm">
              <div className="text-amber-500 font-semibold text-2xl">🌍</div>
              <h4 className="font-bold text-slate-900 text-base">Free Forever</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                No subscriptions, hourly fees, or credit cards required. Our platform is completely free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Comparison Strip */}
      <section className="py-12 border-t border-slate-200 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Norinly Alternatives
          </p>
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-sm text-slate-600">
            <Link href="/compare/cambly-alternative" className="hover:text-blue-600 transition-colors hover:underline">
              Free Cambly alternative
            </Link>
            <span className="text-slate-350">|</span>
            <Link href="/compare/hellotalk-alternative" className="hover:text-blue-600 transition-colors hover:underline">
              HelloTalk alternative without signups
            </Link>
            <span className="text-slate-350">|</span>
            <Link href="/compare/italki-alternative" className="hover:text-blue-600 transition-colors hover:underline">
              Free italki speaking alternative
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-slate-200 px-4 sm:px-6 bg-white" id="faq">
        {/* FAQ JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is Norinly completely free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Norinly is 100% free with no subscriptions, credit cards, or hidden fees. You can practice English speaking as much as you want at no cost."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to create an account?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No account is required. You can start speaking English with a real person in seconds — just click 'Start Speaking Now' and you'll be matched instantly, no signup needed."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is my identity kept anonymous?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Completely. Norinly does not ask for your name, email, or any personal information. Your voice is transmitted peer-to-peer via LiveKit WebRTC and is never recorded or stored."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What level of English do I need?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "All levels are welcome — from complete beginners to advanced speakers looking to maintain fluency. You can choose topic rooms that match your comfort level and interests."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the matching work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "When you click 'Start Speaking', you're added to a live queue. Our system pairs you with another English learner in under 10 seconds. If you want a different partner, you can skip and be rematched immediately."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is there video or just audio?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Voice only — by design. Removing video eliminates camera anxiety so you can focus entirely on speaking and listening in English. No webcam is ever required or used."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which browsers and devices does Norinly support?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Norinly works on any modern browser — Chrome, Firefox, Edge, or Safari — on both desktop and mobile. No app download or plugin is required."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What happens if someone is rude or inappropriate?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can skip or end the call instantly with one click. You can also report a user directly from the call screen. We take safety seriously and review all reports promptly. See our Safety Center for full details."
                  }
                }
              ]
            })
          }}
        />

        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm">Everything you need to know about Norinly</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is Norinly completely free?",
                a: "Yes. Norinly is 100% free with no subscriptions, credit cards, or hidden fees. You can practice English speaking as much as you want at no cost."
              },
              {
                q: "Do I need to create an account?",
                a: "No account is required. Just click 'Start Speaking Now' and you'll be matched with a real English learner instantly — no signup, no email, no passwords."
              },
              {
                q: "Is my identity kept anonymous?",
                a: "Completely. We don't ask for your name, email, or any personal information. Your voice is transmitted peer-to-peer via LiveKit WebRTC and is never recorded or stored on our servers."
              },
              {
                q: "What level of English do I need?",
                a: "All levels are welcome — from complete beginners to advanced speakers. Choose a topic room that matches your interests and comfort level, and go at your own pace."
              },
              {
                q: "How does the matching work?",
                a: "When you click 'Start Speaking', you enter a live queue. Our system pairs you with another English learner in under 10 seconds. Don't like your match? Skip and get rematched instantly."
              },
              {
                q: "Is there video or just audio?",
                a: "Voice only — by design. Removing video eliminates camera anxiety so you can focus 100% on speaking and listening. No webcam is ever required."
              },
              {
                q: "Which browsers and devices are supported?",
                a: "Any modern browser works — Chrome, Firefox, Edge, or Safari — on desktop or mobile. No app download or plugin needed, just open the site and start speaking."
              },
              {
                q: "What if someone is rude or inappropriate?",
                a: "End or skip the call instantly with one click. You can also report the user directly from the call screen. We review all reports promptly. Visit our Safety Center for more details."
              }
            ].map(({ q, a }, i) => (
              <details
                key={i}
                className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none hover:bg-slate-100/40 transition-colors">
                  <span className="text-slate-800 font-semibold text-sm sm:text-base">{q}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 group-open:rotate-45 transition-transform duration-200 text-lg leading-none">+</span>
                </summary>
                <div className="px-6 pb-5 pt-1 text-slate-650 text-sm leading-relaxed border-t border-slate-200 bg-white">
                  {a}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-slate-500 text-sm">
              Still have questions?{' '}
              <a href="/safety" className="text-blue-600 hover:text-blue-500 transition-colors underline underline-offset-2">
                Visit our Safety Center
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-lg font-black tracking-wider text-slate-900">Norinly</div>
            <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
              Anonymous English voice practice with real learners around the globe. Instantly, for free.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <Link href="/safety" className="hover:text-indigo-600 transition-colors">Safety</Link>
            <Link href="/guidelines" className="hover:text-indigo-600 transition-colors">Guidelines</Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
            <Link href="/stats" className="hover:text-indigo-600 transition-colors">My Progress</Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-200 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Norinly. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for learners worldwide <Heart className="w-3 h-3 text-blue-500 fill-blue-500" role="img" aria-label="Heart icon" />
          </p>
        </div>
      </footer>
    </div>
  );
}

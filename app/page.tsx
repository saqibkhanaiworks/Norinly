import React from 'react';
import Link from 'next/link';
import { supabase, isMockMode } from '@/lib/supabase';
import { MOCK_ROOMS } from '@/lib/rooms-config';
import RoomsGrid from '@/components/RoomsGrid';
import { Room } from '@/components/RoomCard';
import DailyChallenge from '@/components/DailyChallenge';
import { Mic, ArrowRight, ShieldCheck, Heart, Zap, Sparkles } from 'lucide-react';

// Force dynamic rendering to always fetch latest room list
export const dynamic = 'force-dynamic';

export default async function HomePage() {
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Sparkles className="w-3.5 h-3.5" /> Instantly Speak English Free
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Speak English. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
              With Real People.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 font-medium max-w-2xl mx-auto">
            No signup. No camera. No judgment. Just voice. <br />
            Norinly connects you with English learners worldwide in seconds. <br />
            Anonymous, free, forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/connect"
              className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl transition-all duration-200 text-base flex items-center justify-center gap-2 group shadow-lg shadow-white/5"
            >
              Start Speaking Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#rooms"
              className="w-full sm:w-auto h-14 px-8 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 font-semibold rounded-xl transition-all duration-200 text-base flex items-center justify-center"
            >
              Join a Topic Room
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Challenge Banner */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-8 mt-2">
        <DailyChallenge />
      </div>

      {/* How It Works Section */}
      <section className="py-20 bg-neutral-950 border-y border-neutral-900 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">How Norinly Works</h2>
            <p className="text-neutral-400 text-sm">Practice English speaking in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-2xl space-y-4 relative">
              <span className="absolute top-6 right-6 text-4xl font-extrabold text-neutral-850 select-none">01</span>
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Click Start Speaking</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                No forms, no signups, no email verification. Just one click to access the 1-on-1 matchmaking portal.
              </p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-2xl space-y-4 relative">
              <span className="absolute top-6 right-6 text-4xl font-extrabold text-neutral-850 select-none">02</span>
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Get Matched in Seconds</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Our queue pairs you with a live English learner somewhere in the world in under 10 seconds.
              </p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-2xl space-y-4 relative">
              <span className="absolute top-6 right-6 text-4xl font-extrabold text-neutral-850 select-none">03</span>
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Talk, Skip, Repeat</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Practice at your own pace. Switch partners immediately if you want, or end the session with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Rooms Section */}
      <section id="rooms" className="py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Choose Your Topic</h2>
            <p className="text-neutral-400 text-sm max-w-md mx-auto">
              Want to focus on specific vocabulary? Jump into one of our permanent topic rooms.
            </p>
          </div>

          <RoomsGrid initialRooms={initialRooms} />
        </div>
      </section>

      {/* Why Norinly Section */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Built for Learners</h2>
            <p className="text-neutral-400 text-sm">Everything you need to build confidence in English</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neutral-900 border border-neutral-800/80 p-6 rounded-xl space-y-3">
              <div className="text-blue-400 font-semibold text-2xl">🎙️</div>
              <h4 className="font-bold text-white text-base">Voice Only</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">
                No cameras, no eye-contact stress. Just focus on hearing and expressing yourself clearly.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800/80 p-6 rounded-xl space-y-3">
              <div className="text-blue-400 font-semibold text-2xl">👤</div>
              <h4 className="font-bold text-white text-base">100% Anonymous</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">
                No names, no profiles. Talk without feeling self-conscious. Make mistakes comfortably.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800/80 p-6 rounded-xl space-y-3">
              <div className="text-purple-400 font-semibold text-2xl">⚡</div>
              <h4 className="font-bold text-white text-base">Instant Match</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Skip scheduling sessions or waiting. Open the app and start speaking instantly.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800/80 p-6 rounded-xl space-y-3">
              <div className="text-amber-400 font-semibold text-2xl">🌍</div>
              <h4 className="font-bold text-white text-base">Free Forever</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">
                No subscriptions, hourly fees, or credit cards required. Our platform is completely free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Comparison Strip */}
      <section className="py-12 border-t border-neutral-900 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Norinly Alternatives
          </p>
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-sm text-neutral-400">
            <Link href="/compare/cambly-alternative" className="hover:text-blue-400 transition-colors hover:underline">
              Free Cambly alternative
            </Link>
            <span className="text-neutral-800">|</span>
            <Link href="/compare/hellotalk-alternative" className="hover:text-blue-400 transition-colors hover:underline">
              HelloTalk alternative without signups
            </Link>
            <span className="text-neutral-800">|</span>
            <Link href="/compare/italki-alternative" className="hover:text-blue-400 transition-colors hover:underline">
              Free italki speaking alternative
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-lg font-black tracking-wider text-white">Norinly</div>
            <p className="text-neutral-500 text-xs max-w-xs leading-relaxed">
              Anonymous English voice practice with real learners around the globe. Instantly, for free.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
            <Link href="/safety" className="hover:text-white transition-colors">Safety</Link>
            <Link href="/guidelines" className="hover:text-white transition-colors">Guidelines</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/stats" className="hover:text-white transition-colors">My Progress</Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-neutral-900/60 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <p>© 2026 Norinly. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for learners worldwide <Heart className="w-3 h-3 text-blue-500 fill-blue-500" />
          </p>
        </div>
      </footer>
    </div>
  );
}

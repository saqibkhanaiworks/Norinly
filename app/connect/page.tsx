'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MicPermissionGate from '@/components/MicPermissionGate';
import MatchQueue from '@/components/MatchQueue';
import VoiceRoom from '@/components/VoiceRoom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

type ConnectState = 'level-select' | 'requesting-mic' | 'queuing' | 'matched' | 'in-call' | 'post-call';

export default function ConnectPage() {
  const router = useRouter();
  const [state, setState] = useState<ConnectState>('level-select');
  const [userName, setUserName] = useState<string>('Stranger');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('norinly_level');
    }
    return null;
  });
  const [matchDetails, setMatchDetails] = useState<{
    roomUrl: string;
    meetingToken: string;
    sessionToken: string;
    partnerCountry?: string | null;
  } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('norinly_learn_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.nickname) {
          setUserName(parsed.nickname);
        }
      }
    } catch (e) {
      console.error('Failed to load nickname from localStorage:', e);
    }
  }, []);

  const [postCallData, setPostCallData] = useState<{
    durationSeconds: number;
    xpEarned: number;
    streak: number;
    prevStreak: number;
  } | null>(null);

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (state !== 'post-call') return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/learn');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, router]);

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    sessionStorage.setItem('norinly_level', level);
    setState('requesting-mic');
  };

  const handleMicGranted = () => {
    setState('queuing');
  };

  const handleMicDenied = () => {
    // Keep user in the permission gate displaying denied help message
  };

  const handleMatched = (roomUrl: string, meetingToken: string, sessionToken: string, partnerCountry?: string | null) => {
    setMatchDetails({ roomUrl, meetingToken, sessionToken, partnerCountry });
    setState('matched');

    // Wait for the 800ms confirmation splash screen
    setTimeout(() => {
      setState('in-call');
    }, 800);
  };

  const handleCancelMatch = () => {
    router.push('/');
  };

  const handleSkipCall = async () => {
    // Reset state to queuing to find next partner
    setMatchDetails(null);
    setState('queuing');
  };

  const handleEndCall = (durationSeconds: number) => {
    const xpEarned = Math.round((durationSeconds / 60) * 10);
    
    let currentStreak = 0;
    let prevStreak = 0;

    try {
      const stored = localStorage.getItem('norinly_learn_state');
      let stateObj: { streak?: number; lastVisitDate?: string; voiceXP?: number; nickname?: string } = {};
      if (stored) {
        stateObj = JSON.parse(stored);
      }
      
      prevStreak = stateObj.streak || 0;
      let newStreak = prevStreak;
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split('T')[0];

      if (stateObj.lastVisitDate === yesterdayKey || prevStreak === 0) {
        newStreak += 1;
      } else if (stateObj.lastVisitDate !== today) {
        newStreak = 1;
      }

      stateObj.streak = newStreak;
      stateObj.lastVisitDate = today;
      stateObj.voiceXP = (stateObj.voiceXP || 0) + xpEarned;

      localStorage.setItem('norinly_learn_state', JSON.stringify(stateObj));
      currentStreak = newStreak;
    } catch (e) {
      console.error('Failed to update streak/XP on end call:', e);
      currentStreak = prevStreak || 1;
    }

    setPostCallData({
      durationSeconds,
      xpEarned,
      streak: currentStreak,
      prevStreak
    });
    setCountdown(10);
    setState('post-call');
  };

  return (
    <div className="flex-1 flex flex-col justify-center bg-[#f8f9fc] py-10 px-4 sm:px-6 relative">
      {/* Return home link (only when not in-call and not matched) */}
      {state !== 'in-call' && state !== 'matched' && (
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-850 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      )}

      <div className={`w-full mx-auto transition-all duration-500 ${state === 'in-call' || state === 'queuing' ? 'max-w-6xl' : 'max-w-md'}`}>
        {state === 'level-select' && (
          <div className="bg-white border border-slate-200/80 p-8 rounded-2xl space-y-6 text-center animate-fade-in shadow-md">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">How&apos;s your English feeling today?</h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Choose a tag to match with similar speakers.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { key: 'nervous', emoji: '😰', title: 'Nervous', desc: '"I need patience and encouragement"' },
                { key: 'practicing', emoji: '🙂', title: 'Practicing', desc: '"I\'m getting better every day"' },
                { key: 'confident', emoji: '😎', title: 'Confident', desc: '"I can handle any topic"' }
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.key;
                return (
                  <button
                    key={lvl.key}
                    onClick={() => handleLevelSelect(lvl.key)}
                    className={`flex items-center gap-4 text-left p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] min-h-[80px] w-full ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-355 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl shrink-0">{lvl.emoji}</span>
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-slate-900">{lvl.title}</div>
                      <div className="text-xs text-slate-500 leading-normal">{lvl.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {state === 'requesting-mic' && (
          <MicPermissionGate
            onGranted={handleMicGranted}
            onDenied={handleMicDenied}
          />
        )}

        {state === 'queuing' && (
          <MatchQueue
            onMatched={handleMatched}
            onCancel={handleCancelMatch}
            selectedLevel={selectedLevel}
          />
        )}

        {state === 'matched' && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 text-center animate-fade-in">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-50 border border-blue-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Found someone!</h2>
              <p className="text-slate-500 text-sm">Connecting voice lines...</p>
            </div>
          </div>
        )}

        {state === 'in-call' && matchDetails && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-2">
              <h2 className="text-xl font-bold text-slate-900">1-on-1 Practice</h2>
              <p className="text-xs text-slate-500">
                You&apos;re paired with a random English learner. Keep the conversation flowing!
              </p>
            </div>
            
            <VoiceRoom
              roomUrl={matchDetails.roomUrl}
              meetingToken={matchDetails.meetingToken}
              sessionToken={matchDetails.sessionToken}
              userName={userName}
              onSkip={handleSkipCall}
              onEnd={handleEndCall}
              partnerCountry={matchDetails.partnerCountry}
            />
          </div>
        )}

        {state === 'post-call' && postCallData && (
          <div className="bg-white border border-slate-205 border-slate-200 p-8 rounded-2xl space-y-6 text-center animate-fade-in shadow-xl max-w-md mx-auto">
            <div className="space-y-2">
              <div className="text-5xl animate-bounce">🎉</div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Great Practice Session!</h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                You&apos;re one step closer to English fluency.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-4 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Duration</span>
                <span className="text-lg font-black text-slate-800 font-mono">
                  {Math.floor(postCallData.durationSeconds / 60)}m {postCallData.durationSeconds % 60}s
                </span>
              </div>
              <div className="bg-purple-50 border border-purple-100/50 rounded-xl p-4 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">XP Earned</span>
                <span className="text-lg font-black text-purple-700 font-mono">
                  +{postCallData.xpEarned} XP
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100/50 rounded-xl p-5 flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Practice Streak</span>
                <p className="text-sm font-semibold text-slate-700">Daily practice secured!</p>
              </div>
              <div className="flex items-center gap-1 bg-white border border-amber-200 px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-base">🔥</span>
                <span className="text-sm font-extrabold text-amber-700">{postCallData.streak} days</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-semibold py-1">
              Returning to dashboard in <span className="text-blue-600 font-bold">{countdown}s</span>...
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  setCountdown(10);
                  setState('level-select');
                  setPostCallData(null);
                }}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-100"
              >
                Practice Again
              </button>
              <button
                onClick={() => router.push('/learn')}
                className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

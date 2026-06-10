'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MicPermissionGate from '@/components/MicPermissionGate';
import MatchQueue from '@/components/MatchQueue';
import VoiceRoom from '@/components/VoiceRoom';
import { ArrowLeft, CheckCircle, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type ConnectState = 'level-select' | 'requesting-mic' | 'queuing' | 'matched' | 'in-call';

export default function ConnectPage() {
  const router = useRouter();
  const [state, setState] = useState<ConnectState>('level-select');
  const [userName, setUserName] = useState<string>('Stranger');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [matchDetails, setMatchDetails] = useState<{
    roomUrl: string;
    meetingToken: string;
    sessionToken: string;
    partnerCountry?: string | null;
  } | null>(null);

  useEffect(() => {
    const savedLevel = sessionStorage.getItem('norinly_level');
    if (savedLevel) {
      setSelectedLevel(savedLevel);
    }
  }, []);

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

  const handleEndCall = () => {
    // Navigate home on end call
    router.push('/?ended=true');
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">How's your English feeling today?</h2>
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
                You are paired with a random English learner. Keep the conversation flowing!
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
      </div>
    </div>
  );
}

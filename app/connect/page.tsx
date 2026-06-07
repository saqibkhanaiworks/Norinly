'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MicPermissionGate from '@/components/MicPermissionGate';
import MatchQueue from '@/components/MatchQueue';
import VoiceRoom from '@/components/VoiceRoom';
import NotifyMeButton from '@/components/NotifyMeButton';
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
    <div className="flex-1 flex flex-col justify-center bg-gradient-to-b from-[#0a0a0a] to-neutral-950 py-10 px-4 sm:px-6 relative">
      {/* Return home link (only when not in-call and not matched) */}
      {state !== 'in-call' && state !== 'matched' && (
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      )}

      <div className={`w-full mx-auto transition-all duration-500 ${state === 'in-call' ? 'max-w-4xl' : 'max-w-md'}`}>
        {state === 'level-select' && (
          <div className="bg-neutral-900/50 border border-neutral-800/80 p-8 rounded-2xl space-y-6 text-center animate-fade-in shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">How's your English feeling today?</h2>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
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
                        ? 'border-[#3b82f6] bg-[#3b82f6]/5'
                        : 'border-neutral-800 bg-[#111111] hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-3xl shrink-0">{lvl.emoji}</span>
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-white">{lvl.title}</div>
                      <div className="text-xs text-neutral-400 leading-normal">{lvl.desc}</div>
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
          <div className="space-y-4">
            <MatchQueue
              onMatched={handleMatched}
              onCancel={handleCancelMatch}
              selectedLevel={selectedLevel}
            />
            <NotifyMeButton />
          </div>
        )}

        {state === 'matched' && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 text-center animate-fade-in">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <CheckCircle className="w-10 h-10 text-blue-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Found someone!</h2>
              <p className="text-neutral-400 text-sm">Connecting voice lines...</p>
            </div>
          </div>
        )}

        {state === 'in-call' && matchDetails && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-2">
              <h2 className="text-xl font-bold text-white">1-on-1 Practice</h2>
              <p className="text-xs text-neutral-400">
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

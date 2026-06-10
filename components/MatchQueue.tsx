'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, AlertTriangle, Lightbulb, MessageSquare, ShieldCheck } from 'lucide-react';
import { TIMEZONE_MAP } from '@/lib/timezone-mapping';
import { supabase } from '@/lib/supabase';

interface MatchQueueProps {
  onMatched: (roomUrl: string, token: string, sessionToken: string, partnerCountry?: string | null) => void;
  onCancel: () => void;
  selectedLevel?: string | null;
}

const TIPS = [
  "Don't worry about perfect grammar! Real conversation is about sharing ideas and building confidence.",
  "Try using conversational fillers like 'well', 'actually', or 'you know' to give yourself thinking time.",
  "Ask follow-up questions like 'What makes you say that?' or 'How about you?' to keep the conversation flowing.",
  "Use descriptions if you forget a specific word. Instead of 'refrigerator', say 'the cold box in the kitchen'.",
  "Listen actively! Nods or small phrases like 'I see' or 'That's interesting' show your partner you are engaged."
];

const ICEBREAKERS = [
  "What is the best movie or TV show you watched recently? Tell me about it!",
  "If you could travel to any country tomorrow, where would you go first?",
  "What is a typical local food or dish from your country that everyone should try?",
  "What do you do to relax after a long day? Any interesting hobbies?",
  "What's one thing about your city or country that tourists usually don't know?"
];

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function MatchQueue({ onMatched, onCancel, selectedLevel }: MatchQueueProps) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'joining' | 'waiting' | 'matched' | 'failed'>('joining');

  // Push notifications state
  const [isNotificationsSupported, setIsNotificationsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Cycling states
  const [tipIndex, setTipIndex] = useState(0);
  const [icebreakerIndex, setIcebreakerIndex] = useState(0);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTokenRef = useRef<string | null>(null);

  const countries = ['Spain', 'Brazil', 'Japan', 'Germany', 'France', 'Italy', 'Vietnam', 'Turkey', 'Mexico', 'South Korea', 'Poland', 'Egypt', 'Thailand', 'Colombia'];
  const [currentCountryIdx, setCurrentCountryIdx] = useState(0);

  // Cycle tips & icebreakers
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 6000);

    const icebreakerInterval = setInterval(() => {
      setIcebreakerIndex((prev) => (prev + 1) % ICEBREAKERS.length);
    }, 6000);

    return () => {
      clearInterval(tipInterval);
      clearInterval(icebreakerInterval);
    };
  }, []);

  // Notifications permission & state check
  useEffect(() => {
    const isSupported =
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      Notification.permission !== 'denied';

    setIsNotificationsSupported(isSupported);

    if (isSupported) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  // Toggle push notifications active state
  const handleToggleNotifications = async () => {
    if (loadingNotifications) return;
    setLoadingNotifications(true);

    try {
      if (isSubscribed) {
        // Unsubscribe
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          const endpoint = subscription.endpoint;
          await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
        }
        setIsSubscribed(false);
      } else {
        // Subscribe
        if (Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            setLoadingNotifications(false);
            return;
          }
        }

        const registration = await navigator.serviceWorker.ready;
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not defined in environment');
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        const subJson = subscription.toJSON();
        const endpoint = subJson.endpoint;
        const keys_p256dh = subJson.keys?.p256dh;
        const keys_auth = subJson.keys?.auth;

        if (endpoint && keys_p256dh && keys_auth) {
          const { error } = await supabase
            .from('push_subscriptions')
            .insert({
              endpoint,
              keys_p256dh,
              keys_auth,
            });

          if (!error) {
            setIsSubscribed(true);
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle push notifications:', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const leaveQueue = async (tokenToLeave: string) => {
    try {
      await fetch('/api/match/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: tokenToLeave }),
      });
    } catch (err) {
      console.error('Error leaving match queue:', err);
    }
  };

  const handleCancelClick = async () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (sessionTokenRef.current) {
      await leaveQueue(sessionTokenRef.current);
    }
    onCancel();
  };

  useEffect(() => {
    if (status === 'waiting' || status === 'joining') {
      const countryInterval = setInterval(() => {
        setCurrentCountryIdx((prev) => (prev + 1) % countries.length);
      }, 1500);
      return () => clearInterval(countryInterval);
    }
  }, [status, countries.length]);

  useEffect(() => {
    let active = true;

    const startMatchmaking = async () => {
      setStatus('joining');
      setError(null);
      
      let countryCode = '';
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        countryCode = TIMEZONE_MAP[tz]?.code || '';
      } catch (err) {
        console.error('Failed to get browser timezone:', err);
      }

      try {
        const response = await fetch('/api/match/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: countryCode, level: selectedLevel }),
        });

        if (!response.ok) {
          throw new Error('Failed to join matchmaking queue');
        }

        const data = await response.json();

        if (!active) {
          if (data.sessionToken) {
            leaveQueue(data.sessionToken);
          }
          return;
        }

        setSessionToken(data.sessionToken);
        sessionTokenRef.current = data.sessionToken;

        if (data.status === 'matched') {
          setStatus('matched');
          setTimeout(() => {
            onMatched(data.roomUrl, data.meetingToken, data.sessionToken, data.partnerCountry);
          }, 800);
        } else {
          setStatus('waiting');
          timerIntervalRef.current = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
          }, 1000);

          pollIntervalRef.current = setInterval(async () => {
            try {
              const pollRes = await fetch(`/api/match/poll?token=${data.sessionToken}`);
              if (!pollRes.ok) throw new Error('Polling error');
              
              const pollData = await pollRes.json();
              if (pollData.status === 'matched' && active) {
                setStatus('matched');
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                
                setTimeout(() => {
                  onMatched(pollData.roomUrl, pollData.meetingToken, data.sessionToken, pollData.partnerCountry);
                }, 800);
              } else if (pollData.status === 'expired' && active) {
                setStatus('failed');
                setError('Queue session expired. Please try again.');
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
              }
            } catch (pollErr) {
              console.error('Error polling match:', pollErr);
            }
          }, 2000);
        }
      } catch (err: any) {
        console.error('Matchmaking error:', err);
        if (active) {
          setStatus('failed');
          setError(err.message || 'Connection failed — try again');
        }
      }
    };

    startMatchmaking();

    return () => {
      active = false;
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      const currentToken = sessionTokenRef.current;
      if (currentToken) {
        leaveQueue(currentToken);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-8 animate-fade-in">
      {status === 'matched' ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] space-y-6 text-center bg-white border border-slate-200 p-12 rounded-3xl shadow-md">
          <div className="relative flex items-center justify-center w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm">
            <span className="relative inline-flex rounded-full h-10 w-10 bg-emerald-600 items-center justify-center text-white font-extrabold text-lg">✓</span>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900">Found someone!</h2>
            <p className="text-slate-500 text-sm font-medium">Connecting voice room...</p>
          </div>
        </div>
      ) : status === 'failed' ? (
        <div className="max-w-md mx-auto space-y-6 bg-amber-50/50 border border-amber-200 p-8 rounded-3xl text-center shadow-md">
          <div className="flex items-center justify-center w-14 h-14 bg-amber-100/50 border border-amber-200 text-amber-700 rounded-2xl mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-base text-slate-900">Matchmaking Failed</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {error || 'Unable to connect to matchmaking server. Please check your internet connection.'}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full h-11 bg-purple-600 text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors shadow-sm shadow-purple-600/10 active:scale-98 cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        /* Left: Radar Visual & Controls | Right: Tips & Starters Cards */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* COLUMN 1: Radar Visualization & Match Parameters (3 cols) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col items-center text-center space-y-8 shadow-sm">
            
            {/* Radar Layout block */}
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-purple-100 bg-purple-50/5 flex items-center justify-center shadow-inner">
              
              {/* Sweeping radar line */}
              <div className="absolute inset-0 animate-[spin_4s_linear_infinite] pointer-events-none origin-center">
                <div className="absolute top-1/2 left-1/2 w-[50%] h-[2.5px] bg-gradient-to-r from-purple-500/40 via-purple-300/10 to-transparent origin-left -translate-y-1/2" />
              </div>

              {/* Concentric rings */}
              <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-dashed border-purple-200/40" />
              <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-purple-200/30" />

              {/* Central User Avatar Frame */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-purple-600 shadow-md flex items-center justify-center bg-purple-50 text-purple-700 font-extrabold text-xl overflow-hidden z-10 animate-pulse">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" 
                  alt="You" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Floating Avatars of other learners */}
              <div className="absolute top-[16%] left-[20%] w-9 h-9 rounded-full border-2 border-white shadow bg-rose-50 overflow-hidden animate-[pulse_2.2s_infinite_ease-in-out]">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" 
                  alt="Learner" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute bottom-[24%] right-[14%] w-10 h-10 rounded-full border-2 border-white shadow bg-emerald-50 overflow-hidden animate-[bounce_4s_infinite]">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" 
                  alt="Learner" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute top-[36%] right-[20%] w-8 h-8 rounded-full border-2 border-white shadow bg-sky-50 overflow-hidden animate-[pulse_3.2s_infinite_ease-in-out]">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" 
                  alt="Learner" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Status Headings & Elapsed Count */}
            <div className="space-y-3.5 w-full">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight animate-pulse">
                  Matching in progress...
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Looking for a partner speaking in <span className="text-purple-600 font-bold underline decoration-wavy decoration-purple-250 decoration-purple-200">{countries[currentCountryIdx]}</span>...
                </p>
              </div>

              {/* Elapsed Pill Badge */}
              <div className="inline-flex items-center px-4.5 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-xs font-bold text-purple-700 shadow-sm">
                Elapsed: {elapsedSeconds}s
              </div>
            </div>

            {/* Matching Parameters Box */}
            <div className="w-full bg-slate-50 border border-slate-200/80 p-5 rounded-2xl grid grid-cols-2 gap-4 max-w-md text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MATCH TYPE</span>
                <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">🎙️ 1-on-1 Voice</span>
              </div>
              <div className="border-l border-slate-200 pl-5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TARGET LEVEL</span>
                <span className="text-sm font-extrabold text-slate-850 text-slate-800 flex items-center gap-1.5 mt-0.5 capitalize">
                  {selectedLevel === 'nervous' ? '😰 Nervous' : selectedLevel === 'practicing' ? '🙂 Practicing' : selectedLevel === 'confident' ? '😎 Confident' : '💬 All Levels'}
                </span>
              </div>
            </div>

            {/* Controls Container (Rose button & Notifications Toggle switch) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-2">
              <button
                type="button"
                onClick={handleCancelClick}
                className="w-full sm:w-auto px-6 h-12 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm active:scale-98 cursor-pointer"
              >
                <X className="w-4 h-4" /> Cancel matchmaking
              </button>

              {isNotificationsSupported && (
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 bg-white border border-slate-200 px-5 h-12 rounded-xl shadow-sm text-xs select-none">
                  <span className="font-bold text-slate-700">Notifications active</span>
                  <button
                    type="button"
                    onClick={handleToggleNotifications}
                    disabled={loadingNotifications}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isSubscribed ? 'bg-purple-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isSubscribed ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: Cycling Tips & Starters (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Tips while you wait */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm border-l-[6px] border-l-blue-600 min-h-[170px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Tips while you wait</h4>
                </div>
                
                <p 
                  key={tipIndex} 
                  className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed animate-fade-in min-h-[4rem]"
                >
                  "{TIPS[tipIndex]}"
                </p>
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-100">
                💡 Tip {tipIndex + 1} of {TIPS.length}
              </div>
            </div>

            {/* Card 2: Icebreakers / Conversation Starters */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm border-l-[6px] border-l-purple-500 min-h-[170px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Icebreakers</h4>
                </div>
                
                <p 
                  key={icebreakerIndex} 
                  className="text-slate-650 text-slate-700 text-xs sm:text-sm font-black leading-relaxed animate-fade-in italic min-h-[4rem]"
                >
                  "{ICEBREAKERS[icebreakerIndex]}"
                </p>
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-100">
                💬 Starter {icebreakerIndex + 1} of {ICEBREAKERS.length}
              </div>
            </div>
            
            {/* Safety Reminder badge */}
            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-start gap-3">
              <div className="text-blue-600 text-base">🛡️</div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Safety First</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                  Every voice chat is anonymous. Never share personal information, social handles, or contact info with matching partners.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

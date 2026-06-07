'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Mic, X, AlertTriangle } from 'lucide-react';
import { TIMEZONE_MAP } from '@/lib/timezone-mapping';

interface MatchQueueProps {
  onMatched: (roomUrl: string, token: string, sessionToken: string, partnerCountry?: string | null) => void;
  onCancel: () => void;
  selectedLevel?: string | null;
}

export default function MatchQueue({ onMatched, onCancel, selectedLevel }: MatchQueueProps) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'joining' | 'waiting' | 'matched' | 'failed'>('joining');

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTokenRef = useRef<string | null>(null);

  // Leave queue endpoint wrapper
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
    // Stop intervals
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (sessionTokenRef.current) {
      await leaveQueue(sessionTokenRef.current);
    }
    onCancel();
  };

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
          // If component was unmounted while joining, clean up immediately
          if (data.sessionToken) {
            leaveQueue(data.sessionToken);
          }
          return;
        }

        setSessionToken(data.sessionToken);
        sessionTokenRef.current = data.sessionToken;

        if (data.status === 'matched') {
          setStatus('matched');
          // Call matched hook immediately
          setTimeout(() => {
            onMatched(data.roomUrl, data.meetingToken, data.sessionToken, data.partnerCountry);
          }, 800);
        } else {
          setStatus('waiting');
          // Start the elapsed timer
          timerIntervalRef.current = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
          }, 1000);

          // Start polling every 2 seconds
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
      
      // Clean up in background if still waiting
      const currentToken = sessionTokenRef.current;
      if (currentToken) {
        leaveQueue(currentToken);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        {status === 'matched' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="relative flex items-center justify-center w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="relative inline-flex rounded-full h-12 w-12 bg-blue-500 items-center justify-center text-white font-extrabold text-xl">✓</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Found someone!</h2>
              <p className="text-neutral-400 text-sm">Connecting voice room...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Visual Pulse Radar */}
            <div className="relative flex items-center justify-center w-28 h-28 bg-neutral-900 border border-neutral-800/80 rounded-full">
              <div className={`absolute inset-0 w-full h-full rounded-full bg-blue-500/5 border border-blue-500/10 transition-all duration-1000 ${status === 'failed' ? 'opacity-0' : 'animate-ping'}`} />
              <div className={`absolute inset-4 w-20 h-20 rounded-full bg-blue-500/5 border border-blue-500/10 transition-all duration-1000 ${status === 'failed' ? 'opacity-0' : 'animate-pulse'}`} />
              <Mic className={`w-8 h-8 ${status === 'failed' ? 'text-neutral-600' : 'text-blue-400 animate-pulse'}`} />
            </div>

            {status === 'failed' ? (
              <div className="space-y-6 bg-blue-950/5 border border-blue-900/15 p-6 rounded-2xl w-full">
                <div className="flex items-center gap-3 text-blue-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h3 className="font-semibold text-sm text-left">Matchmaking Failed</h3>
                </div>
                <p className="text-neutral-400 text-xs text-left leading-relaxed">
                  {error || 'Unable to connect to matchmaking server. Please check your internet connection.'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full h-11 bg-white text-black font-semibold rounded-xl text-xs hover:bg-neutral-200 transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">
                  {status === 'joining' ? 'Joining queue...' : 'Finding you someone to talk to...'}
                </h2>
                <p className="text-neutral-400 text-sm max-w-xs mx-auto leading-relaxed">
                  Usually under 10 seconds. Sometimes a bit longer.
                </p>
                <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider pt-2">
                  Looking for {elapsedSeconds}s...
                </div>
              </div>
            )}

            {status !== 'failed' && (
              <button
                onClick={handleCancelClick}
                className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white border-b border-dashed border-neutral-700 hover:border-white transition-colors py-1 px-2 mt-4"
              >
                <X className="w-3.5 h-3.5" /> Cancel matchmaking
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

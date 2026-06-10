'use client';

import React, { useEffect, useState } from 'react';
import { Mic, AlertCircle, HelpCircle } from 'lucide-react';

interface MicPermissionGateProps {
  onGranted: () => void;
  onDenied: () => void;
}

export default function MicPermissionGate({ onGranted, onDenied }: MicPermissionGateProps) {
  const [status, setStatus] = useState<'requesting' | 'granted' | 'denied'>('requesting');

  const requestPermission = async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      // Stop stream tracks immediately since we only wanted to request permission
      stream.getTracks().forEach((track) => track.stop());
      setStatus('granted');
      onGranted();
    } catch (error) {
      console.error('Microphone access denied:', error);
      setStatus('denied');
      onDenied();
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {status === 'requesting' && (
        <div className="flex flex-col items-center space-y-6">
          <div className="relative flex items-center justify-center w-24 h-24 bg-white border border-slate-200 rounded-full shadow-sm">
            <div className="absolute inset-0 w-full h-full rounded-full bg-blue-500/10 animate-ping" />
            <Mic className="w-10 h-10 text-blue-600" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h2 className="text-2xl font-bold text-slate-900">One quick thing</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Norinly needs microphone access to connect you with learners. Please click allow when prompted.
            </p>
          </div>
          <div className="text-xs text-slate-400">We never record your voice.</div>
        </div>
      )}

      {status === 'denied' && (
        <div className="flex flex-col items-center space-y-6 max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-md">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-50 border border-blue-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Microphone Access Required</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Norinly cannot connect you without microphone access. Please update your browser settings to allow microphone permission.
            </p>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={requestPermission}
              className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-100"
            >
              <Mic className="w-4 h-4" /> Try Again
            </button>

            <a
              href="https://support.google.com/chrome/answer/2693767"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline inline-flex items-center justify-center gap-1 py-2"
            >
              <HelpCircle className="w-3 h-3" /> How to enable mic permissions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

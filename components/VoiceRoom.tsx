'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase, isMockMode } from '@/lib/supabase';
import { Mic, MicOff, PhoneOff, ArrowRight, Flag, ShieldAlert, Send, MessageSquare, X } from 'lucide-react';
import ReportModal from './ReportModal';
import PostCallFeedback from './PostCallFeedback';
import { COUNTRY_INFO_MAP } from '@/lib/timezone-mapping';

interface VoiceRoomProps {
  roomUrl: string;
  meetingToken: string;
  sessionToken: string;
  userName: string;
  onSkip: () => void;
  onEnd: () => void;
  partnerCountry?: string | null;
}

const CONVERSATION_PROMPTS = [
  "Tell each other one thing that happened to you this week.",
  "What's a skill you wish you had?",
  "Describe your city to someone who's never been there.",
  "What's something you changed your mind about recently.",
  "What would you do with a free day tomorrow?",
  "Tell each other about a book, show, or movie you loved.",
  "What's the most useful English word you know?",
  "Describe your perfect meal.",
  "What's something small that makes you happy?",
  "If you could live anywhere, where and why?"
];


export default function VoiceRoom({ roomUrl, meetingToken, sessionToken, userName, onSkip, onEnd, partnerCountry }: VoiceRoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [partnerLeft, setPartnerLeft] = useState(false);
  const [localIsSpeaking, setLocalIsSpeaking] = useState(false);
  const [partnerIsSpeaking, setPartnerIsSpeaking] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Timer, Prompt, Feedback states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showFlagToast, setShowFlagToast] = useState(false);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const getPartnerCountryToast = () => {
    if (partnerCountry && COUNTRY_INFO_MAP[partnerCountry]) {
      const { flag, name } = COUNTRY_INFO_MAP[partnerCountry];
      return `${flag} Connected with someone from ${name}`;
    }
    return `🌍 Connected with someone worldwide`;
  };

  const handleTopicClick = () => {
    if (!showPrompt) {
      const randomIdx = Math.floor(Math.random() * CONVERSATION_PROMPTS.length);
      setPromptIndex(randomIdx);
      setShowPrompt(true);
    } else {
      setPromptIndex((prev) => (prev + 1) % CONVERSATION_PROMPTS.length);
    }
  };

  // Chat States
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([]);
  const [inputText, setInputText] = useState('');

  const callFrameRef = useRef<any>(null);
  const localUserIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inject system welcome message when connected
  useEffect(() => {
    if (isConnected && !partnerLeft) {
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([
        {
          sender: 'System',
          text: `Connected with partner. Say hello!`,
          time: timeString
        }
      ]);
    }
  }, [isConnected, partnerLeft]);

  useEffect(() => {
    let active = true;

    const setupLiveKit = async () => {
      try {
        const { Room, RoomEvent, AudioPresets } = await import('livekit-client');
        
        if (!active) return;

        // Create a new room instance
        const room = new Room({
          publishDefaults: {
            audioPreset: AudioPresets.speech,
          },
        });

        callFrameRef.current = room;

        // Joined meeting handler
        room.on(RoomEvent.Connected, () => {
          if (!active) return;
          setIsConnected(true);
          localUserIdRef.current = room.localParticipant.sid;
          
          // Start the in-call timer
          setElapsedSeconds(0);
          timerIntervalRef.current = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
          }, 1000);

          // Show country flag toast
          setShowFlagToast(true);
          setTimeout(() => {
            setShowFlagToast(false);
          }, 3000);
        });

        // Disconnected handler
        room.on(RoomEvent.Disconnected, () => {
          console.log('Successfully left LiveKit room');
        });

        // Track subscribed handler (play audio tracks)
        room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === 'audio') {
            const audioElement = track.attach();
            audioElement.id = `lk-audio-${participant.sid}`;
            document.body.appendChild(audioElement);
          }
        });

        // Track unsubscribed handler (clean up audio element)
        room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
          if (track.kind === 'audio') {
            const el = document.getElementById(`lk-audio-${participant.sid}`);
            if (el) el.remove();
          }
        });

        // Participant connected (partner joined)
        room.on(RoomEvent.ParticipantConnected, (participant) => {
          if (!active) return;
          setPartnerLeft(false);
        });

        // Participant disconnected (partner left)
        room.on(RoomEvent.ParticipantDisconnected, (participant) => {
          if (!active) return;
          setPartnerLeft(true);
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setMessages(prev => [...prev, {
            sender: 'System',
            text: 'Your partner has disconnected.',
            time: timeString
          }]);
          
          const el = document.getElementById(`lk-audio-${participant.sid}`);
          if (el) el.remove();
        });

        // Active speaker change handler
        room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
          if (!active) return;
          if (speakers.length === 0) {
            setLocalIsSpeaking(false);
            setPartnerIsSpeaking(false);
            return;
          }

          const activeSpeaker = speakers[0];
          if (activeSpeaker.sid === room.localParticipant.sid) {
            setLocalIsSpeaking(true);
            setPartnerIsSpeaking(false);
          } else {
            setPartnerIsSpeaking(true);
            setLocalIsSpeaking(false);
          }
        });

        // Data received (peer chat messages)
        room.on(RoomEvent.DataReceived, (payload, participant) => {
          if (!active) return;
          try {
            const text = new TextDecoder().decode(payload);
            const data = JSON.parse(text);
            const senderName = participant?.identity || 'Partner';
            const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            setMessages((prev) => [
              ...prev,
              {
                sender: senderName,
                text: data.text,
                time: timeString
              }
            ]);
          } catch (err) {
            console.error('Failed to parse received data:', err);
          }
        });

        // Connect to the room
        await room.connect(roomUrl, meetingToken);
        
        // Auto publish local audio track
        await room.localParticipant.setMicrophoneEnabled(true);
        setIsMuted(false);

      } catch (err: any) {
        console.error('Error initializing LiveKit call:', err?.message || err, err?.stack);
        if (active) {
          setConnectionError(err?.message || 'Failed to initialize audio call.');
        }
      }
    };

    setupLiveKit();

    return () => {
      active = false;
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      const room = callFrameRef.current;
      if (room) {
        try {
          room.disconnect();
        } catch (err) {
          console.error('Error during room disconnect:', err);
        }
      }
      // Clean up all audio elements
      const audios = document.querySelectorAll('[id^="lk-audio-"]');
      audios.forEach((el) => el.remove());
    };
  }, [roomUrl, meetingToken]);

  // Mute/unmute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    const room = callFrameRef.current;
    if (room && !isMockMode) {
      room.localParticipant.setMicrophoneEnabled(!nextMuted);
    }
  };

  const saveSession = (durationSecs: number) => {
    if (durationSecs <= 0) return;
    try {
      const raw = localStorage.getItem('norinly_sessions');
      const sessions = raw ? JSON.parse(raw) : [];
      sessions.push({
        date: new Date().toISOString(),
        durationSeconds: durationSecs,
        type: '1on1'
      });
      if (sessions.length > 90) {
        sessions.shift();
      }
      localStorage.setItem('norinly_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  };

  // Skip call handler
  const handleSkip = async () => {
    const duration = elapsedSeconds;
    saveSession(duration);

    const room = callFrameRef.current;
    if (room && !isMockMode) {
      try {
        room.disconnect();
      } catch (e) {
        console.error('Error leaving on skip:', e);
      }
    }

    if (duration > 30) {
      setPendingAction(() => onSkip);
      setShowFeedback(true);
    } else {
      onSkip();
    }
  };

  // End call handler
  const handleEnd = async () => {
    const duration = elapsedSeconds;
    saveSession(duration);

    const room = callFrameRef.current;
    if (room) {
      try {
        room.disconnect();
      } catch (e) {
        console.error('Error leaving on end:', e);
      }
    }

    setPendingAction(() => onEnd);
    setShowFeedback(true);
  };

  // Text message submit handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localMsg = { sender: userName || 'You', text, time: timeString };

    setMessages((prev) => [...prev, localMsg]);

    const room = callFrameRef.current;
    if (room) {
      try {
        const payload = new TextEncoder().encode(JSON.stringify({ text }));
        room.localParticipant.publishData(payload, { reliable: true });
      } catch (err) {
        console.error('Failed to send message over data channel:', err);
      }
    }
  };

  if (connectionError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 max-w-sm mx-auto text-center space-y-6 animate-fade-in">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-950/20 border border-blue-900/40 rounded-full">
          <ShieldAlert className="w-8 h-8 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Connection Failed</h3>
          <p className="text-neutral-400 text-sm">{connectionError}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full h-12 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch animate-fade-in">
      {/* LEFT COLUMN: Voice Panel */}
      <div className="relative flex flex-col items-center justify-between min-h-[480px] p-6 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl backdrop-blur-md">
        {/* Monospaced Timer */}
        {isConnected && (
          <div 
            className="absolute top-3.5 left-6 font-mono text-[13px] font-semibold tracking-wider select-none pointer-events-none"
            style={{ color: '#555555' }}
          >
            {formatTime(elapsedSeconds)}
          </div>
        )}

        {/* Country Flag Reveal Toast */}
        <div 
          className={`absolute top-3.5 left-1/2 -translate-x-1/2 bg-[#0d1527]/90 border border-blue-900/40 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-blue-500/5 backdrop-blur-md z-30 transition-all duration-300 pointer-events-none ${
            showFlagToast ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'
          }`}
        >
          {getPartnerCountryToast()}
        </div>

        {/* Top Header Controls */}
        <div className="flex items-center justify-between w-full">
          {/* Connection status indicator */}
          <div className="flex items-center gap-2 bg-neutral-950/45 px-3 py-1.5 rounded-full border border-neutral-800 ml-auto">
            <span className={`relative flex h-2 w-2`}>
              {isConnected && !partnerLeft && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                !isConnected ? 'bg-blue-500 animate-pulse' : partnerLeft ? 'bg-neutral-600' : 'bg-blue-400'
              }`} />
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              {!isConnected ? 'Connecting...' : partnerLeft ? 'Partner left' : 'Connected'}
            </span>
          </div>

          {/* Report flag button */}
          {isConnected && (
            <button
              onClick={() => setShowReport(true)}
              className="flex items-center justify-center w-9 h-9 bg-neutral-950/45 border border-neutral-800 rounded-xl text-neutral-500 hover:text-blue-400 hover:border-blue-500/20 transition-all duration-200 ml-3"
              title="Report User"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Microphone Graphic */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* Animated pulse rings based on speaking state */}
            {isConnected && !partnerLeft && !isMuted && (
              <>
                <div className={`absolute inset-0 rounded-full bg-blue-500/5 border border-blue-500/10 transition-all duration-300 ${
                  localIsSpeaking ? 'animate-ping scale-110 opacity-70' : 'animate-pulse scale-100 opacity-30'
                }`} />
                <div className={`absolute inset-4 rounded-full bg-blue-500/5 border border-blue-500/10 transition-all duration-500 ${
                  localIsSpeaking ? 'scale-105 opacity-80' : 'scale-100 opacity-40'
                }`} />
              </>
            )}

            {/* Core button container */}
            <button
              onClick={toggleMute}
              disabled={!isConnected}
              className={`relative flex items-center justify-center w-24 h-24 rounded-full border transition-all duration-300 ${
                !isConnected
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : isMuted
                  ? 'bg-blue-950/40 border-blue-900/40 text-blue-400 hover:bg-blue-950/70'
                  : localIsSpeaking
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-neutral-900 border-neutral-800 text-white hover:border-neutral-700 hover:bg-neutral-850'
              }`}
            >
              {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>
          
          {/* Speaking State Labels */}
          <div className="text-center h-6">
            {isConnected && !partnerLeft && (
              <span className="text-xs font-semibold uppercase tracking-widest transition-all duration-300">
                {isMuted ? (
                  <span className="text-neutral-500">Muted</span>
                ) : localIsSpeaking ? (
                  <span className="text-blue-400 animate-pulse">You are speaking</span>
                ) : partnerIsSpeaking ? (
                  <span className="text-blue-300 animate-pulse">Partner is speaking</span>
                ) : (
                  <span className="text-neutral-500">Listening...</span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Disconnect Alert / Banner */}
        {partnerLeft && (
          <div className="w-full bg-blue-950/20 border border-blue-900/40 p-4 rounded-xl text-center space-y-1 mb-4 animate-fade-in">
            <p className="text-blue-400 font-semibold text-sm">Your partner left</p>
            <p className="text-neutral-400 text-xs font-medium">Skip to find someone new immediately.</p>
          </div>
        )}

        {/* Sliding Topic Card */}
        <div 
          className={`absolute bottom-22 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[320px] bg-[#1a1a1a] border border-[#222222] rounded-[12px] p-4 shadow-2xl z-20 transition-all duration-200 ease-out ${
            showPrompt ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <button 
            type="button"
            onClick={() => setShowPrompt(false)}
            className="absolute top-2.5 right-2.5 text-neutral-500 hover:text-neutral-300 transition-colors"
            aria-label="Close prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="pr-4 py-0.5 text-left">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">
              Topic Suggestion
            </span>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-semibold">
              {CONVERSATION_PROMPTS[promptIndex]}
            </p>
          </div>
        </div>

        {/* Footer Call Controls */}
        <div className="flex items-center justify-between w-full gap-2.5 mt-4 relative">
          <button
            onClick={handleSkip}
            disabled={!isConnected}
            className="flex-1 h-12 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-black font-bold rounded-xl flex items-center justify-center gap-1 transition-all duration-200 text-xs sm:text-sm"
          >
            {partnerLeft ? 'Find New' : 'Skip'}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <button
            onClick={handleTopicClick}
            disabled={!isConnected}
            className="flex-1 h-12 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 disabled:bg-neutral-900 disabled:text-neutral-650 disabled:border-neutral-900 disabled:cursor-not-allowed text-neutral-200 font-semibold rounded-xl flex items-center justify-center gap-1 transition-all duration-200 text-xs sm:text-sm"
          >
            💬 Need a topic?
          </button>

          <button
            onClick={handleEnd}
            className="flex-1 h-12 bg-neutral-950 border border-neutral-800 hover:border-blue-900/50 hover:text-blue-400 text-neutral-300 font-semibold rounded-xl flex items-center justify-center gap-1 transition-all duration-200 text-xs sm:text-sm"
          >
            <PhoneOff className="w-4 h-4 shrink-0 text-blue-400" />
            End Call
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Chat Panel */}
      <div className="flex flex-col justify-between min-h-[480px] bg-neutral-900/50 border border-neutral-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        {/* Chat Header */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/30">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Peer Chat</h3>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[340px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare className="w-8 h-8 text-neutral-700 mb-2" />
              <p className="text-xs text-neutral-500 max-w-[180px] leading-relaxed">
                {!isConnected ? 'Waiting for connection...' : 'Chat will activate once connected.'}
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isSystem = msg.sender === 'System';
              const isLocal = msg.sender === userName || msg.sender === 'You';
              
              if (isSystem) {
                return (
                  <div key={idx} className="flex justify-center">
                    <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-950/40 px-3 py-1 rounded-full border border-neutral-800/40">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div key={idx} className={`flex flex-col space-y-1 ${isLocal ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name */}
                  <span className="text-[10px] text-neutral-500 font-semibold px-1">
                    {msg.sender}
                  </span>
                  
                  {/* Bubble text */}
                  <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    isLocal 
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-md shadow-blue-500/10' 
                      : 'bg-neutral-800 text-white rounded-tl-none border border-neutral-800'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {/* Timestamp */}
                  <span className="text-[9px] text-neutral-600 px-1 font-medium">
                    {msg.time}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-800/80 bg-neutral-950/20 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!isConnected || partnerLeft}
            placeholder={!isConnected ? 'Connecting...' : partnerLeft ? 'Partner disconnected' : 'Type a message...'}
            className="flex-1 h-11 bg-neutral-950 disabled:bg-neutral-950/40 border border-neutral-800 rounded-xl px-4 py-2 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-neutral-700 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || !isConnected || partnerLeft}
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
              inputText.trim() && isConnected && !partnerLeft
                ? 'bg-white text-black hover:bg-neutral-250 cursor-pointer active:scale-95'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Report Modal */}
      {showReport && (
        <ReportModal
          sessionToken={sessionToken}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Post Call Micro-Feedback Modal */}
      {showFeedback && (
        <PostCallFeedback
          sessionDurationSeconds={elapsedSeconds}
          onClose={(saved) => {
            setShowFeedback(false);
            if (pendingAction) {
              pendingAction();
            }
          }}
        />
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isMockMode } from '@/lib/supabase';
import { Room } from './RoomCard';
import MicPermissionGate from './MicPermissionGate';
import ScenarioCard from './ScenarioCard';
import ReportModal from './ReportModal';
import { ROOM_SCENARIOS } from '@/lib/rooms-config';
import { Mic, MicOff, PhoneOff, Flag, ArrowLeft, Users, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface GroupRoomClientProps {
  room: Room;
}

export default function GroupRoomClient({ room }: GroupRoomClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<'mic-gate' | 'connecting' | 'connected'>('mic-gate');
  const [isMuted, setIsMuted] = useState(false);
  const [liveActiveCount, setLiveActiveCount] = useState<number>(room.active_count || 0);
  const [localIsSpeaking, setLocalIsSpeaking] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callFrameRef = useRef<any>(null);
  const localUserIdRef = useRef<string | null>(null);
  const joinTimeRef = useRef<number | null>(null);

  const saveGroupSession = () => {
    if (joinTimeRef.current) {
      const durationSeconds = Math.floor((Date.now() - joinTimeRef.current) / 1000);
      if (durationSeconds > 0) {
        try {
          const raw = localStorage.getItem('norinly_sessions');
          const sessions = raw ? JSON.parse(raw) : [];
          sessions.push({
            date: new Date().toISOString(),
            durationSeconds,
            type: 'group'
          });
          if (sessions.length > 90) {
            sessions.shift();
          }
          localStorage.setItem('norinly_sessions', JSON.stringify(sessions));
        } catch (e) {
          console.error('Failed to save group session:', e);
        }
      }
      joinTimeRef.current = null;
    }
  };

  // Subscribe to real-time changes on the current room
  useEffect(() => {
    if (isMockMode) return;

    const channel = supabase
      .channel(`room-detail-${room.slug}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        (payload: any) => {
          if (payload.new) {
            setLiveActiveCount(payload.new.active_count || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id, room.slug]);

  // Handle Supabase active_count increments/decrements
  useEffect(() => {
    if (step !== 'connected' || isMockMode) return;

    let active = true;

    const increment = async () => {
      try {
        const { data } = await supabase.from('rooms').select('active_count').eq('id', room.id).single();
        const currentCount = data?.active_count || 0;
        await supabase.from('rooms').update({ active_count: currentCount + 1 }).eq('id', room.id);
      } catch (err) {
        console.error('Failed to increment active count:', err);
      }
    };

    const decrement = async () => {
      try {
        const { data } = await supabase.from('rooms').select('active_count').eq('id', room.id).single();
        const currentCount = data?.active_count || 0;
        const newCount = Math.max(0, currentCount - 1);
        await supabase.from('rooms').update({ active_count: newCount }).eq('id', room.id);
      } catch (err) {
        console.error('Failed to decrement active count:', err);
      }
    };

    increment();

    // beforeunload handles page closes/tab exits
    const handleBeforeUnload = () => {
      decrement();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      active = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveGroupSession();
      decrement();
    };
  }, [step, room.id]);

  // Disconnect call on component unmount
  useEffect(() => {
    return () => {
      const roomInstance = callFrameRef.current;
      if (roomInstance) {
        try {
          roomInstance.disconnect();
        } catch (e) {
          console.error('Error disconnecting room on unmount:', e);
        }
      }
      const audios = document.querySelectorAll('[id^="lk-audio-"]');
      audios.forEach((el) => el.remove());
    };
  }, []);

  const startGroupCall = async () => {
    setStep('connecting');
    setError(null);

    try {
      // 1. Fetch meeting token and URL from backend
      const tokenRes = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: room.daily_room_name }),
      });

      if (!tokenRes.ok) {
        throw new Error('Failed to retrieve voice room credentials');
      }

      const { url, token } = await tokenRes.json();

      // 2. Load LiveKit SDK dynamically
      const { Room, RoomEvent, AudioPresets } = await import('livekit-client');

      // 3. Create room instance
      const roomInstance = new Room({
        publishDefaults: {
          audioPreset: AudioPresets.speech,
        },
      });

      callFrameRef.current = roomInstance;

      roomInstance.on(RoomEvent.Connected, () => {
        setStep('connected');
        localUserIdRef.current = roomInstance.localParticipant.sid;
        joinTimeRef.current = Date.now();
      });

      roomInstance.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === 'audio') {
          const audioElement = track.attach();
          audioElement.id = `lk-audio-${participant.sid}`;
          document.body.appendChild(audioElement);
        }
      });

      roomInstance.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
        if (track.kind === 'audio') {
          const el = document.getElementById(`lk-audio-${participant.sid}`);
          if (el) el.remove();
        }
      });

      roomInstance.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        if (speakers.length === 0) {
          setLocalIsSpeaking(false);
          return;
        }
        const activeSpeaker = speakers[0];
        if (activeSpeaker.sid === roomInstance.localParticipant.sid) {
          setLocalIsSpeaking(true);
          setTimeout(() => setLocalIsSpeaking(false), 1200);
        }
      });

      roomInstance.on(RoomEvent.Disconnected, () => {
        console.log('Successfully left LiveKit room');
      });

      roomInstance.on(RoomEvent.ParticipantDisconnected, (participant) => {
        const el = document.getElementById(`lk-audio-${participant.sid}`);
        if (el) el.remove();
      });

      await roomInstance.connect(url, token);
      await roomInstance.localParticipant.setMicrophoneEnabled(true);
      setIsMuted(false);

    } catch (err: any) {
      console.error('Failed to connect to group room:', err?.message || err, err?.stack);
      setError(err?.message || 'Unable to join the voice room.');
      setStep('mic-gate');
    }
  };

  const handleLeave = async () => {
    saveGroupSession();
    const roomInstance = callFrameRef.current;
    if (roomInstance) {
      try {
        roomInstance.disconnect();
      } catch (e) {
        console.error('Error during room disconnect:', e);
      }
    }
    // Clean up all audio elements
    const audios = document.querySelectorAll('[id^="lk-audio-"]');
    audios.forEach((el) => el.remove());
    router.push('/');
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    const roomInstance = callFrameRef.current;
    if (roomInstance) {
      roomInstance.localParticipant.setMicrophoneEnabled(!nextMuted);
    }
  };

  const prompts = ROOM_SCENARIOS[room.slug] || [];

  return (
    <div className="flex-1 flex flex-col justify-center bg-gradient-to-b from-[#0a0a0a] to-neutral-950 py-10 px-4 sm:px-6 relative">
      {/* Return home link (only when not connected) */}
      {step !== 'connected' && (
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      )}

      <div className="max-w-2xl w-full mx-auto space-y-8">
        {step === 'mic-gate' && (
          <MicPermissionGate
            onGranted={startGroupCall}
            onDenied={() => {}}
          />
        )}

        {step === 'connecting' && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 text-center animate-fade-in">
            <div className="relative flex items-center justify-center w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <Mic className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Connecting Room...</h2>
              <p className="text-neutral-400 text-sm">Joining {room.name}</p>
            </div>
          </div>
        )}

        {step === 'connected' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold text-white">{room.name}</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                    {room.level}
                  </span>
                </div>
                <p className="text-neutral-400 text-sm">{room.topic}</p>
                {liveActiveCount < (room.max_users || 6) && (
                  <div className="text-[12px] text-[#888888] italic pt-1.5">
                    {(() => {
                      const count = liveActiveCount;
                      const max = room.max_users || 6;
                      if (count >= max) return null;
                      if (count === 0) return "🔇 Quiet — be the first to speak";
                      if (count === 1) return "👤 1 person waiting for someone to join";
                      if (count === 2 || count === 3) return "🗣️ Active conversation happening";
                      if (count === 4 || count === 5) return "🔥 Busy room — jump in";
                      return null;
                    })()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-950/45 px-3 py-1.5 border border-neutral-800 rounded-full">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">{liveActiveCount}</span> / {room.max_users} online
                </div>
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center justify-center w-9 h-9 bg-neutral-950/45 border border-neutral-800 rounded-xl text-neutral-500 hover:text-blue-400 hover:border-blue-500/20 transition-all duration-200"
                  title="Report Room"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-blue-950/20 border border-blue-900/40 text-blue-400 text-sm rounded-xl flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {/* Scenario starter helper */}
            <ScenarioCard prompts={prompts} />

            {/* Audio Voice Control Panel */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative flex items-center justify-center w-28 h-28">
                {!isMuted && (
                  <>
                    <div className={`absolute inset-0 rounded-full bg-blue-500/5 border border-blue-500/10 transition-all duration-300 ${
                      localIsSpeaking ? 'animate-ping scale-110 opacity-70' : 'animate-pulse scale-100 opacity-30'
                    }`} />
                    <div className={`absolute inset-3 rounded-full bg-blue-500/5 border border-blue-500/10 transition-all duration-500 ${
                      localIsSpeaking ? 'scale-105 opacity-80' : 'scale-100 opacity-40'
                    }`} />
                  </>
                )}

                <button
                  onClick={toggleMute}
                  className={`relative flex items-center justify-center w-20 h-20 rounded-full border transition-all duration-300 ${
                    isMuted
                      ? 'bg-blue-950/40 border-blue-900/40 text-blue-400 hover:bg-blue-950/70'
                      : localIsSpeaking
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-neutral-950 border-neutral-800 text-white hover:border-neutral-700'
                  }`}
                >
                  {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              <div className="text-center h-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {isMuted ? 'Muted' : localIsSpeaking ? 'You are speaking' : 'Listening...'}
                </span>
              </div>

              <button
                onClick={handleLeave}
                className="w-full sm:w-auto h-12 px-8 bg-neutral-950 border border-neutral-800 hover:border-blue-900/50 hover:text-blue-400 text-neutral-300 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm"
              >
                <PhoneOff className="w-4 h-4" />
                Leave Room
              </button>
            </div>
          </div>
        )}
      </div>

      {showReport && (
        <ReportModal
          sessionToken={`group-${room.slug}`}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

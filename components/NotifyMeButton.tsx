'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

export default function NotifyMeButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show if browser supports Notifications and PushManager and not denied
    const isSupported =
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      Notification.permission !== 'denied';

    setIsVisible(isSupported);

    if (isSupported) {
      // Check if already subscribed
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const handleSubscribe = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Request permission if not already granted
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setIsVisible(false); // Hide if user denied
          setLoading(false);
          return;
        }
      }

      // 2. Register service worker explicitly (usually Next.js already handles SW, but let's make sure it's registered)
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // 3. Get VAPID public key from env
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not defined in environment');
      }

      // 4. Subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // 5. Send subscription info to Supabase
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

        if (error) {
          console.error('Error saving subscription to Supabase:', error);
        } else {
          setIsSubscribed(true);
        }
      }
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full flex justify-center mt-3 animate-fade-in">
      {isSubscribed ? (
        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <span>🔔 Notifications active</span>
          <span className="text-blue-600 font-bold">✓</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className="h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 hover:text-slate-900 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm"
        >
          {loading ? (
            <span className="animate-pulse">Setting up...</span>
          ) : (
            <>
              <span>🔔 Notify me when someone joins</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

import { supabase, isMockMode } from '@/lib/supabase';
import { generateLiveKitToken } from '@/lib/livekit';
import { NextResponse } from 'next/server';
import webpush from 'web-push';

const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, limit = 5, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps older than the window
  const activeTimestamps = timestamps.filter(t => now - t < windowMs);
  
  if (activeTimestamps.length >= limit) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many matchmaking attempts. Please wait 1 minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { country, level } = body;
    const sessionToken = crypto.randomUUID();

    // 1. Clean up old queue entries (older than 2 minutes and waiting)
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    await supabase
      .from('match_queue')
      .delete()
      .eq('status', 'waiting')
      .lt('joined_at', twoMinsAgo);

    // Clean up old push subscriptions (older than 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('push_subscriptions')
      .delete()
      .lt('created_at', twentyFourHoursAgo);

    // 2. Try to find a waiting partner
    let partners = null;
    let findError = null;

    if (level) {
      // First look for one with the same level (joined within last 90 seconds)
      const ninetySecsAgo = new Date(Date.now() - 90 * 1000).toISOString();
      const { data: levelPartners, error: levelErr } = await supabase
        .from('match_queue')
        .select('*')
        .eq('status', 'waiting')
        .eq('level', level)
        .gt('joined_at', ninetySecsAgo)
        .order('joined_at', { ascending: true });
      
      if (levelErr) {
        findError = levelErr;
      } else if (levelPartners && levelPartners.length > 0) {
        partners = levelPartners;
      }
    }

    if (!partners || partners.length === 0) {
      // Fall back to any waiting user as normal (joined in last 60s)
      const sixtySecsAgo = new Date(Date.now() - 60 * 1000).toISOString();
      const { data: anyPartners, error: anyErr } = await supabase
        .from('match_queue')
        .select('*')
        .eq('status', 'waiting')
        .gt('joined_at', sixtySecsAgo)
        .order('joined_at', { ascending: true });
      
      if (anyErr) {
        findError = anyErr;
      } else {
        partners = anyPartners;
      }
    }

    if (findError) {
      console.error('Error finding partner:', findError.message || findError, findError.details, findError.hint, findError.code);
    }

    let matchedPartner = null;
    let roomUrl = '';
    let tokenA = ''; // Token for the waiting partner
    let tokenB = ''; // Token for the current joining user

    if (partners && partners.length > 0) {
      for (const partner of partners) {
        // Create unique name for the room
        const roomName = `norinly-${crypto.randomUUID()}`;
        try {
          roomUrl = process.env.LIVEKIT_URL || '';
          tokenA = await generateLiveKitToken(roomName, `stranger-${crypto.randomUUID().slice(0, 6)}`);
          tokenB = await generateLiveKitToken(roomName, `stranger-${crypto.randomUUID().slice(0, 6)}`);

          // Attempt to claim this partner by updating their status
          const { data: claimData, error: claimError } = await supabase
            .from('match_queue')
            .update({
              status: 'matched',
              room_url: roomUrl,
              meeting_token: tokenA,
              matched_at: new Date().toISOString()
            })
            .eq('id', partner.id)
            .eq('status', 'waiting')
            .select();

          if (claimError) {
            console.error('Claim error:', claimError);
            continue;
          }

          if (claimData && claimData.length > 0) {
            // Successfully matched with this partner!
            matchedPartner = claimData[0];
            break;
          }
        } catch (roomErr) {
          console.error('Failed to prepare room for match:', roomErr);
          // Continue loop to try the next partner
        }
      }
    }

    if (matchedPartner) {
      // Insert the current user's session directly as matched
      await supabase.from('match_queue').insert({
        session_token: sessionToken,
        status: 'matched',
        room_url: roomUrl,
        meeting_token: tokenB,
        matched_at: new Date().toISOString(),
        country: country || null,
        level: level || null
      });

      // Log session
      await supabase.from('sessions').insert({
        session_type: '1on1',
        started_at: new Date().toISOString()
      });

      return NextResponse.json({
        status: 'matched',
        sessionToken,
        roomUrl,
        meetingToken: tokenB,
        partnerCountry: matchedPartner.country || null
      });
    } else {
      // No partner was found, enter the queue as waiting
      const { error: insertError } = await supabase.from('match_queue').insert({
        session_token: sessionToken,
        status: 'waiting',
        country: country || null,
        level: level || null
      });

      if (insertError) {
        console.error('Insert queue error:', insertError.message || insertError, insertError.details, insertError.hint, insertError.code);
        return NextResponse.json({ error: 'Failed to join queue' }, { status: 500 });
      }

      // Check push subscriptions and trigger notifications
      try {
        const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { data: subscriptions } = await supabase
          .from('push_subscriptions')
          .select('*')
          .gt('created_at', tenMinsAgo);

        if (subscriptions && subscriptions.length > 0) {
          webpush.setVapidDetails(
            'mailto:support@norinly.live',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
            process.env.VAPID_PRIVATE_KEY || ''
          );

          subscriptions.forEach((sub: any) => {
            const pushSubscription = {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys_p256dh,
                auth: sub.keys_auth
              }
            };

            webpush.sendNotification(
              pushSubscription,
              JSON.stringify({
                title: "Someone's waiting!",
                body: "A practice partner just joined. Tap to connect now."
              })
            ).catch(err => {
              console.error('Push notification failed for endpoint:', sub.endpoint, err);
              // Clean up failed subscriptions
              if (err.statusCode === 410 || err.statusCode === 404) {
                supabase.from('push_subscriptions').delete().eq('id', sub.id).then();
              }
            });
          });
        }
      } catch (pushErr) {
        console.error('Error sending push notifications:', pushErr);
      }

      return NextResponse.json({
        status: 'waiting',
        sessionToken
      });
    }
  } catch (error: any) {
    console.error('Error in /api/match/join:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

import { AccessToken } from 'livekit-server-sdk';

/**
 * Generates an Access Token for a participant to join a LiveKit room.
 * @param roomName The name of the room to join.
 * @param participantName Unique identifier/nickname of the participant.
 * @returns The signed JWT token.
 */
export async function generateLiveKitToken(roomName: string, participantName: string) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit API credentials are not defined in environment variables');
  }

  // Create an Access Token
  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
  });

  // Grant permissions: join room, publish audio, subscribe to audio, publish data messages
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
}

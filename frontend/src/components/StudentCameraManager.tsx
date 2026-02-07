'use client';

import { useLocalParticipant, useRemoteParticipant, useParticipants, useRoomContext } from "@livekit/components-react";
import { RoomEvent, DataPacket_Kind } from "livekit-client";
import { useEffect, useState } from "react";

// Helper to decode text data
const decoder = new TextDecoder();
const encoder = new TextEncoder();

export function StudentCameraManager({ bookingId, isStudent, onDeviceChange }: { bookingId: string, isStudent: boolean, onDeviceChange?: (deviceId: string) => void }) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");

  // 1. Initial Setup: Get Devices
  useEffect(() => {
    async function getDevices() {
        if (!isStudent) return; // Only students need to enumerate their own devices to switching
        const devs = await navigator.mediaDevices.enumerateDevices();
        const videos = devs.filter(d => d.kind === 'videoinput');
        setAvailableDevices(videos);
        
        // Publish list of devices to room (so Tutor sees them)
        // We can use LocalParticipant.setMetadata or send a data packet
        // For simplicity, let's just use Data Packet when requested, or just "Next/Prev" logic
    }
    getDevices();
  }, [isStudent]);

  // 2. Listen for Data Messages (Commands from Tutor)
  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array, participant: any, kind: any, topic: any) => {
      if (topic === "CMD_SWITCH_CAMERA") {
        const strData = decoder.decode(payload);
        const data = JSON.parse(strData);
        
        // If I am the student, and I received this command
        if (isStudent && data.target === 'student') {
             console.log("Received camera switch command:", data);
             switchCamera(data.deviceId);
        }
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => { room.off(RoomEvent.DataReceived, handleData); };
  }, [room, isStudent, availableDevices]);

  // 3. Switch Logic (Student Side)
  const switchCamera = async (deviceId: string) => {
    if (!localParticipant) return;
    try {
        // Find current tracks
        const tracks = Array.from(localParticipant.videoTrackPublications.values());
        // Simple toggle: If the requested deviceId is different, restart track
        // Or if deviceId is "NEXT", cycle through availableDevices
        
        let targetId = deviceId;
        if (deviceId === 'NEXT' && availableDevices.length > 0) {
            const currentIdx = availableDevices.findIndex(d => d.deviceId === currentDeviceId);
            const nextIdx = (currentIdx + 1) % availableDevices.length;
            targetId = availableDevices[nextIdx].deviceId;
        }

        console.log("Switching to device:", targetId);
        
        // Stop existing video
        for(const t of tracks) {
             t.track?.stop();
             localParticipant.unpublishTrack(t.track!);
        }

        // Start new video
        const newStream = await navigator.mediaDevices.getUserMedia({
             video: { deviceId: { exact: targetId } }
        });
        await localParticipant.publishTrack(newStream.getVideoTracks()[0]);
        setCurrentDeviceId(targetId);
        
        // Update DB
        fetch(`/api/bookings/${bookingId}/camera`, {
            method: 'PATCH',
            body: JSON.stringify({ cameraMode: targetId })
        });

    } catch(err) {
        console.error("Failed to switch camera", err);
    }
  };

  // 4. Tutor Controls (Rendered for Tutor)
  if (!isStudent) {
    return (
        <div className="absolute top-4 left-4 z-[50] bg-black/80 p-3 rounded-lg border border-gray-700">
             <h4 className="text-white text-xs font-bold mb-2">Student Camera</h4>
             <button 
                onClick={() => {
                    // Send command to room
                    const payload = JSON.stringify({ target: 'student', deviceId: 'NEXT' });
                    room.localParticipant.publishData(encoder.encode(payload), { reliable: true, topic: "CMD_SWITCH_CAMERA" });
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded"
             >
                🔄 Switch Student Cam
             </button>
        </div>
    );
  }

  return null; // Invisible component for the student
}


'use client';

import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { RoomEvent, Track } from "livekit-client";
import { useEffect, useState } from "react";

// Helper to decode text data
const decoder = new TextDecoder();
const encoder = new TextEncoder();

type Role = "STUDENT" | "TUTOR" | "PARENT" | "ADMIN" | undefined;
type CameraCommand = { target: "student"; mode?: "FACE" | "BOARD" | "NEXT"; deviceId?: string };

export function StudentCameraManager({
  bookingId,
  role,
  onDeviceChange,
}: {
  bookingId: string;
  role: Role;
  onDeviceChange?: (deviceId: string) => void;
}) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");
  const [faceDeviceId, setFaceDeviceId] = useState<string>("");
  const [boardDeviceId, setBoardDeviceId] = useState<string>("");
  const [currentMode, setCurrentMode] = useState<"FACE" | "BOARD" | "NEXT">("FACE");

  const isStudent = role === "STUDENT";
  const canControl = role === "TUTOR" || role === "PARENT";

  // 1. Initial Setup: Get Devices
  useEffect(() => {
    async function getDevices() {
      if (!isStudent) return; // Only students need to enumerate their own devices to switching
      const devs = await navigator.mediaDevices.enumerateDevices();
      const videos = devs.filter((d) => d.kind === "videoinput");
      setAvailableDevices(videos);

      if (videos.length > 0) {
        const defaultFace = videos[0].deviceId;
        const defaultBoard = videos[videos.length - 1].deviceId;
        if (!faceDeviceId) setFaceDeviceId(defaultFace);
        if (!boardDeviceId) setBoardDeviceId(defaultBoard);
        if (!currentDeviceId) setCurrentDeviceId(defaultFace);
      }
    }
    getDevices();
  }, [isStudent, faceDeviceId, boardDeviceId, currentDeviceId]);

  // 2. Listen for Data Messages (Commands from Tutor)
  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array, participant: any, kind: any, topic: any) => {
      if (topic === "CMD_SWITCH_CAMERA") {
        const strData = decoder.decode(payload);
        const data: CameraCommand = JSON.parse(strData);

        if (isStudent && data.target === "student") {
          console.log("Received camera switch command:", data);
          if (data.deviceId) {
            switchCamera({ deviceId: data.deviceId });
          } else if (data.mode) {
            switchCamera({ mode: data.mode });
          }
        }
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, isStudent, availableDevices, faceDeviceId, boardDeviceId]);

  // 3. Switch Logic (Student Side)
  const switchCamera = async ({ mode, deviceId }: { mode?: "FACE" | "BOARD" | "NEXT"; deviceId?: string }) => {
    if (!localParticipant) return;
    try {
      const tracks = Array.from(localParticipant.videoTrackPublications.values());

      let targetId = deviceId || currentDeviceId;

      if (mode === "NEXT" && availableDevices.length > 0) {
        const currentIdx = availableDevices.findIndex((d) => d.deviceId === currentDeviceId);
        const nextIdx = (currentIdx + 1) % availableDevices.length;
        targetId = availableDevices[nextIdx].deviceId;
      }

      if (mode === "FACE" && faceDeviceId) {
        targetId = faceDeviceId;
      }

      if (mode === "BOARD" && boardDeviceId) {
        targetId = boardDeviceId;
      }

      if (!targetId) return;

      console.log("Switching to device:", targetId);

      for (const t of tracks) {
        if (t.source === Track.Source.Camera) {
          t.track?.stop();
          localParticipant.unpublishTrack(t.track!);
        }
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: targetId } },
      });
      await localParticipant.publishTrack(newStream.getVideoTracks()[0], { source: Track.Source.Camera });
      setCurrentDeviceId(targetId);
      if (mode) setCurrentMode(mode);
      onDeviceChange?.(targetId);

      await fetch(`/api/bookings/${bookingId}/camera`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cameraMode: mode || targetId }),
      });
    } catch (err) {
      console.error("Failed to switch camera", err);
    }
  };

  // 4. Tutor Controls (Rendered for Tutor)
  if (canControl) {
    return (
      <div className="absolute top-4 left-4 z-[50] bg-black/80 p-3 rounded-lg border border-gray-700 text-white w-56">
        <h4 className="text-xs font-bold mb-2">Student Camera</h4>
        <p className="text-[10px] text-gray-400 mb-2">
          {"Mode"}: <span className="text-gray-200">{currentMode}</span>
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => {
              const payload = JSON.stringify({ target: "student", mode: "FACE" });
              room.localParticipant.publishData(encoder.encode(payload), {
                reliable: true,
                topic: "CMD_SWITCH_CAMERA",
              });
              setCurrentMode("FACE");
            }}
            className="bg-gray-800 hover:bg-gray-700 text-xs px-2 py-1.5 rounded"
          >
            Face Cam
          </button>
          <button
            onClick={() => {
              const payload = JSON.stringify({ target: "student", mode: "BOARD" });
              room.localParticipant.publishData(encoder.encode(payload), {
                reliable: true,
                topic: "CMD_SWITCH_CAMERA",
              });
              setCurrentMode("BOARD");
            }}
            className="bg-gray-800 hover:bg-gray-700 text-xs px-2 py-1.5 rounded"
          >
            Board Cam
          </button>
        </div>
        <button
          onClick={() => {
            const payload = JSON.stringify({ target: "student", mode: "NEXT" });
            room.localParticipant.publishData(encoder.encode(payload), {
              reliable: true,
              topic: "CMD_SWITCH_CAMERA",
            });
            setCurrentMode("NEXT");
          }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded"
        >
          🔄 Switch Camera (Next)
        </button>
      </div>
    );
  }

  return null; // Invisible component for the student
}

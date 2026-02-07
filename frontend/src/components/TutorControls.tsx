'use client';

import { useLocalParticipant } from "@livekit/components-react";
import { Track, LocalTrackPublication } from "livekit-client";
import { useEffect, useMemo, useState } from "react";

type CamMode = "dual" | "single";

export function TutorControls() {
  const { localParticipant } = useLocalParticipant();
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [faceCamId, setFaceCamId] = useState<string>("");
  const [boardCamId, setBoardCamId] = useState<string>("");
  const [primaryCamId, setPrimaryCamId] = useState<string>("");
  const [mode, setMode] = useState<CamMode>("dual");
  const [boardPub, setBoardPub] = useState<LocalTrackPublication | undefined>(undefined);

  useEffect(() => {
    getDevices();
    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    return () => navigator.mediaDevices.removeEventListener("devicechange", getDevices);
  }, []);

  const getDevices = async () => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devs.filter((d) => d.kind === "videoinput");
      setCameras(videoDevs);

      if (videoDevs.length > 0) {
        const defaultFace = videoDevs[0].deviceId;
        const defaultBoard = videoDevs[videoDevs.length - 1].deviceId;
        if (!faceCamId) setFaceCamId(defaultFace);
        if (!boardCamId) setBoardCamId(defaultBoard);
        if (!primaryCamId) setPrimaryCamId(defaultFace);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const faceLabel = useMemo(() => {
    const cam = cameras.find((c) => c.deviceId === faceCamId);
    return cam?.label || "Face Camera";
  }, [cameras, faceCamId]);

  const boardLabel = useMemo(() => {
    const cam = cameras.find((c) => c.deviceId === boardCamId);
    return cam?.label || "Board Camera";
  }, [cameras, boardCamId]);

  const switchPrimaryCamera = async (deviceId: string) => {
    if (!localParticipant || !deviceId) return;
    try {
      // Unpublish existing camera tracks (leave screen share intact)
      const pubs = Array.from(localParticipant.videoTrackPublications.values());
      for (const pub of pubs) {
        if (pub.source === Track.Source.Camera) {
          pub.track?.stop();
          localParticipant.unpublishTrack(pub.track!);
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });

      const track = stream.getVideoTracks()[0];
      await localParticipant.publishTrack(track, { source: Track.Source.Camera });
      setPrimaryCamId(deviceId);
    } catch (err) {
      console.error("Failed to switch camera", err);
      alert("Could not switch camera. It may be in use or blocked.");
    }
  };

  const toggleBoardCam = async () => {
    if (!localParticipant) return;
    if (boardPub) {
      localParticipant.unpublishTrack(boardPub.track!);
      boardPub.track?.stop();
      setBoardPub(undefined);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: boardCamId },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      const track = stream.getVideoTracks()[0];
      const pub = await localParticipant.publishTrack(track, {
        name: "board-cam",
        source: Track.Source.ScreenShare,
      });
      setBoardPub(pub);
    } catch (err) {
      console.error("Error publishing board cam:", err);
      alert("Could not access the board camera. It might be in use or blocked.");
    }
  };

  const handleSingleSwitch = (target: "FACE" | "BOARD") => {
    if (target === "FACE") {
      switchPrimaryCamera(faceCamId);
    } else {
      switchPrimaryCamera(boardCamId);
    }
  };

  if (!localParticipant) return null;

  return (
    <div className="absolute top-4 right-4 z-[50] bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white w-80 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold flex items-center gap-2">
          <span className="text-xl">🎥</span>
          <span>Camera Controls</span>
        </h4>
        <div className="flex h-2 w-2 relative">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${boardPub ? "bg-green-400" : "bg-gray-400"}`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${boardPub ? "bg-green-500" : "bg-gray-500"}`}
          ></span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4 font-light">
        Use dual cameras for face + board, or switch a single camera between face and board views.
      </p>

      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("dual")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide ${
              mode === "dual" ? "bg-blue-600" : "bg-gray-800 text-gray-300"
            }`}
          >
            Dual Camera
          </button>
          <button
            onClick={() => setMode("single")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide ${
              mode === "single" ? "bg-blue-600" : "bg-gray-800 text-gray-300"
            }`}
          >
            Single Camera
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Face Camera</label>
          <select
            value={faceCamId}
            onChange={(e) => setFaceCamId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            {cameras.map((c, i) => (
              <option key={c.deviceId} value={c.deviceId}>
                {c.label || `Camera ${i + 1} (${c.deviceId.slice(0, 4)}...)`}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Board Camera</label>
          <select
            value={boardCamId}
            onChange={(e) => setBoardCamId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            {cameras.map((c, i) => (
              <option key={c.deviceId} value={c.deviceId}>
                {c.label || `Camera ${i + 1} (${c.deviceId.slice(0, 4)}...)`}
              </option>
            ))}
          </select>
        </div>

        {mode === "dual" ? (
          <button
            onClick={toggleBoardCam}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              boardPub
                ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-t border-red-400/20"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-t border-blue-400/20"
            }`}
          >
            {boardPub ? "Stop Board Cam" : "Start Board Cam"}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSingleSwitch("FACE")}
              className="py-2 rounded-lg text-xs font-bold uppercase tracking-wide bg-gray-800 hover:bg-gray-700"
            >
              Face View
            </button>
            <button
              onClick={() => handleSingleSwitch("BOARD")}
              className="py-2 rounded-lg text-xs font-bold uppercase tracking-wide bg-gray-800 hover:bg-gray-700"
            >
              Board View
            </button>
          </div>
        )}

        <div className="text-[11px] text-gray-400">
          Active face cam: <span className="text-gray-200">{faceLabel}</span>
          <br />
          Active board cam: <span className="text-gray-200">{boardLabel}</span>
        </div>
      </div>
    </div>
  );
}

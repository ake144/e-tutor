'use client';

import { useLocalParticipant } from "@livekit/components-react";
import { Track, LocalTrackPublication } from "livekit-client";
import { useEffect, useState } from "react";

export function TutorControls() {
  const { localParticipant } = useLocalParticipant();
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamId, setSelectedCamId] = useState<string>("");
  const [wbPub, setWbPub] = useState<LocalTrackPublication | undefined>(undefined);

  useEffect(() => {
    // Initial fetch
    getDevices();
    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
  }, []);

  const getDevices = async () => {
    try {
        const devs = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devs.filter(d => d.kind === 'videoinput');
        setCameras(videoDevs);
        if (videoDevs.length > 0 && !selectedCamId) {
            // Try to pick the 'back' environment camera if available for whiteboard naturally, else just the last one
            // Often the last camera ID in the list is the external USB one if plugged in later
            if (videoDevs.length > 1) setSelectedCamId(videoDevs[videoDevs.length - 1].deviceId);
            else setSelectedCamId(videoDevs[0].deviceId);
        }
    } catch(e) { console.error(e) }
  }

  const toggleWhiteboard = async () => {
    if (wbPub) {
      localParticipant.unpublishTrack(wbPub.track!);
      wbPub.track?.stop();
      setWbPub(undefined);
    } else {
      try {
        // If we are sharing, we're simulating a screen share so it appears big
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { exact: selectedCamId },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        
        const track = stream.getVideoTracks()[0];
        // Publish with ScreenShare source to trigger "Presentation" mode in layout
        const pub = await localParticipant.publishTrack(track, {
           name: "whiteboard-cam",
           source: Track.Source.ScreenShare 
        });
        setWbPub(pub);
      } catch (err) {
        console.error("Error publishing whiteboard:", err);
        alert("Could not access camera for whiteboard. It might be in use or blocked.");
      }
    }
  };

  if(!localParticipant) return null;

  return (
    <div className="absolute top-4 right-4 z-[50] bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white w-72 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="text-xl">🎥</span> 
            <span>Whiteboard Cam</span>
        </h4>
        <div className="flex h-2 w-2 relative">
             <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${wbPub ? 'bg-green-400' : 'bg-gray-400'}`}></span>
             <span className={`relative inline-flex rounded-full h-2 w-2 ${wbPub ? 'bg-green-500' : 'bg-gray-500'}`}></span>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mb-4 font-light">
        Share a secondary camera view (e.g. your notes) alongside your face.
      </p>
      
      <div className="flex flex-col gap-3">
        <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Source Device</label>
            <select 
            value={selectedCamId} 
            onChange={(e) => setSelectedCamId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
            {cameras.map((c, i) => (
                <option key={c.deviceId} value={c.deviceId}>
                {c.label || `Camera ${i + 1} (${c.deviceId.slice(0,4)}...)`}
                </option>
            ))}
            </select>
        </div>

        <button
          onClick={toggleWhiteboard}
          className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
            wbPub 
              ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-t border-red-400/20" 
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-t border-blue-400/20"
          }`}
        >
            {wbPub ? "Stop Sharing" : "Start Sharing"}
        </button>
      </div>
    </div>
  );
}

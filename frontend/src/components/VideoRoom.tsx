"use client";
import React, { useRef, useEffect, useState } from "react";

export default function VideoRoom() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => setError("Unable to access webcam. Please allow camera access."));
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-80 bg-black rounded-lg flex items-center justify-center text-white relative overflow-hidden">
      {error ? (
        <span className="text-lg text-red-400">{error}</span>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-lg"
        />
      )}
      <span className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded text-xs">Your Camera Preview (LiveKit/Agora coming soon)</span>
    </div>
  );
}

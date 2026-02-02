'use client';

import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
  useToken,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";

type VideoRoomProps = {
  sessionId: string;
  user: { email: string } | null;
};

export default function VideoRoom({ sessionId, user }: VideoRoomProps) {
  const [connectionDetails, setConnectionDetails] = useState<null | {
    serverUrl: string;
    participantToken: string;
    roomName: string;
    participantName: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(
          "/api/connection-details?roomName=demo-room&participantName=User" + Math.floor(Math.random() * 1000)
        );
        if (!res.ok) throw new Error(await res.text());
        setConnectionDetails(await res.json());
      } catch (err: any) {
        setError(err.message || "Failed to connect to LiveKit");
      }
    }
    fetchDetails();
  }, []);

  if (error) {
    return (
      <div className="w-full h-[480px] bg-black rounded-lg flex items-center justify-center text-red-400 text-lg">
        {error}
      </div>
    );
  }

  if (!connectionDetails) {
    return (
      <div className="w-full h-[480px] bg-black rounded-lg flex items-center justify-center text-white text-lg">
        Connecting to LiveKit...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-950 rounded-lg overflow-hidden relative group">
      <LiveKitRoom
        video={true}
        audio={true}
        token={connectionDetails.participantToken}
        serverUrl={connectionDetails.serverUrl}
        connect={true}
        data-lk-theme="default"
        style={{ height: "100%" }}
      >
        <div className="absolute inset-0">
             <VideoConference />
        </div>
        
        {/* Custom styled control bar overlay */}
        {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-full pointer-events-none">
             <div className="bg-gray-900/90 backdrop-blur-md p-2 rounded-2xl border border-gray-700 shadow-xl pointer-events-auto">
                <ControlBar 
                    variation="minimal" 
                    controls={{ 
                        microphone: true, 
                        camera: true, 
                        screenShare: true, 
                       
                        chat: false,
                        leave: false,
                    }} 
                />
             </div>
        </div> */}
      </LiveKitRoom>
    </div>
  );
}

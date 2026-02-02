'use client';

import VideoRoom from "@/components/VideoRoom";
import CollaborativeNotebook from "@/components/CollaborativeNotebook";
import Whiteboard from "@/components/Whiteboard";
import Chat from "@/components/Chat";
import { useParams } from "next/navigation";
// Update the import path below to match your actual file structure or alias configuration.
// For example, if the file is at src/auth/ProtectedRoute.tsx, use:
// Update the import path below to match your actual file structure or alias configuration.
// For example, if the file is at src/auth/ProtectedRoute.tsx, use:

import { useAuthStore } from "@/hooks/useAuthStore";
import ProtectedRoute from "@/app/(auth)/ProtectedRoute";
import { getSessionById } from "@/lib/sessions";

export default function SessionPage() {
  const { user, logout } = useAuthStore();
  const params = useParams();
  const sessionId = params?.id as string;
  const session = typeof window !== "undefined" ? getSessionById(sessionId) : null;

  return (
    <ProtectedRoute>
      <main className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="p-4 bg-blue-700 text-white text-xl font-bold flex flex-col md:flex-row md:items-center md:justify-between shadow gap-2 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <span>Session Room</span>
            {session && (
              <span className="text-base font-normal ml-0 md:ml-4 text-blue-100">
                {session.date} at {session.time} &bull; Tutor: {session.tutor} &bull; Student: {session.student}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-base font-semibold">{user?.email}</span>
            <button
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>
        <section className="flex-1 flex flex-col md:flex-row gap-4 p-4">
          <div className="flex-1 flex flex-col gap-4">
            <div className="w-full" style={{ height: "480px" }}>
              <VideoRoom sessionId={sessionId} user={user} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CollaborativeNotebook sessionId={sessionId} user={user} />
              <Whiteboard sessionId={sessionId} user={user} />
            </div>
          </div>
          <aside className="w-full md:w-80 bg-white/80 p-0 border-l flex flex-col gap-4 rounded-lg shadow-lg">
            <Chat sessionId={sessionId} user={user} />
            {/* TODO: Add participants list here */}
          </aside>
        </section>
      </main>
    </ProtectedRoute>
  );
}

"use client"


import { useAuthStore } from "@/hooks/useAuthStore";
import ProtectedRoute from "../(auth)/ProtectedRoute";
import { getSessionsForUser } from "@/lib/sessions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  
  const { user, logout } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      setSessions(getSessionsForUser(user.email));
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <main className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg text-blue-700 font-semibold">{user?.email}</span>
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="font-bold text-blue-700 mb-2">Upcoming Sessions</div>
            {sessions.length === 0 ? (
              <div className="text-gray-500">No upcoming sessions.</div>
            ) : (
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li key={s.id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-blue-50 rounded-lg p-3">
                    <div>
                      <div className="font-semibold text-blue-800">{s.date} at {s.time}</div>
                      <div className="text-sm text-gray-700">Tutor: {s.tutor}</div>
                      <div className="text-sm text-gray-700">Student: {s.student}</div>
                    </div>
                    <button
                      className="mt-2 md:mt-0 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition text-sm"
                      onClick={() => router.push(`/session/${s.id}`)}
                    >
                      Join Session
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">Your Tutors</div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

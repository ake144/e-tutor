"use client"


import { useAuthStore } from "@/hooks/useAuthStore";
import ProtectedRoute from "../(auth)/ProtectedRoute";
import { getSessionsForUser } from "@/lib/sessions";
import { getTutors, Tutor } from "@/lib/tutors";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  
  const { user, logout } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [yourTutors, setYourTutors] = useState<Tutor[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      setSessions(getSessionsForUser(user.email));
      // For parents: tutors you've booked with
      if (user.role === "parent") {
        const sessionTutors = getSessionsForUser(user.email).map(s => s.tutor);
        const uniqueTutors = Array.from(new Set(sessionTutors));
        const allTutors = getTutors();
        setYourTutors(allTutors.filter(t => uniqueTutors.includes(t.email)));
      }
    }
  }, [user]);

  if (!user) return null;

  return (
    <ProtectedRoute>
      <main className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg text-blue-700 font-semibold">{user.email}</span>
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
        {user.role === "parent" && (
          <div className="mb-6 flex justify-end">
            <button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition text-lg"
              onClick={() => router.push("/tutors")}
            >
              Find a Tutor
            </button>
          </div>
        )}
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
          <div className="bg-white rounded-lg shadow p-6">
            {user.role === "parent" ? (
              <>
                <div className="font-bold text-blue-700 mb-2">Your Tutors</div>
                {yourTutors.length === 0 ? (
                  <div className="text-gray-500">No tutors yet. Book a session to connect with tutors!</div>
                ) : (
                  <ul className="space-y-3">
                    {yourTutors.map((t) => (
                      <li key={t.email} className="flex items-center gap-4 bg-blue-50 rounded-lg p-3">
                        <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
                        <div>
                          <div className="font-semibold text-blue-800">{t.name}</div>
                          <div className="text-sm text-gray-700">{t.subjects.join(", ")}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <div className="font-bold text-blue-700 mb-2">Your Tutor Profile</div>
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
                  <div>
                    <div className="font-semibold text-blue-800 text-lg">{user.name}</div>
                    <div className="text-sm text-gray-700 mb-1">{user.email}</div>
                    <div className="text-sm text-gray-700">{user.subjects?.join(", ")}</div>
                    <div className="text-sm text-gray-700 mt-1">{user.bio}</div>
                  </div>
                </div>
                {/* Optionally add edit profile functionality here */}
              </>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

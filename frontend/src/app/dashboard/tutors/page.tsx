"use client"

import { useState } from "react";
import { createRecurringSessions } from "@/lib/sessions";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import ProtectedRoute from "../../(auth)/ProtectedRoute";
import { Tutor, allSubjects, getTutors,  } from "@/lib/tutors";

import BookingModal from "@/components/BookingModal";

export default function TutorsPage() {
  const { user, logout } = useAuthStore();
  const [subject, setSubject] = useState<string>("");
  const [bookingTutor, setBookingTutor] = useState<Tutor | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [joinSessionId, setJoinSessionId] = useState<string | null>(null);
  const router = useRouter();




  const filteredTutors = subject
    ? getTutors().filter((t) => t.subjects.includes(subject))
    : getTutors();

  function handleBook(date: string, time: string, frequencyPerWeek: number, contractMonths: number) {
    if (!user?.email || !bookingTutor) return;
    const sessions = createRecurringSessions({
      tutor: bookingTutor.email,
      student: user.email,
      startDate: date,
      time,
      months: contractMonths,
      frequencyPerWeek,
    });
    const first = sessions[0];
    if (first) setJoinSessionId(first.id);
    setConfirmation(
      `Sessions booked with ${bookingTutor.name}. ${frequencyPerWeek}x per week for ${contractMonths} month${contractMonths > 1 ? "s" : ""}, starting ${date} at ${time}.`
    );
    setBookingTutor(null);
  }

  return (
    <ProtectedRoute>
      <main className="p-12">
        <div className="flex items-center  justify-between mb-4">
          <h1 className="text-4xl font-bold">Find a Tutor</h1>
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
        <div className="mb-6 flex flex-wrap gap-2 mt-8 p-4 items-center">
          <span className="font-semibold text-blue-700">Filter by subject:</span>
          <button
            className={`px-3 py-1 rounded-full border text-sm font-medium transition ${subject === "" ? "bg-blue-500 text-white" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"}`}
            onClick={() => setSubject("")}
          >
            All
          </button>
          {allSubjects.map((s) => (
            <button
              key={s}
              className={`px-3 py-1 rounded-full border text-sm font-medium transition ${subject === s ? "bg-blue-500 text-white" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"}`}
              onClick={() => setSubject(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-xl shadow-lg p-6 flex gap-4 items-center">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-blue-800">{tutor.name}</span>
                  <span className="text-yellow-500 font-semibold text-sm">★ {tutor.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tutor.subjects.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-2">{tutor.bio}</p>
                <button
                  className="mt-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition text-sm"
                  onClick={() => setBookingTutor(tutor)}
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredTutors.length === 0 && (
          <div className="text-center text-gray-500 mt-8">No tutors found for this subject.</div>
        )}
        <BookingModal
          tutorName={bookingTutor?.name || ""}
          open={!!bookingTutor}
          onClose={() => setBookingTutor(null)}
          onBook={handleBook}
        />
        {confirmation && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-xl shadow-lg z-50 flex flex-col items-center gap-2">
            <span>{confirmation}</span>
            {joinSessionId && (
              <button
                className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition"
                onClick={() => router.push(`/session/${joinSessionId}`)}
              >
                Join Session
              </button>
            )}
            <button className="ml-4 text-blue-600 underline" onClick={() => { setConfirmation(null); setJoinSessionId(null); }}>Close</button>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

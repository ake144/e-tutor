import { useState, useEffect } from "react";
import { getSessionsForUser } from "@/lib/sessions";
// In a real app, parent-child mapping would be dynamic. Here, we demo with a static child email.
const CHILD_EMAIL = "student@example.com";

export default function ParentDashboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    setSessions(getSessionsForUser(CHILD_EMAIL));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-4">Parent Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="font-bold text-blue-700 mb-2">Child's Upcoming Sessions</div>
        {sessions.length === 0 ? (
          <div className="text-gray-500">No upcoming sessions for your child.</div>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-blue-50 rounded-lg p-3">
                <div>
                  <div className="font-semibold text-blue-800">{s.date} at {s.time}</div>
                  <div className="text-sm text-gray-700">Tutor: {s.tutor}</div>
                  <div className="text-sm text-gray-700">Student: {s.student}</div>
                </div>
                <a
                  href={`/session/${s.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 md:mt-0 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500 transition text-sm text-center"
                >
                  Monitor Session
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

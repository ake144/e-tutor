// Simple in-memory session store for demo purposes
// In production, replace with a database or persistent store

export interface Session {
  id: string;
  tutor: string;
  student: string;
  date: string;
  time: string;
}

function loadSessions(): Session[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tutorly_sessions");
    if (stored) return JSON.parse(stored);
  }
  return [];
}

function saveSessions(sessions: Session[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tutorly_sessions", JSON.stringify(sessions));
  }
}

export function createSession({ tutor, student, date, time }: { tutor: string; student: string; date: string; time: string }): Session {
  const id = Math.random().toString(36).slice(2, 10);
  const session = { id, tutor, student, date, time };
  const sessions = loadSessions();
  sessions.push(session);
  saveSessions(sessions);
  return session;
}

export function getSessionsForUser(email: string): Session[] {
  return loadSessions().filter(s => s.tutor === email || s.student === email);
}

export function getSessionById(id: string): Session | undefined {
  return loadSessions().find(s => s.id === id);
}

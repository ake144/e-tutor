// Simple in-memory session store for demo purposes
// In production, replace with a database or persistent store

export interface Session {
  id: string;
  tutor: string;
  student: string;
  date: string;
  time: string;
}

let sessions: Session[] = [];

export function createSession({ tutor, student, date, time }: { tutor: string; student: string; date: string; time: string }): Session {
  const id = Math.random().toString(36).slice(2, 10);
  const session = { id, tutor, student, date, time };
  sessions.push(session);
  return session;
}

export function getSessionsForUser(email: string): Session[] {
  return sessions.filter(s => s.tutor === email || s.student === email);
}

export function getSessionById(id: string): Session | undefined {
  return sessions.find(s => s.id === id);
}

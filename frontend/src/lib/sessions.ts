// Simple in-memory session store for demo purposes
// In production, replace with a database or persistent store

export interface Session {
  id: string;
  tutor: string;
  student: string;
  date: string;
  time: string;
}

export interface RecurringSessionOptions {
  tutor: string;
  student: string;
  startDate: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  months: number; // contract length in months
  frequencyPerWeek: number; // 1-5
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

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toDateString(date: Date) {
  return date.toISOString().split("T")[0];
}

function getWeekOffsets(frequencyPerWeek: number) {
  switch (frequencyPerWeek) {
    case 1:
      return [0];
    case 2:
      return [0, 3];
    case 3:
      return [0, 2, 4];
    case 4:
      return [0, 2, 4, 6];
    case 5:
      return [0, 1, 2, 3, 4];
    default:
      return [0];
  }
}

export function createRecurringSessions({
  tutor,
  student,
  startDate,
  time,
  months,
  frequencyPerWeek,
}: RecurringSessionOptions): Session[] {
  const start = new Date(`${startDate}T00:00:00`);
  const end = addMonths(start, months);
  const offsets = getWeekOffsets(Math.max(1, Math.min(5, frequencyPerWeek)));

  const sessions = loadSessions();
  const created: Session[] = [];

  let weekStart = new Date(start);
  while (weekStart <= end) {
    for (const offset of offsets) {
      const sessionDate = addDays(weekStart, offset);
      if (sessionDate < start || sessionDate > end) continue;
      const session: Session = {
        id: Math.random().toString(36).slice(2, 10),
        tutor,
        student,
        date: toDateString(sessionDate),
        time,
      };
      sessions.push(session);
      created.push(session);
    }
    weekStart = addDays(weekStart, 7);
  }

  saveSessions(sessions);
  return created;
}

export function getSessionsForUser(email: string): Session[] {
  return loadSessions().filter(s => s.tutor === email || s.student === email);
}

export function getSessionById(id: string): Session | undefined {
  return loadSessions().find(s => s.id === id);
}

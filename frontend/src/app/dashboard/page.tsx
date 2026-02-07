"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TutorDashboard from "@/components/dashboard/TutorDashboard";

export default function Dashboard() {
  const { user, isAuthenticated, checkSession, loading: authLoading } = useAuthStore();
  const router = useRouter();
  
  // Local loading state for dashboard-specific data
  const [dataLoading, setDataLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const hasCheckedSession = useRef(false);

  // We rely on AuthProvider or DashboardLayout to trigger initial session checks if needed.
  // We do NOT call checkSession() here to avoid loops with the Layout's protection logic.
  
  useEffect(() => {
    // If auth is still loading, wait.
    if (authLoading) return;

    // If not authenticated, redirect.
    if (!isAuthenticated) {
        router.push("/login");
        return;
    }

    // User is authenticated, fetch sessions.
    const fetchSessions = async () => {
        setDataLoading(true);
        try {
            const res = await fetch('/api/sessions', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setSessions(data.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        } finally {
            setDataLoading(false);
        }
    };

    fetchSessions();
  }, [isAuthenticated, authLoading, router]);

  // Show spinner if checking auth OR loading data
  if (authLoading || dataLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Based on Role */}
      {user?.role === "TUTOR" ? (
          <TutorDashboard user={user} sessions={sessions} />
      ) : (
          <StudentDashboard user={user} sessions={sessions} />
      )}
    </div>
  );
}

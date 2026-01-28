
import { useAuthStore } from "@/hooks/useAuthStore";
import ProtectedRoute from "../(auth)/ProtectedRoute";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
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
        {/* TODO: Add dashboard widgets and navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">Upcoming Sessions</div>
          <div className="bg-white rounded-lg shadow p-6">Your Tutors</div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

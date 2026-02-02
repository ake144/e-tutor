"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import ProtectedRoute from "../(auth)/ProtectedRoute";
import { getSessionsForUser } from "@/lib/sessions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaRegCalendarAlt,
  FaChalkboardTeacher,
  FaCog,
  FaSignOutAlt,
  FaClock,
  FaGraduationCap,
  FaVideo,
  FaShieldAlt,
  FaCreditCard,
  FaPlay,
  FaUserGraduate,
  FaColumns
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { name: "Week 1", score: 65 },
  { name: "Week 2", score: 75 },
  { name: "Week 3", score: 68 },
  { name: "Week 4", score: 85 },
  { name: "Week 5", score: 92 },
];

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      setSessions(getSessionsForUser(user.email));
    }
  }, [user]);

  if (!user) return null;

  const nextSession = sessions.length > 0 ? sessions[0] : null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              <FaGraduationCap />
            </div>
            <span className="text-xl font-bold text-gray-800">EduConnect</span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <NavItem icon={<FaColumns />} label="Dashboard" active />
            <NavItem icon={<FaRegCalendarAlt />} label="Calendar" />
            <NavItem
              icon={<FaChalkboardTeacher />}
              label="Tutors"
              onClick={() => router.push("/tutors")}
            />
            <NavItem icon={<FaCog />} label="Settings" />
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4 px-2">
              <img
                src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="Profile"
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {/* Header */}
          <header className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <p className="text-gray-500">
                Overview of your learning progress and settings.
              </p>
            </div>
            {user.role === "parent" && (
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
                <span className="text-sm text-gray-500">Viewing Profile For</span>
                <select className="font-semibold text-gray-800 bg-transparent border-none focus:ring-0 cursor-pointer outline-none">
                  <option>Leo (Grade 4)</option>
                  <option>Sarah (Grade 6)</option>
                </select>
              </div>
            )}
            {user.role === "tutor" && (
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
                 <span className="text-sm text-gray-500 font-semibold text-blue-600">Tutor Portal</span>
              </div>
            )}
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Hours */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-medium">
                  Total Hours Learned
                </span>
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <FaClock />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold text-gray-900">42.5</span>
                <span className="text-gray-400 ml-1">hrs</span>
                <p className="text-green-500 text-sm font-medium mt-1">
                  ↗ +2.5 hrs this week
                </p>
              </div>
            </div>

            {/* Average Grade */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-medium">Average Grade</span>
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <FaGraduationCap />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold text-gray-900">92%</span>
                <p className="text-green-500 text-sm font-medium mt-1">
                  ↗ Top 10% of class
                </p>
              </div>
            </div>

            {/* Upcoming Session */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 ring-2 ring-blue-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                  <FaVideo />
                </div>
              </div>
              <span className="text-gray-500 font-medium block mb-4">
                Upcoming Session
              </span>
              {nextSession ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {nextSession.time}, Today
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {nextSession.subject || "General Session"} with{" "}
                    {user.role === "parent" ? nextSession.tutor : nextSession.student}
                  </p>
                  <button
                    onClick={() => router.push(`/session/${nextSession.id}`)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                  >
                    Join Session
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No sessions today
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Schedule a new session to get started.
                  </p>
                  <button
                    onClick={() => router.push("/tutors")}
                    className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition"
                  >
                    Find a Tutor
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Charts & Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Student Progress
                  </h3>
                  <p className="text-sm text-gray-500">
                    Performance over the last 30 days
                  </p>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button className="px-3 py-1 bg-white shadow-sm rounded-md text-sm font-medium text-gray-800">
                    Math
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-800">
                    Science
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-800">
                    English
                  </button>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="#f3f4f6"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      hide
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Parental Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center">
                  <FaShieldAlt />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Parental Controls
                  </h3>
                  <p className="text-xs text-gray-500">Manage limits & access</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-gray-700">Daily Screen Time</span>
                    <span className="text-blue-600">2h 30m</span>
                  </div>
                  <input
                    type="range"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    min="1"
                    max="5"
                    step="0.5"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1h</span>
                    <span>5h</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Subject Access
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Allow Gamified Quizzes
                      </span>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Social Chat Features
                      </span>
                      <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History & Billing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session History */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Session History
                </h3>
                <button className="text-blue-600 text-sm font-semibold hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                    <div className="text-gray-500 text-sm">No session history available.</div>
                ) : (
                    sessions.slice(0, 3).map((s, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition"
                    >
                        <div className="flex items-center gap-4">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.tutor}`}
                            alt={s.tutor}
                            className="w-10 h-10 rounded-full bg-gray-200"
                        />
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">
                            {s.subject || "Advanced Mathematics"}
                            </h4>
                            <p className="text-xs text-gray-500">
                            with {s.tutor} • {s.date}
                            </p>
                        </div>
                        </div>
                        <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                            Completed
                        </span>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                            <FaPlay className="text-[10px]" /> Recording
                        </button>
                        </div>
                    </div>
                    ))
                )}
              </div>
            </div>

            {/* Billing Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <FaCreditCard />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Billing Summary
                  </h3>
                  <p className="text-xs text-gray-500">Premium Plan</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Next Invoice</span>
                  <span className="text-sm font-bold text-gray-900">
                    Nov 24, 2026
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="text-sm font-bold text-gray-900">$49.00</span>
                </div>
              </div>

              <button className="w-full py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
                Manage Billing
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition ${
        active
          ? "bg-blue-50 text-blue-600 font-bold"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

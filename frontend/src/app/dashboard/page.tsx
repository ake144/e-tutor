"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaBell,
  FaArrowRight,
  FaBookOpen,
  FaStar,
  FaClock
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "@/components/Sidebar";
import { getSessionsForUser } from "@/lib/sessions";

// Mock Data for Charts
const data = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 75 },
  { name: "Wed", score: 70 },
  { name: "Thu", score: 85 },
  { name: "Fri", score: 80 },
  { name: "Sat", score: 90 },
  { name: "Sun", score: 88 },
];

const CHILD_EMAIL = "student@example.com";

export default function Dashboard() {
  const { user, isAuthenticated, checkSession } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
       router.push("/login");
       return;
    }

    if (isAuthenticated) {
        fetch('/api/sessions')
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                setSessions(data.data);
            }
            setLoading(false);
        });
    }
  }, [isAuthenticated, loading, router]);

  const handleSesionJoin = (sessionId: string) => {
    router.push(`/dashboard/session/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      {/* Sidebar - Replaced with Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here is what's happening with your learning today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64"
              />
            </div>
            <button className="p-2 bg-white rounded-xl border border-gray-100 text-gray-500 hover:text-blue-600 relative">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value="24"
            trend="+12%"
            icon={<FaBookOpen className="text-purple-600" />}
            color="bg-purple-50"
          />
          <StatCard
            title="Hours Learned"
            value="32.5"
            trend="+5%"
            icon={<FaClock className="text-blue-600" />}
            color="bg-blue-50"
          />
          <StatCard
            title="Avg. Score"
            value="88%"
            trend="+2%"
            icon={<FaStar className="text-orange-500" />}
            color="bg-orange-50"
          />
            {/* Custom Upgrade Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1">Upgrade Plan</h3>
                <p className="text-blue-100 text-sm mb-3">Get unlimited access</p>
                <button className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg">Go Pro</button>
             </div>
             <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                <FaStar size={80} />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-lg">
                Student Progress
              </h2>
              <select className="bg-gray-50 border-none text-sm text-gray-500 rounded-lg px-2 py-1 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    hide={true} // Cleaner look like design
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                    cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg mb-6">
              Parental Controls
            </h2>
            
            <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-sm mb-2">
                         <span className="font-medium text-gray-600">Daily Limit</span>
                         <span className="text-blue-600 font-bold">2h 30m</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between text-sm mb-2">
                         <span className="font-medium text-gray-600">Session Budget</span>
                         <span className="text-purple-600 font-bold">$120 / $200</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-gray-100 mt-6">
                    <div className="flex items-center justify-between mb-5">
                       <h3 className="font-bold text-gray-800">Your Sessions</h3>
                       <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">See all</button>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        {sessions.length > 0 ? (
                          sessions.map((session, index) => (
                            <div key={index} className="group bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-100 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                                        <FaBookOpen size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-base">{session.tutor}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                                                <FaClock size={10} className="text-gray-400" />
                                                <span className="font-medium text-gray-600">{session.time}</span>
                                            </div>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-gray-400 font-medium">{session.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleSesionJoin(session.id)} 
                                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm group-hover:translate-x-1"
                                    title="Join Session"
                                >
                                    <FaArrowRight size={14} />
                                </button>
                            </div>
                          ))
                        ) : (
                             <div className="p-8 bg-gray-50 rounded-2xl text-center border overflow-hidden border-dashed border-gray-200">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3">
                                    <FaBookOpen />
                                </div>
                                <p className="text-gray-500 text-sm font-medium">No sessions scheduled.</p>
                                <button className="mt-4 text-blue-600 font-bold text-sm hover:underline">Find a Tutor</button>
                             </div>
                        )}
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon, color }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}
        >
          {icon}
        </div>
        <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
      </div>
    </div>
  );
}

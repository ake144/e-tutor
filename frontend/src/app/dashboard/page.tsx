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

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading/auth check
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setTimeout(() => setLoading(false), 500);
    }
  }, [isAuthenticated, router]);

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

                 <div className="pt-4 border-t border-gray-50">
                    <h3 className="font-bold text-gray-800 text-sm mb-3">Next Session</h3>
                    <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FaBookOpen />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-xs text-sm">Mathematics</p>
                            <p className="text-xs text-blue-500">Today, 4:00 PM</p>
                        </div>
                        <button className="ml-auto bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-200">
                            <FaArrowRight size={12} />
                        </button>
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

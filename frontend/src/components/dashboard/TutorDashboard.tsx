import {
  FaSearch,
  FaBell,
  FaArrowRight,
  FaChalkboardTeacher,
  FaUsers,
  FaWallet,
  FaCalendarCheck,
  FaClock,
  FaStar
} from "react-icons/fa";
import { useRouter } from "next/navigation";

interface TutorDashboardProps {
  user: any;
  sessions: any[];
}

export default function TutorDashboard({ user, sessions }: TutorDashboardProps) {
  const router = useRouter();

  const handleSesionJoin = (sessionId: string) => {
    router.push(`/dashboard/session/${sessionId}`);
  };

  return (
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, Tutor {user?.name?.split(" ")[0]}! 👨‍🏫
            </h1>
            <p className="text-gray-500 mt-1">
              Ready to inspire some minds today?
            </p>
          </div>

          <div className="flex items-center gap-4">
             {/* Same header controls for now */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
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
            title="Total Earnings"
            value="$1,240"
            trend="+15%"
            icon={<FaWallet className="text-green-600" />}
            color="bg-green-50"
          />
          <StatCard
            title="Hours Taught"
            value="48.5"
            trend="+8%"
            icon={<FaClock className="text-blue-600" />}
            color="bg-blue-50"
          />
          <StatCard
            title="Active Students"
            value="12"
            trend="+3"
            icon={<FaUsers className="text-purple-500" />}
            color="bg-purple-50"
          />
          <StatCard
            title="Sessions Completed"
            value="34"
            trend="+4"
            icon={<FaCalendarCheck className="text-orange-500" />}
            color="bg-orange-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Upcoming Sessions (Teaching) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-lg">
                Upcoming Classes
              </h2>
               <button className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
                  View Calendar
               </button>
            </div>
            
            <div className="space-y-4">
                 {sessions.length > 0 ? (
                    sessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 font-bold border border-gray-200">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Session with {session.student || "Student"}</h3>
                                <p className="text-sm text-gray-500">{session.time} • {session.topic || "General Tutoring"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Confirmed</span>
                            <button 
                                onClick={() => handleSesionJoin(session.id)}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                            >
                                Start Class
                            </button>
                        </div>
                    </div>
                    ))
                 ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-dashed border-2 border-gray-200">
                        <p className="text-gray-500 font-medium">No upcoming classes scheduled.</p>
                    </div>
                 )}
            </div>
          </div>

          {/* Right Column - Quick Actions / Requests */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <div>
                 <h2 className="font-bold text-gray-800 text-lg mb-4">
                   Quick Actions
                 </h2>
                 <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition flex flex-col items-center gap-2 text-gray-600">
                        <FaClock size={24} />
                        <span className="text-xs font-bold">Availability</span>
                    </button>
                    <button className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition flex flex-col items-center gap-2 text-gray-600">
                        <FaUsers size={24} />
                        <span className="text-xs font-bold">Students</span>
                    </button>
                 </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <h2 className="font-bold text-gray-800 text-lg mb-4">
                   Recent Reviews
                 </h2>
                 <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <div className="flex gap-1 text-yellow-500 mb-2">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    <p className="text-sm text-gray-700 italic">"Great tutor! Explained calculus concepts very clearly."</p>
                    <p className="text-xs text-gray-400 mt-2 font-bold">- Sarah J.</p>
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

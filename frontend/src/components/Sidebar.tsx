"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  FaRegCalendarAlt,
  FaChalkboardTeacher,
  FaCog,
  FaSignOutAlt,
  FaGraduationCap,
  FaColumns
} from "react-icons/fa";

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10 transition-all font-sans">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          <FaGraduationCap />
        </div>
        <span className="text-xl font-bold text-gray-800">EduConnect</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem 
          icon={<FaColumns />} 
          label="Dashboard" 
          active={pathname === "/dashboard"} 
          onClick={() => router.push("/dashboard")} 
        />
        <NavItem 
          icon={<FaRegCalendarAlt />} 
          label="Calendar" 
          active={pathname === "/calendar"} 
          onClick={() => router.push("/calendar")}
        />
        <NavItem
          icon={<FaChalkboardTeacher />}
          label="Tutors"
          active={pathname === "/tutors"}
          onClick={() => router.push("/tutors")}
        />
        <NavItem 
          icon={<FaCog />} 
          label="Settings" 
          active={pathname === "/settings"} 
          onClick={() => router.push("/settings")}  
        />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img
            src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
            alt="Profile"
            className="w-10 h-10 rounded-full bg-gray-200 object-cover"
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
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </aside>
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

import { 
  FaUser, 
  FaClock, 
  FaUserGraduate, 
  FaLanguage, 
  FaMoneyBillWave 
} from "react-icons/fa";

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
        <div className="p-4 border-b border-gray-50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
        </div>
        <nav className="p-2 space-y-1">
          <SidebarTab 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
            label="Profile" 
            icon={<FaUser />} 
          />
          <SidebarTab 
            active={activeTab === "schedule"} 
            onClick={() => setActiveTab("schedule")} 
            label="Schedule" 
            icon={<FaClock />} 
          />
          <SidebarTab 
            active={activeTab === "preferences"} 
            onClick={() => setActiveTab("preferences")} 
            label="Student Preference" 
            icon={<FaUserGraduate />} 
          />
          <SidebarTab 
            active={activeTab === "language"} 
            onClick={() => setActiveTab("language")} 
            label="Language" 
            icon={<FaLanguage />} 
          />
          <SidebarTab 
            active={activeTab === "pricing"} 
            onClick={() => setActiveTab("pricing")} 
            label="Pricing" 
            icon={<FaMoneyBillWave />} 
          />
        </nav>

        <div className="p-4 bg-gray-50 m-2 rounded-xl border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 mb-2">
                Manage your account settings and preferences here.
            </p>
        </div>
      </div>
    </div>
  );
}

function SidebarTab({ active, onClick, label, icon }: any) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                active 
                ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            }`}
        >
            <span className={active ? "text-white" : "text-gray-400"}>{icon}</span>
            {label}
        </button>
    )
}

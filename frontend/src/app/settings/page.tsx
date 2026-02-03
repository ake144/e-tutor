"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { 
  FaUser, 
  FaClock, 
  FaUserGraduate, 
  FaLanguage, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaShieldAlt,
  FaCamera,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  // Mock initial state - in a real app, this would come from a comprehensive user object
  const [formData, setFormData] = useState({
      fullName: user?.name || "Mr. Yohannes Bekele",
      education: "MSc",
      country: "Ethiopia",
      city: "Addis Ababa",
      area: "Bole",
      gender: "Male",
      subjects: "Physics, Math",
      bio: "Experienced tutor focused on results, discipline, and clear explanations.",
      availability: "",
      languages: "Amharic, English",
      hourlyRate: "20",
  });

  const handleSave = async () => {
      // API call to update profile would go here
      alert("Profile updated successfully!");
  }

  const renderContent = () => {
      switch(activeTab) {
          case "profile":
              return (
                <div className="space-y-8 animate-in fade-in duration-300">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Photo Upload */}
                        <div className="w-full md:w-64 flex flex-col items-center">
                            <div className="w-48 h-48 bg-gray-100 rounded-xl mb-4 relative overflow-hidden group border-2 border-dashed border-gray-300 flex items-center justify-center">
                                {user?.avatar ? ( 
                                    <img src={user.avatar} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <FaUser className="mx-auto text-4xl text-gray-300 mb-2" />
                                        <p className="text-xs text-gray-400">Tutor Photo</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                    <FaCamera className="text-white text-2xl" />
                                </div>
                            </div>
                            <button className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-lg text-sm hover:bg-blue-100 transition">
                                Upload New Photo
                            </button>
                            <p className="text-[10px] text-gray-400 mt-2 text-center px-4">
                                Tip: Use a professional photo to build trust with students.
                            </p>
                        </div>

                        {/* Top Info */}
                        <div className="flex-1 w-full">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Tutor Profile</h2>
                                <p className="text-gray-500 text-sm mb-4">Update your information so parents can find and trust you.</p>
                                
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <FaCheckCircle /> Verified National ID
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <FaShieldAlt /> Background Checked
                                    </span>
                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <FaUserGraduate /> Degree Verified
                                    </span>
                                </div>

                                {/* Preview Card */}
                                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed shadow-sm">
                                    <p className="font-bold text-gray-800 mb-1">Public Listing Preview</p>
                                    <p>
                                        <span className="font-semibold">{formData.fullName}</span> • {formData.education} • {formData.city} / {formData.area} 
                                        <br />
                                        <span className="font-semibold text-blue-600">Subjects:</span> {formData.subjects} 
                                        <span className="mx-2 text-gray-300">|</span> 
                                        <span className="font-semibold text-blue-600">Languages:</span> {formData.languages}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info Form */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                             <span className="w-1 h-6 bg-blue-600 rounded-full"></span> Basic Info
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    value={formData.fullName}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                                <input 
                                    type="text" 
                                    value={formData.country}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">City / Region</label>
                                <input 
                                    type="text" 
                                    value={formData.city}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Area / Sub-city</label>
                                <input 
                                    type="text" 
                                    value={formData.area}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>

                             <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Education Status</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                                    <option>BSc</option>
                                    <option>MSc</option>
                                    <option>PhD</option>
                                    <option>Undergraduate</option>
                                </select>
                            </div>

                             <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subjects <span className="text-gray-400 font-normal text-xs">(Comma separated)</span></label>
                                <input 
                                    type="text" 
                                    value={formData.subjects}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                             <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                                <textarea 
                                    rows={4}
                                    value={formData.bio}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button onClick={handleSave} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
              );
        case "schedule":
            return <Placeholder title="Schedule Settings" icon={<FaClock />} />;
        case "preferences":
            return <Placeholder title="Student Preferences" icon={<FaUserGraduate />} />;
        case "language":
            return <Placeholder title="Languages" icon={<FaLanguage />} />;
        case "pricing":
            return <Placeholder title="Pricing & Payments" icon={<FaMoneyBillWave />} />;
        default:
            return null;
      }
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            
            {/* Settings Sidebar */}
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
                             This demo stores changes in localStorage (no backend). When you integrate your database, replace saveToLocal() with API calls.
                         </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                {renderContent()}
            </div>
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

function Placeholder({ title, icon }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-2xl mx-auto mb-4">
                {icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-500 text-sm">This section is currently under development.</p>
        </div>
    )
}

"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { 
  FaUser, 
  FaCheckCircle, 
  FaShieldAlt,
  FaUserGraduate,
  FaCamera
} from "react-icons/fa";

export default function ProfileSettings() {
  const { user, updateProfile } = useAuthStore();
  
  // Initialize state with empty strings to avoid uncontrolled/controlled warnings if user is null initially
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      education: "MSc", // Default
      country: "Ethiopia",
      city: "Addis Ababa",
      area: "",
      gender: "Male",
      subjects: "",
      bio: "",
      languages: "Amharic, English"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            education: "MSc", // Placeholder as it's not in User interface yet
            country: "Ethiopia",
            city: "Addis Ababa",
            area: "",
            gender: "Male",
            subjects: user.subjects?.join(", ") || "",
            bio: user.bio || "",
            languages: "Amharic, English"
        });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
      setIsLoading(true);
      setMessage(null);
      
      try {
          await updateProfile({
              name: formData.name,
              // email is usually not editable quickly or needs verification
              bio: formData.bio,
              subjects: formData.subjects.split(",").map(s => s.trim()).filter(s => s),
              // Add other fields when backend supports them
          });
          setMessage({ type: 'success', text: "Profile updated successfully!" });
      } catch (error) {
          setMessage({ type: 'error', text: "Failed to update profile. Please try again." });
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pt-5">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo Upload */}
            <div className="w-full md:w-64 flex flex-col items-center">
                <div className="w-48 h-48 bg-gray-100 rounded-xl mb-4 relative overflow-hidden group border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {user?.avatar ? ( 
                        <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
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
                    <div className="bg-linear-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed shadow-sm">
                        <p className="font-bold text-gray-800 mb-1">Public Listing Preview</p>
                        <p>
                            <span className="font-semibold">{formData.name}</span> • {formData.education} • {formData.city} / {formData.area || "N/A"}
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
            
            {message && (
                <div className={`p-4 mb-6 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input 
                        type="text"
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                    <input 
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City / Region</label>
                    <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Area / Sub-city</label>
                    <input 
                        type="text" 
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                    <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>

                    <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Education Status</label>
                    <select 
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
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
                        name="subjects"
                        value={formData.subjects}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                    <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                    <textarea 
                        rows={4}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    </div>
  );
}

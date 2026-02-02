'use client';

import { useState } from "react";
import VideoRoom from "@/components/VideoRoom";
import CollaborativeNotebook from "@/components/CollaborativeNotebook";
import Whiteboard from "@/components/Whiteboard";
import Chat from "@/components/Chat";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import ProtectedRoute from "@/app/(auth)/ProtectedRoute";
import { getSessionById } from "@/lib/sessions";
import { 
  FaChevronLeft, 
  FaVideo, 
  FaChalkboard, 
  FaBookOpen, 
  FaComments, 
  FaUsers,
  FaCog,
  FaPhoneSlash
} from "react-icons/fa";

export default function SessionPage() {
  const { user } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;
  const session = typeof window !== "undefined" ? getSessionById(sessionId) : null;
  
  // UI State
  const [activeTab, setActiveTab] = useState<'whiteboard' | 'notebook'>('whiteboard');
  const [sidebarView, setSidebarView] = useState<'chat' | 'participants'>('chat');

  const handleExit = () => {
      if(window.confirm("Are you sure you want to leave the session?")) {
        router.push('/dashboard');
      }
  }

  return (
 
      <main className="flex flex-col h-screen bg-gray-100 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-20 shadow-sm relative">
           <div className="flex items-center gap-4">
              <button 
                onClick={handleExit} 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
                title="Back to Dashboard"
              >
                  <FaChevronLeft />
              </button>
              <div>
                  <h1 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     {session ? `Session with ${session.tutor}` : 'Live Session'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {session ? `${session.date} • ${session.time}` : 'TutorTime Classroom'}
                  </p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              {/* User Profile Pill */}
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.[0] || 'U'}
                  </div>
                  <div className="hidden md:block">
                      <p className="text-sm font-bold text-gray-700 leading-tight">{user?.name || 'Student'}</p>
                      <p className="text-[10px] text-gray-500 leading-tight capitalize">{user?.role || 'Student'}</p>
                  </div>
              </div>
              
              <button className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition font-bold flex items-center gap-2" onClick={handleExit}>
                 <FaPhoneSlash /> 
                 <span className="hidden md:inline">End Session</span>
              </button>
           </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-auto">
            
            {/* Left/Center Stage */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50 p-4 gap-4 overflow-y-auto">
                {/* Video Area */}
                <div className="w-full bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-800 relative shrink-0" style={{ height: "60vh", minHeight: "300px" }}>
                    <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
                        <FaVideo className="inline mr-2" /> Live Stream
                    </div>
                    <VideoRoom sessionId={sessionId} user={user} />
                </div>

                {/* Tools Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden min-h-[400px]">
                    {/* Tool Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button 
                            onClick={() => setActiveTab('whiteboard')}
                            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'whiteboard' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <FaChalkboard /> Whiteboard
                        </button>
                        <button 
                            onClick={() => setActiveTab('notebook')}
                            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'notebook' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <FaBookOpen /> Collaborative Notes
                        </button>
                    </div>
                    
                    {/* Tool Content */}
                    <div className="flex-1 p-0 relative bg-gray-50">
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'whiteboard' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                             <Whiteboard sessionId={sessionId} user={user} />
                        </div>
                         <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'notebook' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                             <div className="h-full p-4 overflow-auto">
                                <CollaborativeNotebook sessionId={sessionId} user={user} />
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10">
               {/* Sidebar Tabs */}
               <div className="flex p-2 gap-2 border-b border-gray-200 bg-gray-50">
                   <button 
                    onClick={() => setSidebarView('chat')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${sidebarView === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200/50'}`}
                   >
                     <FaComments /> Chat
                   </button>
                   <button 
                    onClick={() => setSidebarView('participants')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${sidebarView === 'participants' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200/50'}`}
                   >
                     <FaUsers /> People
                   </button>
               </div>

                <div className="flex-1 overflow-hidden relative">
                    {sidebarView === 'chat' ? (
                         <Chat sessionId={sessionId} user={user} />
                    ) : (
                        <div className="p-4 space-y-4">
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">In this session</h3>
                             
                             {/* Mock Participants */}
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold">
                                     {user?.name?.[0] || 'U'}
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-sm font-bold text-gray-800">{user?.name || 'Student'} (You)</p>
                                     <p className="text-xs text-green-500 flex items-center gap-1">
                                         <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                     </p>
                                 </div>
                             </div>

                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-purple-600 font-bold overflow-hidden">
                                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=tutor" alt="Tutor" />
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-sm font-bold text-gray-800">{session?.tutor || 'Tutor'}</p>
                                     <p className="text-xs text-blue-500">Instructor</p>
                                 </div>
                             </div>

                             <hr className="border-gray-100" />
                             
                             <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                 <div className="flex items-start gap-3">
                                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                         <FaCog size={14} />
                                     </div>
                                     <div>
                                         <h4 className="text-sm font-bold text-blue-900">Audio/Video Settings</h4>
                                         <p className="text-xs text-blue-700 mt-1 mb-2">Check your mic and camera before speaking.</p>
                                         <button className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 w-full">Open Settings</button>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </aside>
        </div>
      </main>
  );
}

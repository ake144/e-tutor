"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarAlt, 
  FaClock, 
  FaVideo, 
  FaPlus 
} from "react-icons/fa";
import { useRouter } from "next/navigation";

// Mock Data for Sessions
const MOCK_SESSIONS = [
    { id: 1, date: "2026-02-05", time: "10:00 AM", title: "Math Session", tutor: "Mr. Smith", type: "video" },
    { id: 2, date: "2026-02-05", time: "02:00 PM", title: "Physics Review", tutor: "Ms. Johnson", type: "video" },
    { id: 3, date: "2026-02-12", time: "11:00 AM", title: "Chemistry Lab", tutor: "Dr. Brown", type: "video" },
    { id: 4, date: "2026-02-18", time: "09:00 AM", title: "English Lit", tutor: "Mrs. Davis", type: "video" },
    { id: 5, date: "2026-02-24", time: "04:00 PM", title: "Math Session", tutor: "Mr. Smith", type: "video" },
];

export default function CalendarPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const newDate = new Date(year, month, day);
        setSelectedDate(newDate);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const isSelected = (day: number) => {
        return selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
    };

    const getSessionsForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return MOCK_SESSIONS.filter(s => s.date === dateStr);
    };

    const selectedDaySessions = selectedDate 
        ? getSessionsForDay(selectedDate.getDate())
        : [];

    return (
        <div className="flex min-h-screen bg-[#F8F9FC]">
            <Sidebar />

            <div className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Schedule</h1>
                        <p className="text-gray-500 mt-1">Manage your sessions and upcoming classes.</p>
                    </div>
                    <button 
                        onClick={() => router.push('/tutors')}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <FaPlus size={14} /> Book Session
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Calendar Grid */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-gray-800">
                                {monthNames[month]} {year}
                            </h2>
                            <div className="flex bg-gray-50 rounded-lg p-1">
                                <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600">
                                    <FaChevronLeft size={14} />
                                </button>
                                <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600">
                                    <FaChevronRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Week Days */}
                        <div className="grid grid-cols-7 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm font-bold text-gray-400 uppercase tracking-wider py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Empty slots for previous month */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-24 md:h-32 p-2"></div>
                            ))}

                            {/* Actual days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const sessionCount = getSessionsForDay(day).length;
                                const active = isSelected(day);
                                const today = isToday(day);

                                return (
                                    <div 
                                        key={day}
                                        onClick={() => handleDayClick(day)}
                                        className={`
                                            h-24 md:h-32 border rounded-xl p-2 cursor-pointer transition-all flex flex-col justify-between group
                                            ${active ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/30' : 'border-gray-50 hover:border-blue-200 hover:shadow-md bg-white'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={`
                                                w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                                                ${today ? 'bg-blue-600 text-white' : 'text-gray-700'}
                                                ${active && !today ? 'text-blue-600' : ''}
                                            `}>
                                                {day}
                                            </span>
                                            {sessionCount > 0 && (
                                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                            )}
                                        </div>
                                        
                                        {/* Simplified session indicators for the grid */}
                                        <div className="space-y-1">
                                            {getSessionsForDay(day).slice(0, 2).map((session, idx) => (
                                                <div key={idx} className="text-[10px] truncate bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-medium">
                                                    {session.time}
                                                </div>
                                            ))}
                                            {sessionCount > 2 && (
                                                <div className="text-[10px] text-gray-400 px-1">+{sessionCount - 2} more</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Sidebar: Selected Day Details */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1">
                            <h3 className="font-bold text-gray-800 text-lg mb-1">
                                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">You have {selectedDaySessions.length} sessions scheduled.</p>

                            <div className="space-y-4">
                                {selectedDaySessions.length > 0 ? (
                                    selectedDaySessions.map((session, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded border border-blue-100 flex items-center gap-1">
                                                    <FaClock size={10} /> {session.time}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                    <FaVideo size={10} /> Zoom
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-800 mb-1">{session.title}</h4>
                                            <p className="text-sm text-gray-500 mb-3">with {session.tutor}</p>
                                            
                                            <button className="w-full bg-blue-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-blue-700 transition opacity-0 group-hover:opacity-100">
                                                Join Session
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                                            <FaCalendarAlt size={24} />
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium">No sessions for this day.</p>
                                        <button 
                                            onClick={() => router.push('/tutors')}
                                            className="text-blue-600 font-bold text-sm mt-2 hover:underline"
                                        >
                                            Schedule one now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mini Widget */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-3xl text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Need a Reschedule?</h3>
                            <p className="text-purple-100 text-sm mb-4">You can reschedule sessions up to 24 hours in advance.</p>
                            <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-2 px-4 rounded-lg transition backdrop-blur-sm">
                                View Policy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
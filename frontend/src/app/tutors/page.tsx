"use client";

import { useEffect, useState } from "react";
import { createSession } from "@/lib/sessions";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import ProtectedRoute from "../(auth)/ProtectedRoute";
import { Tutor, allSubjects, getTutors } from "@/lib/tutors";
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaCheckCircle,
  FaHeart,
  FaMapMarkerAlt,
  FaClock,
  FaBolt
} from "react-icons/fa";
import Sidebar from "@/components/Sidebar";

export default function TutorsPage() {
  const { user, logout } = useAuthStore();
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingTutor, setBookingTutor] = useState<Tutor | null>(null);
  
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Build query
    const params = new URLSearchParams();
    if (selectedSubject !== "All") params.append("subject", selectedSubject);
    
    // Simple mapping for price to generic maxPrice for now, or just client side filter
    // For now let's fetch all and filter client side to match the complex ranges (Under 30, 30-50, etc)
    // In a real app, you'd want robust backend filtering.
    
    fetch(`/api/tutors?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
         if(data.success) {
             setTutors(data.data);
         }
         setLoading(false);
      });
  }, [selectedSubject]);

  const filteredTutors = tutors.filter((tutor) => {
    // Subject is already filtered by API if not "All", but good to double check or if we selected "All" after
    const matchesSubject = selectedSubject === "All" || tutor.subjects.includes(selectedSubject);
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceRange === "Under $30") matchesPrice = tutor.hourlyPrice < 30;
    if (priceRange === "$30 - $50") matchesPrice = tutor.hourlyPrice >= 30 && tutor.hourlyPrice <= 50;
    if (priceRange === "Over $50") matchesPrice = tutor.hourlyPrice > 50;

    return matchesSubject && matchesSearch && matchesPrice;
  });

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Find a Tutor</h1>
            <p className="text-gray-500 mt-1">Connect with expert tutors for 1-on-1 learning</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search by name or keyword..." 
                 className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
          </div>
        </header>

        <div className="flex gap-8">
          {/* Filters Sidebar (Inner) */}
          <aside className="w-64 flex-shrink-0 space-y-8">
            {/* Subjects Filter */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaFilter className="text-blue-500" /> Subjects
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${selectedSubject === "All" ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}>
                    {selectedSubject === "All" && <FaCheckCircle className="text-white text-xs"/>}
                  </div>
                  <input 
                    type="radio" 
                    name="subject" 
                    className="hidden" 
                    checked={selectedSubject === "All"} 
                    onChange={() => setSelectedSubject("All")}
                  />
                  <span className={`text-sm ${selectedSubject === "All" ? "text-gray-900 font-medium" : "text-gray-600"}`}>All Subjects</span>
                </label>
                
                {allSubjects.map(subject => (
                  <label key={subject} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${selectedSubject === subject ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}>
                       {selectedSubject === subject && <FaCheckCircle className="text-white text-xs"/>}
                    </div>
                    <input 
                      type="radio" 
                      name="subject" 
                      className="hidden" 
                      checked={selectedSubject === subject} 
                      onChange={() => setSelectedSubject(subject)}
                    />
                    <span className={`text-sm ${selectedSubject === subject ? "text-gray-900 font-medium" : "text-gray-600"}`}>{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Hourly Rate</h3>
              <div className="space-y-3">
                 {["All", "Under $30", "$30 - $50", "Over $50"].map((range) => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${priceRange === range ? "border-blue-600" : "border-gray-300"}`}>
                        {priceRange === range && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                      </div>
                      <input 
                        type="radio" 
                        name="price" 
                        className="hidden"
                        checked={priceRange === range}
                        onChange={() => setPriceRange(range)} 
                      />
                      <span className="text-sm text-gray-600">{range}</span>
                    </label>
                 ))}
              </div>
            </div>
            
            {/* Promo Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center">
                <h3 className="font-bold text-lg mb-2">Get 50% Off</h3>
                <p className="text-blue-100 text-sm mb-4">On your first session with any new tutor.</p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-blue-50 transition">Claim Now</button>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
             <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-gray-800 text-xl">{filteredTutors.length} Tutors Available</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Sort by:</span>
                    <select className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer">
                        <option>Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Rating: High to Low</option>
                    </select>
                </div>
             </div>

             <div className="space-y-6">
                {filteredTutors.map(tutor => (
                   <TutorCard key={tutor.id} tutor={tutor} onBook={() => setBookingTutor(tutor)} />
                ))}
                
                {filteredTutors.length === 0 && (
                   <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                       <p className="text-gray-400 text-lg">No tutors found matching your criteria.</p>
                       <button 
                         onClick={() => {setSelectedSubject("All"); setPriceRange("All"); setSearchQuery("");}}
                         className="mt-4 text-blue-600 font-bold hover:underline"
                       >
                         Clear Filters
                       </button>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
      
      {/* Simple Booking Modal (Overlay) */}
      {bookingTutor && (
         <BookingModal tutor={bookingTutor} onClose={() => setBookingTutor(null)} user={user} />
      )}
    </div>
  );
}

function TutorCard({ tutor, onBook }: { tutor: Tutor; onBook: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col md:flex-row gap-6">
       <div className="flex-shrink-0 relative">
          <img src={tutor.avatar} alt={tutor.name} className="w-24 h-24 rounded-full object-cover border-4 border-blue-50" />
          <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full border-2 border-white" title="Online">
             <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
       </div>
       
       <div className="flex-1">
          <div className="flex justify-between items-start">
             <div>
                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {tutor.name}
                    <FaCheckCircle className="text-blue-500 text-sm" title="Verified Tutor" />
                 </h3>
                 <p className="text-sm text-gray-500 font-medium mb-1">Certified {tutor.subjects[0]} Tutor</p>
                 <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold">
                       <FaStar /> {tutor.rating}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span>{tutor.reviews} Reviews</span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-gray-400"/> Remote</span>
                 </div>
             </div>
             <div className="text-right">
                 <div className="text-2xl font-bold text-gray-800">${tutor.hourlyPrice}</div>
                 <div className="text-xs text-gray-400 font-medium">per hour</div>
             </div>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
             {tutor.bio}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
               {tutor.subjects.map(s => (
                   <span key={s} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
                      {s}
                   </span>
               ))}
          </div>
          
          <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
              <button onClick={onBook} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition flex text-sm items-center gap-2 shadow-lg shadow-blue-100">
                  <FaBolt size={12}/> Book Now
              </button>
              <button className="text-gray-500 hover:text-gray-800 font-bold text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                  Message
              </button>
              <span className="ml-auto text-green-600 text-xs font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                  <FaClock /> Responds in 1 hr
              </span>
          </div>
       </div>
    </div>
  );
}

function BookingModal({ tutor, onClose, user }: { tutor: Tutor, onClose: () => void, user: any }) {
    const router = useRouter();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState("10:00");

    const handleProceed = () => {
        const params = new URLSearchParams({
            tutorId: tutor.id,
            date,
            time
        });
        onClose();
        router.push(`/checkout?${params.toString()}`);
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md m-4 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    ✕
                </button>
                <div className="text-center mb-6">
                    <img src={tutor.avatar} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg" />
                    <h2 className="text-2xl font-bold text-gray-800">Book Session</h2>
                    <p className="text-gray-500 text-sm">with {tutor.name}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Date</label>
                        <input 
                            type="date" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Time</label>
                        <input 
                            type="time" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center text-blue-800">
                        <span className="text-sm font-medium">Hourly Rate</span>
                        <span className="font-bold">${tutor.hourlyPrice}/hr</span>
                    </div>
                </div>

                <button 
                  onClick={handleProceed}
                  className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
                >
                    Proceed to Checkout <FaBolt size={14} />
                </button>
            </div>
        </div>
    )
}

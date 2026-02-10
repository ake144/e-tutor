"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { getTutors, Tutor } from "@/lib/tutors";
import { createSession } from "@/lib/sessions";
import Sidebar from "@/components/Sidebar";
import { 
  FaCreditCard, 
  FaPaypal, 
  FaApple, 
  FaLock, 
  FaCalendarAlt, 
  FaClock, 
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";
import { ChapaButton } from "@/components/dashboard/chapaChekout";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const tutorId = searchParams.get("tutorId");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [isChapaProcessing, setIsChapaProcessing] = useState(false);

  useEffect(() => {
    if (tutorId) {
      // Fetch specific tutor details from API
      // In a real app we would have a specific getTutorById endpoint, but filtering the list works for now
      fetch(`/api/tutors`)
         .then(res => res.json())
         .then(data => {
             if(data.success && data.data) {
                 const found = data.data.find((t:any) => t.id === tutorId);
                 if (found) setTutor(found);
             }
         });
    }
  }, [tutorId]);

  if (!tutor || !user) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  const sessionPrice = tutor.hourlyPrice;
  const serviceFee = 3.00;
  const total = sessionPrice + serviceFee;

  const txRef = `booking-${tutor.id}-${Date.now()}`;
  
  // Format Date
  const displayDate = dateParam ? new Date(dateParam).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "Mon, Oct 24, 2023";

  // Chapa Payment Handler
  const handlePayment = async () => {
    setLoading(true);
    setIsChapaProcessing(true);
    
    try {
        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tutorId: tutor.id,
                date: dateParam,
                time: timeParam
            })
        });

        const data = await res.json();
        if(data.success && data.booking) {
             alert(`Payment Successful! Booking Confirmed with ${tutor.name}`);
             router.push("/dashboard");
        } else {
             alert("Booking failed: " + (data.error || "Unknown error"));
        }
    } catch(err) {
        alert("An error occurred during payment processing");
    } finally {
        setLoading(false);
        setIsChapaProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8 lg:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
        <p className="text-gray-500 mb-8">Complete your booking for a safe and fun learning session.</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Form */}
            <div className="flex-1 space-y-8">
                
                {/* Payment Method */}
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setPaymentMethod("card")}
                            className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FaCreditCard /> Credit Card
                        </button>
                        <button 
                           onClick={()=> setPaymentMethod("chapa")}
                           className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition ${paymentMethod === 'chapa' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FaCheckCircle /> Chapa Pay
                        </button>
                        <button 
                            onClick={() => setPaymentMethod("paypal")}
                            className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FaPaypal /> PayPal
                        </button>
                    </div>
                </section>

                {/* Card Fields */}
                {paymentMethod === "card" && (
                    <>
                   
                <section className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Name on Card</label>
                        <input type="text" placeholder="e.g. Sarah J. Connor" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                        <div className="relative">
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                            <FaCreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Expiration</label>
                            <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">CVC <span className="text-gray-400 font-normal text-xs">(3 digits)</span></label>
                            <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                        </div>
                    </div>
                    
                    <div className="w-1/2 pr-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code</label>
                         <input type="text" placeholder="90210" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                </section>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
                    <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm">Add to Monthly Subscription</h4>
                        <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                            Save 10% on every session and get priority booking with your favorite tutors. Cancel anytime.
                        </p>
                    </div>
                </div>

                {/* Confirm Button */}
                <button 
                    onClick={handlePayment} 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <FaLock size={14} /> Confirm Payment • ${total.toFixed(2)}
                        </>
                    )}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <FaShieldAlt /> Payments are secure and encrypted.
                </div>
                </>
                )}

                {
                    paymentMethod === "chapa" && (
                         <ChapaButton
                            amount={total}
                            email={user.email}
                            firstName={user.name.split(' ')[0]}
                            lastName={user.name.split(' ')[1] || ''}
                            txRef={txRef}
                            phone_number={(user as any).phone || ''}
                            courseSlug={tutor.id}
                        />
                )}
                {/* Discount Code */}
                {/* <section>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Discount Code</label>
                     <div className="flex gap-2">
                         <input type="text" placeholder="Paste code here" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                          <button className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition">Apply</button>
                     </div>
                 </section> */}

             
                
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-96">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-full object-cover border-4 border-gray-50" />
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">1-on-1 Session</p>
                            <h3 className="font-bold text-gray-900 text-lg leading-none mb-1">{tutor.name}</h3>
                            <p className="text-sm text-gray-500">{tutor.subjects[0]} • 4th Grade</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-3">
                        <div className="flex items-start gap-3">
                            <FaCalendarAlt className="text-blue-500 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Date</p>
                                <p className="text-sm font-bold text-gray-800">{displayDate}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FaClock className="text-blue-500 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Time</p>
                                <p className="text-sm font-bold text-gray-800">{timeParam || "4:00 PM"} - {timeParam ? "One Hour" : "5:00 PM"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-6 mb-6">
                         <div className="flex justify-between text-sm text-gray-600">
                             <span>Session Price</span>
                             <span className="font-bold">${sessionPrice ? sessionPrice.toFixed(2) : "0.00"}</span>
                         </div>
                         <div className="flex justify-between text-sm text-gray-600">
                             <span>Service Fee</span>
                             <span className="font-bold">${serviceFee.toFixed(2)}</span>
                         </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t border-gray-100 pt-6 mb-6">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <button className="w-full text-blue-600 font-bold text-sm py-2 hover:bg-blue-50 rounded-lg transition">
                         Save for Later
                    </button>
                    
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}

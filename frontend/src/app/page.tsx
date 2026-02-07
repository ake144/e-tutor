
import Link from "next/link";
import { FaChalkboardTeacher, FaBookOpen, FaSmile } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-green-100 font-sans">
      <main className="flex flex-col items-center justify-center w-full max-w-2xl px-6 py-24 bg-white/90 rounded-3xl shadow-2xl border border-blue-100">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <FaChalkboardTeacher className="text-blue-500 text-4xl" />
            <span className="text-4xl font-extrabold text-blue-700 tracking-tight">Tutorly</span>
            <FaSmile className="text-pink-400 text-3xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800">Smart, Fun, and Safe Online Tutoring for Kids</h1>
          <p className="text-lg text-gray-600 text-center max-w-xl">
            Real-time video lessons, collaborative notes, camera-based whiteboard, and strong parental controls—all in one playful platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
          <Link href="/signup" className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold text-lg shadow hover:from-blue-600 hover:to-green-500 transition text-center">Get Started</Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-3 rounded-lg border-2 border-blue-400 text-blue-700 font-bold text-lg shadow hover:bg-blue-50 transition text-center">Sign In</Link>
        </div>
        <div className="flex items-center gap-2 text-blue-500 mt-2">
          <FaBookOpen className="text-2xl" />
          <span className="text-base font-medium text-blue-700">Empowering every child to learn, create, and connect.</span>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { allSubjects } from "@/lib/tutors";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";


export default function SignupPage() {

  const [role, setRole] = useState<"parent" | "tutor">("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // Tutor-specific fields
  const [subjects, setSubjects] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  function handleSubjectChange(subj: string) {
    setSubjects((prev) => prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email || !password || !confirm || !name || !phone) {
      setFormError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }
    if (role === "tutor") {
      if (subjects.length === 0 || !bio || !avatar) {
        setFormError("All tutor fields are required.");
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
        await register({email, password, 
          role,
          name,
          phone,
          ...(role === "tutor" ? { subjects, bio, avatar } : {}),
        });
    } catch (err) {
        // Error handling if signup throws
    } finally {
        setIsSubmitting(false);
    }
    // Redirect will happen in useEffect
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 pt-4 to-pink-100">
      <div className="w-full max-w-md md:max-w-xl p-8 bg-white/90 rounded-3xl shadow-2xl border border-blue-100 relative">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center mb-2 shadow-lg">
            <FaUser className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1">Join Tutorly!</h1>
          <p className="text-gray-500 text-sm">Create your account to start learning and having fun.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4 mb-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-bold shadow transition border-2 ${role === "parent" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-blue-700 border-blue-300"}`}
              onClick={() => setRole("parent")}
            >
              Parent/Student
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-bold shadow transition border-2 ${role === "tutor" ? "bg-green-500 text-white border-green-500" : "bg-white text-green-700 border-green-300"}`}
              onClick={() => setRole("tutor")}
            >
              Tutor
            </button>
          </div>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 transition text-gray-700 bg-blue-50 placeholder:text-blue-300"
              placeholder="Full Name"
              type="text"
              aria-label="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 transition text-gray-700 bg-blue-50 placeholder:text-blue-300"
              placeholder="Email"
              type="email"
              aria-label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="relative">
            <input
              className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 transition text-gray-700 bg-blue-50 placeholder:text-blue-300"
              placeholder="Phone Number"
              type="tel"
              aria-label="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          {/* <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 transition text-gray-700 bg-blue-50 placeholder:text-blue-300"
              placeholder="Email"
              type="email"
              aria-label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div> */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 transition text-gray-700 bg-blue-50 placeholder:text-blue-300"
              placeholder="Password"
              type="password"
              aria-label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 transition text-gray-700 bg-blue-50 placeholder:text-blue-300"
              placeholder="Confirm Password"
              type="password"
              aria-label="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          {role === "tutor" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-700">Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {allSubjects.map((subj) => (
                    <button
                      type="button"
                      key={subj}
                      className={`px-3 py-1 rounded-full border text-sm font-medium transition ${subjects.includes(subj) ? "bg-blue-500 text-white" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"}`}
                      onClick={() => handleSubjectChange(subj)}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-700">Bio</label>
                <textarea
                  className="w-full border rounded-lg p-2 text-gray-700 bg-blue-50 focus:outline-none focus:border-blue-400 resize-none"
                  placeholder="Tell parents and students about yourself..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-700">Avatar URL</label>
                <input
                  className="w-full border rounded-lg p-2 text-gray-700 bg-blue-50 focus:outline-none focus:border-blue-400"
                  placeholder="Paste a profile image URL..."
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          {(formError || error) && (
            <div className="text-red-500 text-sm text-center">{formError || error}</div>
          )}
          <button
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-bold text-lg shadow hover:from-blue-600 hover:to-green-500 transition disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign in</a></p>
      </div>
    </main>
  );
}

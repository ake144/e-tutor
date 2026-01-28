"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { signup, loading, error, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email || !password || !confirm) {
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
    await signup(email, password);
    // Redirect will happen in useEffect
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-200 via-blue-100 to-pink-100">
      <div className="w-full max-w-md p-8 bg-white/90 rounded-3xl shadow-2xl border border-blue-100 relative">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center mb-2 shadow-lg">
            <FaUser className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1">Join Tutorly!</h1>
          <p className="text-gray-500 text-sm">Create your account to start learning and having fun.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
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
          {(formError || error) && (
            <div className="text-red-500 text-sm text-center">{formError || error}</div>
          )}
          <button
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-bold text-lg shadow hover:from-blue-600 hover:to-green-500 transition disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign in</a></p>
      </div>
    </main>
  );
}

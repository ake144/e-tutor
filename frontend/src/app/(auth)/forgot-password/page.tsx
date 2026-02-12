"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus("success");
        setMessage("If an account with that email exists, we've sent you a password reset link.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <section className="rounded-2xl border bg-card/70 p-6 shadow-lg backdrop-blur md:p-8">
      <header className="mb-6">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to login
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </header>

      {status === "success" ? (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
             <CheckCircle2 className="size-6 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="mb-1 text-base font-semibold text-green-700 dark:text-green-300">Check your email</h3>
          <p className="text-sm text-green-700/80 dark:text-green-300/80">
            {message}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
             Did not receive the email? Check your spam folder or try again.
          </p>
          <button 
             onClick={() => setStatus("idle")}
             className="mt-4 text-sm font-medium text-primary hover:underline"
          >
             Try using another email address
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                className="h-11 w-full rounded-lg border bg-background/70 pl-10 pr-3 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                placeholder="you@example.com"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={status === "loading"}
              />
            </div>
          </div>

          {status === "error" && (
             <div className="text-sm text-destructive">{message}</div>
          )}

          <button
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
            disabled={status === "loading" || !email}
            type="submit"
          >
            {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
            {status === "loading" ? "Sending link..." : "Send reset link"}
          </button>
        </form>
      )}
    </section>
  );
}

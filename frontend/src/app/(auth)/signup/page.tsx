"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { allSubjects } from "@/lib/tutors";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

export default function SignupPage() {
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const mergedError = useMemo(() => formError ?? error, [formError, error]);

  function handleSubjectChange(subj: string) {
    setSubjects((prev) => (prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!email || !password || !confirm || !name || !phone) {
      setFormError("Please fill in all required fields.");
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
    if (role === "TUTOR") {
      if (subjects.length === 0 || !bio || !avatar) {
        setFormError("Please complete your tutor profile (subjects, bio, and avatar URL).");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await register({
        email,
        password,
        role,
        name,
        phone,
        ...(role === "TUTOR" ? { subjects, bio, avatar } : {}),
      });
    } catch {
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border bg-card/70 p-6 shadow-lg backdrop-blur md:p-8">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" />
          Create your account
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Join Tutorly</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started in minutes — book sessions, collaborate live, and track progress.
        </p>
      </header>

      <div className="mb-5">
        <div className="grid grid-cols-2 rounded-xl border bg-background/60 p-1">
          <button
            type="button"
            className={cn(
              "h-9 rounded-lg text-sm font-medium transition",
              role === "STUDENT" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setRole("STUDENT")}
            aria-pressed={role === "STUDENT"}
          >
            Parent/Student
          </button>
          <button
            type="button"
            className={cn(
              "h-9 rounded-lg text-sm font-medium transition",
              role === "TUTOR" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setRole("TUTOR")}
            aria-pressed={role === "TUTOR"}
          >
            Tutor
          </button>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="name"
                className="h-11 w-full rounded-lg border bg-background/70 pl-10 pr-3 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                placeholder="Your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="phone"
                className="h-11 w-full rounded-lg border bg-background/70 pl-10 pr-3 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                placeholder="+1 555 123 4567"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
            </div>
          </div>
        </div>

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
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                className="h-11 w-full rounded-lg border bg-background/70 pl-10 pr-10 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                placeholder="At least 6 characters"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirm
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="confirm"
                className="h-11 w-full rounded-lg border bg-background/70 pl-10 pr-10 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                placeholder="Repeat password"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        {role === "TUTOR" && (
          <div className="rounded-xl border bg-background/50 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Tutor profile</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  These details appear on your public profile.
                </div>
              </div>
              <span className="rounded-full border bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                Required
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {allSubjects.map((subj) => {
                    const selected = subjects.includes(subj);
                    return (
                      <button
                        type="button"
                        key={subj}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition",
                          selected
                            ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                            : "bg-background/60 text-foreground hover:bg-accent"
                        )}
                        onClick={() => handleSubjectChange(subj)}
                        aria-pressed={selected}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  className="min-h-23 w-full resize-none rounded-lg border bg-background/70 p-3 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                  placeholder="Share your teaching style, experience, and what students can expect…"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="avatar" className="text-sm font-medium">
                  Avatar URL
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="avatar"
                    className="h-11 w-full rounded-lg border bg-background/70 pl-10 pr-3 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    placeholder="https://…"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {mergedError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {mergedError}
          </div>
        )}

        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {isSubmitting ? "Creating account" : "Create account"}
          <ArrowRight className="size-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </section>
  );
}

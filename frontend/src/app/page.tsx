
import Link from "next/link";
import { FaBookOpen, FaChalkboardTeacher, FaSmile } from "react-icons/fa";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-104 w-104 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-10 md:px-10 lg:pt-14">
        <header className="mb-14 flex items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex size-10 items-center justify-center rounded-xl border bg-card/80 shadow-sm">
              <FaChalkboardTeacher className="text-blue-500 text-xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Tutorly</span>
          </div>
          <nav className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-lg border bg-card/70 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm">
              <Sparkles className="size-3.5" />
              Modern tutoring platform
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Smart, safe, and engaging learning for every child.
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
              Tutorly combines live video sessions, collaborative notes, whiteboard tools, and parent-friendly controls
              in one world-class experience.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                Start for free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-lg border bg-card/70 px-6 text-sm font-medium shadow-sm transition hover:bg-accent"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Real-time collaborative classes
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Trusted tutor matching
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Parent-friendly oversight
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Secure account and sessions
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card/70 p-5 shadow-xl backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">Live session preview</span>
              <span className="inline-flex items-center gap-1 rounded-full border bg-background/70 px-2.5 py-1 text-xs text-muted-foreground">
                <Video className="size-3.5" />
                HD Classroom
              </span>
            </div>
            <div className="grid gap-3">
              <div className="rounded-xl border bg-background/70 p-4">
                <div className="mb-1 inline-flex items-center gap-2 text-sm font-medium">
                  <FaBookOpen className="text-blue-500" />
                  Collaborative Notes
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Students and tutors write together, organize concepts, and save progress after every session.
                </p>
              </div>
              <div className="rounded-xl border bg-background/70 p-4">
                <div className="mb-1 inline-flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  Parent Safety Controls
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Built-in supervision settings and secure authentication for peace of mind.
                </p>
              </div>
              <div className="rounded-xl border bg-background/70 p-4">
                <div className="mb-1 inline-flex items-center gap-2 text-sm font-medium">
                  <FaSmile className="text-pink-500" />
                  Engagement First
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Friendly interface designed to keep learners focused, motivated, and confident.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

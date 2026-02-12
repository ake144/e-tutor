import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative isolate min-h-screen">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-linear-to-tr from-indigo-500/25 via-sky-500/20 to-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-48 right-[-10%] h-130 w-130 rounded-full bg-linear-to-tr from-emerald-500/20 via-cyan-500/15 to-indigo-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(0,0,0,0.05),transparent)] dark:bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)]" />
        </div>

        <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
          {/* Left marketing panel */}
          <aside className="relative hidden flex-col justify-between p-10 lg:flex">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-semibold tracking-tight"
                aria-label="Go to Tutorly home"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-xl border bg-card/70 shadow-sm">
                  <span className="text-base">T</span>
                </span>
                <span className="text-lg">Tutorly</span>
              </Link>
              <span className="rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground shadow-sm">
                Secure • Fast • Global
              </span>
            </div>

            <div className="mt-10">
              <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight">
                Learn faster with tutors you can trust.
              </h2>
              <p className="mt-4 max-w-md text-pretty text-sm leading-6 text-muted-foreground">
                Tutorly helps families and learners book sessions, collaborate live, and track progress — all in one
                place.
              </p>

              <div className="mt-8 grid max-w-md gap-3">
                <div className="rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur">
                  <div className="text-sm font-medium">World-class experience</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Clean UI, accessible forms, and a frictionless sign-in flow.
                  </div>
                </div>
                <div className="rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur">
                  <div className="text-sm font-medium">Built for live learning</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Video rooms, whiteboard, chat, and collaborative notes.
                  </div>
                </div>
                <div className="rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur">
                  <div className="text-sm font-medium">Flexible for tutors</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Create a profile, set your subjects, and get discovered.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card/60 p-6 text-sm shadow-sm backdrop-blur">
              <div className="font-medium">“Booking a tutor is now effortless.”</div>
              <div className="mt-2 text-xs leading-5 text-muted-foreground">
                Parents can find the right fit quickly, and students love the live tools.
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="size-9 rounded-full border bg-background/70" />
                <div>
                  <div className="text-xs font-medium">Community feedback</div>
                  <div className="text-xs text-muted-foreground">Trusted by learners worldwide</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right auth panel */}
          <main className="relative flex items-center justify-center p-6 lg:p-10">
            <div className="w-full max-w-xl">
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-semibold tracking-tight"
                  aria-label="Go to Tutorly home"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-xl border bg-card/70 shadow-sm">
                    <span className="text-base">T</span>
                  </span>
                  <span className="text-lg">Tutorly</span>
                </Link>
              </div>

              {children}

              <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
                By continuing, you agree to our <span className="underline underline-offset-4">Terms</span> and{" "}
                <span className="underline underline-offset-4">Privacy Policy</span>.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
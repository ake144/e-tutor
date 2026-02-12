"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    if (!token) {
        return (
            <div className="text-center p-4">
                <p className="text-red-500 mb-4">Invalid or missing reset token.</p>
                <Link href="/forgot-password" className="text-primary hover:underline">
                    Request a new password reset link
                </Link>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (password.length < 6) {
           setStatus("error");
           setMessage("Password must be at least 6 characters.");
           return;
        }

        if (password !== confirm) {
            setStatus("error");
            setMessage("Passwords do not match.");
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            
            const data = await res.json();
            
            if (data.success) {
                setStatus("success");
                setMessage("Your password has been reset successfully.");
                 // Redirect after a delay
                 setTimeout(() => router.push("/login"), 3000);
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to reset password. The link may have expired.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("An unexpected error occurred.");
        }
    }

    if (status === "success") {
         return (
             <div className="text-center py-6">
                 <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                     <CheckCircle2 className="size-6 text-green-600 dark:text-green-300" />
                 </div>
                 <h2 className="text-xl font-semibold mb-2">Password Reset!</h2>
                 <p className="text-muted-foreground mb-6">
                     You can now log in with your new password.
                 </p>
                 <Link 
                   href="/login"
                   className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90"
                 >
                    Go to Login
                 </Link>
             </div>
         );
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">New Password</label>
                <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        id="password"
                        className="h-11 w-full rounded-lg border bg-background/70 pl-10 pr-10 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                        placeholder="At least 6 characters"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        id="confirm"
                        className="h-11 w-full rounded-lg border bg-background/70 pl-10 pr-10 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                        placeholder="Repeat password"
                        type={showPassword ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
            </div>

            {status === "error" && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">{message}</div>
            )}

            <button
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
                disabled={status === "loading"}
                type="submit"
            >
                {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
                {status === "loading" ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your new password must be different from previously used passwords.
        </p>
      </header>

      <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}>
         <ResetPasswordForm />
      </Suspense>
    </section>
  );
}

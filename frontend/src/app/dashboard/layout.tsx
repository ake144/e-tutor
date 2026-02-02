'use client';


import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-blue-600">Redirecting to login...</div>
    );
  }
  return <>{children}</>;
}

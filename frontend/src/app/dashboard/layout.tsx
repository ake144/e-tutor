'use client';

import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if explicitly not loading and not authenticated
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If we are here, we are either authenticated or about to redirect.
  // Rendering children if user is present is safer.
  if (!isAuthenticated) {
    return null; 
  }
  
  return <>{children}</>;
}

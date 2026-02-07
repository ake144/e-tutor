'use client';

import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect, useRef } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
        initialized.current = true;
        checkSession();
    }
  }, [checkSession]);

  return <>{children}</>;
}

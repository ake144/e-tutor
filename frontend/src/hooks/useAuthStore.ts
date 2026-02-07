import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  name: string;
  avatar?: string;
  bio?: string;
  subjects?: string[];
}

interface AuthState {
  user: null | User;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      set({ user: data.data.user, isAuthenticated: true, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  register: async (regData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      set({ user: data.data.user, isAuthenticated: true, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    set({ user: null, isAuthenticated: false , loading: false });
    // Optional: Redirect or reload
    window.location.href = '/login';
  },

  checkSession: async () => {
    set({ loading: true });
    try {
      // Add no-store and timestamp to prevent caching of auth state
      // credentials: 'include' ensures cookies are sent even if browser thinks it's cross-site (though it shouldn't be)
      const res = await fetch(`/api/auth/me?t=${Date.now()}`, { 
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
        credentials: "include"
      });
      
      // If unauthorized, not found, or server error -> Clear session
      if (!res.ok) {
         console.error(`Session check failed with status: ${res.status}`);
         if (res.status === 401 || res.status === 403) {
             // Do NOT call logout endpoint here as it might cause loops if the endpoint is also protected or redirects
             // Just clear local state. Use set() to avoid triggering listeners excessively if possible.
             // Also, setting isAuthenticated false will likely trigger a redirect in ProtectedLayout.
             set({ user: null, isAuthenticated: false });
         }
         // For 500s, we probably shouldn't logout technically, but if we can't verify identity...
         // Let's safe fail to logged out to avoid infinite loops if the error is persistent
         if (res.status >= 500) {
             // Maybe don't call logout endpoint, just clear local state?
             set({ user: null, isAuthenticated: false }); 
         }
         return;
      }

      const data = await res.json();
      if (data.success) {
        set({ user: data.data.user, isAuthenticated: true });
      } else {
         console.warn("Session check returned success:false", data);
         // Do not hit logout endpoint, just clear local state
         set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      console.error("Session check failed, clearing local session", err);
      // Do not hit logout endpoint, just clear local state
      set({ user: null, isAuthenticated: false });
    } finally {
      // ALWAYS set loading to false to prevent infinite spinners
      set({ loading: false });
    }
  },
}));

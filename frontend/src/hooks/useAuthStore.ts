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
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        set({ user: data.data.user, isAuthenticated: true, loading: false });
      } else {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));

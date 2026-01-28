import { create } from "zustand";

interface AuthState {
  user: null | { email: string };
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Try to load user from localStorage
  let initialUser = null;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tutorly_user");
    if (stored) initialUser = JSON.parse(stored);
  }
  return {
    user: initialUser,
    loading: false,
    error: null,
    login: async (email, password) => {
      set({ loading: true, error: null });
      // Mock API call
      await new Promise((r) => setTimeout(r, 800));
      if (email === "demo@tutorly.com" && password === "password") {
        set({ user: { email }, loading: false });
        if (typeof window !== "undefined") localStorage.setItem("tutorly_user", JSON.stringify({ email }));
      } else {
        set({ error: "Invalid credentials", loading: false });
      }
    },
    signup: async (email, password) => {
      set({ loading: true, error: null });
      // Mock API call
      await new Promise((r) => setTimeout(r, 800));
      set({ user: { email }, loading: false });
      if (typeof window !== "undefined") localStorage.setItem("tutorly_user", JSON.stringify({ email }));
    },
    logout: () => {
      set({ user: null });
      if (typeof window !== "undefined") localStorage.removeItem("tutorly_user");
    },
  };
});

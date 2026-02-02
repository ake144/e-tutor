import { create } from "zustand";
import { addTutor, addParent } from "@/lib/tutors";


interface SignupFields {
  role: "parent" | "tutor";
  name: string;
  phone: string;
  subjects?: string[];
  bio?: string;
  avatar?: string;
}

export interface User {
  email: string;
  role: "parent" | "tutor";
  name: string;
  phone: string;
  subjects?: string[];
  bio?: string;
  avatar?: string;
}

interface AuthState {
  user: null | User;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fields: SignupFields) => Promise<void>;
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
    isAuthenticated: initialUser !== null,
    loading: false,
    error: null,
    login: async (email, password) => {
      set({ loading: true, error: null });
      await new Promise((r) => setTimeout(r, 800));
      // Load all users from localStorage
      let users: any[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("tutorly_all_users");
        if (stored) users = JSON.parse(stored);
      }
      // Demo user fallback
      if (email === "demo@tutorly.com" && password === "password") {
        const demoUser: User = {
          email,
          role: "tutor",
          name: "Demo User",
          phone: "000-000-0000",
        };
        set({ user: demoUser, loading: false, isAuthenticated: true });
        if (typeof window !== "undefined") localStorage.setItem("tutorly_user", JSON.stringify(demoUser));
        return;
      }
      // Find user
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        set({ user: found, loading: false, isAuthenticated: true });
        if (typeof window !== "undefined") localStorage.setItem("tutorly_user", JSON.stringify(found));
      } else {
        set({ error: "Invalid credentials", loading: false });
      }
    },
    signup: async (email, password, fields) => {
      set({ loading: true, error: null });
      await new Promise((r) => setTimeout(r, 800));
      const user = { email, password, ...fields };
      // Save to all users
      let users: any[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("tutorly_all_users");
        if (stored) users = JSON.parse(stored);
      }
      users.push(user);
      if (typeof window !== "undefined") localStorage.setItem("tutorly_all_users", JSON.stringify(users));
      if (fields.role === "tutor") {
        addTutor({
          id: Math.random().toString(36).slice(2, 10),
          email,
          name: fields.name,
          subjects: fields.subjects || [],
          bio: fields.bio || "",
          avatar: fields.avatar || "",
          rating: 5.0,
          hourlyPrice: 40,
          reviews: 0,
        });
      }
      set({ user, loading: false, isAuthenticated: true });
      if (typeof window !== "undefined") localStorage.setItem("tutorly_user", JSON.stringify(user));
    },
    logout: () => {
      set({ user: null, isAuthenticated: false });
      if (typeof window !== "undefined") localStorage.removeItem("tutorly_user");
    },
  };
});

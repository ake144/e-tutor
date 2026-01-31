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
    loading: false,
    error: null,
    login: async (email, password) => {
      set({ loading: true, error: null });

      // Mock API call
      await new Promise((r) => setTimeout(r, 800));
      if (email === "demo@tutorly.com" && password === "password") {
        const demoUser: User = {
          email,
          role: "tutor",
          name: "Demo User",
          phone: "000-000-0000",
        };
        set({ user: demoUser, loading: false });
        if (typeof window !== "undefined") localStorage.setItem("tutorly_user", JSON.stringify(demoUser));
      } else {
        set({ error: "Invalid credentials", loading: false });
      }
    },
    signup: async (email, password, fields) => {
      set({ loading: true, error: null });
      // Mock API call
      await new Promise((r) => setTimeout(r, 800));
      const user = { email, ...fields };
      if (fields.role === "tutor") {
        // Add to tutors list
        addTutor({
          id: Math.random().toString(36).slice(2, 10),
          email,
          name: fields.name,
          subjects: fields.subjects || [],
          bio: fields.bio || "",
          avatar: fields.avatar || "",
          rating: 5.0,
        });
      }
      if (fields.role === "parent") {
        addParent(user);
      }
      set({ user, loading: false });
      if (typeof window !== "undefined") localStorage.setItem("tutorly_user", JSON.stringify(user));
    },
    logout: () => {
      set({ user: null });
      if (typeof window !== "undefined") localStorage.removeItem("tutorly_user");
    },
  };
});

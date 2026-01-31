import { User } from "@/hooks/useAuthStore";

// Mock data for tutors
export interface Tutor {
  id: string;
  email: string;
  name: string;
  subjects: string[];
  bio: string;
  avatar: string;
  rating: number;
}

function getInitialTutors(): Tutor[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tutorly_tutors");
    if (stored) return JSON.parse(stored);
  }
  // Default tutors
  return [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@gmail.com",
      subjects: ["Math", "Science"],
      bio: "Experienced math and science tutor with a passion for helping kids learn in fun ways.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
    },
    {
      id: "2",
      name: "Brian Lee",
      email: "brian@gmail.com",
      subjects: ["English", "History"],
      bio: "Enthusiastic English and history tutor who loves storytelling and interactive lessons.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
    },
    {
      id: "3",
      name: "Carla Gomez",
      email: "carla@gmail.com",
      subjects: ["Art", "Math"],
      bio: "Creative art and math tutor, making learning visual and engaging for all ages.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4.7,
    },
    {
      id: "4",
      name: "David Kim",
      email: "david@gmail.com",
      subjects: ["Science", "Coding"],
      bio: "STEM enthusiast and coding mentor, helping kids build confidence and curiosity.",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      rating: 4.95,
    },
  ];
}

export function getTutors(): Tutor[] {
  return getInitialTutors();
}

function getInitialParents(): User[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tutorly_user");
    if (stored) return JSON.parse(stored);
  }
  return [];
}

export function addParent(user:User){
    const  parents = getInitialParents();
    parents.push(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("tutorly_user", JSON.stringify(parents));
    }
}

export function addTutor(tutor: Tutor) {
  const tutors = getInitialTutors();
  tutors.push(tutor);
  if (typeof window !== "undefined") {
    localStorage.setItem("tutorly_tutors", JSON.stringify(tutors));
  }
}

export const allSubjects = [
  "Math",
  "Science",
  "English",
  "History",
  "Art",
  "Coding",
];

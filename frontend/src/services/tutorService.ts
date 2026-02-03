import { prisma } from "@/lib/prisma";
import { Anybody } from "next/font/google";

export const TutorService = {
  async getAllTutors(filters?: { subject?: string; maxPrice?: number }) {
    const where: any = {
      role: "TUTOR",
    };

    if (filters?.subject) {
      where.tutorProfile = {
        subjects: {
          has: filters.subject,
        },
      };
    }

    if (filters?.maxPrice) {
      where.tutorProfile = {
        ...where.tutorProfile,
        hourlyRate: {
          lte: filters.maxPrice,
        },
      };
    }

    const tutors = await prisma.user.findMany({
      where,
      include: {
        tutorProfile: true,
      },
      take: 20, // Limit results
    });

    // Transform to frontend friendly format
    return tutors.map((t: any) => ({
      id: t.tutorProfile?.id || "",
      userId: t.id,
      name: t.name,
      email: t.email,
      avatar: t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`,
      role: "Tutor",
      hourlyPrice: t.tutorProfile?.hourlyRate?.toNumber() || 0,
      subjects: t.tutorProfile?.subjects || [],
      rating: t.tutorProfile?.rating || 0,
      bio: t.tutorProfile?.bio || "",
    }));
  },

  async getTutorById(id: string) {
    const tutor = await prisma.user.findFirst({
        where: {
            tutorProfile: {
                id: id
            }
        },
        include: {
            tutorProfile: true,
            reviews: true 
        }
    });

    if (!tutor) return null;

    return {
        id: tutor.tutorProfile?.id,
        userId: tutor.id,
        name: tutor.name,
        avatar: tutor.avatar,
        bio: tutor.tutorProfile?.bio,
        hourlyPrice: tutor.tutorProfile?.hourlyRate,
        subjects: tutor.tutorProfile?.subjects,
        rating: tutor.tutorProfile?.rating,
        reviews: tutor.reviews
    };
  }
};

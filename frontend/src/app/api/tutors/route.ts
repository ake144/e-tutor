import { NextRequest } from "next/server";
import { TutorService } from "@/services/tutorService";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject") || undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

    const tutors = await TutorService.getAllTutors({ subject, maxPrice });

    return successResponse(tutors);
  } catch (error) {
    return handleApiError(error);
  }
}

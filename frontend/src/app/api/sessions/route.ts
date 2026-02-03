import { NextRequest } from "next/server";
import { BookingService } from "@/services/bookingService";
import { verifyAuth } from "@/lib/auth";
import { successResponse, handleApiError, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return errorResponse("Unauthorized", { status: 401 });

    const user = await verifyAuth(token);
    // @ts-ignore
    const sessions = await BookingService.getUserSessions(user.id);

    return successResponse(sessions);
  } catch (error) {
    return handleApiError(error);
  }
}

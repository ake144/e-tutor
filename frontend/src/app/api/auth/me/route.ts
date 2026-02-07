import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, handleApiError, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    
    // DEBUG LOGGING
    console.log("[API/ME] Checking session. Token present:", !!token);
    if (token) {
        console.log("[API/ME] Token preview:", token.substring(0, 10) + "...");
    }

    if (!token) {
        console.log("[API/ME] No token found in cookies.");
        return errorResponse("Unauthorized", { status: 401 });
    }

    let payload;
    try {
        payload = await verifyAuth(token);
        console.log("[API/ME] Token verified. Payload user ID:", payload.id);
    } catch (verr: any) {
        console.error("[API/ME] Token verification failed:", verr.message);
        return errorResponse("Invalid token", { status: 401 });
    }

    // @ts-ignore
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
        console.log("[API/ME] User not found in DB for ID:", payload.id);
        return errorResponse("User not found", { status: 404 });
    }

    console.log("[API/ME] Session valid for user:", user.email);
    return successResponse({ user });
  } catch (error) {
    console.error("[API/ME] Critical error:", error);
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, handleApiError, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return errorResponse("Unauthorized", { status: 401 });

    const payload = await verifyAuth(token);
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

    if (!user) return errorResponse("User not found", { status: 404 });

    return successResponse({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

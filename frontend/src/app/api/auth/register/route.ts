import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/authService";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, token } = await AuthService.register(body);

    const response = successResponse({ user });
    
    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

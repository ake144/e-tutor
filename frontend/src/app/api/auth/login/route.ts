import { NextRequest } from "next/server";
import { AuthService } from "@/services/authService";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, token } = await AuthService.login(body);

    const response = successResponse({ user });

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

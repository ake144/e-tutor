import { NextRequest } from "next/server";
import { AuthService } from "@/services/authService";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, token } = await AuthService.login(body);

    const response = successResponse({ user });

    // Force secure to false if not strictly production, and log it to be sure
    const isProduction = process.env.NODE_ENV === "production";
    console.log(`[API/LOGIN] Setting cookie. NODE_ENV=${process.env.NODE_ENV}, Secure=${isProduction}`);

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: isProduction, 
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

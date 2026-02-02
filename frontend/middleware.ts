import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  // Define protected routes
  const protectedRoutes = ["/dashboard", "/checkout", "/profile"];
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // Define public routes (login/register) to redirect if already logged in
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await verifyAuth(token);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (isAuthRoute && token) {
     try {
       await verifyAuth(token);
       return NextResponse.redirect(new URL("/dashboard", req.url));
     } catch (err) {
       // Token invalid, allow access to login
       return NextResponse.next();
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/profile/:path*", "/login", "/register"],
};
import { NextRequest, NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  const response = successResponse({ message: "Logged out" });
  response.cookies.delete("token");
  return response;
}

import { NextResponse } from "next/server";
import { ZodError } from "zod";

type ApiResponseOptions = {
  status?: number;
};

export function successResponse(data: any, options: ApiResponseOptions = {}) {
  const { status = 200 } = options;
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, options: ApiResponseOptions = {}) {
  const { status = 400 } = options;
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handleApiError(error: any) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    const message = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    return errorResponse(message, { status: 400 });
  }

  if (error instanceof Error) {
    return errorResponse(error.message, { status: 500 }); // Or map specific errors to 400/401/403/404
  }

  return errorResponse("An unexpected error occurred", { status: 500 });
}

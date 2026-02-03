import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/services/bookingService";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Auth Guard (Or use middleware to rely on headers, but manual check gives user info)
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const userPayload = await verifyAuth(token) as { id: string };
    const userId = userPayload.id;

    // 2. Parse Body
    const body = await req.json();
    const { tutorId, date, time } = body;

    // 3. Call Service
    const booking = await BookingService.createBooking({
      studentId: userId,
      tutorId,
      date,
      time
    });

    // 4. Return Response
    return NextResponse.json({ success: true, booking });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { cameraMode } = await request.json();

    const booking = await prisma.booking.update({
      where: { id },
      data: { studentCameraMode: cameraMode },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update camera mode" },
      { status: 500 }
    );
  }
}

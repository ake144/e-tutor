import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal user existence
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    // Token expires in 1 hour
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Mock Email Sending
    // In a real app, use Resend, SendGrid, etc.
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    
    console.log("---------------------------------------------------");
    console.log("PASSWORD RESET LINK (Dev Mode):");
    console.log(resetUrl);
    console.log("---------------------------------------------------");

    return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });

  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

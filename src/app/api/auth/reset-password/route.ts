import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/services/passwordResetService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, newPassword, verificationCode } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Alamat email wajib dicantumkan." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { success: false, error: "Kata sandi baru wajib dicantumkan." },
        { status: 400 }
      );
    }

    const result = await resetPassword(email, newPassword, verificationCode);

    return NextResponse.json({
      success: true,
      message: result.message,
      email: result.email,
      userName: result.userName,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in /api/auth/reset-password:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menyetel ulang kata sandi." },
      { status: 400 }
    );
  }
}

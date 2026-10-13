import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/services/passwordResetService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Alamat email yang valid wajib diisi." },
        { status: 400 }
      );
    }

    const result = await requestPasswordReset(email);

    return NextResponse.json({
      success: true,
      message: result.message,
      foundUser: result.userExists,
      userName: result.userName,
      demoVerificationCode: result.verificationCode,
      resetToken: result.resetToken,
      expiresInMinutes: result.expiresInMinutes,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in /api/auth/forgot-password:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memproses permohonan lupa kata sandi." },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Alamat email yang valid wajib diisi." },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();
    const user = db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.email, emailTrimmed))
      .get();

    // Generate a 6-digit verification code & temporary reset token
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = `rst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return NextResponse.json({
      success: true,
      message: `Tautan dan kode verifikasi pemulihan sandi telah dikirim ke ${emailTrimmed}.`,
      foundUser: Boolean(user),
      userName: user ? user.name : "Produser",
      demoVerificationCode: verificationCode,
      resetToken,
      expiresInMinutes: 15,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in /api/auth/forgot-password:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses permohonan lupa kata sandi." },
      { status: 500 }
    );
  }
}

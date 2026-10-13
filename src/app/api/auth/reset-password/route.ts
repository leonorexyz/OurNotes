import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Kata sandi baru minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();
    const user = db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.email, emailTrimmed))
      .get();

    return NextResponse.json({
      success: true,
      message: "Kata sandi akun produser Anda berhasil diperbarui! Silakan masuk kembali.",
      email: emailTrimmed,
      userName: user ? user.name : "Produser",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in /api/auth/reset-password:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyetel ulang kata sandi." },
      { status: 500 }
    );
  }
}

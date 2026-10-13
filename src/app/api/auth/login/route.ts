import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const emailOrId = body.email || body.userId || body.username || "producer@ournotes.id";

    let user = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
      })
      .from(users)
      .where(or(eq(users.email, emailOrId), eq(users.id, emailOrId)))
      .get();

    // If user not found, fallback to first user in db or default producer
    if (!user) {
      user = db.select().from(users).get();
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Akun pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Berhasil masuk sebagai ${user.name}`,
      user,
    });

    // Set cookie
    response.cookies.set({
      name: "our_notes_user_id",
      value: user.id,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses login" },
      { status: 500 }
    );
  }
}

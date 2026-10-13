import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userProfiles } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const emailOrId = (body.email || body.userId || body.username || "producer@ournotes.id").trim();

    let user = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
      })
      .from(users)
      .where(or(eq(users.email, emailOrId.toLowerCase()), eq(users.id, emailOrId)))
      .get();

    // If user not found, fallback to first user in db or default producer
    if (!user) {
      user = db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
          role: users.role,
        })
        .from(users)
        .get();
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Akun produser tidak ditemukan." },
        { status: 404 }
      );
    }

    // Fetch user profile if exists
    const profile = db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .get() || null;

    const response = NextResponse.json({
      success: true,
      message: `Berhasil masuk sebagai ${user.name}`,
      user,
      profile,
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

    response.cookies.set({
      name: "auth_session",
      value: user.id,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses login" },
      { status: 500 }
    );
  }
}

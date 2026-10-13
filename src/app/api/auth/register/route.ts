import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, avatarUrl, favoriteBand } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama produser wajib diisi." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Alamat email yang valid wajib diisi." },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();
    const existing = db
      .select()
      .from(users)
      .where(eq(users.email, emailTrimmed))
      .get();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar. Silakan gunakan menu Masuk." },
        { status: 409 }
      );
    }

    const userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const defaultAvatar =
      avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    // 1. Insert into users table
    db.insert(users)
      .values({
        id: userId,
        name: name.trim(),
        email: emailTrimmed,
        avatarUrl: defaultAvatar,
        role: "user",
      })
      .run();

    // 2. Insert into user_profiles table
    const chosenBand = favoriteBand || "Poppin'Party";
    db.insert(userProfiles)
      .values({
        id: `prof-${userId}`,
        userId: userId,
        title: "Produser Baru CiRCLE",
        bio: `Produser musik baru di CiRCLE Live House. Band favorit: ${chosenBand}.`,
        favoriteBand: chosenBand,
        favoriteCharacterId: "char-kasumi-toyama",
        favoriteAttribute: "Pure",
        rank: 1,
        noteSpeed: 10.0,
        timingOffset: 0.0,
        tapSoundEffect: "Tambourine",
        showCutIn: 1,
      })
      .run();

    const createdUser = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .get();

    const createdProfile = db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .get();

    const response = NextResponse.json(
      {
        success: true,
        message: `Pendaftaran berhasil! Selamat datang di CiRCLE, ${name}`,
        user: createdUser,
        profile: createdProfile,
      },
      { status: 201 }
    );

    // Set cookies
    response.cookies.set({
      name: "our_notes_user_id",
      value: userId,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    response.cookies.set({
      name: "auth_session",
      value: userId,
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
    console.error("Error in /api/auth/register:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pendaftaran akun" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/authService";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      const demoUsers = db
        .select({ id: users.id, name: users.name, email: users.email, role: users.role })
        .from(users)
        .all();

      return NextResponse.json({
        authenticated: false,
        user: null,
        availableUsers: demoUsers,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in GET /api/auth/me:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memeriksa status autentikasi" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Autentikasi diperlukan untuk mengubah profil." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, avatarUrl } = body;

    const updates: Partial<{ name: string; avatarUrl: string }> = {};
    if (typeof name === "string" && name.trim()) {
      updates.name = name.trim();
    }
    if (typeof avatarUrl === "string" && avatarUrl.trim()) {
      updates.avatarUrl = avatarUrl.trim();
    }

    if (Object.keys(updates).length > 0) {
      await db.update(users)
        .set(updates)
        .where(eq(users.id, user.id))
        .run();
    }

    const updatedUser = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .get();

    return NextResponse.json({
      success: true,
      message: "Profil produser berhasil diperbarui!",
      user: updatedUser,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in PATCH /api/auth/me:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui profil pengguna." },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/authService";
import { db } from "@/db";
import { users } from "@/db/schema";

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
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memeriksa status autentikasi" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/authService";
import { getUserProfile, updateUserProfile } from "@/services/userProfileService";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const userId =
      request.nextUrl.searchParams.get("userId") ||
      (user ? user.id : "user-producer-1");

    const profileData = await getUserProfile(userId);

    if (!profileData) {
      return NextResponse.json(
        { success: false, error: "Profil pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: profileData.user,
      profile: profileData.profile,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data profil." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const body = await request.json().catch(() => ({}));

    const userId = body.userId || (user ? user.id : "user-producer-1");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Autentikasi diperlukan untuk mengubah profil." },
        { status: 401 }
      );
    }

    const updated = await updateUserProfile(userId, body);

    return NextResponse.json({
      success: true,
      message: "Profil produser dan foto berhasil diperbarui!",
      user: updated?.user,
      profile: updated?.profile,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in PATCH /api/profile:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui profil pengguna." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return PATCH(request);
}

export async function POST(request: NextRequest) {
  return PATCH(request);
}

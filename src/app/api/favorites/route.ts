import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/authService";
import {
  getUserFavorites,
  addFavorite,
} from "@/services/favoriteService";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const userId =
      request.nextUrl.searchParams.get("userId") ||
      (user ? user.id : "user-producer-1");

    const type = request.nextUrl.searchParams.get("type") || undefined;
    const q = request.nextUrl.searchParams.get("q") || undefined;
    const sort = (request.nextUrl.searchParams.get("sort") || "newest") as "newest" | "title";

    const favorites = await getUserFavorites(userId, { type, q, sort });

    return NextResponse.json({
      success: true,
      count: favorites.length,
      userId,
      favorites,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in GET /api/favorites:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar favorit pengguna." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const body = await request.json().catch(() => ({}));

    const userId = body.userId || (user ? user.id : "user-producer-1");
    const {
      targetType,
      targetId,
      title,
      subtitle,
      categoryLabel,
      url,
      badge,
      badgeColor,
      avatarUrl,
      coverBg,
      notes,
    } = body;

    if (!targetId || !title || !url) {
      return NextResponse.json(
        {
          success: false,
          error: "Field targetId, title, dan url wajib dicantumkan.",
        },
        { status: 400 }
      );
    }

    const favorite = await addFavorite(userId, {
      targetType: targetType || "character",
      targetId,
      title,
      subtitle,
      categoryLabel,
      url,
      badge,
      badgeColor,
      avatarUrl,
      coverBg,
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: `"${title}" berhasil ditambahkan ke favorit!`,
        favorite,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in POST /api/favorites:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan item ke favorit." },
      { status: 500 }
    );
  }
}

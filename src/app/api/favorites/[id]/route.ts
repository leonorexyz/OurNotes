import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/authService";
import { removeFavorite, checkIsFavorited } from "@/services/favoriteService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    const userId =
      request.nextUrl.searchParams.get("userId") ||
      (user ? user.id : "user-producer-1");

    const isFavorited = await checkIsFavorited(userId, id);

    return NextResponse.json({
      success: true,
      targetId: id,
      isFavorited,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in GET /api/favorites/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memeriksa status favorit." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    const userId =
      request.nextUrl.searchParams.get("userId") ||
      (user ? user.id : "user-producer-1");

    const deleted = await removeFavorite(userId, id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Item favorit tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item berhasil dihapus dari koleksi favorit.",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in DELETE /api/favorites/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus item favorit." },
      { status: 500 }
    );
  }
}

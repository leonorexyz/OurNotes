import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/authService";
import {
  recordSearchQuery,
  getSearchKeywordAnalytics,
} from "@/services/searchLogService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

    const analytics = await getSearchKeywordAnalytics(limit);

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching search logs analytics:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat log dan analitik kata kunci pencarian" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const body = await request.json().catch(() => ({}));
    const query = body.query || body.q || body.term;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { success: false, error: "Kata kunci pencarian (query) wajib disertakan." },
        { status: 400 }
      );
    }

    const result = await recordSearchQuery({
      query: query.trim(),
      category: body.category || "all",
      resultCount: typeof body.resultCount === "number" ? body.resultCount : 0,
      userId: user ? user.id : body.userId || null,
    });

    return NextResponse.json({
      success: true,
      message: "Kata kunci pencarian berhasil dicatat ke database",
      data: result,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error logging search query:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mencatat kata kunci pencarian" },
      { status: 500 }
    );
  }
}

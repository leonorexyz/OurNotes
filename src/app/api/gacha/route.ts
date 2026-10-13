import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gachas } from "@/db/schema";
import { eq, like, or, and, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search") || searchParams.get("q");
    const recommendedParam = searchParams.get("recommended");

    const conditions = [];

    if (statusParam) {
      conditions.push(eq(gachas.status, statusParam));
    }

    if (categoryParam) {
      conditions.push(eq(gachas.category, categoryParam));
    }

    if (recommendedParam === "true" || recommendedParam === "1") {
      conditions.push(eq(gachas.isRecommended, 1));
    }

    if (searchParam) {
      const term = `%${searchParam.trim()}%`;
      conditions.push(
        or(
          like(gachas.title, term),
          like(gachas.japaneseTitle, term),
          like(gachas.description, term),
          like(gachas.tags, term)
        )
      );
    }

    const query = conditions.length > 0
      ? db.select().from(gachas).where(and(...conditions)).orderBy(desc(gachas.startAt))
      : db.select().from(gachas).orderBy(desc(gachas.startAt));

    const rows = query.all();

    const formatted = rows.map((row) => ({
      ...row,
      isRecommended: Boolean(row.isRecommended),
      featuredCharacters: row.featuredCharacters ? JSON.parse(row.featuredCharacters) : [],
      pickupRates: row.pickupRates ? JSON.parse(row.pickupRates) : null,
      pitySystem: row.pitySystem ? JSON.parse(row.pitySystem) : null,
      cost: row.cost ? JSON.parse(row.cost) : null,
      tags: row.tags ? JSON.parse(row.tags) : [],
    }));

    // Summary statistics
    const stats = {
      total: formatted.length,
      active: formatted.filter((g) => g.status === "Aktif").length,
      upcoming: formatted.filter((g) => g.status === "Akan Datang").length,
      ended: formatted.filter((g) => g.status === "Selesai").length,
    };

    return NextResponse.json({
      success: true,
      stats,
      data: formatted,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Gagal mengambil data jadwal gacha:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses permintaan data gacha" },
      { status: 500 }
    );
  }
}

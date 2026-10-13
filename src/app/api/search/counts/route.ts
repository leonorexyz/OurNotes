import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { searchItems } from "@/db/schema";
import { SEARCH_CATEGORIES } from "@/data/searchData";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = searchParams.get("q") || searchParams.get("search") || "";
    const qLower = rawQuery.trim().toLowerCase();

    const allItems = await db.select().from(searchItems).all();

    let matching = allItems;
    if (qLower.length > 0) {
      matching = allItems.filter((item) => {
        if (item.searchVector && item.searchVector.includes(qLower)) {
          return true;
        }
        return (
          item.title.toLowerCase().includes(qLower) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(qLower)) ||
          item.snippet.toLowerCase().includes(qLower) ||
          (item.tags && item.tags.toLowerCase().includes(qLower))
        );
      });
    }

    const counts: Record<string, number> = {
      all: matching.length,
      character: 0,
      band: 0,
      guide: 0,
      blog: 0,
      gacha: 0,
      team: 0,
    };

    for (const item of matching) {
      if (counts[item.category] !== undefined) {
        counts[item.category] += 1;
      }
    }

    const categories = SEARCH_CATEGORIES.map((c) => ({
      key: c.key,
      label: c.label,
      iconName: c.iconName,
      color: c.color,
      count: counts[c.key] || 0,
    }));

    return NextResponse.json({
      success: true,
      query: rawQuery,
      total: matching.length,
      counts,
      categories,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error computing search category counts:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghitung hasil pencarian per kategori" },
      { status: 500 }
    );
  }
}

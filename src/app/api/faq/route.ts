import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { guides } from "@/db/schema";
import { eq, like, or, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || searchParams.get("search") || "";
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    // Conditions: must be FAQ category
    const conditions = [eq(guides.category, "FAQ")];

    // Filter by specific subcategory (stored in summary or tags)
    if (category && category !== "Semua" && category !== "all") {
      conditions.push(
        or(
          eq(guides.summary, category),
          like(guides.tags, `%${category}%`)
        )!
      );
    }

    // Filter by search query
    if (query.trim().length > 0) {
      const q = `%${query.trim()}%`;
      conditions.push(
        or(
          like(guides.title, q),
          like(guides.content, q),
          like(guides.summary, q),
          like(guides.tags, q)
        )!
      );
    }

    const rows = await db
      .select()
      .from(guides)
      .where(and(...conditions))
      .limit(limit)
      .all();

    // Available categories from all FAQ records
    const allFaqs = await db.select().from(guides).where(eq(guides.category, "FAQ")).all();
    const categoriesSet = new Set<string>();
    allFaqs.forEach((f) => {
      if (f.summary) categoriesSet.add(f.summary);
    });

    const formattedData = rows.map((row) => ({
      id: row.id,
      question: row.title,
      category: row.summary || "Umum",
      answer: row.content,
      tags: row.tags ? JSON.parse(row.tags) : [],
      updatedAt: row.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      total: formattedData.length,
      query: query || null,
      selectedCategory: category || "Semua",
      availableCategories: ["Semua", ...Array.from(categoriesSet)],
      data: formattedData,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error searching FAQ:", error);
    return NextResponse.json(
      { success: false, error: "Gagal melakukan pencarian pertanyaan umum" },
      { status: 500 }
    );
  }
}

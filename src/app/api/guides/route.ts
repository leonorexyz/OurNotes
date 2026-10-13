import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { guides } from "@/db/schema";
import { eq, like, or, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search") || searchParams.get("q");
    const idParam = searchParams.get("id");

    // If specific ID requested
    if (idParam) {
      const item = await db.select().from(guides).where(eq(guides.id, idParam)).get();
      if (!item) {
        return NextResponse.json(
          { success: false, error: `Panduan dengan ID '${idParam}' tidak ditemukan` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: item });
    }

    // Build conditions
    const conditions = [];

    // Filter by category
    if (categoryParam && categoryParam !== "all" && categoryParam !== "Semua") {
      // Map lowercase to DB capitalised category
      const catLower = categoryParam.toLowerCase();
      let matchedCategory = "Pemula";
      if (catLower.includes("tip")) matchedCategory = "Tips";
      else if (catLower.includes("event")) matchedCategory = "Event";
      else if (catLower.includes("faq")) matchedCategory = "FAQ";
      else if (catLower.includes("pemula")) matchedCategory = "Pemula";

      conditions.push(eq(guides.category, matchedCategory));
    }

    // Filter by search query
    if (searchParam && searchParam.trim().length > 0) {
      const q = `%${searchParam.trim()}%`;
      conditions.push(
        or(
          like(guides.title, q),
          like(guides.summary, q),
          like(guides.content, q),
          like(guides.tags, q)
        )
      );
    }

    const results =
      conditions.length > 0
        ? await db.select().from(guides).where(and(...conditions)).all()
        : await db.select().from(guides).all();

    // Grouping count summary
    const countByCategory = {
      pemula: (await db.select().from(guides).where(eq(guides.category, "Pemula")).all()).length,
      tips: (await db.select().from(guides).where(eq(guides.category, "Tips")).all()).length,
      event: (await db.select().from(guides).where(eq(guides.category, "Event")).all()).length,
      faq: (await db.select().from(guides).where(eq(guides.category, "FAQ")).all()).length,
    };

    return NextResponse.json({
      success: true,
      total: results.length,
      filter: {
        category: categoryParam || "all",
        search: searchParam || null,
      },
      counts: countByCategory,
      data: results,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data panduan dari database" },
      { status: 500 }
    );
  }
}

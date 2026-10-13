import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { popularSearches } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { slugifyTag } from "@/data/blogData";

function resolveCategoryForTerm(term: string): {
  category: "karakter" | "band" | "tips" | "gacha";
  categoryLabel: string;
  tagline: string;
} {
  const t = term.toLowerCase();
  if (
    t.includes("kasumi") ||
    t.includes("yukina") ||
    t.includes("ran") ||
    t.includes("aya") ||
    t.includes("kokoro") ||
    t.includes("mashiro") ||
    t.includes("layer") ||
    t.includes("tomori")
  ) {
    return {
      category: "karakter",
      categoryLabel: "Karakter",
      tagline: `Profil, statistik kartu, dan informasi karakter ${term}`,
    };
  }
  if (
    t.includes("poppin") ||
    t.includes("afterglow") ||
    t.includes("roselia") ||
    t.includes("pastel") ||
    t.includes("hello") ||
    t.includes("morfonica") ||
    t.includes("raise") ||
    t.includes("mygo") ||
    t.includes("mujica")
  ) {
    return {
      category: "band",
      categoryLabel: "Band",
      tagline: `Informasi personil, diskografi, dan biodata band ${term}`,
    };
  }
  if (t.includes("kirafes") || t.includes("gacha") || t.includes("stars") || t.includes("spark")) {
    return {
      category: "gacha",
      categoryLabel: "Jadwal Gacha",
      tagline: `Jadwal penarikan banner, target spark, dan informasi gacha`,
    };
  }
  return {
    category: "tips",
    categoryLabel: "Tips Gameplay",
    tagline: `Panduan strategi, build tim sinergi, dan tips ritme lagu`,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "10", 10)));
    const trendingOnly = searchParams.get("trending") === "true" || searchParams.get("trendingOnly") === "true";
    const categoryFilter = searchParams.get("category");

    const baseQuery = db.select().from(popularSearches);

    let rows = trendingOnly
      ? await baseQuery.where(eq(popularSearches.isTrending, 1)).orderBy(desc(popularSearches.hitCount)).limit(limit).all()
      : await baseQuery.orderBy(desc(popularSearches.hitCount)).limit(limit).all();

    const formatted = rows.map((r, idx) => {
      const meta = resolveCategoryForTerm(r.term);
      const isHot = r.isTrending === 1 || r.hitCount >= 50;

      return {
        rank: idx + 1,
        id: r.id,
        term: r.term,
        hitCount: r.hitCount,
        searchCount: `${(r.hitCount * 15).toLocaleString("id-ID")} dicari`,
        isTrending: r.isTrending === 1,
        isHot,
        category: meta.category,
        categoryLabel: meta.categoryLabel,
        tagline: meta.tagline,
        lastSearchedAt: r.lastSearchedAt,
      };
    });

    const filtered = categoryFilter
      ? formatted.filter((item) => item.category === categoryFilter.toLowerCase())
      : formatted;

    return NextResponse.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching popular searches:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar pencarian populer" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const term = body.term || body.query;

    if (!term || typeof term !== "string" || !term.trim()) {
      return NextResponse.json(
        { success: false, error: "Kata kunci (term) wajib diisi." },
        { status: 400 }
      );
    }

    const termTrimmed = term.trim();
    const termSlug = slugifyTag(termTrimmed);
    const id = `pop-${termSlug}`;
    const isTrending = body.isTrending ? 1 : 0;
    const now = new Date().toISOString();

    const existing = await db
      .select()
      .from(popularSearches)
      .where(eq(popularSearches.term, termTrimmed))
      .get();

    if (existing) {
      await db.update(popularSearches)
        .set({
          hitCount: existing.hitCount + 1,
          isTrending: isTrending || existing.isTrending,
          lastSearchedAt: now,
        })
        .where(eq(popularSearches.id, existing.id))
        .run();
    } else {
      await db.insert(popularSearches)
        .values({
          id,
          term: termTrimmed,
          hitCount: 1,
          isTrending,
          lastSearchedAt: now,
        })
        .run();
    }

    const updated = db
      .select()
      .from(popularSearches)
      .where(eq(popularSearches.term, termTrimmed))
      .get();

    return NextResponse.json({
      success: true,
      message: "Kata kunci populer berhasil diperbarui",
      data: updated,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error updating popular search term:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan kata kunci populer" },
      { status: 500 }
    );
  }
}

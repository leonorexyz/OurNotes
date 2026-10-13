import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { searchItems } from "@/db/schema";
import { SEARCH_CATEGORIES } from "@/data/searchData";

export async function GET(request: NextRequest) {
  return handleFilter(request);
}

export async function POST(request: NextRequest) {
  return handleFilter(request);
}

async function handleFilter(request: NextRequest) {
  try {
    let q = "";
    let categories: string[] = [];
    let tags: string[] = [];
    let attribute = "";
    let page = 1;
    let limit = 20;
    let sort = "relevance";

    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      q = (body.q || body.query || "").trim();
      categories = Array.isArray(body.categories)
        ? body.categories.map((c: string) => c.toLowerCase())
        : body.category
        ? [body.category.toLowerCase()]
        : [];
      tags = Array.isArray(body.tags) ? body.tags.map((t: string) => t.toLowerCase()) : [];
      attribute = (body.attribute || "").trim();
      page = Math.max(1, parseInt(body.page || "1", 10));
      limit = Math.max(1, Math.min(100, parseInt(body.limit || "20", 10)));
      sort = body.sort || "relevance";
    } else {
      const searchParams = request.nextUrl.searchParams;
      q = (searchParams.get("q") || searchParams.get("search") || "").trim();
      const catParam = searchParams.get("categories") || searchParams.get("category");
      if (catParam) {
        categories = catParam
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .filter(Boolean);
      }
      const tagsParam = searchParams.get("tags") || searchParams.get("tag");
      if (tagsParam) {
        tags = tagsParam
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
      }
      attribute = (searchParams.get("attribute") || "").trim();
      page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
      sort = searchParams.get("sort") || "relevance";
    }

    const qLower = q.toLowerCase();
    const allItems = await db.select().from(searchItems).all();

    // Calculate baseline counts per category for the current query
    const counts: Record<string, number> = {
      all: 0,
      character: 0,
      band: 0,
      guide: 0,
      blog: 0,
      gacha: 0,
      team: 0,
    };

    let queryMatches = allItems;
    if (qLower.length > 0) {
      queryMatches = allItems.filter((item) => {
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

    counts.all = queryMatches.length;
    for (const item of queryMatches) {
      if (counts[item.category] !== undefined) {
        counts[item.category] += 1;
      }
    }

    // Apply category filter if specified
    let filtered = queryMatches;
    if (categories.length > 0 && !categories.includes("all") && !categories.includes("semua")) {
      filtered = filtered.filter((item) => categories.includes(item.category));
    }

    // Apply attribute filter if specified (e.g. 'Pure', 'Cool', 'Power', 'Happy')
    if (attribute) {
      const attrLower = attribute.toLowerCase();
      filtered = filtered.filter((item) => {
        const itemTags = (item.tags || "").toLowerCase();
        const itemSubtitle = (item.subtitle || "").toLowerCase();
        const itemBadge = (item.badgeText || "").toLowerCase();
        return (
          itemTags.includes(attrLower) ||
          itemSubtitle.includes(attrLower) ||
          itemBadge.includes(attrLower)
        );
      });
    }

    // Apply tags filter if specified
    if (tags.length > 0) {
      filtered = filtered.filter((item) => {
        const itemTags = (item.tags || "").toLowerCase();
        return tags.some((t) => itemTags.includes(t));
      });
    }

    // Scoring
    const scored = filtered.map((item) => {
      let score = item.popularityScore || 0;
      if (qLower.length > 0) {
        const titleLower = item.title.toLowerCase();
        if (titleLower === qLower) score += 200;
        else if (titleLower.startsWith(qLower)) score += 120;
        else if (titleLower.includes(qLower)) score += 80;

        if ((item.tags || "").toLowerCase().includes(qLower)) score += 50;
      }
      return { item, score };
    });

    if (sort === "popular") {
      scored.sort((a, b) => (b.item.popularityScore || 0) - (a.item.popularityScore || 0));
    } else {
      scored.sort((a, b) => b.score - a.score);
    }

    const total = scored.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = scored.slice((page - 1) * limit, page * limit);

    const data = paginated.map(({ item, score }) => {
      let parsedTags: string[] = [];
      try {
        parsedTags = item.tags ? JSON.parse(item.tags) : [];
      } catch {
        parsedTags = [];
      }

      let parsedMetadata: Record<string, any> = {};
      try {
        parsedMetadata = item.metadata ? JSON.parse(item.metadata) : {};
      } catch {
        parsedMetadata = {};
      }

      return {
        id: item.id,
        category: item.category,
        categoryLabel: item.categoryLabel,
        title: item.title,
        subtitle: item.subtitle,
        snippet: item.snippet,
        url: item.url,
        tags: parsedTags,
        badgeText: item.badgeText,
        badgeColor: item.badgeColor,
        metadata: parsedMetadata,
        relevanceScore: score,
      };
    });

    return NextResponse.json({
      success: true,
      query: q,
      filters: {
        categories,
        tags,
        attribute,
      },
      counts,
      total,
      page,
      limit,
      totalPages,
      data,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error filtering search results:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memfilter hasil pencarian" },
      { status: 500 }
    );
  }
}

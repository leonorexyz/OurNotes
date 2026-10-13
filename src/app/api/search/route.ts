import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { searchItems, popularSearches, searchLogs } from "@/db/schema";
import { eq, and, or, like, desc, sql } from "drizzle-orm";
import { slugifyTag } from "@/data/blogData";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = searchParams.get("q") || searchParams.get("search") || "";
    const q = rawQuery.trim();
    const qLower = q.toLowerCase();
    const category = (searchParams.get("category") || "all").toLowerCase();
    const sort = searchParams.get("sort") || "relevance";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

    // Fetch candidate records
    let allCandidates = await db.select().from(searchItems).all();

    // Calculate category counts for the current query before filtering by category
    const categoryCounts: Record<string, number> = {
      all: 0,
      character: 0,
      band: 0,
      guide: 0,
      blog: 0,
      gacha: 0,
      team: 0,
    };

    let matchingCandidates = allCandidates;

    if (q.length > 0) {
      matchingCandidates = allCandidates.filter((item) => {
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

    // Populate category counts
    categoryCounts.all = matchingCandidates.length;
    for (const item of matchingCandidates) {
      if (categoryCounts[item.category] !== undefined) {
        categoryCounts[item.category] += 1;
      }
    }

    // Filter by category if not 'all'
    let filtered = matchingCandidates;
    if (category !== "all" && category !== "semua") {
      filtered = matchingCandidates.filter((item) => item.category === category);
    }

    // Score and rank results
    const scoredResults = filtered.map((item) => {
      let score = item.popularityScore || 0;

      if (q.length > 0) {
        const titleLower = item.title.toLowerCase();
        const subtitleLower = (item.subtitle || "").toLowerCase();
        const snippetLower = item.snippet.toLowerCase();
        const tagsLower = (item.tags || "").toLowerCase();

        // Exact match
        if (titleLower === qLower) {
          score += 200;
        } else if (titleLower.startsWith(qLower)) {
          score += 120;
        } else if (titleLower.includes(qLower)) {
          score += 80;
        }

        if (subtitleLower.includes(qLower)) {
          score += 40;
        }

        if (tagsLower.includes(qLower)) {
          score += 50;
        }

        if (snippetLower.includes(qLower)) {
          score += 20;
        }
      }

      return {
        item,
        score,
      };
    });

    // Sort items
    scoredResults.sort((a, b) => {
      if (sort === "popular") {
        return (b.item.popularityScore || 0) - (a.item.popularityScore || 0);
      }
      if (sort === "latest") {
        return (
          new Date(b.item.createdAt || 0).getTime() -
          new Date(a.item.createdAt || 0).getTime()
        );
      }
      // default: relevance
      return b.score - a.score;
    });

    const total = scoredResults.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = scoredResults.slice((page - 1) * limit, page * limit);

    const formattedData = paginated.map(({ item, score }) => {
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

    // Asynchronously log search and update popular searches if query is non-empty
    if (q.length >= 2) {
      try {
        // Record in searchLogs
        await db.insert(searchLogs)
          .values({
            id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            query: q,
            category,
            resultCount: total,
            userId: null,
          })
          .run();

        // Increment or insert popularSearches
        const termSlug = slugifyTag(q);
        const existingPopular = await db
          .select()
          .from(popularSearches)
          .where(eq(popularSearches.term, q))
          .get();

        if (existingPopular) {
          await db.update(popularSearches)
            .set({
              hitCount: existingPopular.hitCount + 1,
              lastSearchedAt: new Date().toISOString(),
            })
            .where(eq(popularSearches.id, existingPopular.id))
            .run();
        } else {
          await db.insert(popularSearches)
            .values({
              id: `pop-${termSlug}-${Date.now().toString().slice(-4)}`,
              term: q,
              hitCount: 1,
              isTrending: 0,
            })
            .run();
        }
      } catch (logErr) {
        console.warn("Could not log search metric:", logErr);
      }
    }

    return NextResponse.json({
      success: true,
      query: q,
      category,
      total,
      page,
      limit,
      totalPages,
      categoryCounts,
      data: formattedData,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error performing search:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pencarian" },
      { status: 500 }
    );
  }
}

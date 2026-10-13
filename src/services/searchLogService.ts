import { db } from "@/db";
import { searchLogs, popularSearches, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { slugifyTag } from "@/data/blogData";

export interface RecordSearchQueryInput {
  query: string;
  category?: string;
  resultCount?: number;
  userId?: string | null;
}

export interface SearchKeywordAnalytics {
  totalSearches: number;
  uniqueKeywords: number;
  trendingKeywords: number;
  topKeywords: Array<{
    id: string;
    term: string;
    hitCount: number;
    isTrending: boolean;
    lastSearchedAt: string | null;
  }>;
  recentLogs: Array<{
    id: string;
    query: string;
    category: string;
    resultCount: number;
    userId: string | null;
    createdAt: string | null;
  }>;
}

/**
 * Records a search query into searchLogs and updates popularSearches hit counts.
 */
export async function recordSearchQuery(
  input: RecordSearchQueryInput
): Promise<{ success: boolean; logId: string; termId: string }> {
  const queryTrimmed = (input.query || "").trim();
  if (queryTrimmed.length === 0) {
    return { success: false, logId: "", termId: "" };
  }

  const category = input.category || "all";
  const resultCount = typeof input.resultCount === "number" ? input.resultCount : 0;
  const userId = input.userId || null;
  const logId = `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  // 1. Insert into searchLogs
  await db.insert(searchLogs)
    .values({
      id: logId,
      query: queryTrimmed,
      category,
      resultCount,
      userId,
    })
    .run();

  // 2. Upsert into popularSearches
  const termSlug = slugifyTag(queryTrimmed);
  const termId = `pop-${termSlug}`;

  const existingTerm = await db
    .select()
    .from(popularSearches)
    .where(eq(popularSearches.term, queryTrimmed))
    .get();

  if (existingTerm) {
    const newHitCount = existingTerm.hitCount + 1;
    // Mark trending if hit count reaches threshold or was already trending
    const isTrending = newHitCount >= 20 || existingTerm.isTrending === 1 ? 1 : 0;

    await db.update(popularSearches)
      .set({
        hitCount: newHitCount,
        isTrending,
        lastSearchedAt: now,
      })
      .where(eq(popularSearches.id, existingTerm.id))
      .run();
  } else {
    await db.insert(popularSearches)
      .values({
        id: termId,
        term: queryTrimmed,
        hitCount: 1,
        isTrending: 0,
        lastSearchedAt: now,
      })
      .onConflictDoUpdate({
        target: popularSearches.term,
        set: {
          hitCount: sql`${popularSearches.hitCount} + 1`,
          lastSearchedAt: now,
        },
      })
      .run();
  }

  return { success: true, logId, termId };
}

/**
 * Retrieves keyword analytics and search history.
 */
export async function getSearchKeywordAnalytics(limit = 20): Promise<SearchKeywordAnalytics> {
  const topKeywordsRows = await db
    .select()
    .from(popularSearches)
    .orderBy(desc(popularSearches.hitCount))
    .limit(limit)
    .all();

  const recentLogsRows = await db
    .select()
    .from(searchLogs)
    .orderBy(desc(searchLogs.createdAt))
    .limit(limit)
    .all();

  const totalSearchesCount = (await db
    .select({ count: sql<number>`count(*)` })
    .from(searchLogs)
    .get())?.count || 0;

  const uniqueKeywordsCount = (await db
    .select({ count: sql<number>`count(*)` })
    .from(popularSearches)
    .get())?.count || 0;

  const trendingCount = (await db
    .select({ count: sql<number>`count(*)` })
    .from(popularSearches)
    .where(eq(popularSearches.isTrending, 1))
    .get())?.count || 0;

  return {
    totalSearches: totalSearchesCount,
    uniqueKeywords: uniqueKeywordsCount,
    trendingKeywords: trendingCount,
    topKeywords: topKeywordsRows.map((r) => ({
      id: r.id,
      term: r.term,
      hitCount: r.hitCount,
      isTrending: r.isTrending === 1,
      lastSearchedAt: r.lastSearchedAt,
    })),
    recentLogs: recentLogsRows,
  };
}

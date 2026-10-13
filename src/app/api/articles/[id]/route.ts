import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogArticles, blogCategories, blogComments } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;

    const row = db
      .select({
        id: blogArticles.id,
        title: blogArticles.title,
        excerpt: blogArticles.excerpt,
        content: blogArticles.content,
        categoryId: blogArticles.categoryId,
        category: blogArticles.category,
        categoryName: blogCategories.name,
        categoryColor: blogCategories.color,
        categoryIcon: blogCategories.icon,
        authorId: blogArticles.authorId,
        authorName: blogArticles.authorName,
        authorAvatar: blogArticles.authorAvatar,
        authorRole: blogArticles.authorRole,
        authorBadgeColor: blogArticles.authorBadgeColor,
        publishedAt: blogArticles.publishedAt,
        readTime: blogArticles.readTime,
        likes: blogArticles.likes,
        commentsCount: blogArticles.commentsCount,
        views: blogArticles.views,
        isFeatured: blogArticles.isFeatured,
        coverImageBg: blogArticles.coverImageBg,
        tags: blogArticles.tags,
        createdAt: blogArticles.createdAt,
        updatedAt: blogArticles.updatedAt,
      })
      .from(blogArticles)
      .leftJoin(blogCategories, eq(blogArticles.categoryId, blogCategories.id))
      .where(eq(blogArticles.id, articleId))
      .get();

    if (!row) {
      return NextResponse.json(
        { success: false, error: `Artikel dengan id/slug '${articleId}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Increment views count by 1
    const newViews = (row.views || 0) + 1;
    try {
      db.update(blogArticles)
        .set({ views: newViews })
        .where(eq(blogArticles.id, articleId))
        .run();
    } catch (err) {
      console.warn("Could not increment views:", err);
    }

    // Get real-time comment count from blogComments table
    const commentsInDb = db
      .select({ count: sql<number>`count(*)` })
      .from(blogComments)
      .where(eq(blogComments.articleId, articleId))
      .get();

    const actualCommentsCount = commentsInDb?.count || row.commentsCount || 0;

    let parsedTags: string[] = [];
    try {
      parsedTags = row.tags ? JSON.parse(row.tags) : [];
    } catch {
      parsedTags = [];
    }

    // Find related articles (same category or others, max 3)
    const relatedRows = db
      .select({
        id: blogArticles.id,
        title: blogArticles.title,
        excerpt: blogArticles.excerpt,
        category: blogArticles.category,
        categoryId: blogArticles.categoryId,
        publishedAt: blogArticles.publishedAt,
        readTime: blogArticles.readTime,
        coverImageBg: blogArticles.coverImageBg,
        likes: blogArticles.likes,
        commentsCount: blogArticles.commentsCount,
      })
      .from(blogArticles)
      .where(
        and(
          eq(blogArticles.category, row.category),
          ne(blogArticles.id, articleId)
        )
      )
      .limit(3)
      .all();

    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        category: row.category,
        categoryId: row.categoryId,
        categoryDetails: row.categoryName
          ? {
              id: row.categoryId,
              name: row.categoryName,
              color: row.categoryColor,
              icon: row.categoryIcon,
            }
          : null,
        tags: parsedTags,
        author: {
          id: row.authorId,
          name: row.authorName,
          avatar: row.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          role: row.authorRole || "Contributor",
          badgeColor: row.authorBadgeColor || "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        },
        publishedAt: row.publishedAt,
        readTime: row.readTime,
        likes: row.likes,
        commentsCount: actualCommentsCount,
        views: newViews,
        isFeatured: row.isFeatured === 1,
        coverImageBg: row.coverImageBg,
        relatedArticles: relatedRows,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching article detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail artikel" },
      { status: 500 }
    );
  }
}

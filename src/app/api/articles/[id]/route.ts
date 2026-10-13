import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogArticles, blogCategories, blogComments, blogTags, blogArticleTags } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { requireAuth } from "@/services/authService";
import { REVERSE_CATEGORY_MAP, slugifyTag } from "@/data/blogData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;

    const row = await db
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
      await db.update(blogArticles)
        .set({ views: newViews })
        .where(eq(blogArticles.id, articleId))
        .run();
    } catch (err) {
      console.warn("Could not increment views:", err);
    }

    // Get real-time comment count from blogComments table
    const commentsInDb = await db
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
    const relatedRows = await db
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const authResult = await requireAuth(
      request,
      "Autentikasi diperlukan. Silakan masuk untuk mengubah artikel."
    );
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const existingArticle = await db
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.id, articleId))
      .get();

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    if (
      existingArticle.authorId !== currentUser.id &&
      currentUser.role !== "admin"
    ) {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin mengubah artikel ini" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: Partial<typeof blogArticles.$inferInsert> = {
      updatedAt: new Date().toISOString(),
    };

    if (typeof body.title === "string" && body.title.trim()) {
      updateData.title = body.title.trim();
    }
    if (typeof body.excerpt === "string") {
      updateData.excerpt = body.excerpt.trim();
    }
    if (typeof body.content === "string" && body.content.trim()) {
      updateData.content = body.content.trim();
      const wordCount = body.content.trim().split(/\s+/).filter(Boolean).length;
      updateData.readTime = `${Math.max(1, Math.ceil(wordCount / 160))} Menit Baca`;
    }
    if (typeof body.category === "string" && body.category.trim()) {
      updateData.category = body.category.trim();
      updateData.categoryId =
        body.categoryId ||
        (REVERSE_CATEGORY_MAP as any)[body.category] ||
        existingArticle.categoryId;
    }
    if (typeof body.coverImageBg === "string") {
      updateData.coverImageBg = body.coverImageBg;
    }
    if (Array.isArray(body.tags)) {
      updateData.tags = JSON.stringify(body.tags);
    }

    await db.update(blogArticles)
      .set(updateData)
      .where(eq(blogArticles.id, articleId))
      .run();

    const updated = await db
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.id, articleId))
      .get();

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil diperbarui",
      data: updated,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui artikel" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(request, context);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const authResult = await requireAuth(
      request,
      "Autentikasi diperlukan. Silakan masuk untuk menghapus artikel."
    );
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const existingArticle = await db
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.id, articleId))
      .get();

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    if (
      existingArticle.authorId !== currentUser.id &&
      currentUser.role !== "admin"
    ) {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin menghapus artikel ini" },
        { status: 403 }
      );
    }

    // Cascade delete comments and junction tags
    await db.delete(blogComments).where(eq(blogComments.articleId, articleId)).run();
    await db.delete(blogArticleTags).where(eq(blogArticleTags.articleId, articleId)).run();
    await db.delete(blogArticles).where(eq(blogArticles.id, articleId)).run();

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil dihapus",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus artikel" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogComments, blogArticles } from "@/db/schema";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import { requireAuth } from "@/services/authService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const articleIdParam = searchParams.get("articleId");
    const userIdParam = searchParams.get("userId");
    const limitParam = parseInt(searchParams.get("limit") || "20", 10);
    const limit = Math.max(1, Math.min(100, limitParam));

    const conditions = [];
    if (articleIdParam) {
      conditions.push(eq(blogComments.articleId, articleIdParam));
    }
    if (userIdParam) {
      conditions.push(eq(blogComments.userId, userIdParam));
    }

    const rows = db
      .select({
        id: blogComments.id,
        articleId: blogComments.articleId,
        articleTitle: blogArticles.title,
        articleCategory: blogArticles.category,
        userId: blogComments.userId,
        authorName: blogComments.authorName,
        authorAvatar: blogComments.authorAvatar,
        authorBadge: blogComments.authorBadge,
        parentId: blogComments.parentId,
        content: blogComments.content,
        likes: blogComments.likes,
        createdAt: blogComments.createdAt,
      })
      .from(blogComments)
      .leftJoin(blogArticles, eq(blogComments.articleId, blogArticles.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(blogComments.createdAt))
      .limit(limit)
      .all();

    return NextResponse.json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching comments list:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat komentar" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(
      request,
      "Autentikasi diperlukan. Silakan masuk sebagai Produser terlebih dahulu untuk memberikan komentar."
    );
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const body = await request.json();
    const { articleId, content, parentId } = body;

    if (!articleId || typeof articleId !== "string") {
      return NextResponse.json(
        { success: false, error: "ID artikel (articleId) wajib disertakan." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Isi komentar (content) wajib diisi." },
        { status: 400 }
      );
    }

    // Check if article exists
    const article = db
      .select({ id: blogArticles.id, commentsCount: blogArticles.commentsCount })
      .from(blogArticles)
      .where(eq(blogArticles.id, articleId))
      .get();

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    if (parentId) {
      const parent = db
        .select()
        .from(blogComments)
        .where(
          and(
            eq(blogComments.id, parentId),
            eq(blogComments.articleId, articleId)
          )
        )
        .get();

      if (!parent) {
        return NextResponse.json(
          { success: false, error: "Komentar induk tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    const commentId = body.id || `comm-${Date.now()}`;
    const authorBadge =
      currentUser.role === "admin"
        ? "Staff Admin"
        : currentUser.id === "user-producer-1"
        ? "Top Contributor"
        : "Produser";

    db.insert(blogComments)
      .values({
        id: commentId,
        articleId,
        userId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl,
        authorBadge,
        parentId: parentId || null,
        content: content.trim(),
        likes: 0,
      })
      .run();

    // Increment commentsCount in blogArticles
    db.update(blogArticles)
      .set({
        commentsCount: (article.commentsCount || 0) + 1,
      })
      .where(eq(blogArticles.id, articleId))
      .run();

    const created = db
      .select()
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
      .get();

    return NextResponse.json(
      {
        success: true,
        message: parentId
          ? "Balasan komentar berhasil dikirim"
          : "Komentar berhasil ditambahkan",
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan komentar" },
      { status: 500 }
    );
  }
}

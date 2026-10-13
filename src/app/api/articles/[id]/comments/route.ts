import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogComments, blogArticles, users } from "@/db/schema";
import { eq, and, isNull, desc, sql } from "drizzle-orm";
import { getCurrentUser, requireAuth } from "@/services/authService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get("sort") || "newest";

    const allComments = db
      .select({
        id: blogComments.id,
        articleId: blogComments.articleId,
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
      .where(eq(blogComments.articleId, articleId))
      .orderBy(sortBy === "popular" ? desc(blogComments.likes) : desc(blogComments.createdAt))
      .all();

    // Separate top-level comments and replies
    const topLevelComments = allComments.filter((c) => !c.parentId);
    const repliesMap = new Map<string, typeof allComments>();

    for (const comment of allComments) {
      if (comment.parentId) {
        const list = repliesMap.get(comment.parentId) || [];
        list.push(comment);
        repliesMap.set(comment.parentId, list);
      }
    }

    const formattedTree = topLevelComments.map((c) => {
      const replies = (repliesMap.get(c.id) || []).map((r) => ({
        id: r.id,
        authorName: r.authorName,
        authorBadge: r.authorBadge || "Produser",
        createdAt: r.createdAt || "Baru saja",
        content: r.content,
        likes: r.likes,
        hasLiked: false,
      }));

      return {
        id: c.id,
        postId: c.articleId,
        authorName: c.authorName,
        authorBadge: c.authorBadge || "Produser",
        createdAt: c.createdAt || "Baru saja",
        content: c.content,
        likes: c.likes,
        hasLiked: false,
        replies,
      };
    });

    return NextResponse.json({
      success: true,
      total: allComments.length,
      data: formattedTree,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching article comments:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar komentar" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const authResult = await requireAuth(
      request,
      "Autentikasi diperlukan. Silakan masuk sebagai Produser terlebih dahulu untuk memberikan komentar."
    );
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

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

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Isi komentar (content) wajib diisi." },
        { status: 400 }
      );
    }

    if (parentId) {
      const parentComment = db
        .select()
        .from(blogComments)
        .where(
          and(
            eq(blogComments.id, parentId),
            eq(blogComments.articleId, articleId)
          )
        )
        .get();

      if (!parentComment) {
        return NextResponse.json(
          { success: false, error: "Komentar induk yang dibalas tidak ditemukan" },
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
    console.error("Error creating article comment:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan komentar" },
      { status: 500 }
    );
  }
}

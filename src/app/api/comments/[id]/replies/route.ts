import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogComments, blogArticles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/services/authService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;

    const replies = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.parentId, commentId))
      .orderBy(desc(blogComments.createdAt))
      .all();

    return NextResponse.json({
      success: true,
      total: replies.length,
      data: replies,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching comment replies:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat balasan komentar" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: parentId } = await params;
    const authResult = await requireAuth(
      request,
      "Autentikasi diperlukan. Silakan masuk untuk membalas komentar."
    );
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const parent = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.id, parentId))
      .get();

    if (!parent) {
      return NextResponse.json(
        { success: false, error: "Komentar induk tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Isi balasan (content) wajib diisi." },
        { status: 400 }
      );
    }

    const replyId = body.id || `rep-${Date.now()}`;
    const authorBadge =
      currentUser.role === "admin"
        ? "Staff Admin"
        : currentUser.id === "user-producer-1"
        ? "Top Contributor"
        : "Produser";

    await db.insert(blogComments)
      .values({
        id: replyId,
        articleId: parent.articleId,
        userId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl,
        authorBadge,
        parentId,
        content: content.trim(),
        likes: 0,
      })
      .run();

    // Increment commentsCount in blogArticles
    const article = await db
      .select({ commentsCount: blogArticles.commentsCount })
      .from(blogArticles)
      .where(eq(blogArticles.id, parent.articleId))
      .get();

    if (article) {
      await db.update(blogArticles)
        .set({
          commentsCount: (article.commentsCount || 0) + 1,
        })
        .where(eq(blogArticles.id, parent.articleId))
        .run();
    }

    const created = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.id, replyId))
      .get();

    return NextResponse.json(
      {
        success: true,
        message: "Balasan berhasil dikirim",
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error creating comment reply:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim balasan komentar" },
      { status: 500 }
    );
  }
}

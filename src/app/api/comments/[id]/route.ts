import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogComments, blogArticles } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { requireAuth } from "@/services/authService";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;
    const authResult = await requireAuth(
      request,
      "Autentikasi diperlukan. Silakan masuk untuk menghapus komentar."
    );
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    const comment = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
      .get();

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Komentar tidak ditemukan" },
        { status: 404 }
      );
    }

    if (comment.userId !== currentUser.id && currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin menghapus komentar ini" },
        { status: 403 }
      );
    }

    // Delete comment and its replies
    await db.delete(blogComments)
      .where(
        or(
          eq(blogComments.id, commentId),
          eq(blogComments.parentId, commentId)
        )
      )
      .run();

    // Decrement commentsCount on the article
    const article = await db
      .select({ commentsCount: blogArticles.commentsCount })
      .from(blogArticles)
      .where(eq(blogArticles.id, comment.articleId))
      .get();

    if (article) {
      await db.update(blogArticles)
        .set({
          commentsCount: Math.max(0, (article.commentsCount || 1) - 1),
        })
        .where(eq(blogArticles.id, comment.articleId))
        .run();
    }

    return NextResponse.json({
      success: true,
      message: "Komentar berhasil dihapus",
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus komentar" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;
    const body = await request.json().catch(() => ({}));

    const comment = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
      .get();

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Komentar tidak ditemukan" },
        { status: 404 }
      );
    }

    // Action: Like toggle or edit content
    if (body.action === "like") {
      const delta = body.increment === false ? -1 : 1;
      const newLikes = Math.max(0, (comment.likes || 0) + delta);
      await db.update(blogComments)
        .set({ likes: newLikes })
        .where(eq(blogComments.id, commentId))
        .run();

      return NextResponse.json({
        success: true,
        likes: newLikes,
      });
    }

    // Edit content requires auth
    const authResult = await requireAuth(request);
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }
    const currentUser = authResult.user;

    if (comment.userId !== currentUser.id && currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin mengubah komentar ini" },
        { status: 403 }
      );
    }

    if (typeof body.content === "string" && body.content.trim()) {
      await db.update(blogComments)
        .set({ content: body.content.trim() })
        .where(eq(blogComments.id, commentId))
        .run();
    }

    const updated = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
      .get();

    return NextResponse.json({
      success: true,
      message: "Komentar berhasil diperbarui",
      data: updated,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui komentar" },
      { status: 500 }
    );
  }
}

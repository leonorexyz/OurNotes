import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogCategories, blogArticles } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categorySlug } = await params;

    const category = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, categorySlug.toLowerCase()))
      .get();

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const articles = await db
      .select()
      .from(blogArticles)
      .where(
        or(
          eq(blogArticles.categoryId, category.id),
          eq(blogArticles.category, category.name)
        )
      )
      .orderBy(desc(blogArticles.createdAt))
      .all();

    const formattedArticles = articles.map((r) => {
      let parsedTags: string[] = [];
      try {
        parsedTags = r.tags ? JSON.parse(r.tags) : [];
      } catch {
        parsedTags = [];
      }

      return {
        id: r.id,
        title: r.title,
        excerpt: r.excerpt,
        category: r.category,
        categoryId: r.categoryId,
        tags: parsedTags,
        author: {
          id: r.authorId,
          name: r.authorName,
          avatar: r.authorAvatar,
          role: r.authorRole,
          badgeColor: r.authorBadgeColor,
        },
        publishedAt: r.publishedAt,
        readTime: r.readTime,
        likes: r.likes,
        commentsCount: r.commentsCount,
        views: r.views,
        coverImageBg: r.coverImageBg,
      };
    });

    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        articleCount: articles.length,
      },
      totalArticles: articles.length,
      articles: formattedArticles,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching category detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail kategori" },
      { status: 500 }
    );
  }
}

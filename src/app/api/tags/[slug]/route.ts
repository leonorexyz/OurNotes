import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogTags, blogArticleTags, blogArticles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tagRecord = await db
      .select()
      .from(blogTags)
      .where(eq(blogTags.slug, slug.toLowerCase()))
      .get();

    if (!tagRecord) {
      return NextResponse.json(
        { success: false, error: "Tag tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get articles with this tag
    const taggedArticles = await db
      .select({
        id: blogArticles.id,
        title: blogArticles.title,
        excerpt: blogArticles.excerpt,
        category: blogArticles.category,
        categoryId: blogArticles.categoryId,
        authorName: blogArticles.authorName,
        authorAvatar: blogArticles.authorAvatar,
        publishedAt: blogArticles.publishedAt,
        readTime: blogArticles.readTime,
        likes: blogArticles.likes,
        commentsCount: blogArticles.commentsCount,
        views: blogArticles.views,
        coverImageBg: blogArticles.coverImageBg,
        tags: blogArticles.tags,
      })
      .from(blogArticleTags)
      .innerJoin(blogArticles, eq(blogArticleTags.articleId, blogArticles.id))
      .where(eq(blogArticleTags.tagId, tagRecord.slug))
      .orderBy(desc(blogArticles.createdAt))
      .all();

    const formattedArticles = taggedArticles.map((r) => {
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
          name: r.authorName,
          avatar: r.authorAvatar,
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
      tag: {
        id: tagRecord.id,
        name: tagRecord.name,
        slug: tagRecord.slug,
        articleCount: formattedArticles.length,
      },
      totalArticles: formattedArticles.length,
      articles: formattedArticles,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching tag detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail tag" },
      { status: 500 }
    );
  }
}

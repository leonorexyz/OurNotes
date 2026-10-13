import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogArticles, blogCategories, blogArticleTags, blogTags } from "@/db/schema";
import { eq, and, or, like, desc, asc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");
    const searchParam = searchParams.get("search") || searchParams.get("q");
    const featuredParam = searchParams.get("featured");
    const authorParam = searchParams.get("author");
    const sortParam = searchParams.get("sort") || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

    const conditions = [];

    // Filter by category (by categoryId slug or direct category name)
    if (categoryParam && categoryParam !== "all" && categoryParam !== "semua") {
      conditions.push(
        or(
          eq(blogArticles.categoryId, categoryParam.toLowerCase()),
          like(blogArticles.category, `%${categoryParam}%`)
        )
      );
    }

    // Filter by featured
    if (featuredParam === "true" || featuredParam === "1") {
      conditions.push(eq(blogArticles.isFeatured, 1));
    }

    // Filter by author
    if (authorParam) {
      conditions.push(
        or(
          eq(blogArticles.authorId, authorParam),
          like(blogArticles.authorName, `%${authorParam}%`)
        )
      );
    }

    // Filter by search query
    if (searchParam && searchParam.trim()) {
      const q = `%${searchParam.trim()}%`;
      conditions.push(
        or(
          like(blogArticles.title, q),
          like(blogArticles.excerpt, q),
          like(blogArticles.content, q),
          like(blogArticles.tags, q),
          like(blogArticles.authorName, q)
        )
      );
    }

    // Base query
    const baseQuery = db
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
      .leftJoin(blogCategories, eq(blogArticles.categoryId, blogCategories.id));

    let rows =
      conditions.length > 0
        ? baseQuery.where(and(...conditions)).all()
        : baseQuery.all();

    // Filter by tag if requested
    if (tagParam && tagParam.trim()) {
      const tagLower = tagParam.trim().toLowerCase();
      rows = rows.filter((r) => {
        try {
          const tagsList: string[] = r.tags ? JSON.parse(r.tags) : [];
          return tagsList.some(
            (t) =>
              t.toLowerCase() === tagLower ||
              t.toLowerCase().replace(/[^a-z0-9]+/g, "-") === tagLower
          );
        } catch {
          return false;
        }
      });
    }

    // Sorting
    rows.sort((a, b) => {
      if (sortParam === "popular") {
        return (b.views + b.likes * 5) - (a.views + a.likes * 5);
      }
      if (sortParam === "comments") {
        return b.commentsCount - a.commentsCount;
      }
      if (sortParam === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      // default: latest
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    const total = rows.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = rows.slice((page - 1) * limit, page * limit);

    const formattedArticles = paginated.map((r) => {
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
        content: r.content,
        category: r.category,
        categoryId: r.categoryId,
        categoryDetails: r.categoryName
          ? {
              id: r.categoryId,
              name: r.categoryName,
              color: r.categoryColor,
              icon: r.categoryIcon,
            }
          : null,
        tags: parsedTags,
        author: {
          id: r.authorId,
          name: r.authorName,
          avatar: r.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          role: r.authorRole || "Contributor",
          badgeColor: r.authorBadgeColor || "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        },
        publishedAt: r.publishedAt,
        readTime: r.readTime,
        likes: r.likes,
        commentsCount: r.commentsCount,
        views: r.views,
        isFeatured: r.isFeatured === 1,
        coverImageBg: r.coverImageBg,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages,
      data: formattedArticles,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar artikel blog" },
      { status: 500 }
    );
  }
}

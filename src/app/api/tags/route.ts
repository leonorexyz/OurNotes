import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogTags, blogArticleTags, blogArticles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { slugifyTag } from "@/data/blogData";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get("sort") || "count"; // 'count' | 'name'

    const allTags = db.select().from(blogTags).all();

    // Count usage from blogArticleTags junction table
    const junctionCounts = db
      .select({
        tagId: blogArticleTags.tagId,
        count: sql<number>`count(*)`,
      })
      .from(blogArticleTags)
      .groupBy(blogArticleTags.tagId)
      .all();

    const countMap = new Map<string, number>();
    for (const j of junctionCounts) {
      if (j.tagId) {
        countMap.set(j.tagId, Number(j.count));
      }
    }

    const data = allTags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: countMap.get(t.slug) || countMap.get(t.id) || 0,
      createdAt: t.createdAt,
    }));

    if (sort === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      data.sort((a, b) => b.count - a.count);
    }

    return NextResponse.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar tag blog" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama tag (name) wajib diisi." },
        { status: 400 }
      );
    }

    const resolvedSlug = slug || slugifyTag(name);

    const existing = db
      .select()
      .from(blogTags)
      .where(eq(blogTags.slug, resolvedSlug))
      .get();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Tag sudah ada",
        data: existing,
      });
    }

    db.insert(blogTags)
      .values({
        id: resolvedSlug,
        name: name.trim(),
        slug: resolvedSlug,
      })
      .run();

    const created = db
      .select()
      .from(blogTags)
      .where(eq(blogTags.slug, resolvedSlug))
      .get();

    return NextResponse.json(
      {
        success: true,
        message: "Tag berhasil ditambahkan",
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat tag blog" },
      { status: 500 }
    );
  }
}

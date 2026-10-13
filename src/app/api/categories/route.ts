import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogCategories, blogArticles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireAuth } from "@/services/authService";

export async function GET(request: NextRequest) {
  try {
    const categoriesList = await db.select().from(blogCategories).all();

    // Calculate article counts per category
    const articleCounts = await db
      .select({
        categoryId: blogArticles.categoryId,
        count: sql<number>`count(*)`,
      })
      .from(blogArticles)
      .groupBy(blogArticles.categoryId)
      .all();

    const countMap = new Map<string, number>();
    for (const ac of articleCounts) {
      if (ac.categoryId) {
        countMap.set(ac.categoryId, Number(ac.count));
      }
    }

    const data = categoriesList.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description || "",
      icon: c.icon || "BookOpen",
      color: c.color || "blue",
      articleCount: countMap.get(c.id) || 0,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat kategori blog" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(
      request,
      "Autentikasi diperlukan untuk menambahkan kategori."
    );
    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const body = await request.json();
    const { name, id, description, icon, color } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama kategori (name) wajib diisi." },
        { status: 400 }
      );
    }

    const slug =
      id ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const existing = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, slug))
      .get();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Kategori dengan ID/slug ini sudah ada." },
        { status: 409 }
      );
    }

    await db.insert(blogCategories)
      .values({
        id: slug,
        name: name.trim(),
        description: description ? description.trim() : null,
        icon: icon || "BookOpen",
        color: color || "blue",
      })
      .run();

    const created = db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, slug))
      .get();

    return NextResponse.json(
      {
        success: true,
        message: "Kategori berhasil ditambahkan",
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat kategori blog" },
      { status: 500 }
    );
  }
}

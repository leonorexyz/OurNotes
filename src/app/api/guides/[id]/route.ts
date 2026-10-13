import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { guides } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = db.select().from(guides).where(eq(guides.id, id)).get();

    if (!item) {
      return NextResponse.json(
        { success: false, error: `Panduan dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching guide by ID:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail panduan" },
      { status: 500 }
    );
  }
}

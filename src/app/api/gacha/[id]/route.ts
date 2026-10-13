import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gachas, gachaReminders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const row = await db.select().from(gachas).where(eq(gachas.id, id)).get();

    if (!row) {
      return NextResponse.json(
        { success: false, error: `Banner gacha dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Fetch related reminders count for this banner
    const reminders = await db
      .select()
      .from(gachaReminders)
      .where(eq(gachaReminders.gachaId, id))
      .all();

    const formatted = {
      ...row,
      isRecommended: Boolean(row.isRecommended),
      featuredCharacters: row.featuredCharacters ? JSON.parse(row.featuredCharacters) : [],
      pickupRates: row.pickupRates ? JSON.parse(row.pickupRates) : null,
      pitySystem: row.pitySystem ? JSON.parse(row.pitySystem) : null,
      cost: row.cost ? JSON.parse(row.cost) : null,
      tags: row.tags ? JSON.parse(row.tags) : [],
      remindersCount: reminders.length,
    };

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Gagal mengambil detail gacha:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses permintaan detail gacha" },
      { status: 500 }
    );
  }
}

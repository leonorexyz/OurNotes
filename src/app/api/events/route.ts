import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status");

    let rows;
    if (statusParam && statusParam !== "all") {
      rows = db.select().from(events).where(eq(events.status, statusParam)).all();
    } else {
      rows = db.select().from(events).orderBy(desc(events.startAt)).all();
    }

    const formattedEvents = rows.map((ev) => ({
      id: ev.id,
      name: ev.name,
      type: ev.type,
      status: ev.status,
      startAt: ev.startAt,
      endAt: ev.endAt,
      featuredAttribute: ev.featuredAttribute,
      description: ev.description,
      featuredCharacters: ev.featuredCharacters ? JSON.parse(ev.featuredCharacters) : [],
      pointRewards: ev.pointRewards ? JSON.parse(ev.pointRewards) : [],
      tierRankingRewards: ev.tierRankingRewards ? JSON.parse(ev.tierRankingRewards) : [],
      badgeShopHighlights: ev.badgeShopHighlights ? JSON.parse(ev.badgeShopHighlights) : [],
    }));

    return NextResponse.json({
      success: true,
      total: formattedEvents.length,
      data: formattedEvents,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data event" },
      { status: 500 }
    );
  }
}

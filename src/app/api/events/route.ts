import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, gachas } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status");

    const query = db
      .select({
        event: events,
        gacha: gachas,
      })
      .from(events)
      .leftJoin(gachas, eq(events.relatedGachaId, gachas.id))
      .orderBy(desc(events.startAt));

    const rows = await query.all();

    let filteredRows = rows;
    if (statusParam && statusParam !== "all") {
      filteredRows = rows.filter((r) => r.event.status.toLowerCase().includes(statusParam.toLowerCase()));
    }

    const formattedEvents = filteredRows.map(({ event: ev, gacha: g }) => ({
      id: ev.id,
      name: ev.name,
      type: ev.type,
      status: ev.status,
      startAt: ev.startAt,
      endAt: ev.endAt,
      featuredAttribute: ev.featuredAttribute,
      description: ev.description,
      relatedGachaId: ev.relatedGachaId,
      relatedGacha: g
        ? {
            id: g.id,
            title: g.title,
            category: g.category,
            status: g.status,
            bannerImageBg: g.bannerImageBg,
          }
        : null,
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

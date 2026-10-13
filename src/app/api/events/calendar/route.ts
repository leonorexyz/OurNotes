import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, gachas } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get("month"); // e.g. "2026-10" or "10"
    const statusParam = searchParams.get("status");
    const typeParam = searchParams.get("type");

    // Query events with left join to gachas
    const rows = db
      .select({
        event: events,
        gacha: gachas,
      })
      .from(events)
      .leftJoin(gachas, eq(events.relatedGachaId, gachas.id))
      .orderBy(desc(events.startAt))
      .all();

    let calendarItems = rows.map(({ event: ev, gacha: g }) => {
      // Calculate duration & timing
      const start = new Date(ev.startAt).getTime();
      const end = new Date(ev.endAt).getTime();
      const now = new Date("2026-10-13T20:00:00+07:00").getTime(); // fixed or dynamic anchor

      const durationHours = Math.max(0, Math.round((end - start) / (1000 * 60 * 60)));
      const durationDays = Math.round(durationHours / 24);

      let timelineStatus: "Berjalan" | "Mendatang" | "Berakhir" = "Berjalan";
      if (now < start) {
        timelineStatus = "Mendatang";
      } else if (now > end) {
        timelineStatus = "Berakhir";
      }

      return {
        id: ev.id,
        name: ev.name,
        type: ev.type,
        status: ev.status,
        timelineStatus,
        startAt: ev.startAt,
        endAt: ev.endAt,
        durationDays,
        durationHours,
        featuredAttribute: ev.featuredAttribute,
        description: ev.description,
        featuredCharacters: ev.featuredCharacters ? JSON.parse(ev.featuredCharacters) : [],
        pointRewards: ev.pointRewards ? JSON.parse(ev.pointRewards) : [],
        tierRankingRewards: ev.tierRankingRewards ? JSON.parse(ev.tierRankingRewards) : [],
        badgeShopHighlights: ev.badgeShopHighlights ? JSON.parse(ev.badgeShopHighlights) : [],
        relatedGacha: g
          ? {
              id: g.id,
              title: g.title,
              japaneseTitle: g.japaneseTitle,
              category: g.category,
              status: g.status,
              startAt: g.startAt,
              endAt: g.endAt,
              bannerImageBg: g.bannerImageBg,
              featuredCharacters: g.featuredCharacters ? JSON.parse(g.featuredCharacters) : [],
              isRecommended: Boolean(g.isRecommended),
            }
          : null,
      };
    });

    // Apply filtering
    if (statusParam && statusParam !== "all") {
      calendarItems = calendarItems.filter((item) =>
        item.status.toLowerCase().includes(statusParam.toLowerCase())
      );
    }

    if (typeParam && typeParam !== "all") {
      calendarItems = calendarItems.filter((item) =>
        item.type.toLowerCase() === typeParam.toLowerCase()
      );
    }

    if (monthParam) {
      calendarItems = calendarItems.filter(
        (item) => item.startAt.includes(monthParam) || item.endAt.includes(monthParam)
      );
    }

    // Summary statistics
    const stats = {
      total: calendarItems.length,
      activeEvents: calendarItems.filter((i) => i.timelineStatus === "Berjalan").length,
      upcomingEvents: calendarItems.filter((i) => i.timelineStatus === "Mendatang").length,
      endedEvents: calendarItems.filter((i) => i.timelineStatus === "Berakhir").length,
      withRelatedGacha: calendarItems.filter((i) => i.relatedGacha !== null).length,
    };

    return NextResponse.json({
      success: true,
      stats,
      data: calendarItems,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error generating event calendar API:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses data kalender event" },
      { status: 500 }
    );
  }
}

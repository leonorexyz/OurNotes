import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  recommendedTeams,
  recommendedTeamMembers,
  characters,
  bands,
  characterStats,
} from "@/db/schema";
import { eq, and, like, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search") || searchParams.get("q");
    const targetRoomParam = searchParams.get("targetRoom");
    const sortParam = searchParams.get("sort") || "bp-desc";

    const baseQuery = db.select().from(recommendedTeams);
    const conditions = [];

    if (categoryParam && categoryParam !== "all" && categoryParam !== "semua") {
      conditions.push(eq(recommendedTeams.category, categoryParam));
    }
    if (targetRoomParam && targetRoomParam !== "all") {
      conditions.push(like(recommendedTeams.targetRoom, `%${targetRoomParam}%`));
    }
    if (searchParam && searchParam.trim().length > 0) {
      const q = `%${searchParam.trim()}%`;
      conditions.push(
        or(
          like(recommendedTeams.name, q),
          like(recommendedTeams.tagline, q),
          like(recommendedTeams.strategy, q),
          like(recommendedTeams.songSuitability, q)
        )
      );
    }

    const teamRows =
      conditions.length > 0
        ? await baseQuery.where(and(...conditions)).all()
        : await baseQuery.all();

    // Fetch all members for these teams
    const allMembers = await db
      .select({
        id: recommendedTeamMembers.id,
        recommendedTeamId: recommendedTeamMembers.recommendedTeamId,
        slotNumber: recommendedTeamMembers.slotNumber,
        isCenter: recommendedTeamMembers.isCenter,
        characterId: characters.id,
        characterName: characters.name,
        japaneseName: characters.japaneseName,
        bandId: characters.bandId,
        bandName: bands.name,
        bandColor: bands.color,
        role: characters.role,
        attribute: characters.attribute,
        rarity: characters.rarity,
        avatarBg: characters.avatarBg,
        cardTitle: characters.cardTitle,
        cardImage: characters.cardImage,
        statTotal: characterStats.total,
        statPerformance: characterStats.performance,
        statTechnique: characterStats.technique,
        statVisual: characterStats.visual,
        statHp: characterStats.hp,
        skillName: characterStats.skillName,
        skillType: characterStats.skillType,
        skillBoostValue: characterStats.skillBoostValue,
        skillDescription: characterStats.skillDescription,
      })
      .from(recommendedTeamMembers)
      .leftJoin(characters, eq(recommendedTeamMembers.characterId, characters.id))
      .leftJoin(bands, eq(characters.bandId, bands.id))
      .leftJoin(characterStats, eq(characters.id, characterStats.characterId))
      .all();

    // Group members by teamId
    const membersByTeam: Record<string, typeof allMembers> = {};
    for (const m of allMembers) {
      if (!membersByTeam[m.recommendedTeamId]) {
        membersByTeam[m.recommendedTeamId] = [];
      }
      membersByTeam[m.recommendedTeamId].push(m);
    }

    // Build response array
    const data = teamRows.map((team) => {
      const teamMems = (membersByTeam[team.id] || []).sort(
        (a, b) => a.slotNumber - b.slotNumber
      );
      const memberIds = teamMems.map((m) => m.characterId || "");
      const centerMemRow = teamMems.find(
        (m) => m.characterId === team.centerMemberId || m.isCenter === 1
      );
      const centerMember = centerMemRow && centerMemRow.characterId
        ? {
            id: centerMemRow.characterId,
            name: centerMemRow.characterName,
            japaneseName: centerMemRow.japaneseName,
            bandId: centerMemRow.bandId,
            bandName: centerMemRow.bandName,
            bandColor: centerMemRow.bandColor,
            role: centerMemRow.role,
            attribute: centerMemRow.attribute,
            rarity: centerMemRow.rarity,
            avatarBg: centerMemRow.avatarBg,
            cardTitle: centerMemRow.cardTitle,
            cardImage: centerMemRow.cardImage,
            stats: {
              total: centerMemRow.statTotal,
              performance: centerMemRow.statPerformance,
              technique: centerMemRow.statTechnique,
              visual: centerMemRow.statVisual,
              hp: centerMemRow.statHp,
            },
            skill: {
              name: centerMemRow.skillName,
              type: centerMemRow.skillType,
              boostValue: centerMemRow.skillBoostValue,
              description: centerMemRow.skillDescription,
            },
          }
        : null;

      let synergyTags: string[] = [];
      let recommendedAreaItems: string[] = [];
      try {
        synergyTags = team.synergyTags ? JSON.parse(team.synergyTags) : [];
      } catch {
        synergyTags = [];
      }
      try {
        recommendedAreaItems = team.recommendedAreaItems
          ? JSON.parse(team.recommendedAreaItems)
          : [];
      } catch {
        recommendedAreaItems = [];
      }

      return {
        id: team.id,
        name: team.name,
        category: team.category,
        tagline: team.tagline,
        targetRoom: team.targetRoom,
        estimatedBP: team.estimatedBp,
        centerMemberId: team.centerMemberId,
        synergyTags,
        strategy: team.strategy,
        recommendedAreaItems,
        songSuitability: team.songSuitability,
        memberIds,
        members: teamMems.map((m) => ({
          slotNumber: m.slotNumber,
          isCenter: m.isCenter === 1,
          character: m.characterId
            ? {
                id: m.characterId,
                name: m.characterName,
                japaneseName: m.japaneseName,
                bandId: m.bandId,
                bandName: m.bandName,
                bandColor: m.bandColor,
                role: m.role,
                attribute: m.attribute,
                rarity: m.rarity,
                avatarBg: m.avatarBg,
                cardTitle: m.cardTitle,
                cardImage: m.cardImage,
                stats: {
                  total: m.statTotal,
                  performance: m.statPerformance,
                  technique: m.statTechnique,
                  visual: m.statVisual,
                  hp: m.statHp,
                },
                skill: {
                  name: m.skillName,
                  type: m.skillType,
                  boostValue: m.skillBoostValue,
                  description: m.skillDescription,
                },
              }
            : null,
        })),
        centerMember,
        createdAt: team.createdAt,
      };
    });

    // Sort teams
    data.sort((a, b) => {
      if (sortParam === "bp-desc") return b.estimatedBP - a.estimatedBP;
      if (sortParam === "bp-asc") return a.estimatedBP - b.estimatedBP;
      if (sortParam === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

    // Counts by category
    const allCategories = await db
      .select({ category: recommendedTeams.category })
      .from(recommendedTeams)
      .all();
    const countsByCategory: Record<string, number> = {};
    for (const c of allCategories) {
      countsByCategory[c.category] = (countsByCategory[c.category] || 0) + 1;
    }

    return NextResponse.json(
      {
        success: true,
        count: data.length,
        total: data.length,
        countsByCategory,
        data,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching recommended teams:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar rekomendasi tim" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      tagline,
      targetRoom,
      estimatedBP,
      centerMemberId,
      synergyTags,
      strategy,
      recommendedAreaItems,
      songSuitability,
      memberIds,
    } = body;

    if (!name || !category || !centerMemberId || !memberIds || !Array.isArray(memberIds)) {
      return NextResponse.json(
        {
          success: false,
          error: "Field name, category, centerMemberId, dan array memberIds (5 anggota) wajib diisi",
        },
        { status: 400 }
      );
    }

    const teamId = body.id || `team-rec-${Date.now()}`;

    await db.insert(recommendedTeams)
      .values({
        id: teamId,
        name,
        category,
        tagline: tagline || "",
        targetRoom: targetRoom || "Regular Room",
        estimatedBp: estimatedBP || 180000,
        centerMemberId,
        synergyTags: JSON.stringify(synergyTags || []),
        strategy: strategy || "",
        recommendedAreaItems: JSON.stringify(recommendedAreaItems || []),
        songSuitability: songSuitability || "",
      })
      .run();

    // Insert members
    for (let idx = 0; idx < memberIds.length; idx++) {
      const memId = memberIds[idx];
      await db.insert(recommendedTeamMembers)
        .values({
          id: `rtm-${teamId}-${idx + 1}`,
          recommendedTeamId: teamId,
          characterId: memId,
          slotNumber: idx + 1,
          isCenter: memId === centerMemberId ? 1 : 0,
        })
        .run();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Rekomendasi tim berhasil ditambahkan",
        id: teamId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating recommended team:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan rekomendasi tim" },
      { status: 500 }
    );
  }
}

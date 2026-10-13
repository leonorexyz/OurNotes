import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  teams,
  teamMembers,
  characters,
  bands,
  characterStats,
} from "@/db/schema";
import { eq, and, like, or, desc, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search") || searchParams.get("q");
    const userIdParam = searchParams.get("userId");
    const sortParam = searchParams.get("sort") || "createdAt-desc";

    const baseQuery = db.select().from(teams);
    const conditions = [];

    if (categoryParam && categoryParam !== "all" && categoryParam !== "semua") {
      conditions.push(eq(teams.category, categoryParam));
    }
    if (userIdParam) {
      conditions.push(eq(teams.userId, userIdParam));
    }
    if (searchParam && searchParam.trim().length > 0) {
      const q = `%${searchParam.trim()}%`;
      conditions.push(
        or(
          like(teams.name, q),
          like(teams.notes, q),
          like(teams.category, q)
        )
      );
    }

    const teamRows =
      conditions.length > 0
        ? baseQuery.where(and(...conditions)).all()
        : baseQuery.all();

    // Fetch members with character details
    const allMembers = db
      .select({
        id: teamMembers.id,
        teamId: teamMembers.teamId,
        slotNumber: teamMembers.slotNumber,
        isCenter: teamMembers.isCenter,
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
      .from(teamMembers)
      .leftJoin(characters, eq(teamMembers.characterId, characters.id))
      .leftJoin(bands, eq(characters.bandId, bands.id))
      .leftJoin(characterStats, eq(characters.id, characterStats.characterId))
      .all();

    // Group members by teamId
    const membersByTeam: Record<string, typeof allMembers> = {};
    for (const m of allMembers) {
      if (!membersByTeam[m.teamId]) {
        membersByTeam[m.teamId] = [];
      }
      membersByTeam[m.teamId].push(m);
    }

    const data = teamRows.map((team) => {
      const teamMems = (membersByTeam[team.id] || []).sort(
        (a, b) => a.slotNumber - b.slotNumber
      );
      const memberIds = teamMems.map((m) => m.characterId || "");
      const centerMemRow = teamMems.find(
        (m) => m.characterId === team.centerCharacterId || m.isCenter === 1
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

      return {
        id: team.id,
        name: team.name,
        category: team.category,
        note: team.notes || "",
        notes: team.notes || "",
        userId: team.userId,
        centerMemberId: team.centerCharacterId,
        effectiveBP: team.effectiveBp,
        totalHP: team.totalHp,
        synergyPercent: team.synergyPercent,
        isPublic: team.isPublic === 1,
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
        updatedAt: team.updatedAt,
      };
    });

    data.sort((a, b) => {
      if (sortParam === "bp-desc") return (b.effectiveBP || 0) - (a.effectiveBP || 0);
      if (sortParam === "bp-asc") return (a.effectiveBP || 0) - (b.effectiveBP || 0);
      if (sortParam === "name-asc") return a.name.localeCompare(b.name);
      return 0; // Default created order
    });

    return NextResponse.json({
      success: true,
      count: data.length,
      total: data.length,
      data,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching saved teams:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar tim tersimpan" },
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
      note,
      notes,
      userId,
      memberIds,
      centerMemberId,
      effectiveBP,
      effectiveBp,
      totalHP,
      totalHp,
      synergyPercent,
      isPublic,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama formasi tim wajib diisi" },
        { status: 400 }
      );
    }

    if (!memberIds || !Array.isArray(memberIds)) {
      return NextResponse.json(
        { success: false, error: "Daftar ID anggota tim (memberIds) wajib diisi" },
        { status: 400 }
      );
    }

    const teamId = body.id || `team-${Date.now()}`;
    const resolvedNotes = (notes || note || "").trim();
    const resolvedCenterId = centerMemberId || memberIds[2] || memberIds[0] || null;
    const resolvedEffectiveBP = effectiveBP || effectiveBp || 0;
    const resolvedTotalHP = totalHP || totalHp || 5000;
    const resolvedSynergy = synergyPercent || 0;
    const resolvedIsPublic = isPublic === false || isPublic === 0 ? 0 : 1;

    db.insert(teams)
      .values({
        id: teamId,
        name: name.trim(),
        category: category || "Score Attack",
        notes: resolvedNotes,
        userId: userId || null,
        centerCharacterId: resolvedCenterId,
        effectiveBp: resolvedEffectiveBP,
        totalHp: resolvedTotalHP,
        synergyPercent: resolvedSynergy,
        isPublic: resolvedIsPublic,
      })
      .run();

    // Insert slot members
    memberIds.forEach((charId: string, idx: number) => {
      if (!charId) return;
      db.insert(teamMembers)
        .values({
          id: `tm-${teamId}-${idx + 1}`,
          teamId,
          characterId: charId,
          slotNumber: idx + 1,
          isCenter: charId === resolvedCenterId ? 1 : 0,
        })
        .run();
    });

    return NextResponse.json(
      {
        success: true,
        message: `Formasi tim '${name}' berhasil disimpan`,
        data: {
          id: teamId,
          name: name.trim(),
          category: category || "Score Attack",
          notes: resolvedNotes,
          centerMemberId: resolvedCenterId,
          memberIds,
          effectiveBP: resolvedEffectiveBP,
          totalHP: resolvedTotalHP,
          synergyPercent: resolvedSynergy,
          isPublic: resolvedIsPublic === 1,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving team:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan formasi tim ke database" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  recommendedTeams,
  recommendedTeamMembers,
  characters,
  bands,
  characterStats,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const team = await db
      .select()
      .from(recommendedTeams)
      .where(eq(recommendedTeams.id, id))
      .get();

    if (!team) {
      return NextResponse.json(
        { success: false, error: `Rekomendasi tim dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    const members = (await db
      .select({
        id: recommendedTeamMembers.id,
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
      .where(eq(recommendedTeamMembers.recommendedTeamId, id))
      .all())
      .sort((a, b) => a.slotNumber - b.slotNumber);

    const memberIds = members.map((m) => m.characterId || "");
    const centerMemRow = members.find(
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

    return NextResponse.json({
      success: true,
      data: {
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
        members: members.map((m) => ({
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
      },
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching recommended team detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail rekomendasi tim" },
      { status: 500 }
    );
  }
}

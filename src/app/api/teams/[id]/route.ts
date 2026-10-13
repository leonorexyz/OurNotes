import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  teams,
  teamMembers,
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

    const team = db
      .select()
      .from(teams)
      .where(eq(teams.id, id))
      .get();

    if (!team) {
      return NextResponse.json(
        { success: false, error: `Formasi tim dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    const members = db
      .select({
        id: teamMembers.id,
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
      .where(eq(teamMembers.teamId, id))
      .all()
      .sort((a, b) => a.slotNumber - b.slotNumber);

    const memberIds = members.map((m) => m.characterId || "");
    const centerMemRow = members.find(
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

    return NextResponse.json({
      success: true,
      data: {
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
        updatedAt: team.updatedAt,
      },
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching single team:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data formasi tim" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db
      .select()
      .from(teams)
      .where(eq(teams.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Formasi tim dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    const {
      name,
      category,
      note,
      notes,
      memberIds,
      centerMemberId,
      effectiveBP,
      effectiveBp,
      totalHP,
      totalHp,
      synergyPercent,
      isPublic,
    } = body;

    const resolvedName = name !== undefined ? String(name).trim() : existing.name;
    const resolvedCategory = category !== undefined ? category : existing.category;
    const resolvedNotes =
      notes !== undefined
        ? notes
        : note !== undefined
        ? note
        : existing.notes;
    const resolvedEffectiveBP =
      effectiveBP !== undefined
        ? effectiveBP
        : effectiveBp !== undefined
        ? effectiveBp
        : existing.effectiveBp;
    const resolvedTotalHP =
      totalHP !== undefined
        ? totalHP
        : totalHp !== undefined
        ? totalHp
        : existing.totalHp;
    const resolvedSynergy =
      synergyPercent !== undefined ? synergyPercent : existing.synergyPercent;
    const resolvedCenterId =
      centerMemberId !== undefined ? centerMemberId : existing.centerCharacterId;
    const resolvedIsPublic =
      isPublic !== undefined
        ? isPublic === false || isPublic === 0
          ? 0
          : 1
        : existing.isPublic;

    db.update(teams)
      .set({
        name: resolvedName,
        category: resolvedCategory,
        notes: resolvedNotes,
        centerCharacterId: resolvedCenterId,
        effectiveBp: resolvedEffectiveBP,
        totalHp: resolvedTotalHP,
        synergyPercent: resolvedSynergy,
        isPublic: resolvedIsPublic,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(teams.id, id))
      .run();

    // If new memberIds provided, update slots
    if (memberIds && Array.isArray(memberIds)) {
      // Clear existing members
      db.delete(teamMembers).where(eq(teamMembers.teamId, id)).run();

      // Insert new members
      memberIds.forEach((charId: string, idx: number) => {
        if (!charId) return;
        db.insert(teamMembers)
          .values({
            id: `tm-${id}-${idx + 1}-${Date.now()}`,
            teamId: id,
            characterId: charId,
            slotNumber: idx + 1,
            isCenter: charId === resolvedCenterId ? 1 : 0,
          })
          .run();
      });
    }

    return NextResponse.json({
      success: true,
      message: `Formasi tim '${resolvedName}' berhasil diperbarui`,
      data: {
        id,
        name: resolvedName,
        category: resolvedCategory,
        notes: resolvedNotes,
        centerMemberId: resolvedCenterId,
        effectiveBP: resolvedEffectiveBP,
        totalHP: resolvedTotalHP,
        synergyPercent: resolvedSynergy,
        isPublic: resolvedIsPublic === 1,
      },
    });
  } catch (error: any) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data formasi tim" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = db
      .select()
      .from(teams)
      .where(eq(teams.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Formasi tim dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Delete members then team
    db.delete(teamMembers).where(eq(teamMembers.teamId, id)).run();
    db.delete(teams).where(eq(teams.id, id)).run();

    return NextResponse.json({
      success: true,
      message: `Formasi tim '${existing.name}' berhasil dihapus`,
      id,
    });
  } catch (error: any) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus formasi tim dari database" },
      { status: 500 }
    );
  }
}

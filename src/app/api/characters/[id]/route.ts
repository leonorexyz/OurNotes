import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { characters, bands, characterStats } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const charRow = db
      .select({
        id: characters.id,
        name: characters.name,
        japaneseName: characters.japaneseName,
        romaji: characters.romaji,
        bandId: characters.bandId,
        bandName: bands.name,
        bandColor: bands.color,
        bandConcept: bands.concept,
        bandDescription: bands.description,
        role: characters.role,
        instrument: characters.instrument,
        attribute: characters.attribute,
        rarity: characters.rarity,
        birthday: characters.birthday,
        seiyuu: characters.seiyuu,
        bio: characters.bio,
        avatarBg: characters.avatarBg,
        cardTitle: characters.cardTitle,
        cardImage: characters.cardImage,
        stats: {
          total: characterStats.total,
          performance: characterStats.performance,
          technique: characterStats.technique,
          visual: characterStats.visual,
          hp: characterStats.hp,
        },
        skill: {
          name: characterStats.skillName,
          type: characterStats.skillType,
          boostValue: characterStats.skillBoostValue,
          description: characterStats.skillDescription,
          duration: characterStats.skillDuration,
        },
      })
      .from(characters)
      .leftJoin(bands, eq(characters.bandId, bands.id))
      .leftJoin(characterStats, eq(characters.id, characterStats.characterId))
      .where(eq(characters.id, id))
      .get();

    if (!charRow) {
      return NextResponse.json(
        { success: false, error: `Karakter dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Fetch fellow band members
    const bandMembers = db
      .select({
        id: characters.id,
        name: characters.name,
        japaneseName: characters.japaneseName,
        role: characters.role,
        attribute: characters.attribute,
        rarity: characters.rarity,
        avatarBg: characters.avatarBg,
      })
      .from(characters)
      .where(eq(characters.bandId, charRow.bandId))
      .all();

    return NextResponse.json({
      success: true,
      data: {
        ...charRow,
        bandMembers,
      },
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching character detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail karakter dari database" },
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

    const existing = db.select().from(characters).where(eq(characters.id, id)).get();
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Karakter dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    const {
      name,
      japaneseName,
      romaji,
      bandId,
      role,
      instrument,
      attribute,
      rarity,
      birthday,
      seiyuu,
      bio,
      avatarBg,
      cardTitle,
      stats,
      skill,
    } = body || {};

    // Update character record
    db.update(characters)
      .set({
        name: name !== undefined ? name : existing.name,
        japaneseName: japaneseName !== undefined ? japaneseName : existing.japaneseName,
        romaji: romaji !== undefined ? romaji : existing.romaji,
        bandId: bandId !== undefined ? bandId : existing.bandId,
        role: role !== undefined ? role : existing.role,
        instrument: instrument !== undefined ? instrument : existing.instrument,
        attribute: attribute !== undefined ? attribute : existing.attribute,
        rarity: rarity !== undefined ? Number(rarity) : existing.rarity,
        birthday: birthday !== undefined ? birthday : existing.birthday,
        seiyuu: seiyuu !== undefined ? seiyuu : existing.seiyuu,
        bio: bio !== undefined ? bio : existing.bio,
        avatarBg: avatarBg !== undefined ? avatarBg : existing.avatarBg,
        cardTitle: cardTitle !== undefined ? cardTitle : existing.cardTitle,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(characters.id, id))
      .run();

    // Update stats record if stats or skill provided
    if (stats || skill) {
      const existingStat = db.select().from(characterStats).where(eq(characterStats.characterId, id)).get();
      if (existingStat) {
        const perf = stats?.performance !== undefined ? Number(stats.performance) : existingStat.performance;
        const tech = stats?.technique !== undefined ? Number(stats.technique) : existingStat.technique;
        const vis = stats?.visual !== undefined ? Number(stats.visual) : existingStat.visual;
        const total = stats?.total !== undefined ? Number(stats.total) : (perf + tech + vis);
        const hp = stats?.hp !== undefined ? Number(stats.hp) : existingStat.hp;

        db.update(characterStats)
          .set({
            total,
            performance: perf,
            technique: tech,
            visual: vis,
            hp,
            skillName: skill?.name !== undefined ? skill.name : existingStat.skillName,
            skillType: skill?.type !== undefined ? skill.type : existingStat.skillType,
            skillBoostValue: skill?.boostValue !== undefined ? skill.boostValue : existingStat.skillBoostValue,
            skillDescription: skill?.description !== undefined ? skill.description : existingStat.skillDescription,
            skillDuration: skill?.duration !== undefined ? Number(skill.duration) : existingStat.skillDuration,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(characterStats.characterId, id))
          .run();
      }
    }

    // Return updated character
    const updated = db
      .select({
        id: characters.id,
        name: characters.name,
        japaneseName: characters.japaneseName,
        bandId: characters.bandId,
        role: characters.role,
        attribute: characters.attribute,
        rarity: characters.rarity,
        stats: {
          total: characterStats.total,
          performance: characterStats.performance,
          technique: characterStats.technique,
          visual: characterStats.visual,
          hp: characterStats.hp,
        },
        skill: {
          name: characterStats.skillName,
          type: characterStats.skillType,
          boostValue: characterStats.skillBoostValue,
          description: characterStats.skillDescription,
        },
      })
      .from(characters)
      .leftJoin(characterStats, eq(characters.id, characterStats.characterId))
      .where(eq(characters.id, id))
      .get();

    return NextResponse.json({
      success: true,
      message: `Karakter '${updated?.name || id}' berhasil diperbarui!`,
      data: updated,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error updating character:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data karakter di database" },
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

    const existing = db.select().from(characters).where(eq(characters.id, id)).get();
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Karakter dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Delete stats first due to foreign key
    db.delete(characterStats).where(eq(characterStats.characterId, id)).run();
    // Delete character
    db.delete(characters).where(eq(characters.id, id)).run();

    return NextResponse.json({
      success: true,
      message: `Karakter '${existing.name}' berhasil dihapus dari database!`,
      deletedId: id,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error deleting character:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data karakter dari database" },
      { status: 500 }
    );
  }
}

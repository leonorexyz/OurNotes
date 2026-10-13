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

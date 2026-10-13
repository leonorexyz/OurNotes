import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bands, characters, characterStats } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bandRow = db.select().from(bands).where(eq(bands.id, id)).get();

    if (!bandRow) {
      return NextResponse.json(
        { success: false, error: `Band dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Fetch all members of this band with stats and skills
    const members = db
      .select({
        id: characters.id,
        name: characters.name,
        japaneseName: characters.japaneseName,
        romaji: characters.romaji,
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
      .leftJoin(characterStats, eq(characters.id, characterStats.characterId))
      .where(eq(characters.bandId, id))
      .all();

    // Calculate band aggregated statistics
    const totalBP = members.reduce((sum, m) => sum + (m.stats?.total || 0), 0);
    const avgBP = members.length > 0 ? Math.round(totalBP / members.length) : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...bandRow,
        membersCount: members.length,
        aggregatedStats: {
          totalBP,
          averageBP: avgBP,
        },
        members,
      },
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching band detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail band dari database" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bands, characters, characterStats } from "@/db/schema";
import { eq, like, or, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchParam = searchParams.get("search") || searchParams.get("q");
    const idParam = searchParams.get("id");

    // If specific ID requested via query parameter
    if (idParam) {
      const bandRow = db.select().from(bands).where(eq(bands.id, idParam)).get();
      if (!bandRow) {
        return NextResponse.json(
          { success: false, error: `Band dengan ID '${idParam}' tidak ditemukan` },
          { status: 404 }
        );
      }

      // Fetch band members with stats
      const members = db
        .select({
          id: characters.id,
          name: characters.name,
          japaneseName: characters.japaneseName,
          role: characters.role,
          instrument: characters.instrument,
          attribute: characters.attribute,
          rarity: characters.rarity,
          bio: characters.bio,
          avatarBg: characters.avatarBg,
          cardTitle: characters.cardTitle,
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
        .where(eq(characters.bandId, idParam))
        .all();

      return NextResponse.json({
        success: true,
        data: {
          ...bandRow,
          members,
        },
      });
    }

    // Query bands with optional search
    const allBands =
      searchParam && searchParam.trim().length > 0
        ? db
            .select()
            .from(bands)
            .where(
              or(
                like(bands.name, `%${searchParam.trim()}%`),
                like(bands.japaneseName, `%${searchParam.trim()}%`),
                like(bands.concept, `%${searchParam.trim()}%`),
                like(bands.description, `%${searchParam.trim()}%`)
              )
            )
            .orderBy(asc(bands.name))
            .all()
        : db.select().from(bands).orderBy(asc(bands.name)).all();

    // Fetch members count and member list for each band
    const allMembers = db
      .select({
        id: characters.id,
        bandId: characters.bandId,
        name: characters.name,
        role: characters.role,
        attribute: characters.attribute,
        avatarBg: characters.avatarBg,
      })
      .from(characters)
      .all();

    const bandsWithMembers = allBands.map((band) => {
      const members = allMembers.filter((m) => m.bandId === band.id);
      return {
        ...band,
        membersCount: members.length || band.memberCount,
        members,
      };
    });

    return NextResponse.json({
      success: true,
      total: bandsWithMembers.length,
      filters: {
        search: searchParam || null,
      },
      data: bandsWithMembers,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching bands:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data band dari database" },
      { status: 500 }
    );
  }
}

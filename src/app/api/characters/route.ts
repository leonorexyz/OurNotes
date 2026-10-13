import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { characters, bands, characterStats } from "@/db/schema";
import { eq, like, or, and, desc, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bandParam = searchParams.get("band") || searchParams.get("bandId");
    const attrParam = searchParams.get("attribute") || searchParams.get("attr");
    const roleParam = searchParams.get("role");
    const rarityParam = searchParams.get("rarity");
    const searchParam = searchParams.get("search") || searchParams.get("q");
    const sortParam = searchParams.get("sort") || "bp-desc";
    const idParam = searchParams.get("id");

    // If specific character ID requested
    if (idParam) {
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
          },
        })
        .from(characters)
        .leftJoin(bands, eq(characters.bandId, bands.id))
        .leftJoin(characterStats, eq(characters.id, characterStats.characterId))
        .where(eq(characters.id, idParam))
        .get();

      if (!charRow) {
        return NextResponse.json(
          { success: false, error: `Karakter dengan ID '${idParam}' tidak ditemukan` },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: charRow });
    }

    // Build filter conditions
    const conditions = [];

    // Filter by band
    if (bandParam && bandParam !== "all" && bandParam !== "semua") {
      conditions.push(eq(characters.bandId, bandParam));
    }

    // Filter by attribute
    if (attrParam && attrParam !== "all" && attrParam !== "semua") {
      conditions.push(eq(characters.attribute, attrParam));
    }

    // Filter by role
    if (roleParam && roleParam !== "all" && roleParam !== "semua") {
      conditions.push(like(characters.role, `%${roleParam}%`));
    }

    // Filter by rarity
    if (rarityParam && rarityParam !== "all") {
      const rarityNum = parseInt(rarityParam, 10);
      if (!isNaN(rarityNum)) {
        conditions.push(eq(characters.rarity, rarityNum));
      }
    }

    // Filter by search query
    if (searchParam && searchParam.trim().length > 0) {
      const q = `%${searchParam.trim()}%`;
      conditions.push(
        or(
          like(characters.name, q),
          like(characters.japaneseName, q),
          like(characters.romaji, q),
          like(characters.role, q),
          like(characters.bio, q),
          like(bands.name, q)
        )
      );
    }

    const orderByClause =
      sortParam === "bp-asc"
        ? asc(characterStats.total)
        : sortParam === "perf-desc"
        ? desc(characterStats.performance)
        : sortParam === "tech-desc"
        ? desc(characterStats.technique)
        : sortParam === "vis-desc"
        ? desc(characterStats.visual)
        : sortParam === "name-asc"
        ? asc(characters.name)
        : sortParam === "rarity-desc"
        ? desc(characters.rarity)
        : desc(characterStats.total);

    const baseQuery = db
      .select({
        id: characters.id,
        name: characters.name,
        japaneseName: characters.japaneseName,
        romaji: characters.romaji,
        bandId: characters.bandId,
        bandName: bands.name,
        bandColor: bands.color,
        bandConcept: bands.concept,
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
        },
      })
      .from(characters)
      .leftJoin(bands, eq(characters.bandId, bands.id))
      .leftJoin(characterStats, eq(characters.id, characterStats.characterId));

    const results =
      conditions.length > 0
        ? baseQuery.where(and(...conditions)).orderBy(orderByClause).all()
        : baseQuery.orderBy(orderByClause).all();

    // Summary counts for filter badges
    const allCharacters = db.select({ bandId: characters.bandId, attribute: characters.attribute }).from(characters).all();
    const countsByBand: Record<string, number> = {};
    const countsByAttr: Record<string, number> = {};

    allCharacters.forEach((c) => {
      countsByBand[c.bandId] = (countsByBand[c.bandId] || 0) + 1;
      countsByAttr[c.attribute] = (countsByAttr[c.attribute] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      total: results.length,
      filters: {
        band: bandParam || "all",
        attribute: attrParam || "all",
        role: roleParam || "all",
        rarity: rarityParam || "all",
        search: searchParam || null,
        sort: sortParam,
      },
      counts: {
        byBand: countsByBand,
        byAttribute: countsByAttr,
      },
      data: results,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data karakter dari database" },
      { status: 500 }
    );
  }
}

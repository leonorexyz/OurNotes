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
    const slotNumber = searchParams.get("slot");
    const isCenterParam = searchParams.get("isCenter") === "true";
    const currentBand = searchParams.get("currentBand");
    const currentAttr = searchParams.get("currentAttr");
    const filterExcluded = searchParams.get("filterExcluded") === "true";

    // Excluded or currently assigned IDs (comma separated or multiple params)
    const excludeRaw = searchParams.get("exclude") || "";
    const excludeIds = new Set(
      excludeRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );

    // Build base query
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

    const conditions = [];

    if (bandParam && bandParam !== "all") {
      conditions.push(eq(characters.bandId, bandParam));
    }
    if (attrParam && attrParam !== "all") {
      conditions.push(eq(characters.attribute, attrParam));
    }
    if (roleParam && roleParam !== "all") {
      conditions.push(like(characters.role, `%${roleParam}%`));
    }
    if (rarityParam && rarityParam !== "all") {
      const rarityNum = parseInt(rarityParam, 10);
      if (!isNaN(rarityNum)) {
        conditions.push(eq(characters.rarity, rarityNum));
      }
    }
    if (searchParam) {
      const queryPattern = `%${searchParam}%`;
      conditions.push(
        or(
          like(characters.name, queryPattern),
          like(characters.japaneseName, queryPattern),
          like(characters.role, queryPattern),
          like(characterStats.skillName, queryPattern)
        )
      );
    }

    let rows = conditions.length > 0
      ? baseQuery.where(and(...conditions)).all()
      : baseQuery.all();

    // Map rows with team slot metadata
    let enriched = rows.map((char) => {
      const isAssigned = excludeIds.has(char.id);
      const matchesBand = currentBand ? char.bandId === currentBand : false;
      const matchesAttr = currentAttr ? char.attribute === currentAttr : false;
      const isLeaderCandidate = char.skill?.type === "Score Up";

      // Synergy score rating for this slot:
      let synergyRating = 0;
      if (matchesBand) synergyRating += 20;
      if (matchesAttr) synergyRating += 20;
      if (isLeaderCandidate && isCenterParam) synergyRating += 30;

      return {
        ...char,
        isAssigned,
        synergyImpact: {
          matchesBand,
          matchesAttr,
          synergyRating,
          isLeaderCandidate,
          bandBonusPercent: matchesBand ? 10 : 0,
          attrBonusPercent: matchesAttr ? 10 : 0,
        },
      };
    });

    // Optionally filter out already assigned characters
    if (filterExcluded) {
      enriched = enriched.filter((c) => !c.isAssigned);
    }

    // Apply sorting
    enriched.sort((a, b) => {
      // Put unassigned first if not filtered
      if (!filterExcluded && a.isAssigned !== b.isAssigned) {
        return a.isAssigned ? 1 : -1;
      }

      if (sortParam === "synergy-desc") {
        return b.synergyImpact.synergyRating - a.synergyImpact.synergyRating;
      }
      if (sortParam === "bp-desc") {
        return (b.stats?.total || 0) - (a.stats?.total || 0);
      }
      if (sortParam === "bp-asc") {
        return (a.stats?.total || 0) - (b.stats?.total || 0);
      }
      if (sortParam === "perf-desc") {
        return (b.stats?.performance || 0) - (a.stats?.performance || 0);
      }
      if (sortParam === "tech-desc") {
        return (b.stats?.technique || 0) - (a.stats?.technique || 0);
      }
      if (sortParam === "vis-desc") {
        return (b.stats?.visual || 0) - (a.stats?.visual || 0);
      }
      if (sortParam === "hp-desc") {
        return (b.stats?.hp || 0) - (a.stats?.hp || 0);
      }
      if (sortParam === "rarity-desc") {
        return (b.rarity || 0) - (a.rarity || 0);
      }
      if (sortParam === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "50", 10));
    const total = enriched.length;
    const startIndex = (page - 1) * limit;
    const paginated = enriched.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        success: true,
        total,
        page,
        limit,
        count: paginated.length,
        slotRequested: slotNumber ? parseInt(slotNumber, 10) : null,
        isCenterRequested: isCenterParam,
        data: paginated,
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
    console.error("Error fetching slot characters:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar karakter untuk slot tim" },
      { status: 500 }
    );
  }
}

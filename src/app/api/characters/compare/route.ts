import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { characters, bands, characterStats } from "@/db/schema";
import { eq, or } from "drizzle-orm";

function fetchCharacterFull(charId: string) {
  return db
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
    .where(eq(characters.id, charId))
    .get();
}

function computeComparison(char1: any, char2: any) {
  const stats1 = char1.stats || { total: 0, performance: 0, technique: 0, visual: 0, hp: 0 };
  const stats2 = char2.stats || { total: 0, performance: 0, technique: 0, visual: 0, hp: 0 };

  const diff = {
    total: stats1.total - stats2.total,
    performance: stats1.performance - stats2.performance,
    technique: stats1.technique - stats2.technique,
    visual: stats1.visual - stats2.visual,
    hp: stats1.hp - stats2.hp,
  };

  const isSameBand = char1.bandId === char2.bandId;
  const isSameAttribute = char1.attribute === char2.attribute;
  const synergyPotential = (isSameBand ? 10 : 0) + (isSameAttribute ? 10 : 0);

  // Win tally
  let char1Wins = 0;
  let char2Wins = 0;
  let ties = 0;

  ["performance", "technique", "visual", "hp"].forEach((key) => {
    const val1 = stats1[key] || 0;
    const val2 = stats2[key] || 0;
    if (val1 > val2) char1Wins++;
    else if (val2 > val1) char2Wins++;
    else ties++;
  });

  const overallWinner =
    stats1.total > stats2.total ? "char1" : stats2.total > stats1.total ? "char2" : "equal";

  let recommendation = "";
  if (isSameBand && isSameAttribute) {
    recommendation = `Kedua karakter memiliki kecocokan sempurna (Satu Band: ${char1.bandName} & Satu Atribut: ${char1.attribute}). Sangat direkomendasikan dipasangkan dalam satu tim untuk bonus sinergi ganda!`;
  } else if (isSameBand) {
    recommendation = `Keduanya berasal dari band yang sama (${char1.bandName}), mengaktifkan bonus sinergi instrumen band studio (+10% hingga +20%).`;
  } else if (isSameAttribute) {
    recommendation = `Keduanya berbagi atribut yang sama (${char1.attribute}), sangat bagus untuk rotasi event live dengan boosted attribute yang relevan.`;
  } else {
    recommendation = `${char1.name} lebih unggul di ${char1Wins > char2Wins ? "lebih banyak parameter stat" : "stat tertentu"}, sedangkan ${char2.name} memiliki kelebihan pada ${char2.role}. Gunakan sesuai kebutuhan formasi event live!`;
  }

  return {
    char1,
    char2,
    difference: diff,
    comparisonSummary: {
      overallWinner,
      char1ParamWins: char1Wins,
      char2ParamWins: char2Wins,
      paramTies: ties,
      isSameBand,
      isSameAttribute,
      synergyPotentialBonus: synergyPotential,
      recommendation,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const char1Id = searchParams.get("char1") || searchParams.get("c1");
    const char2Id = searchParams.get("char2") || searchParams.get("c2");

    if (!char1Id || !char2Id) {
      return NextResponse.json(
        {
          success: false,
          error: "Parameter 'char1' dan 'char2' wajib disertakan. Contoh: /api/characters/compare?char1=char-kasumi-toyama&char2=char-yukina-minato",
        },
        { status: 400 }
      );
    }

    const char1 = fetchCharacterFull(char1Id);
    const char2 = fetchCharacterFull(char2Id);

    if (!char1) {
      return NextResponse.json(
        { success: false, error: `Karakter pertama dengan ID '${char1Id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    if (!char2) {
      return NextResponse.json(
        { success: false, error: `Karakter kedua dengan ID '${char2Id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    const comparison = computeComparison(char1, char2);

    return NextResponse.json({
      success: true,
      data: comparison,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error comparing characters:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses perbandingan karakter" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { char1Id, char2Id } = body || {};

    if (!char1Id || !char2Id) {
      return NextResponse.json(
        { success: false, error: "Field 'char1Id' dan 'char2Id' wajib diisi dalam request body" },
        { status: 400 }
      );
    }

    const char1 = fetchCharacterFull(char1Id);
    const char2 = fetchCharacterFull(char2Id);

    if (!char1 || !char2) {
      return NextResponse.json(
        { success: false, error: "Salah satu atau kedua karakter tidak ditemukan di database" },
        { status: 404 }
      );
    }

    const comparison = computeComparison(char1, char2);

    return NextResponse.json({
      success: true,
      data: comparison,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error in POST compare characters:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses perbandingan karakter" },
      { status: 500 }
    );
  }
}

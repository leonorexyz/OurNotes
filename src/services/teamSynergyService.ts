import { db } from "@/db";
import { characters, bands, characterStats } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { BANDS_DATA } from "@/data/charactersData";

export interface TeamMemberSlot {
  slotNumber: number;
  isCenter: boolean;
  characterId: string | null;
  character?: {
    id: string;
    name: string;
    bandId: string;
    attribute: string;
    stats: {
      total: number;
      performance: number;
      technique: number;
      visual: number;
      hp: number;
    };
    skill: {
      name: string;
      type: string;
      boostValue: string;
    };
  } | null;
}

export interface SynergyCalculationInput {
  slots?: TeamMemberSlot[];
  memberIds?: string[];
  characterIds?: string[];
  centerMemberId?: string;
  centerSlotIndex?: number;
}

export interface TacticalNote {
  type: "positive" | "warning" | "neutral" | "tip";
  text: string;
}

export interface SynergyCalculationResult {
  rawStats: {
    total: number;
    performance: number;
    technique: number;
    visual: number;
    hp: number;
  };
  bandSynergy: {
    counts: Record<string, number>;
    maxCount: number;
    dominantBandId: string | null;
    dominantBandName: string | null;
    bonusPercent: number;
    bonusBP: number;
  };
  attributeSynergy: {
    counts: Record<string, number>;
    maxCount: number;
    dominantAttribute: string | null;
    bonusPercent: number;
    bonusBP: number;
  };
  totalBonusPercent: number;
  effectiveBP: number;
  centerLeader: {
    characterId: string | null;
    name: string | null;
    skillName: string | null;
    skillType: string | null;
    boostValue: string | null;
    isOptimalForFever: boolean;
    note: string;
  } | null;
  synergyScore: number;
  grade: "SS" | "S" | "A" | "B" | "C";
  gradeDescription: string;
  roomQualified: string;
  projectedScoreRange: {
    min: number;
    max: number;
    feverEstimated: number;
  };
  recommendedAreaItems: string[];
  tacticalNotes: TacticalNote[];
}

export function calculateTeamSynergySync(
  resolvedChars: {
    id: string;
    name: string;
    bandId: string;
    attribute: string;
    stats: {
      total: number;
      performance: number;
      technique: number;
      visual: number;
      hp: number;
    };
    skill: {
      name: string;
      type: string;
      boostValue: string;
    };
    isCenter: boolean;
  }[]
): SynergyCalculationResult {
  const activeChars = resolvedChars.filter((c) => Boolean(c && c.id));

  // 1. Raw Stats Accumulation
  const rawStats = activeChars.reduce(
    (acc, c) => ({
      total: acc.total + (c.stats?.total || 0),
      performance: acc.performance + (c.stats?.performance || 0),
      technique: acc.technique + (c.stats?.technique || 0),
      visual: acc.visual + (c.stats?.visual || 0),
      hp: acc.hp + (c.stats?.hp || 0),
    }),
    { total: 0, performance: 0, technique: 0, visual: 0, hp: 0 }
  );

  // 2. Band Synergy
  const bandCounts: Record<string, number> = {};
  activeChars.forEach((c) => {
    if (c.bandId) {
      bandCounts[c.bandId] = (bandCounts[c.bandId] || 0) + 1;
    }
  });

  const maxBandCount = Math.max(0, ...Object.values(bandCounts));
  const dominantBandId =
    Object.keys(bandCounts).find((k) => bandCounts[k] === maxBandCount) || null;
  const dominantBandObj = dominantBandId
    ? BANDS_DATA.find((b) => b.id === dominantBandId)
    : null;
  const dominantBandName = dominantBandObj ? dominantBandObj.name : dominantBandId;

  const bandBonusPercent = maxBandCount === 5 ? 20 : maxBandCount >= 3 ? 10 : 0;
  const bandBonusBP = Math.round((rawStats.total * bandBonusPercent) / 100);

  // 3. Attribute Synergy
  const attrCounts: Record<string, number> = {};
  activeChars.forEach((c) => {
    if (c.attribute) {
      attrCounts[c.attribute] = (attrCounts[c.attribute] || 0) + 1;
    }
  });

  const maxAttrCount = Math.max(0, ...Object.values(attrCounts));
  const dominantAttribute =
    Object.keys(attrCounts).find((k) => attrCounts[k] === maxAttrCount) || null;

  const attrBonusPercent = maxAttrCount === 5 ? 20 : maxAttrCount >= 3 ? 10 : 0;
  const attrBonusBP = Math.round((rawStats.total * attrBonusPercent) / 100);

  // 4. Total Effective BP
  const totalBonusPercent = bandBonusPercent + attrBonusPercent;
  const effectiveBP = Math.round(rawStats.total * (1 + totalBonusPercent / 100));

  // 5. Center Leader Evaluation
  const centerChar = resolvedChars.find((c) => c.isCenter) || null;
  let centerLeader: SynergyCalculationResult["centerLeader"] = null;

  if (centerChar) {
    const isOptimal = centerChar.skill?.type === "Score Up";
    centerLeader = {
      characterId: centerChar.id,
      name: centerChar.name,
      skillName: centerChar.skill?.name || "Skill Pasif",
      skillType: centerChar.skill?.type || "Biasa",
      boostValue: centerChar.skill?.boostValue || "0%",
      isOptimalForFever: isOptimal,
      note: isOptimal
        ? `Skill ${centerChar.skill.type} (${centerChar.skill.boostValue}) aktif saat Fever Time Multi-Live.`
        : `Skill tipe ${centerChar.skill?.type || "Support"} memberikan efek ${centerChar.skill?.name}.`,
    };
  }

  // 6. Tactical Notes & Score Points
  let synergyScore = 0;
  const tacticalNotes: TacticalNote[] = [];

  // Filled slots contribution (up to 40 pts)
  synergyScore += Math.min(5, activeChars.length) * 8;

  // Band synergy points (up to 25 pts)
  if (maxBandCount === 5) {
    synergyScore += 25;
    tacticalNotes.push({
      type: "positive",
      text: `Full 5 Personel ${dominantBandName || "Band"}: Memicu bonus sinergi instrumen band studio maksimal (+20% BP).`,
    });
  } else if (maxBandCount >= 3) {
    synergyScore += 15;
    tacticalNotes.push({
      type: "positive",
      text: `Mayoritas ${maxBandCount} personel dari ${dominantBandName}: Mendapatkan bonus sinergi band +10% BP.`,
    });
    tacticalNotes.push({
      type: "tip",
      text: `Lengkapi ${5 - maxBandCount} personel lagi dari ${dominantBandName} untuk membuka bonus instrumen panggung penuh (+20% BP).`,
    });
  } else if (activeChars.length >= 3) {
    tacticalNotes.push({
      type: "warning",
      text: "Band masih tersebar (kurang dari 3 personel se-band). Sinergi band belum aktif (0% bonus).",
    });
  }

  // Attribute synergy points (up to 25 pts)
  if (maxAttrCount === 5) {
    synergyScore += 25;
    tacticalNotes.push({
      type: "positive",
      text: `Mono-Attribute ${dominantAttribute} Murni (5/5): Formasi sempurna untuk skor event boosted attribute (+20% BP).`,
    });
  } else if (maxAttrCount >= 3) {
    synergyScore += 15;
    tacticalNotes.push({
      type: "positive",
      text: `Mayoritas atribut ${dominantAttribute} (${maxAttrCount}/5): Mendapatkan bonus sinergi atribut +10% BP.`,
    });
    tacticalNotes.push({
      type: "tip",
      text: `Pasang 5 personel dengan atribut ${dominantAttribute} penuh untuk memaksimalkan multiplier event live.`,
    });
  } else if (activeChars.length >= 3) {
    tacticalNotes.push({
      type: "warning",
      text: "Atribut karakter masih heterogen. Sinergi atribut belum aktif (0% bonus).",
    });
  }

  // Center Leader skill evaluation (up to 10 pts)
  if (centerChar) {
    if (centerChar.skill?.type === "Score Up") {
      synergyScore += 10;
      tacticalNotes.push({
        type: "positive",
        text: `Center Slot dipegang oleh ${centerChar.name} dengan skill Score Boost (${centerChar.skill.boostValue}) — pilihan paling ideal untuk Multi-Live Fever.`,
      });
    } else if (centerChar.skill?.type === "Recovery") {
      synergyScore += 7;
      tacticalNotes.push({
        type: "neutral",
        text: `Center Slot memiliki skill Pemulihan Darah (${centerChar.skill.name}) — menjaga kelangsungan hidup di tingkat kesulitan Expert/Special.`,
      });
    } else {
      synergyScore += 8;
      tacticalNotes.push({
        type: "neutral",
        text: `Center Slot memiliki skill ${centerChar.skill?.type || "Dukungan"} (${centerChar.skill?.name}).`,
      });
    }
  } else {
    tacticalNotes.push({
      type: "warning",
      text: "Slot Center masih kosong. Skill Leader tidak aktif!",
    });
  }

  if (rawStats.hp >= 5000) {
    tacticalNotes.push({
      type: "positive",
      text: `Total Life tim ${rawStats.hp.toLocaleString()} HP memberikan batas keamanan tinggi saat bermain Expert/Special.`,
    });
  }

  // 7. Rank Grade
  let grade: "SS" | "S" | "A" | "B" | "C" = "C";
  let gradeDescription = "Perlu perombakan personel untuk mengaktifkan sinergi dasar.";
  if (synergyScore >= 90) {
    grade = "SS";
    gradeDescription = "Formasi Sempurna! Bonus sinergi Mono-Band dan Mono-Attribute aktif maksimal.";
  } else if (synergyScore >= 75) {
    grade = "S";
    gradeDescription = "Formasi Sangat Kuat! Siap bertanding di Multi-Live Room tingkat tinggi.";
  } else if (synergyScore >= 55) {
    grade = "A";
    gradeDescription = "Formasi Solid! Sebagian besar sinergi telah aktif dengan baik.";
  } else if (synergyScore >= 35) {
    grade = "B";
    gradeDescription = "Formasi Cukup! Tambahkan lebih banyak personel dari band atau atribut yang sama.";
  }

  // 8. Room Qualified
  let roomQualified = "Regular Room";
  if (effectiveBP >= 250000) {
    roomQualified = "Master Room (250.000+ BP)";
  } else if (effectiveBP >= 180000) {
    roomQualified = "Grand Room (180.000+ BP)";
  } else if (effectiveBP >= 120000) {
    roomQualified = "Pro Room (120.000+ BP)";
  }

  // 9. Area Item Recommendations
  const recommendedAreaItems: string[] = [];
  if (dominantBandObj) {
    recommendedAreaItems.push(`Studio Instrument ${dominantBandObj.name} (Mic, Guitar, Bass, Drum, Keyboard)`);
    recommendedAreaItems.push(`Poster & Flyer Ryuseido ${dominantBandObj.name}`);
  }
  if (dominantAttribute) {
    recommendedAreaItems.push(`Dekorasi Cafeteria & Kolam Bertema Atribut ${dominantAttribute}`);
  }
  if (recommendedAreaItems.length === 0) {
    recommendedAreaItems.push("Pasang kartu karakter untuk melihat rekomendasi item area studio & kafetaria");
  }

  // 10. Projected Score Range
  const minScore = Math.round(effectiveBP * 5.8);
  const maxScore = Math.round(effectiveBP * 8.4);
  const feverEstimated = Math.round(effectiveBP * 7.1);

  return {
    rawStats,
    bandSynergy: {
      counts: bandCounts,
      maxCount: maxBandCount,
      dominantBandId,
      dominantBandName,
      bonusPercent: bandBonusPercent,
      bonusBP: bandBonusBP,
    },
    attributeSynergy: {
      counts: attrCounts,
      maxCount: maxAttrCount,
      dominantAttribute,
      bonusPercent: attrBonusPercent,
      bonusBP: attrBonusBP,
    },
    totalBonusPercent,
    effectiveBP,
    centerLeader,
    synergyScore,
    grade,
    gradeDescription,
    roomQualified,
    projectedScoreRange: {
      min: minScore,
      max: maxScore,
      feverEstimated,
    },
    recommendedAreaItems,
    tacticalNotes,
  };
}

export async function calculateTeamSynergy(
  input: SynergyCalculationInput
): Promise<SynergyCalculationResult> {
  const memberIds: string[] = [];
  let centerId = input.centerMemberId || null;

  if (input.slots && Array.isArray(input.slots)) {
    input.slots.forEach((s) => {
      const charId = s.characterId || s.character?.id || null;
      if (charId) {
        memberIds.push(charId);
        if (s.isCenter && !centerId) {
          centerId = charId;
        }
      }
    });
  } else if (input.memberIds && Array.isArray(input.memberIds)) {
    memberIds.push(...input.memberIds.filter(Boolean));
  } else if (input.characterIds && Array.isArray(input.characterIds)) {
    memberIds.push(...input.characterIds.filter(Boolean));
  }

  if (!centerId && memberIds.length > 0) {
    // Default slot 3 (index 2) or first
    centerId = memberIds[2] || memberIds[0];
  }

  if (memberIds.length === 0) {
    return calculateTeamSynergySync([]);
  }

  // Fetch character stats from DB
  const charRows = db
    .select({
      id: characters.id,
      name: characters.name,
      bandId: characters.bandId,
      attribute: characters.attribute,
      statTotal: characterStats.total,
      statPerformance: characterStats.performance,
      statTechnique: characterStats.technique,
      statVisual: characterStats.visual,
      statHp: characterStats.hp,
      skillName: characterStats.skillName,
      skillType: characterStats.skillType,
      skillBoostValue: characterStats.skillBoostValue,
    })
    .from(characters)
    .leftJoin(characterStats, eq(characters.id, characterStats.characterId))
    .where(inArray(characters.id, memberIds))
    .all();

  const charsMap = new Map<string, (typeof charRows)[0]>();
  charRows.forEach((r) => charsMap.set(r.id, r));

  const resolved = memberIds.map((id) => {
    const r = charsMap.get(id);
    if (!r) {
      return {
        id,
        name: "Unknown",
        bandId: "",
        attribute: "",
        stats: { total: 0, performance: 0, technique: 0, visual: 0, hp: 1000 },
        skill: { name: "None", type: "None", boostValue: "0%" },
        isCenter: id === centerId,
      };
    }
    return {
      id: r.id,
      name: r.name,
      bandId: r.bandId,
      attribute: r.attribute,
      stats: {
        total: r.statTotal || 30000,
        performance: r.statPerformance || 10000,
        technique: r.statTechnique || 10000,
        visual: r.statVisual || 10000,
        hp: r.statHp || 1000,
      },
      skill: {
        name: r.skillName || "Skill",
        type: r.skillType || "Score Up",
        boostValue: r.skillBoostValue || "100%",
      },
      isCenter: r.id === centerId,
    };
  });

  return calculateTeamSynergySync(resolved);
}

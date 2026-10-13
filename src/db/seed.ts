import { db } from "./index";
import {
  guides,
  events,
  bands,
  characters,
  characterStats,
  recommendedTeams,
  recommendedTeamMembers,
  teams,
  teamMembers,
} from "./schema";
import { runMigrations } from "./migrate";
import { GUIDES_DATA, FAQ_LIST } from "../data/guidesData";
import { BANDS_DATA, CHARACTERS_DATA } from "../data/charactersData";
import { RECOMMENDED_TEAMS } from "../data/recommendedTeamsData";

export async function seedGuides() {
  await runMigrations();

  console.log("Memulai seed konten panduan...");

  // Category mapping
  const categoryMap: Record<string, string> = {
    pemula: "Pemula",
    tips: "Tips",
    event: "Event",
    faq: "FAQ",
  };

  for (const item of GUIDES_DATA) {
    if (item.section === "faq") continue;
    const cat = categoryMap[item.section] || "Pemula";
    db.insert(guides)
      .values({
        id: item.id,
        title: item.title,
        category: cat,
        summary: item.summary,
        readTime: item.readTime,
        difficulty: item.difficulty || "Dasar",
        tags: JSON.stringify(item.tags),
        content: JSON.stringify(item.steps || []),
      })
      .onConflictDoUpdate({
        target: guides.id,
        set: {
          title: item.title,
          category: cat,
          summary: item.summary,
          readTime: item.readTime,
          difficulty: item.difficulty || "Dasar",
          tags: JSON.stringify(item.tags),
          content: JSON.stringify(item.steps || []),
        },
      })
      .run();
  }

  // Seed FAQ items as guides category FAQ
  for (const faq of FAQ_LIST) {
    db.insert(guides)
      .values({
        id: faq.id,
        title: faq.question,
        category: "FAQ",
        summary: faq.category,
        readTime: "1 mnt",
        difficulty: "Dasar",
        tags: JSON.stringify([faq.category, "FAQ"]),
        content: faq.answer,
      })
      .onConflictDoUpdate({
        target: guides.id,
        set: {
          title: faq.question,
          category: "FAQ",
          summary: faq.category,
          content: faq.answer,
        },
      })
      .run();
  }

  // Seed Events table
  const sampleEvents = [
    {
      id: "ev-1",
      name: "Melodi Senja di Panggung Bintang (Twilight Melodies)",
      type: "Marathon",
      status: "Sedang Berlangsung",
      startAt: "2026-10-10 15:00:00",
      endAt: "2026-10-19 20:59:00",
      featuredAttribute: "Cool",
      description: "Event Marathon bertema kolaborasi musik senja. Kumpulkan Event Point dari Solo atau Multi-Live untuk membuka cerita event eksklusif dan menukarkan badge di toko.",
      featuredCharacters: JSON.stringify([
        { name: "Kasumi Toyama", band: "Poppin'Party", bonus: "+50%" },
        { name: "Ran Mitake", band: "Afterglow", bonus: "+50%" },
        { name: "Yukina Minato", band: "Roselia", bonus: "+50%" },
        { name: "Mashiro Kurata", band: "Morfonica", bonus: "+50%" },
        { name: "Tomori Takamatsu", band: "MyGO!!!!!", bonus: "+50%" },
      ]),
      pointRewards: JSON.stringify([
        { points: "20.000 Pts", reward: "50 Stars & 10.000 Koin" },
        { points: "75.000 Pts", reward: "Kostum Panggung 'Twilight Outfit'" },
        { points: "150.000 Pts", reward: "★3 Kasumi [Harmoni Senja] (Eksklusif Event)" },
        { points: "250.000 Pts", reward: "Miracle Crystal x5 & 250 Stars" },
        { points: "350.000 Pts", reward: "Skill Ticket Emas x2" },
        { points: "500.000 Pts", reward: "Rare Stamp Kasumi: 'Ayo Bersinar!'" },
      ]),
      tierRankingRewards: JSON.stringify([
        { rank: "Top 1 - 100", reward: "Gelar Khusus 'Top 100 Legend', 1.000 Stars, 3x Tiket Gacha ★4" },
        { rank: "Top 101 - 1.000", reward: "Gelar 'Top 1.000 Maestro', 750 Stars, 2x Tiket Gacha ★4" },
        { rank: "Top 1.001 - 5.000", reward: "Gelar 'Top 5.000 Performer', 500 Stars, 1x Tiket Gacha ★4" },
      ]),
      badgeShopHighlights: JSON.stringify([
        { item: "★3 Kartu Event Kasumi (Duplikat Skill)", cost: "5.000 Badges" },
        { item: "Miracle Crystal", cost: "3.000 Badges" },
        { item: "Skill Practice Ticket Emas", cost: "2.000 Badges" },
      ]),
    },
    {
      id: "ev-2",
      name: "Pertarungan Ritme: VS Live Neon Beats",
      type: "VS Live",
      status: "Akan Datang",
      startAt: "2026-10-22 15:00:00",
      endAt: "2026-10-30 20:59:00",
      featuredAttribute: "Power",
      description: "Mode duel 5 pemain dengan sistem penilaian skor langsung. Center skill aktif lebih sering dan memberikan bonus poin ekstra berdasarkan posisi peringkat di room.",
      featuredCharacters: JSON.stringify([
        { name: "LAYER (Rei)", band: "RAISE A SUILEN", bonus: "+50%" },
        { name: "Kokoro Tsurumaki", band: "Hello, Happy World!", bonus: "+50%" },
        { name: "Aya Maruyama", band: "Pastel＊Palettes", bonus: "+50%" },
      ]),
      pointRewards: JSON.stringify([
        { points: "150.000 Pts", reward: "★3 LAYER [Bass Tremor] (Eksklusif)" },
        { points: "300.000 Pts", reward: "Special Stamp LAYER 'Showtime!'" },
      ]),
      tierRankingRewards: JSON.stringify([
        { rank: "Top 1 - 500", reward: "Gelar 'VS Master Top 500', 800 Stars" },
      ]),
      badgeShopHighlights: JSON.stringify([
        { item: "Power Shard Kristal x100", cost: "1.500 Badges" },
      ]),
    },
  ];

  for (const ev of sampleEvents) {
    db.insert(events)
      .values(ev)
      .onConflictDoUpdate({
        target: events.id,
        set: ev,
      })
      .run();
  }

  // Seed Bands table
  console.log("Memulai seed data band...");
  for (const band of BANDS_DATA) {
    db.insert(bands)
      .values({
        id: band.id,
        name: band.name,
        japaneseName: band.japaneseName,
        concept: band.theme,
        description: band.description,
        color: band.color,
        gradient: band.theme,
        formedYear: "2026",
        memberCount: band.membersCount,
      })
      .onConflictDoUpdate({
        target: bands.id,
        set: {
          name: band.name,
          japaneseName: band.japaneseName,
          concept: band.theme,
          description: band.description,
          color: band.color,
          gradient: band.theme,
          memberCount: band.membersCount,
        },
      })
      .run();
  }

  // Seed Characters and CharacterStats tables
  console.log("Memulai seed data karakter dan statistik...");
  for (const char of CHARACTERS_DATA) {
    db.insert(characters)
      .values({
        id: char.id,
        bandId: char.bandId,
        name: char.name,
        japaneseName: char.japaneseName,
        romaji: char.name,
        role: char.role,
        instrument: char.role,
        attribute: char.attribute,
        rarity: char.rarity,
        birthday: "1 Januari",
        seiyuu: "Cast Resmi",
        bio: char.bio,
        avatarBg: char.avatarBg,
        cardTitle: `[Harmoni Bintang] ${char.name}`,
      })
      .onConflictDoUpdate({
        target: characters.id,
        set: {
          bandId: char.bandId,
          name: char.name,
          japaneseName: char.japaneseName,
          romaji: char.name,
          role: char.role,
          instrument: char.role,
          attribute: char.attribute,
          rarity: char.rarity,
          bio: char.bio,
          avatarBg: char.avatarBg,
        },
      })
      .run();

    db.insert(characterStats)
      .values({
        id: `stat-${char.id}`,
        characterId: char.id,
        total: char.stats.total,
        performance: char.stats.performance,
        technique: char.stats.technique,
        visual: char.stats.visual,
        hp: char.stats.hp,
        skillName: char.skill.name,
        skillType: char.skill.type,
        skillBoostValue: char.skill.boostValue,
        skillDescription: char.skill.description,
        skillDuration: 7,
      })
      .onConflictDoUpdate({
        target: characterStats.id,
        set: {
          total: char.stats.total,
          performance: char.stats.performance,
          technique: char.stats.technique,
          visual: char.stats.visual,
          hp: char.stats.hp,
          skillName: char.skill.name,
          skillType: char.skill.type,
          skillBoostValue: char.skill.boostValue,
          skillDescription: char.skill.description,
          skillDuration: 7,
        },
      })
      .run();
  }

  // Seed Recommended Teams & Members
  console.log("Memulai seed rekomendasi tim & anggotanya...");
  for (const team of RECOMMENDED_TEAMS) {
    db.insert(recommendedTeams)
      .values({
        id: team.id,
        name: team.name,
        category: team.category,
        tagline: team.tagline,
        targetRoom: team.targetRoom,
        estimatedBp: team.estimatedBP,
        centerMemberId: team.centerMemberId,
        synergyTags: JSON.stringify(team.synergyTags),
        strategy: team.strategy,
        recommendedAreaItems: JSON.stringify(team.recommendedAreaItems),
        songSuitability: team.songSuitability,
      })
      .onConflictDoUpdate({
        target: recommendedTeams.id,
        set: {
          name: team.name,
          category: team.category,
          tagline: team.tagline,
          targetRoom: team.targetRoom,
          estimatedBp: team.estimatedBP,
          centerMemberId: team.centerMemberId,
          synergyTags: JSON.stringify(team.synergyTags),
          strategy: team.strategy,
          recommendedAreaItems: JSON.stringify(team.recommendedAreaItems),
          songSuitability: team.songSuitability,
        },
      })
      .run();

    // Seed members for this team
    team.memberIds.forEach((memberId, idx) => {
      db.insert(recommendedTeamMembers)
        .values({
          id: `rtm-${team.id}-${idx + 1}`,
          recommendedTeamId: team.id,
          characterId: memberId,
          slotNumber: idx + 1,
          isCenter: memberId === team.centerMemberId ? 1 : 0,
        })
        .onConflictDoUpdate({
          target: recommendedTeamMembers.id,
          set: {
            characterId: memberId,
            slotNumber: idx + 1,
            isCenter: memberId === team.centerMemberId ? 1 : 0,
          },
        })
        .run();
    });
  }

  // Seed Sample User Saved Team
  console.log("Memulai seed sample tim tersimpan...");
  const sampleSavedTeam = {
    id: "saved-poppin-kirakira",
    name: "Poppin'Party All Stars Pure",
    category: "Mono-Band",
    notes: "Formasi andalan untuk event Pure. Kasumi Center memberikan bonus 110% Score Fever.",
    centerCharacterId: "char-kasumi-toyama",
    effectiveBp: 168480,
    totalHp: 5000,
    synergyPercent: 20,
    isPublic: 1,
    memberIds: [
      "char-ran-mitake",
      "char-saya-yamabuki",
      "char-kasumi-toyama",
      "char-arisa-ichigaya",
      "char-yukina-minato",
    ],
  };

  db.insert(teams)
    .values({
      id: sampleSavedTeam.id,
      name: sampleSavedTeam.name,
      category: sampleSavedTeam.category,
      notes: sampleSavedTeam.notes,
      centerCharacterId: sampleSavedTeam.centerCharacterId,
      effectiveBp: sampleSavedTeam.effectiveBp,
      totalHp: sampleSavedTeam.totalHp,
      synergyPercent: sampleSavedTeam.synergyPercent,
      isPublic: sampleSavedTeam.isPublic,
    })
    .onConflictDoUpdate({
      target: teams.id,
      set: {
        name: sampleSavedTeam.name,
        category: sampleSavedTeam.category,
        notes: sampleSavedTeam.notes,
        centerCharacterId: sampleSavedTeam.centerCharacterId,
        effectiveBp: sampleSavedTeam.effectiveBp,
        totalHp: sampleSavedTeam.totalHp,
        synergyPercent: sampleSavedTeam.synergyPercent,
        isPublic: sampleSavedTeam.isPublic,
      },
    })
    .run();

  sampleSavedTeam.memberIds.forEach((memId, idx) => {
    db.insert(teamMembers)
      .values({
        id: `tm-${sampleSavedTeam.id}-${idx + 1}`,
        teamId: sampleSavedTeam.id,
        characterId: memId,
        slotNumber: idx + 1,
        isCenter: memId === sampleSavedTeam.centerCharacterId ? 1 : 0,
      })
      .onConflictDoUpdate({
        target: teamMembers.id,
        set: {
          characterId: memId,
          slotNumber: idx + 1,
          isCenter: memId === sampleSavedTeam.centerCharacterId ? 1 : 0,
        },
      })
      .run();
  });

  const guideCount = db.select().from(guides).all().length;
  const eventCount = db.select().from(events).all().length;
  const bandCount = db.select().from(bands).all().length;
  const charCount = db.select().from(characters).all().length;
  const statCount = db.select().from(characterStats).all().length;
  const recTeamCount = db.select().from(recommendedTeams).all().length;
  const savedTeamCount = db.select().from(teams).all().length;

  console.log(
    `✓ Seed database berhasil!\n` +
      `  • Panduan: ${guideCount}\n` +
      `  • Event: ${eventCount}\n` +
      `  • Band: ${bandCount}\n` +
      `  • Karakter: ${charCount}\n` +
      `  • Statistik: ${statCount}\n` +
      `  • Rekomendasi Tim: ${recTeamCount}\n` +
      `  • Tim Tersimpan: ${savedTeamCount}`
  );
}

if (require.main === module) {
  seedGuides().catch((err) => {
    console.error("Gagal melakukan seed:", err);
    process.exit(1);
  });
}

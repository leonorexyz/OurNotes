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
  users,
  gachas,
  gachaReminders,
  blogCategories,
  blogTags,
  blogArticles,
  blogArticleTags,
  blogComments,
} from "./schema";
import { runMigrations } from "./migrate";
import { GUIDES_DATA, FAQ_LIST } from "../data/guidesData";
import { BANDS_DATA, CHARACTERS_DATA } from "../data/charactersData";
import { RECOMMENDED_TEAMS } from "../data/recommendedTeamsData";
import { GACHA_BANNERS_DATA } from "../data/gachaData";
import {
  BLOG_POSTS_DATA,
  REVERSE_CATEGORY_MAP,
  getAllUniqueTags,
  slugifyTag,
} from "../data/blogData";

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

  // Seed Gachas first so events can reference relatedGachaId
  console.log("Memulai seed jadwal gacha dan banner...");
  for (const banner of GACHA_BANNERS_DATA) {
    db.insert(gachas)
      .values({
        id: banner.id,
        title: banner.title,
        japaneseTitle: banner.japaneseTitle || null,
        category: banner.category,
        status: banner.status,
        startAt: banner.startAt,
        endAt: banner.endAt,
        bannerImageBg: banner.bannerImageBg,
        featuredCharacters: JSON.stringify(banner.featuredCharacters),
        pickupRates: JSON.stringify(banner.pickupRates),
        pitySystem: JSON.stringify(banner.pitySystem),
        cost: JSON.stringify(banner.cost),
        description: banner.description,
        isRecommended: banner.isRecommended ? 1 : 0,
        tags: JSON.stringify(banner.tags),
      })
      .onConflictDoUpdate({
        target: gachas.id,
        set: {
          title: banner.title,
          japaneseTitle: banner.japaneseTitle || null,
          category: banner.category,
          status: banner.status,
          startAt: banner.startAt,
          endAt: banner.endAt,
          bannerImageBg: banner.bannerImageBg,
          featuredCharacters: JSON.stringify(banner.featuredCharacters),
          pickupRates: JSON.stringify(banner.pickupRates),
          pitySystem: JSON.stringify(banner.pitySystem),
          cost: JSON.stringify(banner.cost),
          description: banner.description,
          isRecommended: banner.isRecommended ? 1 : 0,
          tags: JSON.stringify(banner.tags),
        },
      })
      .run();
  }

  // Seed Events table (linked with gachas via relatedGachaId)
  console.log("Memulai seed jadwal event dan turnamen...");
  const sampleEvents = [
    {
      id: "ev-1",
      name: "Melodi Senja di Panggung Bintang (Twilight Melodies)",
      type: "Marathon",
      status: "Sedang Berlangsung",
      startAt: "2026-10-10 15:00:00",
      endAt: "2026-10-19 20:59:00",
      featuredAttribute: "Cool",
      relatedGachaId: "gacha-kirafes-vol1",
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
      relatedGachaId: "gacha-event-neon-beats",
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
    {
      id: "ev-3",
      name: "Nocturne Topeng Sandiwara Ave Mujica",
      type: "Live Goals",
      status: "Akan Datang",
      startAt: "2026-10-25 15:00:00",
      endAt: "2026-11-05 20:59:00",
      featuredAttribute: "Cool",
      relatedGachaId: "gacha-upcoming-ave-mujica",
      description: "Selesaikan serangkaian target lagu tingkat kesulitan Expert untuk mengungkap rahasia panggung Ave Mujica.",
      featuredCharacters: JSON.stringify([
        { name: "Uika Misumi (Doloris)", band: "Ave Mujica", bonus: "+50%" },
        { name: "Sayo Hikawa", band: "Roselia", bonus: "+50%" },
      ]),
      pointRewards: JSON.stringify([
        { points: "200.000 Pts", reward: "★3 Uika Misumi [Persona]" },
        { points: "400.000 Pts", reward: "Gelar 'Masquerade Invitee'" },
      ]),
      tierRankingRewards: JSON.stringify([
        { rank: "Top 1 - 100", reward: "1.000 Stars & Tiket Gacha ★4" },
      ]),
      badgeShopHighlights: JSON.stringify([
        { item: "Cool Shard x150", cost: "1.800 Badges" },
      ]),
    },
    {
      id: "ev-4",
      name: "Pesta Pantai & Ombak Tropis Musim Panas",
      type: "Marathon",
      status: "Selesai",
      startAt: "2026-09-15 15:00:00",
      endAt: "2026-09-30 20:59:00",
      featuredAttribute: "Pure",
      relatedGachaId: "gacha-expired-summer-splash",
      description: "Liburan musim panas penuh keceriaan bersama personil Pastel＊Palettes dan Hello, Happy World!.",
      featuredCharacters: JSON.stringify([
        { name: "Aya Maruyama", band: "Pastel＊Palettes", bonus: "+50%" },
        { name: "Kokoro Tsurumaki", band: "Hello, Happy World!", bonus: "+50%" },
      ]),
      pointRewards: JSON.stringify([
        { points: "150.000 Pts", reward: "★3 Aya Maruyama [Ombak Tropis]" },
      ]),
      tierRankingRewards: JSON.stringify([
        { rank: "Top 1 - 500", reward: "Gelar 'Summer Pioneer', 750 Stars" },
      ]),
      badgeShopHighlights: JSON.stringify([
        { item: "Tropical Float Badge", cost: "2.500 Badges" },
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

  // Seed Users table
  console.log("Memulai seed pengguna akun produser...");
  const sampleUsers = [
    {
      id: "user-producer-1",
      name: "Kasumi Producer",
      email: "producer@ournotes.id",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      role: "user",
    },
    {
      id: "user-admin-1",
      name: "CiRCLE Staff Admin",
      email: "admin@ournotes.id",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
      role: "admin",
    },
  ];

  for (const u of sampleUsers) {
    db.insert(users)
      .values(u)
      .onConflictDoUpdate({
        target: users.id,
        set: u,
      })
      .run();
  }

  // Seed Sample User Saved Team
  console.log("Memulai seed sample tim tersimpan...");
  const sampleSavedTeam = {
    id: "saved-poppin-kirakira",
    userId: "user-producer-1",
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
      userId: sampleSavedTeam.userId,
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
        userId: sampleSavedTeam.userId,
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

  // Seed sample reminder
  db.insert(gachaReminders)
    .values({
      id: "reminder-sample-1",
      userId: "user-producer-1",
      gachaId: "gacha-kirafes-vol1",
      targetSpark: 300,
      savedStars: 42500,
      notifyAt: "2026-10-19T12:00:00+09:00",
      note: "Pastikan spark Kasumi Kirafes sebelum banner berakhir!",
      isNotified: 0,
    })
    .onConflictDoUpdate({
      target: gachaReminders.id,
      set: {
        targetSpark: 300,
        savedStars: 42500,
        notifyAt: "2026-10-19T12:00:00+09:00",
        note: "Pastikan spark Kasumi Kirafes sebelum banner berakhir!",
      },
    })
    .run();

  // Seed Blog Categories
  console.log("Memulai seed kategori blog...");
  const blogCategoryItems = [
    {
      id: "tips-gameplay",
      name: "Tips & Gameplay",
      description: "Panduan kecepatan note, kalibrasi timing, dan strategi meraih All Perfect.",
      icon: "Gamepad2",
      color: "blue",
    },
    {
      id: "meta-tim",
      name: "Meta & Tim",
      description: "Formasi komposisi kartu, sinergi atribut, dan upgrade area studio Ryuseido.",
      icon: "Users",
      color: "emerald",
    },
    {
      id: "lore-karakter",
      name: "Lore & Karakter",
      description: "Evolusi musik, kisah masa lalu band, dan cerita mendalam di balik panggung.",
      icon: "BookOpen",
      color: "purple",
    },
    {
      id: "gacha-stars",
      name: "Gacha & Stars",
      description: "Strategi hemat Stars, simulasi spark, dan jadwal festival Kirafes/DoriFes.",
      icon: "Sparkles",
      color: "amber",
    },
    {
      id: "event-skor",
      name: "Event & Skor",
      description: "Mekanik event Marathon, VS Live, dan kalkulasi efisiensi konsumsi Live Boost.",
      icon: "Trophy",
      color: "rose",
    },
  ];

  for (const cat of blogCategoryItems) {
    db.insert(blogCategories)
      .values(cat)
      .onConflictDoUpdate({
        target: blogCategories.id,
        set: {
          name: cat.name,
          description: cat.description,
          icon: cat.icon,
          color: cat.color,
        },
      })
      .run();
  }

  // Seed Blog Tags
  console.log("Memulai seed tag blog...");
  const masterBlogTags = [
    // Difficulties & Rhythm
    "Expert",
    "Special",
    "Hard",
    "All Perfect",
    "Full Combo",
    "Rhythm",
    "Tips Pemula",
    // Bands
    "Poppin'Party",
    "Afterglow",
    "Pastel*Palettes",
    "Roselia",
    "Hello, Happy World!",
    "Morfonica",
    "RAISE A SUILEN",
    "MyGO!!!!!",
    "Ave Mujica",
    // Attributes
    "Pure",
    "Cool",
    "Power",
    "Happy",
    // Gameplay & Mechanics
    "Team Building",
    "Score Meta",
    "Story Recap",
    "Lore",
    "F2P Guide",
    "Kirafes",
    "DoriFes",
    "Stars Saving",
    "Gacha Spark",
    "Event Guide",
    "Marathon",
    "VS Live",
    "Live Goals",
    "Event Rank",
    "Studio Upgrade",
    "Area Items",
    "CiRCLE",
    "Power Boost",
  ];

  const uniqueTagsMap = new Map<string, { name: string; slug: string }>();

  // Add extracted tags from blog data
  for (const t of getAllUniqueTags()) {
    uniqueTagsMap.set(t.slug, { name: t.name, slug: t.slug });
  }

  // Add master tags
  for (const t of masterBlogTags) {
    const slug = slugifyTag(t);
    if (!uniqueTagsMap.has(slug)) {
      uniqueTagsMap.set(slug, { name: t, slug });
    }
  }

  for (const tag of uniqueTagsMap.values()) {
    db.insert(blogTags)
      .values({
        id: tag.slug,
        name: tag.name,
        slug: tag.slug,
      })
      .onConflictDoUpdate({
        target: blogTags.id,
        set: {
          name: tag.name,
          slug: tag.slug,
        },
      })
      .run();
  }

  // Seed Blog Articles
  console.log("Memulai seed artikel blog...");
  for (const post of BLOG_POSTS_DATA) {
    const categorySlug = REVERSE_CATEGORY_MAP[post.category] || "tips-gameplay";
    db.insert(blogArticles)
      .values({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: categorySlug,
        category: post.category,
        authorId: "user-producer-1",
        authorName: post.author.name,
        authorAvatar: post.author.avatar,
        authorRole: post.author.role,
        authorBadgeColor: post.author.badgeColor,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        likes: post.likes,
        commentsCount: post.commentsCount,
        views: post.views,
        isFeatured: post.isFeatured ? 1 : 0,
        coverImageBg: post.coverImageBg,
        tags: JSON.stringify(post.tags),
      })
      .onConflictDoUpdate({
        target: blogArticles.id,
        set: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          categoryId: categorySlug,
          category: post.category,
          authorName: post.author.name,
          authorAvatar: post.author.avatar,
          authorRole: post.author.role,
          authorBadgeColor: post.author.badgeColor,
          publishedAt: post.publishedAt,
          readTime: post.readTime,
          likes: post.likes,
          commentsCount: post.commentsCount,
          views: post.views,
          isFeatured: post.isFeatured ? 1 : 0,
          coverImageBg: post.coverImageBg,
          tags: JSON.stringify(post.tags),
        },
      })
      .run();

    // Seed junction tags
    for (const tagName of post.tags) {
      const tagSlug = slugifyTag(tagName);
      const junctionId = `at-${post.id}-${tagSlug}`;
      db.insert(blogArticleTags)
        .values({
          id: junctionId,
          articleId: post.id,
          tagId: tagSlug,
        })
        .onConflictDoUpdate({
          target: blogArticleTags.id,
          set: {
            articleId: post.id,
            tagId: tagSlug,
          },
        })
        .run();
    }
  }

  // Seed Sample Comments
  console.log("Memulai seed komentar blog...");
  const sampleComments = [
    {
      id: "comment-1",
      articleId: "tips-all-perfect-lagu-level-27-expert",
      userId: "user-producer-1",
      authorName: "Kasumi Fan #1",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      authorBadge: "Top Contributor",
      parentId: null,
      content: "Tips kalibrasi timing offset sangat membantu! Setelah setel ke +3 di Bluetooth TWS akhirnya tembus Full Combo lagu Teardrops!",
      likes: 12,
    },
    {
      id: "comment-2",
      articleId: "tips-all-perfect-lagu-level-27-expert",
      userId: "user-admin-1",
      authorName: "CiRCLE Staff Admin",
      authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
      authorBadge: "Staff",
      parentId: "comment-1",
      content: "Selamat atas FC Teardrops! Pastikan juga layar bersih dari minyak jari agar flick ganda tidak miss ya.",
      likes: 7,
    },
    {
      id: "comment-3",
      articleId: "analisis-meta-tim-pure-poppin-party",
      userId: "user-producer-1",
      authorName: "Yukina Vocalist",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      authorBadge: "Expert",
      parentId: null,
      content: "Kira-kira kalau Kasumi diganti kartu Kirafes apakah sinergi stat Pure masih optimal untuk event Marathon?",
      likes: 8,
    },
  ];

  for (const c of sampleComments) {
    db.insert(blogComments)
      .values(c)
      .onConflictDoUpdate({
        target: blogComments.id,
        set: {
          content: c.content,
          likes: c.likes,
        },
      })
      .run();
  }

  const guideCount = db.select().from(guides).all().length;
  const eventCount = db.select().from(events).all().length;
  const bandCount = db.select().from(bands).all().length;
  const charCount = db.select().from(characters).all().length;
  const statCount = db.select().from(characterStats).all().length;
  const recTeamCount = db.select().from(recommendedTeams).all().length;
  const savedTeamCount = db.select().from(teams).all().length;
  const gachaCount = db.select().from(gachas).all().length;
  const reminderCount = db.select().from(gachaReminders).all().length;
  const blogCatCount = db.select().from(blogCategories).all().length;
  const blogTagCount = db.select().from(blogTags).all().length;
  const blogPostCount = db.select().from(blogArticles).all().length;
  const blogCommentCount = db.select().from(blogComments).all().length;

  console.log(
    `✓ Seed database berhasil!\n` +
      `  • Panduan: ${guideCount}\n` +
      `  • Event: ${eventCount}\n` +
      `  • Band: ${bandCount}\n` +
      `  • Karakter: ${charCount}\n` +
      `  • Statistik: ${statCount}\n` +
      `  • Rekomendasi Tim: ${recTeamCount}\n` +
      `  • Tim Tersimpan: ${savedTeamCount}\n` +
      `  • Banner Gacha: ${gachaCount}\n` +
      `  • Pengingat Gacha: ${reminderCount}\n` +
      `  • Kategori Blog: ${blogCatCount}\n` +
      `  • Tag Blog: ${blogTagCount}\n` +
      `  • Artikel Blog: ${blogPostCount}\n` +
      `  • Komentar Blog: ${blogCommentCount}`
  );
}

if (require.main === module) {
  seedGuides().catch((err) => {
    console.error("Gagal melakukan seed:", err);
    process.exit(1);
  });
}

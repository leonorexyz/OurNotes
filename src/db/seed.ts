import { db } from "./index";
import { guides, events } from "./schema";
import { runMigrations } from "./migrate";
import { GUIDES_DATA, FAQ_LIST } from "../data/guidesData";

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

  const guideCount = db.select().from(guides).all().length;
  const eventCount = db.select().from(events).all().length;
  console.log(`✓ Seed berhasil! Total panduan: ${guideCount}, Total event: ${eventCount}`);
}

if (require.main === module) {
  seedGuides().catch((err) => {
    console.error("Gagal melakukan seed:", err);
    process.exit(1);
  });
}

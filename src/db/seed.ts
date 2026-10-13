import { db } from "./index";
import { guides } from "./schema";
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

  const count = db.select().from(guides).all().length;
  console.log(`✓ Seed berhasil! Total panduan di database: ${count}`);
}

if (require.main === module) {
  seedGuides().catch((err) => {
    console.error("Gagal melakukan seed:", err);
    process.exit(1);
  });
}

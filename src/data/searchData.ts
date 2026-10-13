import { CHARACTERS_DATA, BANDS_DATA } from "@/data/charactersData";
import { BAND_DETAILS } from "@/data/bandDetailsData";
import { GUIDES_DATA, FAQ_LIST } from "@/data/guidesData";
import { GACHA_BANNERS_DATA } from "@/data/gachaData";
import { BLOG_POSTS_DATA, BlogPost } from "@/data/blogData";
import { RECOMMENDED_TEAMS } from "@/data/recommendedTeamsData";

export type SearchCategory =
  | "all"
  | "character"
  | "band"
  | "guide"
  | "gacha"
  | "blog"
  | "team";

export interface SearchCategoryMeta {
  key: SearchCategory;
  label: string;
  iconName: string;
  color: string;
}

export const SEARCH_CATEGORIES: SearchCategoryMeta[] = [
  { key: "all", label: "Semua", iconName: "Sparkles", color: "from-pink-500 to-indigo-600" },
  { key: "character", label: "Karakter", iconName: "Users", color: "from-pink-500 to-rose-500" },
  { key: "band", label: "Band", iconName: "Music2", color: "from-purple-500 to-indigo-600" },
  { key: "guide", label: "Panduan", iconName: "BookOpen", color: "from-blue-500 to-cyan-500" },
  { key: "blog", label: "Blog & Artikel", iconName: "FileText", color: "from-amber-500 to-orange-500" },
  { key: "gacha", label: "Jadwal Gacha", iconName: "Sparkles", color: "from-violet-500 to-purple-600" },
  { key: "team", label: "Susun Tim", iconName: "Layers", color: "from-emerald-500 to-teal-600" },
];

export const POPULAR_SEARCH_TERMS: string[] = [
  "Kasumi Toyama",
  "Roselia",
  "Tips All Perfect",
  "Kirafes",
  "Afterglow",
  "Yukina Minato",
  "Sinergi Tim",
  "Live Boost Flame",
  "MyGO!!!!!",
  "Panduan Pemula",
  "Morfonica",
  "Pure Poppin'Party",
];

export interface SearchResultItem {
  id: string;
  category: "character" | "band" | "guide" | "gacha" | "blog" | "team";
  categoryLabel: string;
  title: string;
  subtitle: string;
  snippet: string;
  url: string;
  tags: string[];
  badgeText?: string;
  badgeColor?: string;
  metadata?: Record<string, string | number>;
}

export function buildSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  // 1. Karakter
  for (const c of CHARACTERS_DATA) {
    items.push({
      id: `char-${c.id}`,
      category: "character",
      categoryLabel: "Karakter",
      title: `${c.name} (${c.japaneseName})`,
      subtitle: `${c.bandName} • ${c.role} • Atribut ${c.attribute}`,
      snippet: `${c.bio} Skill: [${c.skill.name}] ${c.skill.description} (Boost: ${c.skill.boostValue}).`,
      url: `/karakter/${c.id}`,
      tags: [c.name, c.japaneseName, c.bandName, c.role, c.attribute, `${c.rarity} Star`, "Karakter"],
      badgeText: `${c.rarity}★ ${c.attribute}`,
      badgeColor:
        c.attribute === "Power"
          ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
          : c.attribute === "Pure"
          ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
          : c.attribute === "Cool"
          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      metadata: {
        totalBP: c.stats.total,
        role: c.role,
        band: c.bandName,
      },
    });
  }

  // 2. Band
  for (const b of BANDS_DATA) {
    const detail = BAND_DETAILS[b.id];
    items.push({
      id: `band-${b.id}`,
      category: "band",
      categoryLabel: "Band",
      title: `${b.name} (${b.japaneseName})`,
      subtitle: `${b.membersCount} Personel • ${detail?.genre || "J-Rock"}`,
      snippet: `${b.description} ${detail?.tagline || ""}`,
      url: `/band/${b.id}`,
      tags: [b.name, b.japaneseName, "Band", detail?.leader || "", detail?.genre || ""],
      badgeText: `${b.membersCount} Member`,
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      metadata: {
        leader: detail?.leader || "",
        songsCount: detail?.songs.length || 0,
      },
    });
  }

  // 3. Panduan
  for (const g of GUIDES_DATA) {
    const stepsSummary = g.steps ? g.steps.map((s) => `${s.title}: ${s.desc}`).join(" ") : "";
    items.push({
      id: `guide-${g.id}`,
      category: "guide",
      categoryLabel: "Panduan",
      title: g.title,
      subtitle: `Seksi: Panduan ${g.section.toUpperCase()} • Baca ${g.readTime}`,
      snippet: `${g.summary} ${stepsSummary}`,
      url: `/#${g.id}`,
      tags: [...g.tags, g.section, "Panduan", g.difficulty || ""],
      badgeText: g.difficulty || g.section,
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      metadata: {
        readTime: g.readTime,
        section: g.section,
      },
    });
  }

  // FAQ Items
  for (const faq of FAQ_LIST) {
    items.push({
      id: `faq-${faq.id}`,
      category: "guide",
      categoryLabel: "Panduan FAQ",
      title: faq.question,
      subtitle: `Kategori FAQ: ${faq.category}`,
      snippet: faq.answer,
      url: "/#faq",
      tags: ["FAQ", "Tanya Jawab", faq.category],
      badgeText: "FAQ",
      badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    });
  }

  // 4. Blog Posts
  for (const post of BLOG_POSTS_DATA) {
    items.push({
      id: `blog-${post.id}`,
      category: "blog",
      categoryLabel: "Blog & Tulisan",
      title: post.title,
      subtitle: `Kategori: ${post.category} • Penulis: ${post.author.name} (${post.readTime})`,
      snippet: `${post.excerpt} ${post.content.slice(0, 300)}...`,
      url: `/blog/${post.id}`,
      tags: [...post.tags, post.category, post.author.name, "Blog", "Komunitas"],
      badgeText: post.category,
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      metadata: {
        likes: post.likes,
        comments: post.commentsCount,
      },
    });
  }

  // 5. Jadwal Gacha
  for (const g of GACHA_BANNERS_DATA) {
    const chars = g.featuredCharacters.map((c) => `${c.name} [${c.cardTitle}]`).join(", ");
    items.push({
      id: `gacha-${g.id}`,
      category: "gacha",
      categoryLabel: "Jadwal Gacha",
      title: g.title,
      subtitle: `${g.category} • Status: ${g.status}`,
      snippet: `${g.description} Karakter Rate-Up: ${chars}. Aturan pity: ${g.pitySystem.rules}`,
      url: `/gacha/${g.id}`,
      tags: [...g.tags, g.category, g.status, "Gacha", "Banner"],
      badgeText: g.status,
      badgeColor:
        g.status === "Aktif"
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          : "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
      metadata: {
        category: g.category,
        isRecommended: g.isRecommended ? "Rekomendasi" : "Standar",
      },
    });
  }

  // 6. Susun Tim
  for (const t of RECOMMENDED_TEAMS) {
    items.push({
      id: `team-${t.id}`,
      category: "team",
      categoryLabel: "Susun Tim",
      title: t.name,
      subtitle: `${t.category} • Estimasi BP ${t.estimatedBP.toLocaleString("id-ID")}`,
      snippet: `${t.tagline} Strategi: ${t.strategy} Lagu yang cocok: ${t.songSuitability}`,
      url: "/tim",
      tags: [...t.synergyTags, t.category, t.targetRoom, "Tim", "Susun Tim"],
      badgeText: t.category,
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      metadata: {
        estimatedBP: t.estimatedBP,
        targetRoom: t.targetRoom,
      },
    });
  }

  return items;
}

export function searchIndex(
  query: string,
  category: SearchCategory = "all",
  extraUserArticles: BlogPost[] = []
): SearchResultItem[] {
  let allItems = buildSearchIndex();

  // If user has local articles, add them to index
  if (extraUserArticles && extraUserArticles.length > 0) {
    for (const post of extraUserArticles) {
      allItems.push({
        id: `blog-user-${post.id}`,
        category: "blog",
        categoryLabel: "Blog Pengguna",
        title: post.title,
        subtitle: `Kategori: ${post.category} • Penulis: ${post.author.name} (Lokal)`,
        snippet: `${post.excerpt} ${post.content.slice(0, 300)}...`,
        url: `/blog/${post.id}`,
        tags: [...post.tags, post.category, post.author.name, "Blog"],
        badgeText: "Tulisanmu",
        badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      });
    }
  }

  // Filter category
  if (category !== "all") {
    allItems = allItems.filter((item) => item.category === category);
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return allItems;
  }

  const queryWords = cleanQuery.split(/\s+/).filter(Boolean);

  // Score items
  const scored = allItems
    .map((item) => {
      let score = 0;
      const lowerTitle = item.title.toLowerCase();
      const lowerSubtitle = item.subtitle.toLowerCase();
      const lowerSnippet = item.snippet.toLowerCase();
      const lowerTags = item.tags.map((t) => t.toLowerCase()).join(" ");

      for (const word of queryWords) {
        if (lowerTitle.includes(word)) {
          score += 15;
          if (lowerTitle.startsWith(word)) score += 10;
        }
        if (lowerTags.includes(word)) {
          score += 8;
        }
        if (lowerSubtitle.includes(word)) {
          score += 5;
        }
        if (lowerSnippet.includes(word)) {
          score += 2;
        }
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  return scored;
}

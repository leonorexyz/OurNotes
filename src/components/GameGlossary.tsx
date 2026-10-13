"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  Search,
  ExternalLink,
  Users,
  Layers,
  Sparkles,
  Zap,
  Music,
  ArrowRight,
} from "lucide-react";

export interface TermItem {
  term: string;
  category: "Mekanik" | "Karakter & Band" | "Tim & Stat" | "Gacha & Event";
  definition: string;
  relatedLink: string;
  linkText: string;
  badgeColor: string;
}

export const GAME_TERMS: TermItem[] = [
  {
    term: "Live Boost (Flame)",
    category: "Mekanik",
    definition: "Stamina berbentuk api untuk melipatgandakan reward exp, koin, dan event point hingga 15x. Beregenerasi 1 flame tiap 30 menit.",
    relatedLink: "#tips",
    linkText: "Lihat Tips Efisiensi Flame",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    term: "Band Power",
    category: "Tim & Stat",
    definition: "Total kekuatan gabungan 5 anggota band ditambah bonus area items. Menentukan skor live dasar dan syarat masuk Grand / Master Room.",
    relatedLink: "/tim",
    linkText: "Kalkulator Susun Tim",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    term: "Score Booster",
    category: "Tim & Stat",
    definition: "Skill karakter yang melipatgandakan skor note (misal +115% - 130% jika Perfect). Kartu paling krusial untuk dijadikan Center.",
    relatedLink: "/karakter",
    linkText: "Telusuri Karakter Score Booster",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    term: "Gacha Seal (Pity)",
    category: "Gacha & Event",
    definition: "Sistem jaminan tarik kartu. Kumpulkan 300 Seal (300 tarikan) untuk menukar karakter bintang 5 unggulan secara pasti.",
    relatedLink: "/gacha",
    linkText: "Lihat Jadwal Gacha & Pity",
    badgeColor: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  },
  {
    term: "Area Items (Studio)",
    category: "Mekanik",
    definition: "Dekorasi alat musik dan poster atribut di studio dan kafetaria yang memberi buff stat permanen hingga +35% untuk band tertentu.",
    relatedLink: "#tips",
    linkText: "Tips Investasi Area Items",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    term: "Special Training",
    category: "Karakter & Band",
    definition: "Proses evolusi kartu bintang 4 dan 5 menggunakan Miracle Crystal untuk membuka ilustrasi baru dan menaikkan batas level +10.",
    relatedLink: "/karakter",
    linkText: "Katalog Karakter & Evolusi",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  },
  {
    term: "Fever Time",
    category: "Mekanik",
    definition: "Segmen khusus di Multi-Live yang melipatgandakan skor jika kelima pemain sukses menjaga combo sebelum Fever gauge penuh.",
    relatedLink: "#tips",
    linkText: "Etika & Tips Multi-Live",
    badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  },
  {
    term: "Event Multiplier Bonus",
    category: "Gacha & Event",
    definition: "Tambahan poin event hingga +50% per kartu jika mencocokkan karakter unggulan dan atribut yang sedang aktif di event mingguan.",
    relatedLink: "#event",
    linkText: "Panduan Bonus Event",
    badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
  },
  {
    term: "Poppin'Party",
    category: "Karakter & Band",
    definition: "Band SMA Hanasakigawa beranggotakan Kasumi, Tae, Rimi, Saaya, dan Arisa dengan nuansa musik pop-rock ceria dan penuh semangat.",
    relatedLink: "/karakter?band=poppin-party",
    linkText: "Profil Member Poppin'Party",
    badgeColor: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  },
  {
    term: "Roselia",
    category: "Karakter & Band",
    definition: "Band beraliran gothic rock virtuoso beranggotakan Yukina, Sayo, Lisa, Ako, dan Rinko dengan aransemen musik megah dan teknik tinggi.",
    relatedLink: "/karakter?band=roselia",
    linkText: "Profil Member Roselia",
    badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  },
];

export function GameGlossary() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Mekanik", "Karakter & Band", "Tim & Stat", "Gacha & Event"];

  const filteredTerms = GAME_TERMS.filter((t) => {
    const matchesCat = selectedCategory === "Semua" || t.category === selectedCategory;
    const matchesQuery =
      t.term.toLowerCase().includes(query.toLowerCase()) ||
      t.definition.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300">
              <BookMarked className="h-4 w-4" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-foreground">
              Glosarium Istilah & Tautan Terkait
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Klik istilah untuk membuka halaman profil karakter, susun tim, jadwal gacha, atau tips terkait.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah game..."
            className="w-full rounded-xl border border-input bg-background py-1.5 pl-8 pr-3 text-xs focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              selectedCategory === c
                ? "bg-pink-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTerms.map((t) => (
          <div
            key={t.term}
            className="p-4 rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm font-bold text-foreground">{t.term}</strong>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.badgeColor}`}>
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.definition}
              </p>
            </div>

            <div className="pt-2 border-t border-border/40">
              <Link
                href={t.relatedLink}
                className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors"
              >
                <span>{t.linkText}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import {
  TrendingUp,
  Flame,
  Sparkles,
  Users,
  Music2,
  BookOpen,
  ArrowRight,
  Zap,
} from "lucide-react";

export interface PopularTopic {
  term: string;
  category: "karakter" | "band" | "tips" | "gacha";
  categoryLabel: string;
  searchCount: string;
  isHot?: boolean;
  tagline: string;
}

export const POPULAR_TOPICS: PopularTopic[] = [
  {
    term: "Kasumi Toyama",
    category: "karakter",
    categoryLabel: "Karakter",
    searchCount: "2.4k dicari",
    isHot: true,
    tagline: "Vokalis Poppin'Party pemburu kilauan bintang",
  },
  {
    term: "Yukina Minato",
    category: "karakter",
    categoryLabel: "Karakter",
    searchCount: "2.1k dicari",
    isHot: true,
    tagline: "Leader Roselia dengan vokal sempurna",
  },
  {
    term: "Tips All Perfect",
    category: "tips",
    categoryLabel: "Tips Gameplay",
    searchCount: "1.9k dicari",
    isHot: true,
    tagline: "Panduan offset kecepatan dan akurasi ketukan",
  },
  {
    term: "Roselia",
    category: "band",
    categoryLabel: "Band",
    searchCount: "1.7k dicari",
    isHot: true,
    tagline: "Gothic symphonic rock berstandar profesional",
  },
  {
    term: "Kirafes Twilight",
    category: "gacha",
    categoryLabel: "Jadwal Gacha",
    searchCount: "1.5k dicari",
    isHot: false,
    tagline: "Banner gacha rate ganda kartu bintang 5",
  },
  {
    term: "Sinergi Tim",
    category: "tips",
    categoryLabel: "Susun Tim",
    searchCount: "1.3k dicari",
    isHot: false,
    tagline: "Optimalisasi BP dengan bonus satu band & atribut",
  },
  {
    term: "Poppin'Party",
    category: "band",
    categoryLabel: "Band",
    searchCount: "1.2k dicari",
    isHot: false,
    tagline: "Band pop-rock persahabatan SMA Hanasakigawa",
  },
  {
    term: "Live Boost Flame",
    category: "tips",
    categoryLabel: "Panduan",
    searchCount: "1.1k dicari",
    isHot: false,
    tagline: "Manajemen efisiensi flame stamina untuk event",
  },
  {
    term: "Afterglow",
    category: "band",
    categoryLabel: "Band",
    searchCount: "950 dicari",
    isHot: false,
    tagline: "Lima sahabat masa kecil di bawah langit senja",
  },
  {
    term: "Panduan Pemula",
    category: "tips",
    categoryLabel: "Panduan",
    searchCount: "890 dicari",
    isHot: false,
    tagline: "Langkah awal memulai petualangan Our Notes",
  },
];

interface PopularSearchesListProps {
  onSelectTerm: (term: string) => void;
  className?: string;
  variant?: "chips" | "detailed";
}

export function PopularSearchesList({
  onSelectTerm,
  className = "",
  variant = "detailed",
}: PopularSearchesListProps) {
  if (variant === "chips") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Flame className="h-3.5 w-3.5 text-pink-600 fill-pink-600 animate-pulse" />
          <span>Topik Populer:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {POPULAR_TOPICS.map((topic, idx) => (
            <button
              key={topic.term}
              type="button"
              onClick={() => onSelectTerm(topic.term)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/40 dark:hover:text-pink-300 border border-border hover:border-pink-500/50 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span className="text-[10px] font-black text-pink-600 dark:text-pink-400">
                #{idx + 1}
              </span>
              <span>{topic.term}</span>
              {topic.isHot && (
                <span className="text-[9px] px-1 py-0.2 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300 font-extrabold">
                  HOT
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/70 dark:text-pink-400">
            <Flame className="h-4 w-4 fill-pink-600 dark:fill-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-foreground">
              Pencarian Terpopuler di Komunitas
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Klik topik di bawah ini untuk mencari data secara instan
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-pink-600 hidden sm:inline-block">
          Diperbarui realtime
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {POPULAR_TOPICS.map((topic, index) => {
          return (
            <button
              key={topic.term}
              type="button"
              onClick={() => onSelectTerm(topic.term)}
              className="group text-left flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-pink-500/50 hover:bg-muted/40 hover:shadow-md transition-all cursor-pointer"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-black text-xs ${
                  index < 3
                    ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-sm shadow-pink-500/30"
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {index + 1}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-extrabold text-xs text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors truncate">
                    {topic.term}
                  </span>
                  {topic.isHot && (
                    <span className="shrink-0 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300">
                      HOT
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground truncate leading-tight">
                  {topic.tagline}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground/80 font-medium">
                  <span className="text-pink-600 font-semibold">{topic.categoryLabel}</span>
                  <span>{topic.searchCount}</span>
                </div>
              </div>

              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all self-center shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

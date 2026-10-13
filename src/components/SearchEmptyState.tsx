"use client";

import Link from "next/link";
import {
  SearchX,
  RotateCcw,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Compass,
  ArrowRight,
  BookOpen,
  Users,
  Layers,
  FileText,
} from "lucide-react";
import { POPULAR_SEARCH_TERMS, SearchCategory } from "@/data/searchData";

interface SearchEmptyStateProps {
  query: string;
  selectedCategory: SearchCategory;
  categoryLabel?: string;
  onReset: () => void;
  onSelectSuggestion: (keyword: string) => void;
  onSelectAllCategory?: () => void;
}

export function SearchEmptyState({
  query,
  selectedCategory,
  categoryLabel = "Semua",
  onReset,
  onSelectSuggestion,
  onSelectAllCategory,
}: SearchEmptyStateProps) {
  const isFilteredCategory = selectedCategory !== "all";

  const quickPicks = [
    { label: "Panduan Pemula", href: "/#pemula", icon: BookOpen, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50" },
    { label: "Daftar Karakter", href: "/karakter", icon: Users, color: "text-pink-600 bg-pink-50 dark:bg-pink-950/50" },
    { label: "Susun Tim", href: "/tim", icon: Layers, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
    { label: "Blog & Tips", href: "/blog", icon: FileText, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-card border border-border shadow-lg space-y-8 animate-in fade-in duration-200">
      {/* Icon & Message Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-400 shadow-inner">
          <SearchX className="h-8 w-8" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Tidak Ada Hasil Ditemukan
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Kami tidak menemukan hasil untuk kata kunci{" "}
            <strong className="text-foreground bg-muted px-1.5 py-0.5 rounded-md">
              &quot;{query}&quot;
            </strong>
            {isFilteredCategory && (
              <span>
                {" "}pada kategori filter{" "}
                <strong className="text-pink-600 dark:text-pink-400 font-bold">
                  {categoryLabel}
                </strong>
              </span>
            )}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          {isFilteredCategory && onSelectAllCategory && (
            <button
              type="button"
              onClick={onSelectAllCategory}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Cari di Seluruh Kategori (&quot;Semua&quot;)
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Bersihkan Pencarian</span>
          </button>
        </div>
      </div>

      {/* Search Tips Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>Tips Menemukan Konten yang Kamu Cari:</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1.5 pl-6 list-disc marker:text-pink-600">
          <li>Pastikan ejaan nama karakter atau lagu sudah benar (misal: <em>&quot;Kasumi&quot;</em> atau <em>&quot;Yukina&quot;</em>).</li>
          <li>Gunakan nama band (seperti <em>&quot;Roselia&quot;</em>, <em>&quot;Poppin&apos;Party&quot;</em>, <em>&quot;Afterglow&quot;</em>).</li>
          <li>Cari berdasarkan istilah gameplay, seperti <em>&quot;All Perfect&quot;</em>, <em>&quot;Live Boost&quot;</em>, <em>&quot;Sinergi&quot;</em>, atau <em>&quot;Kirafes&quot;</em>.</li>
        </ul>
      </div>

      {/* Suggested Keywords / Trending Topics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-pink-600" />
            <span>Coba Kata Kunci Populer Ini:</span>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {POPULAR_SEARCH_TERMS.slice(0, 8).map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSelectSuggestion(term)}
              className="px-3 py-1.5 rounded-xl bg-muted hover:bg-pink-100 hover:text-pink-700 dark:hover:bg-pink-950/50 dark:hover:text-pink-300 border border-border text-xs font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Page Shortcuts */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="text-xs font-bold text-muted-foreground flex items-center gap-1">
          <Compass className="h-3.5 w-3.5" />
          <span>Atau jelajahi menu utama kami langsung:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {quickPicks.map((pick) => {
            const Icon = pick.icon;
            return (
              <Link
                key={pick.label}
                href={pick.href}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border hover:border-pink-500/50 hover:shadow-md transition-all text-center space-y-1.5 group"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${pick.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold text-foreground group-hover:text-pink-600 transition-colors">
                  {pick.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  Users,
  Music2,
  BookOpen,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Heart,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Tag,
  Star,
} from "lucide-react";
import { SearchResultItem } from "@/data/searchData";

interface SearchResultCardProps {
  item: SearchResultItem;
  searchQuery?: string;
}

const CATEGORY_STYLE_CONFIG = {
  character: {
    label: "Karakter",
    icon: Users,
    gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
    borderHover: "hover:border-pink-500/60",
    textType: "text-pink-600 dark:text-pink-400",
    badgeBg: "bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300 border-pink-200 dark:border-pink-900/60",
    actionLabel: "Lihat Profil Karakter",
  },
  band: {
    label: "Band & Personel",
    icon: Music2,
    gradient: "from-purple-500/10 via-indigo-500/5 to-transparent",
    borderHover: "hover:border-purple-500/60",
    textType: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-900/60",
    actionLabel: "Jelajahi Band",
  },
  guide: {
    label: "Panduan Game",
    icon: BookOpen,
    gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    borderHover: "hover:border-blue-500/60",
    textType: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-900/60",
    actionLabel: "Baca Panduan",
  },
  blog: {
    label: "Blog & Komunitas",
    icon: FileText,
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    borderHover: "hover:border-amber-500/60",
    textType: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900/60",
    actionLabel: "Baca Tulisan",
  },
  gacha: {
    label: "Jadwal Gacha",
    icon: Sparkles,
    gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    borderHover: "hover:border-violet-500/60",
    textType: "text-violet-600 dark:text-violet-400",
    badgeBg: "bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300 border-violet-200 dark:border-violet-900/60",
    actionLabel: "Cek Detail Banner",
  },
  team: {
    label: "Susunan Tim",
    icon: Layers,
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    borderHover: "hover:border-emerald-500/60",
    textType: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60",
    actionLabel: "Buka Simulator Tim",
  },
};

function highlightMatch(text: string, term?: string) {
  if (!term || !term.trim()) return text;
  const safeTerm = term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeTerm})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-pink-500/25 text-pink-700 dark:text-pink-300 font-extrabold rounded-xs px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchResultCard({ item, searchQuery }: SearchResultCardProps) {
  const config = CATEGORY_STYLE_CONFIG[item.category] || CATEGORY_STYLE_CONFIG.guide;
  const CategoryIcon = config.icon;

  return (
    <Link
      href={item.url}
      className={`group relative flex flex-col justify-between p-5 rounded-3xl bg-card border border-border ${config.borderHover} hover:shadow-xl transition-all duration-200 overflow-hidden bg-gradient-to-br ${config.gradient}`}
    >
      <div className="space-y-3">
        {/* Row 1: Content Type Label (Label Jenis Isi) & Badges */}
        <div className="flex items-center justify-between gap-2">
          {/* Main Content Type Label */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border ${config.badgeBg}`}
            >
              <CategoryIcon className="h-3.5 w-3.5" />
              <span>{config.label}</span>
            </span>
          </div>

          {/* Secondary Badge (Attribute, Status, Difficulty, or Rating) */}
          {item.badgeText && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                item.badgeColor || "bg-muted text-muted-foreground border-border"
              }`}
            >
              {item.badgeText}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-base sm:text-lg text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1 leading-snug">
          {highlightMatch(item.title, searchQuery)}
        </h3>

        {/* Subtitle */}
        {item.subtitle && (
          <p className="text-xs font-semibold text-muted-foreground line-clamp-1">
            {highlightMatch(item.subtitle, searchQuery)}
          </p>
        )}

        {/* Snippet Description */}
        <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
          {highlightMatch(item.snippet, searchQuery)}
        </p>

        {/* Dynamic Metadata Badges */}
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground flex-wrap">
            {item.metadata.totalBP && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted font-bold text-foreground">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>BP: {Number(item.metadata.totalBP).toLocaleString("id-ID")}</span>
              </span>
            )}
            {item.metadata.readTime && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted font-medium">
                <Clock className="h-3 w-3" />
                <span>{item.metadata.readTime}</span>
              </span>
            )}
            {item.metadata.likes !== undefined && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted font-medium text-pink-600">
                <Heart className="h-3 w-3 fill-pink-600" />
                <span>{item.metadata.likes}</span>
              </span>
            )}
            {item.metadata.comments !== undefined && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted font-medium text-indigo-600">
                <MessageSquare className="h-3 w-3" />
                <span>{item.metadata.comments}</span>
              </span>
            )}
            {item.metadata.estimatedBP && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted font-bold text-emerald-600">
                <span>Est. BP: {Number(item.metadata.estimatedBP).toLocaleString("id-ID")}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Row: Tags & Action Prompt */}
      <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap overflow-hidden h-6">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-muted/80 text-[10px] text-muted-foreground font-medium"
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground font-medium">
              +{item.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-pink-600 dark:text-pink-400 group-hover:translate-x-1 transition-transform shrink-0">
          <span>{config.actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}

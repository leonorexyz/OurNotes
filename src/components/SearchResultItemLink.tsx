"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Music2,
  BookOpen,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Clock,
  Star,
} from "lucide-react";
import { SearchResultItem } from "@/data/searchData";

interface SearchResultItemLinkProps {
  item: SearchResultItem;
  searchQuery?: string;
  onNavigate?: (item: SearchResultItem) => void;
  variant?: "card" | "list";
}

const CATEGORY_META = {
  character: {
    icon: Users,
    label: "Karakter",
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300",
    borderColor: "hover:border-pink-500/50",
  },
  band: {
    icon: Music2,
    label: "Band",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300",
    borderColor: "hover:border-purple-500/50",
  },
  guide: {
    icon: BookOpen,
    label: "Panduan",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300",
    borderColor: "hover:border-blue-500/50",
  },
  blog: {
    icon: FileText,
    label: "Blog",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
    borderColor: "hover:border-amber-500/50",
  },
  gacha: {
    icon: Sparkles,
    label: "Gacha",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300",
    borderColor: "hover:border-violet-500/50",
  },
  team: {
    icon: Layers,
    label: "Tim",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
    borderColor: "hover:border-emerald-500/50",
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

export function SearchResultItemLink({
  item,
  searchQuery,
  onNavigate,
  variant = "list",
}: SearchResultItemLinkProps) {
  const router = useRouter();
  const meta = CATEGORY_META[item.category] || CATEGORY_META.guide;
  const Icon = meta.icon;

  const handleClick = (e: React.MouseEvent) => {
    // Record clicked item into history
    try {
      const stored = localStorage.getItem("ournotes_recent_visited_search");
      const list = stored ? JSON.parse(stored) : [];
      const updated = [item.id, ...list.filter((id: string) => id !== item.id)].slice(0, 15);
      localStorage.setItem("ournotes_recent_visited_search", JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }

    if (onNavigate) {
      onNavigate(item);
    }
  };

  return (
    <Link
      href={item.url}
      onClick={handleClick}
      prefetch={true}
      className={`group relative flex items-center justify-between p-4 rounded-2xl bg-card border border-border ${meta.borderColor} hover:bg-muted/50 hover:shadow-md transition-all duration-150 cursor-pointer`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Category Icon Badge */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold transition-transform group-hover:scale-105 ${meta.bg}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content Details */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
              {meta.label}
            </span>
            {item.badgeText && (
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold border ${
                  item.badgeColor || "bg-muted text-muted-foreground border-border"
                }`}
              >
                {item.badgeText}
              </span>
            )}
          </div>

          <h4 className="text-sm font-extrabold text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors truncate">
            {highlightMatch(item.title, searchQuery)}
          </h4>

          <p className="text-xs text-muted-foreground truncate">
            {item.subtitle}
          </p>
        </div>
      </div>

      {/* Action / Arrow Link Affordance */}
      <div className="flex items-center gap-1 pl-3 text-xs font-bold text-muted-foreground group-hover:text-pink-600 shrink-0 transition-colors">
        <span className="hidden sm:inline-block text-[11px]">Buka</span>
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

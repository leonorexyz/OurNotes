"use client";

import {
  Sparkles,
  Users,
  Music2,
  BookOpen,
  FileText,
  Layers,
  Check,
  Filter,
} from "lucide-react";
import {
  SEARCH_CATEGORIES,
  SearchCategory,
  SearchCategoryMeta,
} from "@/data/searchData";

interface SearchCategoryFilterProps {
  selectedCategory: SearchCategory;
  categoryCounts: Record<string, number>;
  onSelectCategory: (category: SearchCategory) => void;
  className?: string;
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Users,
  Music2,
  BookOpen,
  FileText,
  Layers,
};

export function SearchCategoryFilter({
  selectedCategory,
  categoryCounts,
  onSelectCategory,
  className = "",
}: SearchCategoryFilterProps) {
  const totalResults = categoryCounts["all"] || 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Category Tabs Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <Filter className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
          <span>Filter Berdasarkan Jenis Konten:</span>
        </div>
        <span className="text-[11px]">
          Total Ditemukan: <strong className="text-foreground">{totalResults}</strong>
        </span>
      </div>

      {/* Scrollable Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none border-b border-border">
        {SEARCH_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICON_MAP[cat.iconName] || Sparkles;
          const isSelected = selectedCategory === cat.key;
          const count = categoryCounts[cat.key] || 0;
          const isEmpty = count === 0;

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelectCategory(cat.key)}
              className={`group relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-500/25 ring-2 ring-pink-500/30 scale-102"
                  : isEmpty
                  ? "bg-card/50 hover:bg-muted text-muted-foreground/60 border border-border/50 hover:text-foreground"
                  : "bg-card hover:bg-muted/80 text-foreground border border-border hover:border-pink-500/40"
              }`}
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-lg transition-transform ${
                  isSelected ? "text-white" : "text-muted-foreground group-hover:text-pink-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              <span>{cat.label}</span>

              {/* Result Count Badge */}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : isEmpty
                    ? "bg-muted/60 text-muted-foreground/50"
                    : "bg-muted text-foreground group-hover:bg-pink-50 group-hover:text-pink-600 dark:group-hover:bg-pink-950/60 dark:group-hover:text-pink-300"
                }`}
              >
                {count}
              </span>

              {isSelected && (
                <span className="sr-only">(Aktif)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

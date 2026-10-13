"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Sparkles,
  Users,
  Music2,
  BookOpen,
  FileText,
  Layers,
  ArrowRight,
  TrendingUp,
  CornerDownLeft,
} from "lucide-react";
import {
  SearchResultItem,
  searchIndex,
  POPULAR_SEARCH_TERMS,
} from "@/data/searchData";

const ICON_MAP: Record<string, React.ElementType> = {
  character: Users,
  band: Music2,
  guide: BookOpen,
  blog: FileText,
  gacha: Sparkles,
  team: Layers,
};

interface RealtimeSearchInputProps {
  value?: string;
  onChange?: (val: string) => void;
  onSubmitSearch?: (val: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  inlineDropdown?: boolean;
  className?: string;
}

export function RealtimeSearchInput({
  value: controlledValue,
  onChange,
  onSubmitSearch,
  placeholder = "Cari karakter, band, lagu, atau tips...",
  autoFocus = false,
  inlineDropdown = true,
  className = "",
}: RealtimeSearchInputProps) {
  const router = useRouter();
  const [internalValue, setInternalValue] = useState(controlledValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Real-time matched results
  const liveResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchIndex(query, "all").slice(0, 7);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inlineDropdown || liveResults.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmitSearch?.(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < liveResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : liveResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < liveResults.length) {
        const target = liveResults[selectedIndex];
        router.push(target.url);
        setIsFocused(false);
      } else {
        onSubmitSearch?.(query);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    onChange?.(val);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-pink-500/20 text-pink-600 dark:text-pink-300 font-extrabold rounded-xs px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input box */}
      <div
        className={`relative flex items-center shadow-lg rounded-2xl bg-card border-2 transition-all ${
          isFocused
            ? "border-pink-500 ring-4 ring-pink-500/10"
            : "border-pink-500/30 hover:border-pink-500/50"
        }`}
      >
        <div className="pl-4 text-muted-foreground flex items-center justify-center">
          <Search className="h-5 w-5 text-pink-600 dark:text-pink-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-4 text-sm sm:text-base font-medium placeholder:text-muted-foreground/60 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 mr-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onSubmitSearch?.(query)}
          className="hidden sm:flex items-center gap-1.5 mr-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-colors"
        >
          <span>Cari</span>
          <CornerDownLeft className="h-3 w-3 opacity-80" />
        </button>
      </div>

      {/* Real-time Suggestions Dropdown */}
      {inlineDropdown && isFocused && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3 border-b border-border bg-muted/40 flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
            <span>
              Hasil Realtime: <strong className="text-foreground">{liveResults.length}</strong> item ditemukan
            </span>
            <span className="hidden sm:inline-block text-[10px]">Gunakan ↑ ↓ untuk memilih, Enter untuk membuka</span>
          </div>

          {liveResults.length > 0 ? (
            <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
              {liveResults.map((item, idx) => {
                const Icon = ICON_MAP[item.category] || Sparkles;
                const isSelected = selectedIndex === idx;

                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => setIsFocused(false)}
                    className={`flex items-start gap-3 p-3.5 transition-colors ${
                      isSelected
                        ? "bg-pink-500/10 text-foreground"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        item.category === "character"
                          ? "bg-pink-100 text-pink-600 dark:bg-pink-950/70 dark:text-pink-400"
                          : item.category === "band"
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400"
                          : item.category === "guide"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400"
                          : item.category === "gacha"
                          ? "bg-violet-100 text-violet-600 dark:bg-violet-950/70 dark:text-violet-400"
                          : "bg-amber-100 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold truncate">
                          {highlightMatch(item.title, query)}
                        </h4>
                        <span className="text-[10px] uppercase font-black tracking-wider text-pink-600 shrink-0">
                          {item.categoryLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate font-medium">
                        {item.subtitle}
                      </p>
                      <p className="text-[11px] text-muted-foreground/80 line-clamp-1">
                        {item.snippet}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 self-center opacity-60" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Tidak ada hasil instan untuk &quot;<strong className="text-foreground">{query}</strong>&quot;.
              </p>
              <button
                type="button"
                onClick={() => onSubmitSearch?.(query)}
                className="text-xs font-bold text-pink-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Buka pencarian lengkap</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Footer action to full search page */}
          <div className="p-2.5 bg-muted/20 border-t border-border flex items-center justify-between text-xs">
            <Link
              href={`/cari?q=${encodeURIComponent(query)}`}
              onClick={() => setIsFocused(false)}
              className="text-pink-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Lihat semua hasil di Halaman Pencarian</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

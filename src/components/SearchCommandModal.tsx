"use client";

import { useState, useEffect } from "react";
import { RealtimeSearchInput } from "@/components/RealtimeSearchInput";
import { X, Sparkles, TrendingUp, Search } from "lucide-react";
import { POPULAR_SEARCH_TERMS } from "@/data/searchData";

interface SearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchCommandModal({ isOpen, onClose }: SearchCommandModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-pink-600 font-extrabold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Pencarian Realtime Our Notes</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <RealtimeSearchInput
          value={query}
          onChange={setQuery}
          onSubmitSearch={() => onClose()}
          autoFocus={true}
          inlineDropdown={true}
          placeholder="Cari karakter, band, lagu, atau tips..."
        />

        <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-border/60">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-pink-600" />
            Trending:
          </span>
          {POPULAR_SEARCH_TERMS.slice(0, 6).map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="px-2 py-0.5 rounded-full bg-muted hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-950/40 text-[10px] font-medium border border-border/80 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

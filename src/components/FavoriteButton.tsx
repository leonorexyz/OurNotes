"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, CheckCircle2 } from "lucide-react";
import { FavoritItem } from "@/components/AkunFavoritLayout";

export const STORAGE_FAVORIT_KEY = "ournotes_user_favorites_v1";
export const FAVORITES_CHANGED_EVENT = "ournotes_favorites_changed";

interface FavoriteButtonProps {
  item: {
    id: string;
    type: "character" | "guide" | "band" | "team" | "gacha" | "blog";
    title: string;
    subtitle: string;
    categoryLabel: string;
    url: string;
    badge?: string;
    badgeColor?: string;
    avatarUrl?: string;
    coverBg?: string;
    notes?: string;
  };
  variant?: "button" | "icon" | "pill";
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({
  item,
  variant = "button",
  className = "",
  showText = true,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const checkIsFavorited = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAVORIT_KEY);
      if (stored) {
        const list: FavoritItem[] = JSON.parse(stored);
        setIsFavorited(list.some((f) => f.id === item.id));
      } else {
        setIsFavorited(false);
      }
    } catch {
      setIsFavorited(false);
    }
  }, [item.id]);

  useEffect(() => {
    checkIsFavorited();

    const handleStorageChange = () => {
      checkIsFavorited();
    };

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkIsFavorited]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem(STORAGE_FAVORIT_KEY);
      let list: FavoritItem[] = stored ? JSON.parse(stored) : [];

      if (isFavorited) {
        list = list.filter((f) => f.id !== item.id);
        localStorage.setItem(STORAGE_FAVORIT_KEY, JSON.stringify(list));
        setIsFavorited(false);
        setToastMessage(`"${item.title}" dihapus dari favorit.`);
      } else {
        const newItem: FavoritItem = {
          ...item,
          addedAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
        list = [newItem, ...list];
        localStorage.setItem(STORAGE_FAVORIT_KEY, JSON.stringify(list));
        setIsFavorited(true);
        setToastMessage(`"${item.title}" disimpan ke favorit!`);
      }

      window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.warn("Error updating favorites:", err);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={toggleFavorite}
          title={isFavorited ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer ${
            isFavorited
              ? "border-pink-500/40 bg-pink-500/15 text-pink-600 dark:text-pink-400 shadow-sm shadow-pink-500/20 scale-105"
              : "border-border bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground"
          } ${className}`}
        >
          <Heart
            className={`h-4 w-4 transition-transform ${
              isFavorited ? "fill-pink-500 text-pink-500 scale-110" : ""
            }`}
          />
        </button>
      ) : variant === "pill" ? (
        <button
          type="button"
          onClick={toggleFavorite}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            isFavorited
              ? "border-pink-500/40 bg-pink-500/15 text-pink-600 dark:text-pink-300"
              : "border-border bg-background/60 hover:bg-muted text-muted-foreground hover:text-foreground"
          } ${className}`}
        >
          <Heart
            className={`h-3 w-3 ${isFavorited ? "fill-pink-500 text-pink-500" : ""}`}
          />
          {showText && <span>{isFavorited ? "Favorit" : "Simpan"}</span>}
        </button>
      ) : (
        <button
          type="button"
          onClick={toggleFavorite}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
            isFavorited
              ? "border-pink-500/40 bg-pink-500/15 text-pink-600 dark:text-pink-300 shadow-pink-500/10"
              : "border-border bg-card hover:bg-muted text-foreground"
          } ${className}`}
        >
          <Heart
            className={`h-4 w-4 transition-transform ${
              isFavorited ? "fill-pink-500 text-pink-500 scale-110" : "text-muted-foreground"
            }`}
          />
          {showText && <span>{isFavorited ? "Tersimpan di Favorit" : "Simpan ke Favorit"}</span>}
        </button>
      )}

      {/* Micro Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate max-w-xs">{toastMessage}</span>
        </div>
      )}
    </>
  );
}

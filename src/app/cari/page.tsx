"use client";

import { Suspense, useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
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
  Clock,
  Trash2,
  TrendingUp,
  Tag,
  Filter,
  Flame,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import {
  SEARCH_CATEGORIES,
  POPULAR_SEARCH_TERMS,
  SearchCategory,
  SearchResultItem,
  searchIndex,
  buildSearchIndex,
} from "@/data/searchData";
import { BlogPost } from "@/data/blogData";
import { RealtimeSearchInput } from "@/components/RealtimeSearchInput";
import { SearchResultCard } from "@/components/SearchResultCard";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { SearchCategoryFilter } from "@/components/SearchCategoryFilter";

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Users,
  Music2,
  BookOpen,
  FileText,
  Layers,
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("kategori") as SearchCategory) || "all";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>(initialCategory);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [userCustomArticles, setUserCustomArticles] = useState<BlogPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load custom articles and search history from localStorage
  useEffect(() => {
    try {
      const storedArticles = localStorage.getItem("ournotes_custom_blog_posts");
      if (storedArticles) {
        setUserCustomArticles(JSON.parse(storedArticles));
      }
      const storedRecent = localStorage.getItem("ournotes_recent_searches");
      if (storedRecent) {
        setRecentSearches(JSON.parse(storedRecent));
      }
    } catch (err) {
      console.warn("Storage load error", err);
    }
  }, []);

  // Sync state if URL query params change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = (searchParams.get("kategori") as SearchCategory) || "all";
    setQuery(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  // Keyboard shortcut: Pressing "/" or "Ctrl+K" focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.ctrlKey && e.key === "k")) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update URL params smoothly
  const updateUrl = (newQuery: string, newCat: SearchCategory) => {
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set("q", newQuery.trim());
    if (newCat !== "all") params.set("kategori", newCat);
    const queryString = params.toString();
    router.replace(queryString ? `/cari?${queryString}` : "/cari", { scroll: false });
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateUrl(val, selectedCategory);
  };

  const handleCategorySelect = (cat: SearchCategory) => {
    setSelectedCategory(cat);
    updateUrl(query, cat);
  };

  const executeSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    updateUrl(searchTerm, selectedCategory);

    // Add to recent searches
    if (searchTerm.trim()) {
      try {
        const trimmed = searchTerm.trim();
        const updated = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
        setRecentSearches(updated);
        localStorage.setItem("ournotes_recent_searches", JSON.stringify(updated));
      } catch (err) {
        console.warn("Save recent search error", err);
      }
    }
  };

  const removeRecentSearch = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== itemToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem("ournotes_recent_searches", JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("ournotes_recent_searches");
    } catch (err) {
      console.warn(err);
    }
  };

  // Perform search across the mock database
  const searchResults = useMemo(() => {
    return searchIndex(query, selectedCategory, userCustomArticles);
  }, [query, selectedCategory, userCustomArticles]);

  // Compute item counts per category for the tabs
  const categoryCounts = useMemo(() => {
    const all = searchIndex(query, "all", userCustomArticles);
    const counts: Record<string, number> = { all: all.length };
    SEARCH_CATEGORIES.forEach((cat) => {
      if (cat.key !== "all") {
        counts[cat.key] = all.filter((item) => item.category === cat.key).length;
      }
    });
    return counts;
  }, [query, userCustomArticles]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pencarian Cepat Bang Dream! Our Notes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Temukan Semua yang Kamu Butuhkan
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cari informasi karakter, band, panduan gameplay, jadwal banner gacha, strategi tim, dan artikel komunitas dalam satu tempat.
          </p>
        </section>

        {/* Search Bar Input Container */}
        <section className="max-w-3xl mx-auto space-y-4">
          <RealtimeSearchInput
            value={query}
            onChange={handleQueryChange}
            onSubmitSearch={executeSearch}
            placeholder="Ketik nama karakter, band, lagu, atau tips (tekan '/' untuk fokus)..."
            inlineDropdown={true}
          />

          {/* Quick Popular Searches / Trending Tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1 text-muted-foreground font-semibold shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-pink-600" />
              <span>Populer:</span>
            </div>
            {POPULAR_SEARCH_TERMS.slice(0, 8).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => executeSearch(term)}
                className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/40 dark:hover:text-pink-300 border border-border text-[11px] font-medium transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Recent Searches (Riwayat Pencarian) */}
          {recentSearches.length > 0 && !query && (
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Riwayat Pencarian Terakhir</span>
                </div>
                <button
                  type="button"
                  onClick={clearAllRecent}
                  className="text-muted-foreground hover:text-red-600 flex items-center gap-1 text-[11px] font-medium transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Hapus Riwayat</span>
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {recentSearches.map((item) => (
                  <span
                    key={item}
                    onClick={() => executeSearch(item)}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-pink-100 hover:text-pink-700 dark:hover:bg-pink-950/50 dark:hover:text-pink-300 border border-border text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(item, e)}
                      className="text-muted-foreground hover:text-red-600 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Category Tabs */}
        <section className="space-y-4">
          <SearchCategoryFilter
            selectedCategory={selectedCategory}
            categoryCounts={categoryCounts}
            onSelectCategory={handleCategorySelect}
          />

          {/* Results Summary Info Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              {query ? (
                <span>
                  Ditemukan <strong className="text-foreground">{searchResults.length}</strong> hasil untuk{" "}
                  <span className="text-pink-600 font-bold">&quot;{query}&quot;</span>
                  {selectedCategory !== "all" && (
                    <span> pada kategori <strong>{SEARCH_CATEGORIES.find((c) => c.key === selectedCategory)?.label}</strong></span>
                  )}
                </span>
              ) : (
                <span>
                  Menampilkan seluruh data indeks (<strong>{searchResults.length}</strong> item)
                </span>
              )}
            </div>
            {query && (
              <button
                type="button"
                onClick={() => {
                  handleQueryChange("");
                  setSelectedCategory("all");
                }}
                className="text-pink-600 hover:underline font-semibold"
              >
                Reset Filter
              </button>
            )}
          </div>
        </section>

        {/* Search Results Grid / List */}
        <section className="space-y-4">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((item) => (
                <SearchResultCard key={item.id} item={item} searchQuery={query} />
              ))}
            </div>
          ) : (
            <SearchEmptyState
              query={query}
              selectedCategory={selectedCategory}
              categoryLabel={SEARCH_CATEGORIES.find((c) => c.key === selectedCategory)?.label}
              onReset={() => {
                handleQueryChange("");
                setSelectedCategory("all");
              }}
              onSelectSuggestion={(term) => executeSearch(term)}
              onSelectAllCategory={() => handleCategorySelect("all")}
            />
          )}
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
          Memuat halaman pencarian...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

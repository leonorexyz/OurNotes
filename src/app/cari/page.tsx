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
          <div className="relative flex items-center shadow-lg rounded-2xl bg-card border-2 border-pink-500/30 focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-500/10 transition-all">
            <div className="pl-4 text-muted-foreground">
              <Search className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  executeSearch(query);
                }
              }}
              placeholder="Ketik nama karakter, band, lagu, atau tips (tekan '/' untuk fokus)..."
              className="w-full bg-transparent px-4 py-4 text-sm sm:text-base font-medium placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  handleQueryChange("");
                  inputRef.current?.focus();
                }}
                className="p-2 mr-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title="Hapus pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => executeSearch(query)}
              className="hidden sm:flex items-center gap-1.5 mr-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <span>Cari</span>
            </button>
          </div>

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
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border">
            {SEARCH_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICON_MAP[cat.iconName] || Sparkles;
              const isSelected = selectedCategory === cat.key;
              const count = categoryCounts[cat.key] || 0;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategorySelect(cat.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                      : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

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
                <Link
                  key={item.id}
                  href={item.url}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl bg-card border border-border hover:border-pink-500/50 hover:shadow-lg transition-all"
                >
                  <div className="space-y-2.5">
                    {/* Header Row: Badge & Category */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
                        {item.categoryLabel}
                      </span>
                      {item.badgeText && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.badgeColor || "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {item.badgeText}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-base text-foreground group-hover:text-pink-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Subtitle */}
                    {item.subtitle && (
                      <p className="text-xs font-semibold text-muted-foreground line-clamp-1">
                        {item.subtitle}
                      </p>
                    )}

                    {/* Snippet */}
                    <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>
                  </div>

                  {/* Footer Row: Tags & Link Prompt */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap overflow-hidden h-6">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground font-medium"
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

                    <div className="flex items-center gap-1 text-xs font-bold text-pink-600 group-hover:translate-x-0.5 transition-transform shrink-0">
                      <span>Buka</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-10 rounded-3xl bg-card border border-border text-center space-y-4 max-w-lg mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                <HelpCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Tidak Ada Hasil Ditemukan</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tidak ada konten yang cocok dengan kata kunci &quot;<strong className="text-foreground">{query}</strong>&quot;
                  {selectedCategory !== "all" && ` pada kategori "${selectedCategory}"`}.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleQueryChange("");
                    setSelectedCategory("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs"
                >
                  Bersihkan Pencarian
                </button>
                <button
                  type="button"
                  onClick={() => executeSearch("Kasumi Toyama")}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md"
                >
                  Coba &quot;Kasumi Toyama&quot;
                </button>
              </div>
            </div>
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

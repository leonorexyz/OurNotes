"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FileText,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Tag,
  Search,
  Filter,
  Eye,
  Clock,
  Sparkles,
  ChevronRight,
  PenSquare,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Share2,
  X,
  SlidersHorizontal,
  Flame,
  RotateCcw,
} from "lucide-react";
import {
  BLOG_POSTS_DATA,
  BlogPost,
  slugifyTag,
  REVERSE_CATEGORY_MAP,
} from "@/data/blogData";

export default function BlogPage() {
  const [customPosts, setCustomPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [readTimeFilter, setReadTimeFilter] = useState<string>("all");
  const [likesFilter, setLikesFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments">("latest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Load custom user articles from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ournotes_custom_blog_posts");
      if (stored) {
        setCustomPosts(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Storage error", err);
    }
  }, []);

  // Combined articles list
  const allPosts = useMemo(() => {
    // Avoid duplicates by id
    const customIds = new Set(customPosts.map((p) => p.id));
    const defaultFiltered = BLOG_POSTS_DATA.filter((p) => !customIds.has(p.id));
    return [...customPosts, ...defaultFiltered];
  }, [customPosts]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach((post) => {
      post.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [allPosts]);

  const categories = [
    "Semua",
    "Tips & Gameplay",
    "Meta & Tim",
    "Lore & Karakter",
    "Gacha & Stars",
    "Event & Skor",
  ];

  // Search suggestions
  const searchSuggestions = ["Expert", "All Perfect", "Kirafes", "Poppin'Party", "Roselia", "Ave Mujica", "Stars"];

  // Filtered & sorted posts
  const filteredPosts = useMemo(() => {
    let result = [...allPosts];

    if (selectedCategory !== "Semua") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    if (likesFilter > 0) {
      result = result.filter((p) => p.likes >= likesFilter);
    }

    if (readTimeFilter === "short") {
      result = result.filter((p) => {
        const min = parseInt(p.readTime) || 4;
        return min <= 4;
      });
    } else if (readTimeFilter === "medium") {
      result = result.filter((p) => {
        const min = parseInt(p.readTime) || 5;
        return min >= 5 && min <= 6;
      });
    } else if (readTimeFilter === "long") {
      result = result.filter((p) => {
        const min = parseInt(p.readTime) || 7;
        return min >= 7;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    if (sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "comments") {
      result.sort((a, b) => b.commentsCount - a.commentsCount);
    } else {
      // latest / featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [allPosts, selectedCategory, selectedTag, likesFilter, readTimeFilter, searchQuery, sortBy]);

  const featuredPost = useMemo(() => {
    return allPosts.find((p) => p.isFeatured) || allPosts[0];
  }, [allPosts]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "Semua" ||
    selectedTag !== null ||
    readTimeFilter !== "all" ||
    likesFilter > 0;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setSelectedTag(null);
    setReadTimeFilter("all");
    setLikesFilter(0);
    setSortBy("latest");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Panduan Utama
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Blog & Komunitas</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-background dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-background p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Blog & Forum Artikel Komunitas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Artikel, Analisis Meta & Panduan Pemain
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Kumpulan tulisan komunitas Our Notes: tips full combo lagu Expert, perbandingan instrumen studio, kalkulasi stars hemat, serta pembahasan mendalam lore anime & band.
            </p>
          </div>

          {/* Quick Metrics Bar & CTA */}
          <div className="mt-6 pt-5 border-t border-indigo-200/40 dark:border-indigo-900/40 flex items-center justify-between flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-muted-foreground text-[11px] block">Total Artikel:</span>
                <strong className="text-foreground font-bold">{allPosts.length} Artikel</strong>
              </div>
              <div className="h-6 w-px bg-border" />
              <div>
                <span className="text-muted-foreground text-[11px] block">Kategori Topik:</span>
                <strong className="text-indigo-600 font-bold">{categories.length - 1} Kategori</strong>
              </div>
              <div className="h-6 w-px bg-border" />
              <div>
                <span className="text-muted-foreground text-[11px] block">Tag Unik:</span>
                <strong className="text-foreground font-bold">{allTags.length} Tag</strong>
              </div>
            </div>

            <Link
              href="/blog/tulis"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <PenSquare className="h-4 w-4" />
              <span>Tulis Artikel Baru</span>
            </Link>
          </div>
        </div>

        {/* Spotlight Featured Article */}
        {featuredPost && !hasActiveFilters && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Artikel Pilihan Minggu Ini</span>
            </div>

            <article className="rounded-3xl border border-indigo-200 dark:border-indigo-900 bg-card shadow-sm overflow-hidden flex flex-col lg:flex-row justify-between hover:border-indigo-400 dark:hover:border-indigo-700 transition-colors">
              <div className={`p-6 sm:p-8 lg:w-2/5 bg-gradient-to-br ${featuredPost.coverImageBg} text-white flex flex-col justify-between space-y-6`}>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold">
                    <Sparkles className="h-3 w-3" />
                    <span>{featuredPost.category}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                    {featuredPost.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/20 text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold">{featuredPost.author.name}</span>
                    <span className="text-white/70 text-[11px]">{featuredPost.author.role}</span>
                  </div>
                  <span className="ml-auto font-mono text-[11px] text-white/80">{featuredPost.readTime}</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:w-3/5 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    {featuredPost.tags.map((t) => (
                      <Link
                        key={t}
                        href={`/blog/tag/${slugifyTag(t)}`}
                        className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-[11px] font-medium text-muted-foreground hover:text-indigo-600 transition-colors"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5 text-pink-500" />
                      <span>{featuredPost.likes} Suka</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{featuredPost.commentsCount} Komentar</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{featuredPost.views} Dibaca</span>
                    </span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Filter, Search & Tag Cloud Bar */}
        <section className="space-y-4 rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          {/* Top Row: Search Input and Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input with quick clear */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari artikel, topik lagu, karakter, atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-input bg-muted/20 text-xs focus:border-indigo-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Advanced Filter Toggle */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border font-bold transition-colors cursor-pointer ${
                  showAdvancedFilters
                    ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    : "border-border bg-card hover:bg-muted text-muted-foreground"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filter Lanjutan</span>
              </button>

              <div className="flex items-center gap-1">
                <span className="text-muted-foreground font-semibold shrink-0">Urut:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-input bg-card px-2.5 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="latest">Terbaru & Pilihan</option>
                  <option value="popular">Paling Banyak Disukai</option>
                  <option value="comments">Paling Banyak Diskusi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-muted-foreground">
            <span className="font-semibold">Kata Kunci Cepat:</span>
            {searchSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => setSearchQuery(s)}
                className="px-2 py-0.5 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-2 border-t border-border/50">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Advanced Multi-Facet Filter Drawer */}
          {showAdvancedFilters && (
            <div className="p-4 rounded-2xl bg-muted/20 border border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Durasi Membaca Artikel:
                </label>
                <select
                  value={readTimeFilter}
                  onChange={(e) => setReadTimeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-card text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Durasi Baca</option>
                  <option value="short">Singkat (≤ 4 Menit Baca)</option>
                  <option value="medium">Sedang (5 - 6 Menit Baca)</option>
                  <option value="long">Mendalam (≥ 7 Menit Baca)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Batas Minimal Suka (Upvote):
                </label>
                <select
                  value={likesFilter}
                  onChange={(e) => setLikesFilter(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-card text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value={0}>Semua Jumlah Suka</option>
                  <option value={100}>Minimal 100+ Suka</option>
                  <option value={200}>Minimal 200+ Suka</option>
                </select>
              </div>
            </div>
          )}

          {/* Tag Cloud Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1 border-t border-border/50">
            <span className="text-muted-foreground text-[11px] font-bold flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Tag Populer:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Active Filters Chips Bar */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-border/60 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-muted-foreground text-[11px] font-bold">Filter Aktif:</span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                    Cari: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} className="hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== "Semua" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                    Kategori: {selectedCategory}
                    <button onClick={() => setSelectedCategory("Semua")} className="hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedTag && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                    Tag: #{selectedTag}
                    <button onClick={() => setSelectedTag(null)} className="hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {readTimeFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                    Durasi: {readTimeFilter}
                    <button onClick={() => setReadTimeFilter("all")} className="hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {likesFilter > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                    Suka: ≥{likesFilter}
                    <button onClick={() => setLikesFilter(0)} className="hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="text-[11px] text-pink-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Semua Filter</span>
              </button>
            </div>
          )}
        </section>

        {/* Blog Posts Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <span>Daftar Artikel</span>
              <span className="text-xs font-normal text-muted-foreground">
                (Menemukan {filteredPosts.length} dari {allPosts.length} artikel)
              </span>
            </h2>

            {/* Direct Link to Category or Tag Index */}
            {selectedCategory !== "Semua" && (
              <Link
                href={`/blog/kategori/${REVERSE_CATEGORY_MAP[selectedCategory as BlogPost["category"]]}`}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Halaman Kategori {selectedCategory}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto stroke-1" />
              <h3 className="font-bold text-base text-foreground">Tidak ada artikel yang cocok</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau bersihkan filter kategori, tag, dan durasi membaca.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-border bg-card shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="space-y-4">
                    {/* Card Header Gradient */}
                    <div className={`h-28 bg-gradient-to-r ${post.coverImageBg} p-4 text-white relative flex flex-col justify-between`}>
                      <Link
                        href={`/blog/kategori/${REVERSE_CATEGORY_MAP[post.category] || "tips-gameplay"}`}
                        className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-[10px] font-bold self-start hover:bg-black/50 transition-colors"
                      >
                        {post.category}
                      </Link>
                      <span className="text-[10px] text-white/80 font-mono self-end">
                        {post.readTime}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-extrabold text-base text-foreground leading-snug group-hover:text-indigo-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {post.tags.slice(0, 3).map((t) => (
                          <Link
                            key={t}
                            href={`/blog/tag/${slugifyTag(t)}`}
                            className="px-2 py-0.5 rounded-md bg-muted hover:bg-indigo-50 dark:hover:bg-indigo-950 text-[10px] font-medium text-muted-foreground hover:text-indigo-600 transition-colors"
                          >
                            #{t}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 space-y-3">
                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                          {post.author.name.charAt(0)}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-[11px] leading-none">
                            {post.author.name}
                          </span>
                          <span className="text-[9px] text-muted-foreground">{post.publishedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-[11px]">
                        <span className="flex items-center gap-1 text-pink-600 font-semibold">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                          <MessageSquare className="h-3 w-3" />
                          <span>{post.commentsCount}</span>
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${post.id}`}
                      className="w-full inline-flex items-center justify-center gap-1 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs transition-colors"
                    >
                      <span>Baca Artikel</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Community Submission Banner */}
        <section className="rounded-3xl border border-indigo-200/70 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/60 via-purple-50/30 to-background dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-background p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-black text-foreground">
              Punya Analisis Meta atau Pengalaman Live yang Mau Dibagikan?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tulis artikel panduanmu sendiri di Our Notes! Setiap pemain bisa berbagi tips flick note, rekaman full combo, atau cerita inspiratif tentang karakter favorit.
            </p>
          </div>

          <Link
            href="/blog/tulis"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            <PenSquare className="h-4 w-4" />
            <span>Mulai Menulis Artikel</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

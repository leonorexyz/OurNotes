"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { BLOG_POSTS_DATA, BlogPost } from "@/data/blogData";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments">("latest");

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    BLOG_POSTS_DATA.forEach((post) => {
      post.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, []);

  const categories = ["Semua", "Tips & Gameplay", "Meta & Tim", "Lore & Karakter", "Gacha & Stars", "Event & Skor"];

  // Filtered & sorted posts
  const filteredPosts = useMemo(() => {
    let result = [...BLOG_POSTS_DATA];

    if (selectedCategory !== "Semua") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
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
      // latest
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  const featuredPost = useMemo(() => {
    return BLOG_POSTS_DATA.find((p) => p.isFeatured) || BLOG_POSTS_DATA[0];
  }, []);

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

          {/* Quick Action Button */}
          <div className="mt-6 pt-5 border-t border-indigo-200/40 dark:border-indigo-900/40 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-muted-foreground text-[11px] block">Total Artikel:</span>
                <strong className="text-foreground font-bold">{BLOG_POSTS_DATA.length} Artikel</strong>
              </div>
              <div className="h-6 w-px bg-border" />
              <div>
                <span className="text-muted-foreground text-[11px] block">Kategori Topik:</span>
                <strong className="text-indigo-600 font-bold">{categories.length - 1} Kategori</strong>
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
        {featuredPost && (
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
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-muted text-[11px] font-medium text-muted-foreground"
                      >
                        #{t}
                      </span>
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
          {/* Top Row: Search and Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari artikel, topik lagu, atau tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-input bg-muted/20 text-xs focus:border-indigo-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-semibold flex items-center gap-1 shrink-0">
                <TrendingUp className="h-3.5 w-3.5" />
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="latest">Terbaru & Pilihan</option>
                <option value="popular">Paling Banyak Disukai</option>
                <option value="comments">Paling Banyak Diskusi</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-border/50">
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

          {/* Tag Cloud Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
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
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[11px] text-pink-600 hover:underline font-bold ml-1"
              >
                Hapus Filter Tag
              </button>
            )}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Daftar Artikel ({filteredPosts.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Menampilkan topik {selectedCategory}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto stroke-1" />
              <h3 className="font-bold text-base text-foreground">Tidak ada artikel yang cocok</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau bersihkan filter kategori dan tag.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                  setSelectedTag(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
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
                      <span className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-[10px] font-bold self-start">
                        {post.category}
                      </span>
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
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground"
                          >
                            #{t}
                          </span>
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

"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import {
  Heart,
  User,
  Star,
  Bookmark,
  BookOpen,
  Layers,
  Sparkles,
  Settings,
  Search,
  Filter,
  Share2,
  Calendar,
  ChevronRight,
  ExternalLink,
  Trash2,
  Music2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  ArrowRight,
  Flame,
  Award,
  SlidersHorizontal,
} from "lucide-react";

export type FavoritTab = "semua" | "karakter" | "panduan" | "tim" | "gacha" | "pengaturan";

export interface FavoritItem {
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
  addedAt: string;
  notes?: string;
}

const DEFAULT_FAVORIT_ITEMS: FavoritItem[] = [
  {
    id: "fav-char-1",
    type: "character",
    title: "Kasumi Toyama",
    subtitle: "Poppin'Party • Vokalis & Gitaris • Atribut Pure",
    categoryLabel: "Karakter Favorit",
    url: "/karakter/char-kasumi-toyama",
    badge: "4★ Pure",
    badgeColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    coverBg: "from-pink-500 to-rose-600",
    addedAt: "12 Okt 2026",
    notes: "Kartu leader utama untuk formasi Pure PoPiPa.",
  },
  {
    id: "fav-char-2",
    type: "character",
    title: "Yukina Minato",
    subtitle: "Roselia • Vokalis Utama • Atribut Cool",
    categoryLabel: "Karakter Favorit",
    url: "/karakter/char-yukina-minato",
    badge: "4★ Cool",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    coverBg: "from-blue-600 to-indigo-700",
    addedAt: "11 Okt 2026",
    notes: "Skor boost +130% saat perfect tap.",
  },
  {
    id: "fav-guide-1",
    type: "guide",
    title: "Tips Mencapai All Perfect Lagu Level 27+ Expert",
    subtitle: "Kalibrasi kecepatan 10.4, timing offset, dan teknik telunjuk",
    categoryLabel: "Panduan Gameplay",
    url: "/blog/tips-all-perfect-lagu-level-27-expert",
    badge: "All Perfect",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    coverBg: "from-indigo-600 via-purple-600 to-pink-600",
    addedAt: "10 Okt 2026",
    notes: "Kunci lulus lagu Teardrops dan Fire Bird.",
  },
  {
    id: "fav-guide-2",
    type: "guide",
    title: "Analisis Meta Sinergi Tim Pure Poppin'Party: Skor 2.5 Juta",
    subtitle: "Upgrade studio Ryuseido & sinergi 5 personel PoPiPa",
    categoryLabel: "Meta & Tim",
    url: "/blog/analisis-meta-tim-pure-poppin-party",
    badge: "Score Meta",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    coverBg: "from-emerald-600 via-teal-600 to-cyan-700",
    addedAt: "09 Okt 2026",
    notes: "Target score attack room Master CiRCLE.",
  },
  {
    id: "fav-gacha-1",
    type: "gacha",
    title: "Kira-Kira Festival Vol. 1",
    subtitle: "Double Rate ★4 6.00% • Spark Seal 300",
    categoryLabel: "Jadwal Gacha",
    url: "/gacha/gacha-kirafes-vol1",
    badge: "Kirafes",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    coverBg: "from-purple-600 via-pink-600 to-indigo-600",
    addedAt: "08 Okt 2026",
    notes: "Tabungan stars saat ini 42.500 / 75.000 (56%).",
  },
  {
    id: "fav-team-1",
    type: "team",
    title: "Poppin'Party All-Stars Pure Meta",
    subtitle: "Total BP: 285.400 • Bonus Sinergi: +45.0%",
    categoryLabel: "Formasi Tim",
    url: "/tim",
    badge: "BP 285k",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    coverBg: "from-amber-500 to-rose-600",
    addedAt: "05 Okt 2026",
    notes: "Formasi andalan Marathon Event mingguan.",
  },
];

const STORAGE_FAVORIT_KEY = "ournotes_user_favorites_v1";

interface AkunFavoritProps {
  initialTab?: FavoritTab;
  baseRoute?: string;
}

function AkunFavoritContent({ initialTab, baseRoute = "/akun" }: AkunFavoritProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get("tab") || initialTab || "semua").toLowerCase() as FavoritTab;
  const [activeTab, setActiveTab] = useState<FavoritTab>(tabParam);
  const [favorites, setFavorites] = useState<FavoritItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");
  const [producerName, setProducerName] = useState("Kasumi Producer");
  const [producerTitle, setProducerTitle] = useState("Bintang Utama CiRCLE");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAVORIT_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites(DEFAULT_FAVORIT_ITEMS);
        localStorage.setItem(STORAGE_FAVORIT_KEY, JSON.stringify(DEFAULT_FAVORIT_ITEMS));
      }

      const storedProfile = localStorage.getItem("ournotes_user_profile");
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed.name) setProducerName(parsed.name);
        if (parsed.title) setProducerTitle(parsed.title);
      }
      const handleFavChanged = () => {
        try {
          const updated = localStorage.getItem(STORAGE_FAVORIT_KEY);
          if (updated) setFavorites(JSON.parse(updated));
        } catch {}
      };

      window.addEventListener("ournotes_favorites_changed", handleFavChanged);
      return () => {
        window.removeEventListener("ournotes_favorites_changed", handleFavChanged);
      };
    } catch {
      setFavorites(DEFAULT_FAVORIT_ITEMS);
    }
  }, []);

  const handleTabChange = (newTab: FavoritTab) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`${baseRoute}?${params.toString()}`);
  };

  const handleDeleteFavorite = (id: string, title: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    try {
      localStorage.setItem(STORAGE_FAVORIT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setToastMessage(`"${title}" dihapus dari daftar favorit.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "ournotes_user_profile",
        JSON.stringify({ name: producerName, title: producerTitle })
      );
    } catch (e) {
      console.warn(e);
    }
    setIsEditingProfile(false);
    setToastMessage("Profil produser berhasil disimpan!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter and sort items
  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    if (activeTab === "karakter") {
      result = result.filter((i) => i.type === "character" || i.type === "band");
    } else if (activeTab === "panduan") {
      result = result.filter((i) => i.type === "guide" || i.type === "blog");
    } else if (activeTab === "tim") {
      result = result.filter((i) => i.type === "team");
    } else if (activeTab === "gacha") {
      result = result.filter((i) => i.type === "gacha");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q) ||
          (i.notes && i.notes.toLowerCase().includes(q))
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [favorites, activeTab, searchQuery, sortBy]);

  const counts = useMemo(() => {
    return {
      semua: favorites.length,
      karakter: favorites.filter((f) => f.type === "character" || f.type === "band").length,
      panduan: favorites.filter((f) => f.type === "guide" || f.type === "blog").length,
      tim: favorites.filter((f) => f.type === "team").length,
      gacha: favorites.filter((f) => f.type === "gacha").length,
    };
  }, [favorites]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 pb-28 md:pb-12 sm:px-6 lg:px-8 space-y-8">
        {/* Toast notice */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-foreground text-background text-xs font-semibold px-4 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Producer Header Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-indigo-900/40 p-6 md:p-8 backdrop-blur-sm shadow-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar & Profile Info */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden border-2 border-pink-500/50 shadow-lg shadow-pink-500/20 bg-gradient-to-tr from-pink-500 to-indigo-600">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    alt={producerName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white text-[10px] font-bold ring-2 ring-background">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                    {producerName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-pink-500/10 border border-pink-500/30 px-2.5 py-0.5 text-[11px] font-bold text-pink-600 dark:text-pink-300">
                    <ShieldCheck className="h-3 w-3" />
                    Produser CiRCLE
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>{producerTitle}</span>
                  <span>•</span>
                  <span className="font-mono text-muted-foreground/80">ID: CIRC-2026-9812</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Music2 className="h-3.5 w-3.5 text-pink-500" />
                    <span>Band Favorit: <strong className="text-foreground">Poppin&apos;Party</strong></span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Atribut Utama: <strong className="text-foreground">Pure</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/masuk"
                className="inline-flex items-center gap-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 px-3.5 py-2 text-xs font-semibold text-pink-600 dark:text-pink-300 hover:bg-pink-500/20 transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span>Ganti Akun</span>
              </Link>

              <Link
                href="/profil"
                className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-colors"
              >
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span>Kartu Profil Lengkap</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{isEditingProfile ? "Tutup Editor Cepat" : "Edit Cepat"}</span>
              </button>

              <Link
                href="/tim"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:opacity-95 transition-all"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Susun Tim Baru</span>
              </Link>
            </div>
          </div>

          {/* Inline Profile Editor Form */}
          {isEditingProfile && (
            <form
              onSubmit={handleSaveProfile}
              className="mt-6 pt-6 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Nama Produser
                </label>
                <input
                  type="text"
                  value={producerName}
                  onChange={(e) => setProducerName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/90 px-3 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  placeholder="Nama Produser Anda"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Gelar / Tagline
                </label>
                <input
                  type="text"
                  value={producerTitle}
                  onChange={(e) => setProducerTitle(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/90 px-3 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  placeholder="Contoh: Bintang Utama CiRCLE"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white hover:bg-pink-700 transition-colors"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* Profile Summary Counter Strip */}
          <div className="mt-6 pt-6 border-t border-border/30 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-border/40 bg-background/50 p-3 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground">Karakter & Band</span>
              <p className="text-xl font-black text-pink-600 dark:text-pink-400 mt-0.5">
                {counts.karakter}
              </p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background/50 p-3 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground">Panduan & Artikel</span>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {counts.panduan}
              </p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background/50 p-3 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground">Formasi Tim</span>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {counts.tim}
              </p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background/50 p-3 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground">Pengingat Gacha</span>
              <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                {counts.gacha}
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border">
          {[
            { id: "semua" as const, label: "Semua Favorit", count: counts.semua, icon: Bookmark },
            { id: "karakter" as const, label: "Karakter & Band", count: counts.karakter, icon: Star },
            { id: "panduan" as const, label: "Panduan & Artikel", count: counts.panduan, icon: BookOpen },
            { id: "tim" as const, label: "Tim Tersimpan", count: counts.tim, icon: Layers },
            { id: "gacha" as const, label: "Pengingat Banner", count: counts.gacha, icon: Sparkles },
            { id: "pengaturan" as const, label: "Preferensi Akun", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1-5: Favorites Collection Content */}
        {activeTab !== "pengaturan" ? (
          <div className="space-y-6">
            {/* Filter and Search Bar within Favorites */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari dalam koleksi favorit Anda..."
                  className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "title")}
                  className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="newest">Terbaru Ditambahkan</option>
                  <option value="title">Nama (A - Z)</option>
                </select>

                <Link
                  href="/gacha/pengingat"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5 text-pink-500" />
                  <span className="hidden sm:inline">Kelola Pengingat .ICS</span>
                </Link>
              </div>
            </div>

            {/* Favorites Grid */}
            {filteredFavorites.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300">
                  <Bookmark className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    Belum Ada Item di Kategori Ini
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                      ? `Tidak ditemukan item favorit yang cocok dengan kata kunci "${searchQuery}".`
                      : "Jelajahi halaman karakter, panduan, atau jadwal gacha lalu klik tombol bookmark/favorit untuk menyimpannya di sini."}
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  <Link
                    href="/karakter"
                    className="inline-flex items-center gap-1 rounded-xl bg-pink-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-pink-700 transition-colors"
                  >
                    <span>Cari Karakter</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    <span>Baca Blog Panduan</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFavorites.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-sm hover:shadow-md hover:border-pink-500/40 transition-all"
                  >
                    <div>
                      {/* Card Header Tag & Category */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 dark:text-pink-400">
                          <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
                          {item.categoryLabel}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                item.badgeColor || "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteFavorite(item.id, item.title)}
                            className="text-muted-foreground/60 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Hapus dari favorit"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <Link href={item.url} className="block group-hover:text-pink-600 transition-colors">
                        <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.subtitle}
                      </p>

                      {/* Personal Notes if any */}
                      {item.notes && (
                        <div className="mt-3 rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground border border-border/40">
                          <span className="font-semibold text-foreground/80">Catatan:</span> {item.notes}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Ditambahkan: {item.addedAt}
                      </span>

                      <Link
                        href={item.url}
                        className="inline-flex items-center gap-1 font-bold text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        <span>Buka</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Tab 6: Account Settings & Preferences */
          <div className="max-w-3xl space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-pink-500" />
                Preferensi Tampilan & Permainan
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div>
                    <h5 className="font-bold text-foreground">Tema Aplikasi</h5>
                    <p className="text-muted-foreground">Sesuaikan tema gelap / terang otomatis</p>
                  </div>
                  <span className="font-semibold text-pink-600">Sistem / Otomatis</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div>
                    <h5 className="font-bold text-foreground">Server Game Utama</h5>
                    <p className="text-muted-foreground">Pilihan server jadwal gacha dan event</p>
                  </div>
                  <span className="font-semibold text-foreground">Japan (JP) Server</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div>
                    <h5 className="font-bold text-foreground">Kecepatan Note Default</h5>
                    <p className="text-muted-foreground">Rekomendasi preset kalkulator ritme</p>
                  </div>
                  <span className="font-semibold text-foreground">10.4 Speed</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h5 className="font-bold text-foreground">Notifikasi Browser</h5>
                    <p className="text-muted-foreground">Pengingat 24 jam sebelum gacha ditutup</p>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Keamanan & Sesi Akun
              </h3>
              <p className="text-xs text-muted-foreground">
                Akun produser Anda terhubung secara lokal dan aman dengan sinkronisasi browser.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(STORAGE_FAVORIT_KEY);
                    setFavorites(DEFAULT_FAVORIT_ITEMS);
                    setToastMessage("Data favorit berhasil direset ke standar.");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="rounded-xl border border-input bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Reset Favorit ke Standar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export function AkunFavoritLayout({ initialTab, baseRoute }: AkunFavoritProps = {}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AkunFavoritContent initialTab={initialTab} baseRoute={baseRoute} />
    </Suspense>
  );
}

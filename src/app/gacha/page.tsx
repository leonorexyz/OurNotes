"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import {
  Sparkles,
  ArrowLeft,
  Clock,
  Calendar,
  ShieldCheck,
  Bell,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Flame,
  Leaf,
  Snowflake,
  Sun,
  Star,
  ExternalLink,
  ChevronRight,
  Info,
  Gift,
  HelpCircle,
  X,
  Zap,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { GACHA_BANNERS_DATA, GachaBanner, FeaturedGachaCharacter } from "@/data/gachaData";
import { GachaEventCalendar } from "@/components/GachaEventCalendar";

export default function GachaPage() {
  const [viewMode, setViewMode] = useState<"banners" | "calendar">("banners");
  const [statusFilter, setStatusFilter] = useState<string>("Aktif");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBannerDetail, setSelectedBannerDetail] = useState<GachaBanner | null>(null);

  // Reminder Modal State
  const [reminderModalBanner, setReminderModalBanner] = useState<GachaBanner | null>(null);
  const [reminderTimeNotice, setReminderTimeNotice] = useState<string>("h-1");
  const [reminderEmail, setReminderEmail] = useState<string>("");
  const [reminderSavedNotice, setReminderSavedNotice] = useState<string | null>(null);

  // Quick 10-Pull Simulator State
  const [pullSimBanner, setPullSimBanner] = useState<GachaBanner | null>(null);
  const [simResults, setSimResults] = useState<
    { name: string; rarity: number; attribute: string; isPickup: boolean }[] | null
  >(null);

  // Time remaining state populated on client mount to allow static prerendering
  const [nowTime, setNowTime] = useState<number | null>(null);

  useEffect(() => {
    setNowTime(Date.now());
    const interval = setInterval(() => {
      setNowTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Time remaining calculator helper
  const calculateTimeRemaining = (endAt: string) => {
    if (nowTime === null) {
      return { expired: false, text: "Memuat sisa waktu..." };
    }
    const end = new Date(endAt).getTime();
    const diff = end - nowTime;

    if (diff <= 0) return { expired: true, text: "Banner telah ditutup" };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return { expired: false, text: `Sisa ${days} Hari ${hours} Jam` };
    if (hours > 0) return { expired: false, text: `Sisa ${hours} Jam ${minutes} Menit` };
    return { expired: false, text: `Sisa ${minutes} Menit` };
  };

  const getAttrIcon = (attr: string) => {
    switch (attr) {
      case "Power":
        return <Flame className="h-3.5 w-3.5 text-red-500" />;
      case "Pure":
        return <Leaf className="h-3.5 w-3.5 text-emerald-500" />;
      case "Cool":
        return <Snowflake className="h-3.5 w-3.5 text-blue-500" />;
      case "Happy":
        return <Sun className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-pink-500" />;
    }
  };

  // Filtered Banners
  const filteredBanners = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return GACHA_BANNERS_DATA.filter((banner) => {
      const matchStatus = statusFilter === "all" || banner.status === statusFilter;
      const matchCategory = categoryFilter === "all" || banner.category === categoryFilter;

      const matchSearch =
        !q ||
        banner.title.toLowerCase().includes(q) ||
        (banner.japaneseTitle && banner.japaneseTitle.toLowerCase().includes(q)) ||
        banner.description.toLowerCase().includes(q) ||
        banner.featuredCharacters.some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.cardTitle.toLowerCase().includes(q) ||
            c.bandName.toLowerCase().includes(q)
        );

      return matchStatus && matchCategory && matchSearch;
    });
  }, [statusFilter, categoryFilter, searchQuery]);

  // Handle Save Reminder
  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderModalBanner) return;

    setReminderSavedNotice(
      `Pengingat untuk banner "${reminderModalBanner.title}" berhasil dipasang (${
        reminderTimeNotice === "h-1" ? "H-1 Sebelum Tutup" : "H-3 Sebelum Tutup"
      })!`
    );
    setTimeout(() => {
      setReminderSavedNotice(null);
      setReminderModalBanner(null);
    }, 2500);
  };

  // Run 10-Pull Simulator
  const handleSimulateTenPull = (banner: GachaBanner) => {
    setPullSimBanner(banner);
    const results = [];
    const isKirafes = banner.pickupRates.isDoubleRate;
    const star4Rate = isKirafes ? 0.06 : 0.03;
    const star3Rate = 0.085;

    for (let i = 0; i < 10; i++) {
      const roll = Math.random();
      // 10th roll guarantee at least 3-star
      const isGuaranteedSlot = i === 9;

      if (roll < star4Rate) {
        // Star 4
        const pickupRoll = Math.random();
        if (pickupRoll < 0.5 && banner.featuredCharacters.length > 0) {
          const char = banner.featuredCharacters[Math.floor(Math.random() * banner.featuredCharacters.length)];
          results.push({
            name: `${char.name} [${char.cardTitle}]`,
            rarity: 4,
            attribute: char.attribute,
            isPickup: true,
          });
        } else {
          results.push({
            name: "Kartu ★4 Acak",
            rarity: 4,
            attribute: ["Power", "Pure", "Cool", "Happy"][Math.floor(Math.random() * 4)],
            isPickup: false,
          });
        }
      } else if (roll < star4Rate + star3Rate || isGuaranteedSlot) {
        results.push({
          name: "Kartu ★3 Rare",
          rarity: 3,
          attribute: ["Power", "Pure", "Cool", "Happy"][Math.floor(Math.random() * 4)],
          isPickup: false,
        });
      } else {
        results.push({
          name: "Kartu ★2 Normal",
          rarity: 2,
          attribute: ["Power", "Pure", "Cool", "Happy"][Math.floor(Math.random() * 4)],
          isPickup: false,
        });
      }
    }

    setSimResults(results);
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
          <span className="text-foreground font-medium">Info Jadwal Gacha & Pity</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-pink-200/60 dark:border-pink-900/40 bg-gradient-to-r from-pink-50/70 via-rose-50/40 to-background dark:from-pink-950/20 dark:via-rose-950/10 dark:to-background p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 dark:bg-pink-950/60 px-3 py-1 text-xs font-semibold text-pink-700 dark:text-pink-300 border border-pink-200/60">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Jadwal Banner & Gacha Seal System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Info Banner Gacha & Panduan Pity Seal
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Pantau jadwal banner gacha aktif, sisa waktu live show, kartu karakter pickup dengan peluang tinggi, serta panduan menukar 300 Gacha Seal untuk jaminan kartu impian.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-6 border-t border-pink-200/40 dark:border-pink-900/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Banner Aktif:</span>
              <strong className="text-foreground font-black text-sm sm:text-base">
                {GACHA_BANNERS_DATA.filter((b) => b.status === "Aktif").length} Banner
              </strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Pity Spark:</span>
              <strong className="text-pink-600 font-black text-sm sm:text-base">
                300 Gacha Seal
              </strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Biaya Tarik 10x:</span>
              <strong className="text-foreground font-black text-sm sm:text-base">
                2.500 Stars
              </strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Kirafes Rate Up:</span>
              <strong className="text-emerald-600 font-black text-sm sm:text-base">
                ★4 Peluang 6.00%
              </strong>
            </div>
          </div>
        </div>

        {/* Global Toast Notice */}
        {reminderSavedNotice && (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/90 dark:bg-emerald-950/70 p-4 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{reminderSavedNotice}</span>
            </div>
            <button
              onClick={() => setReminderSavedNotice(null)}
              className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border">
            <button
              onClick={() => setViewMode("banners")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "banners"
                  ? "bg-pink-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Daftar Banner Gacha</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-pink-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Kalender Event & Gacha Berjalan</span>
            </button>
          </div>

          {viewMode === "banners" ? (
            <button
              onClick={() => setViewMode("calendar")}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Buka Tampilan Kalender Jadwal Event</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setViewMode("banners")}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Kembali ke Daftar Banner Kartu</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {viewMode === "calendar" ? (
          <GachaEventCalendar />
        ) : (
          <>
            {/* Filter Controls Bar */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/60 overflow-x-auto text-xs">
              {["Aktif", "Akan Datang", "Selesai", "all"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                    statusFilter === status
                      ? "bg-pink-600 text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status === "all" ? "Semua Status" : status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari banner / karakter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-muted/20 text-xs focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-border/50">
            <span className="font-bold text-muted-foreground text-[11px] flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Kategori:
            </span>
            {[
              { id: "all", label: "Semua Kategori" },
              { id: "Kirafes / Festival", label: "Kirafes (Rate 2x)" },
              { id: "Limited Event", label: "Limited Event" },
              { id: "Permanent Pickup", label: "Permanen" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  categoryFilter === cat.id
                    ? "bg-muted text-foreground font-bold border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {cat.label}
              </button>
            ))}

            <span className="ml-auto text-[11px] text-muted-foreground">
              Menampilkan <strong>{filteredBanners.length}</strong> banner
            </span>
          </div>
        </div>

        {/* Banner Cards List Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <span>Daftar Banner Gacha</span>
              <span className="text-xs font-normal text-muted-foreground">
                ({filteredBanners.length} Banner Tersedia)
              </span>
            </h2>

            <a
              href="#panduan-pity"
              className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1"
            >
              <span>Cara Kerja Pity Seal</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {filteredBanners.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card/50 space-y-3">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto stroke-[1.5]" />
              <h3 className="font-bold text-base text-foreground">Tidak Ada Banner Sesuai Filter</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Coba ubah status filter atau kata kunci pencarian untuk menemukan banner gacha lainnya.
              </p>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBanners.map((banner) => {
                const timeInfo = calculateTimeRemaining(banner.endAt);

                return (
                  <article
                    key={banner.id}
                    className={`rounded-3xl border bg-card shadow-xs transition-all duration-200 flex flex-col justify-between overflow-hidden hover:border-pink-300 dark:hover:border-pink-800 ${
                      banner.isRecommended
                        ? "border-pink-300 dark:border-pink-900/60 ring-1 ring-pink-500/10"
                        : "border-border"
                    }`}
                  >
                    {/* Banner Top Header */}
                    <div className={`p-5 sm:p-6 bg-gradient-to-r ${banner.bannerImageBg} text-white space-y-3 relative overflow-hidden`}>
                      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />

                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs relative">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-bold text-[11px]">
                            {banner.category}
                          </span>
                          {banner.isRecommended && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-950" />
                              Rekomendasi Utama
                            </span>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 text-[11px] font-bold">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              banner.status === "Aktif"
                                ? "bg-emerald-400 animate-pulse"
                                : banner.status === "Akan Datang"
                                ? "bg-amber-400"
                                : "bg-zinc-400"
                            }`}
                          />
                          <span>{banner.status}</span>
                        </div>
                      </div>

                      <div className="space-y-1 relative">
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                          {banner.title}
                        </h3>
                        {banner.japaneseTitle && (
                          <p className="text-xs text-white/70 font-mono">
                            {banner.japaneseTitle}
                          </p>
                        )}
                      </div>

                      {/* Period & Countdown */}
                      <div className="pt-2 flex items-center justify-between text-xs text-white/90 font-medium border-t border-white/10">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-white/70" />
                          <span>
                            {new Date(banner.startAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            -{" "}
                            {new Date(banner.endAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{timeInfo.text}</span>
                        </div>
                      </div>
                    </div>

                    {/* Banner Body Content */}
                    <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {banner.description}
                        </p>

                        {/* Rate Highlights */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-muted/30 border border-border text-xs">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Peluang ★4 / ★5:</span>
                            <strong className="text-pink-600 font-bold">
                              {banner.pickupRates.maxRarityRate}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Peluang Pickup:</span>
                            <strong className="text-foreground font-bold">
                              {banner.pickupRates.featuredTotalRate}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Ambang Spark:</span>
                            <strong className="text-emerald-600 font-bold">
                              {banner.pitySystem.pityThreshold} Seal
                            </strong>
                          </div>
                        </div>

                        {/* Featured Characters List */}
                        {banner.featuredCharacters.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                              <span>Kartu Karakter Unggulan (Pickup Rate-Up):</span>
                            </span>

                            <div className="space-y-2.5">
                              {banner.featuredCharacters.map((char) => (
                                <div
                                  key={char.id}
                                  className="p-3 rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3 text-xs"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${char.avatarBg} text-white flex items-center justify-center font-black shadow-xs shrink-0`}
                                    >
                                      ★{char.rarity}
                                    </div>
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                                        <span>{char.name}</span>
                                        <span className="text-[10px] text-muted-foreground font-normal">
                                          ({char.bandName})
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-pink-600 font-medium">
                                        [{char.cardTitle}]
                                      </p>
                                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          {getAttrIcon(char.attribute)}
                                          <span>{char.attribute}</span>
                                        </span>
                                        <span>•</span>
                                        <span className="text-foreground font-semibold">
                                          Skill: {char.skillBoost}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className="text-[10px] text-muted-foreground block">Rate</span>
                                    <span className="font-mono font-bold text-pink-600">
                                      {char.pickupRate}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReminderModalBanner(banner)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold transition-colors cursor-pointer"
                          >
                            <Bell className="h-3.5 w-3.5" />
                            <span>Pasang Pengingat</span>
                          </button>

                          <button
                            onClick={() => handleSimulateTenPull(banner)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 text-pink-700 dark:text-pink-300 font-bold transition-colors cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Tes Tarik 10x</span>
                          </button>
                        </div>

                        <button
                          onClick={() => setSelectedBannerDetail(banner)}
                          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold transition-colors cursor-pointer ml-auto"
                        >
                          <span>Drop Rate Lengkap</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </>
    )}

        {/* Section: Panduan Pity System & Gacha Seal */}
        <section id="panduan-pity" className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Panduan Pity Seal & Sistem Jaminan Spark
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Bagaimana sistem perlindungan penarikan (safety net) bekerja di Bang Dream! Our Notes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-600 text-white font-black text-xs">
                  1
                </span>
                <span>Kumpulkan Gacha Seal</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Tiap 1 roll (250 Stars) menghasilkan <strong>1 Gacha Seal</strong>. Roll 10x (2.500 Stars) menghasilkan <strong>10 Gacha Seal</strong>. Seal terkumpul di tab penukaran banner tersebut.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-600 text-white font-black text-xs">
                  2
                </span>
                <span>Tukar di 300 Seal (Spark)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Saat kamu mencapai <strong>300 Gacha Seal</strong> (setara 75.000 Stars), kamu berhak menukarkan kartu ★4 unggulan pilihanmu secara langsung tanpa bergantung pada keberuntungan roll.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-600 text-white font-black text-xs">
                  3
                </span>
                <span>Konversi Akhir Periode</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Gacha Seal <em>tidak dapat diwariskan</em> ke banner berikutnya. Saat banner berakhir, sisa seal otomatis dikonversi menjadi <strong>Michelle Stickers</strong> untuk menukar item latihan studio.
              </p>
            </div>
          </div>

          {/* F2P Stars Savings Strategy Box */}
          <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/60 dark:border-pink-900/40 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-pink-700 dark:text-pink-300">
              <Zap className="h-4 w-4 text-pink-600" />
              <span>Tips Pengelolaan Stars untuk Pemain F2P (Gratis):</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Disarankan menahan Stars kamu untuk <strong>KiraKirameki Festival</strong> karena peluang ★4 digandakan menjadi 6%. Hindari melakukan roll 1x atau 2x secara terpisah; selalu prioritaskan roll 10x untuk menjamin minimal 1 kartu ★3 atau lebih tinggi!
            </p>
          </div>
        </section>

        {/* Modal: Pasang Pengingat Banner Gacha */}
        {reminderModalBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card border border-border shadow-2xl animate-in zoom-in-95">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  <h3 className="font-black text-base text-foreground">
                    Pasang Pengingat Gacha
                  </h3>
                </div>
                <button
                  onClick={() => setReminderModalBanner(null)}
                  className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveReminder} className="p-5 space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Target Banner:
                  </span>
                  <h4 className="font-bold text-foreground text-sm">
                    {reminderModalBanner.title}
                  </h4>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300">
                    Berakhir pada:{" "}
                    {new Date(reminderModalBanner.endAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground block">
                    Kapan Ingin Diingatkan?
                  </label>
                  <select
                    value={reminderTimeNotice}
                    onChange={(e) => setReminderTimeNotice(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-3.5 py-2 text-xs"
                  >
                    <option value="h-3">H-3 Sebelum Banner Berakhir</option>
                    <option value="h-1">H-1 Sebelum Banner Berakhir (Direkomendasikan)</option>
                    <option value="h-day">6 Jam Sebelum Penutupan Server</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground block">
                    Alamat Email (Opsional / Notifikasi Cloud)
                  </label>
                  <input
                    type="email"
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-input bg-muted/20 px-3.5 py-2.5 text-xs focus:border-purple-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Pengingat juga akan tersimpan di browser lokalmu.
                  </span>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReminderModalBanner(null)}
                    className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs"
                  >
                    Aktifkan Pengingat
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Drop Rate Details */}
        {selectedBannerDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-border shadow-2xl animate-in zoom-in-95 space-y-4 p-6 text-xs max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-pink-600" />
                  <h3 className="font-black text-base text-foreground">
                    Rincian Peluang Drop Rate
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBannerDetail(null)}
                  className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-sm">
                  {selectedBannerDetail.title}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Kategori: {selectedBannerDetail.category} • Periode aktif sampai{" "}
                  {new Date(selectedBannerDetail.endAt).toLocaleDateString("id-ID")}
                </p>
              </div>

              {/* Rates Table */}
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground font-bold">
                    <tr>
                      <th className="p-3">Kelangkaan (Rarity)</th>
                      <th className="p-3 text-right">Persentase Peluang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-xs">
                    <tr className="bg-pink-50/30 dark:bg-pink-950/20 font-bold">
                      <td className="p-3 text-pink-600">Kartu ★4 (Super Rare)</td>
                      <td className="p-3 text-right text-pink-600">
                        {selectedBannerDetail.pickupRates.maxRarityRate}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">Kartu ★3 (Rare)</td>
                      <td className="p-3 text-right">
                        {selectedBannerDetail.pickupRates.star3Rate}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">Kartu ★2 (Normal)</td>
                      <td className="p-3 text-right">
                        {selectedBannerDetail.pickupRates.star2Rate}
                      </td>
                    </tr>
                    <tr className="bg-muted/30 font-bold">
                      <td className="p-3">Total Karakter Pickup Unggulan</td>
                      <td className="p-3 text-right text-emerald-600">
                        {selectedBannerDetail.pickupRates.featuredTotalRate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Spark Rules */}
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5 text-[11px]">
                <strong className="text-foreground block font-bold">
                  Aturan Penukaran Spark Seal:
                </strong>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedBannerDetail.pitySystem.rules}
                </p>
                <div className="pt-1 text-pink-600 font-bold">
                  Barang Tukar: {selectedBannerDetail.pitySystem.exchangeItem}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedBannerDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-xs"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Pull Simulator Result */}
        {pullSimBanner && simResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-border shadow-2xl animate-in zoom-in-95 p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pink-600" />
                  <h3 className="font-black text-base text-foreground">
                    Hasil Simulasi Tarik 10x
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setPullSimBanner(null);
                    setSimResults(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-2.5 rounded-2xl bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Banner: <strong>{pullSimBanner.title}</strong></span>
                <span className="font-bold text-pink-600">+10 Gacha Seal Didapat</span>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {simResults.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-center space-y-1 ${
                      res.rarity === 4
                        ? "border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500"
                        : res.rarity === 3
                        ? "border-amber-400 bg-amber-400/10 text-amber-700 dark:text-amber-300"
                        : "border-border bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    <div className="font-black text-xs">★{res.rarity}</div>
                    <div className="text-[10px] truncate font-bold">{res.name}</div>
                    {res.isPickup && (
                      <span className="inline-block px-1.5 py-0.2 rounded bg-pink-600 text-white text-[9px] font-black">
                        PICKUP!
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <button
                  onClick={() => handleSimulateTenPull(pullSimBanner)}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Coba Lagi (10x Pull)</span>
                </button>

                <button
                  onClick={() => {
                    setPullSimBanner(null);
                    setSimResults(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs"
                >
                  Selesai
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

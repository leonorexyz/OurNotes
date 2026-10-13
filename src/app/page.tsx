"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  BookOpen,
  Lightbulb,
  Trophy,
  HelpCircle,
  ArrowRight,
  Flame,
  Star,
  Users2,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GuideSectionNav } from "@/components/GuideSectionNav";
import { GuideCard } from "@/components/GuideCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PanduanPemulaSection } from "@/components/PanduanPemulaSection";
import { TipsTrikSection } from "@/components/TipsTrikSection";
import { GUIDES_DATA, GUIDE_SECTIONS, FAQ_LIST } from "@/data/guidesData";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtered guides based on search query
  const filteredGuides = useMemo(() => {
    return GUIDES_DATA.filter((item) => {
      if (item.section === "faq") return false; // FAQ has its own component
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery]);

  // Counts by section
  const sectionCounts = useMemo(() => {
    return {
      pemula: GUIDES_DATA.filter((g) => g.section === "pemula").length,
      tips: GUIDES_DATA.filter((g) => g.section === "tips").length,
      event: GUIDES_DATA.filter((g) => g.section === "event").length,
      faq: FAQ_LIST.length,
    };
  }, []);

  const pemulaGuides = filteredGuides.filter((g) => g.section === "pemula");
  const tipsGuides = filteredGuides.filter((g) => g.section === "tips");
  const eventGuides = filteredGuides.filter((g) => g.section === "event");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-pink-50/60 via-purple-50/20 to-background dark:from-pink-950/20 dark:via-purple-950/10 dark:to-background py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,114,182,0.12),transparent_40%)]" />
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 dark:bg-pink-950/60 px-3 py-1 text-xs font-semibold text-pink-700 dark:text-pink-300 border border-pink-200/60">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pusat Panduan Resmi Komunitas Our Notes</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Kuasai Ritme, Bentuk Tim & Menangkan Panggung!
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Panduan komprehensif 4 bagian untuk pemain baru maupun veteran di <span className="font-semibold text-foreground">Bang Dream! Our Notes</span>. Mulai dari mekanik dasar, optimasi flame harian, strategi event, hingga FAQ terlengkap.
              </p>

              {/* Quick stats banner */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span><strong>11+</strong> Artikel Panduan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-pink-500" />
                  <span><strong>4</strong> Bagian Terstruktur</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>Tips Harian Efisien</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-purple-500" />
                  <span>Bahasa Indonesia Ringan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Four-Part Navigation & Content */}
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
          {/* Controls Bar: Section Switcher & Search */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Pilih Bagian Panduan
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Klik salah satu bagian untuk fokus atau lihat panduan yang kamu butuhkan.
                </p>
              </div>

              {/* Global search input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="search-guide-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, kata kunci, tag..."
                  className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>

            {/* 4-PART NAVIGATION COMPONENT */}
            <GuideSectionNav
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              counts={sectionCounts}
            />
          </div>

          {/* SECTION 1: PANDUAN PEMULA */}
          {(activeSection === "all" || activeSection === "pemula") && (
            <div id="pemula" className="space-y-6 pt-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      1. Panduan Pemula
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Langkah awal pemain baru: registrasi akun, kontrol ritme, dan tim perdana.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {pemulaGuides.length} Panduan
                </span>
              </div>

              {/* Numbered Steps & Interactive Illustration Walkthrough */}
              <PanduanPemulaSection />

              <div className="pt-2">
                <h4 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <span>Katalog Artikel Lengkap Pemula</span>
                  <span className="text-xs font-normal text-muted-foreground">• Baca topik per artikel</span>
                </h4>
                {pemulaGuides.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">Tidak ada panduan pemula yang cocok dengan pencarian.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pemulaGuides.map((guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 2: TIPS & TRIK */}
          {(activeSection === "all" || activeSection === "tips") && (
            <div id="tips" className="space-y-6 pt-8">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      2. Tips & Trik Harian
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Efisiensi live boost, peningkatan dekorasi area, dan strategi multi-live.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  {tipsGuides.length} Panduan
                </span>
              </div>

              {/* Grouped & Scannable Tips Component */}
              <TipsTrikSection />

              <div className="pt-2">
                <h4 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <span>Katalog Artikel Lengkap Tips & Trik</span>
                  <span className="text-xs font-normal text-muted-foreground">• Baca topik per artikel</span>
                </h4>
                {tipsGuides.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">Tidak ada tips yang cocok dengan pencarian.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tipsGuides.map((guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: PANDUAN EVENT */}
          {(activeSection === "all" || activeSection === "event") && (
            <div id="event" className="space-y-5 pt-8">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      3. Panduan Event & Ranking
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Format turnamen mingguan, multiplier poin karakter, dan penukaran badge.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {eventGuides.length} Panduan
                </span>
              </div>

              {eventGuides.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4">Tidak ada panduan event yang cocok dengan pencarian.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {eventGuides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: PERTANYAAN UMUM (FAQ) */}
          {(activeSection === "all" || activeSection === "faq") && (
            <div id="faq" className="space-y-5 pt-8">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500 text-white shadow-sm">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      4. Pertanyaan Umum (FAQ)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Jawaban cepat untuk pertanyaan teknis, akun, gacha, dan gameplay.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
                  {FAQ_LIST.length} Tanya-Jawab
                </span>
              </div>

              <FaqAccordion />
            </div>
          )}

          {/* Call-to-action banner to explore characters & team builder */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
            <div className="relative max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <Users2 className="h-3.5 w-3.5" />
                <span>Langkah Selanjutnya Setelah Panduan</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Siap Menyusun Formasi Band Impianmu?
              </h3>
              <p className="text-sm sm:text-base text-pink-100 leading-relaxed">
                Setelah memahami dasar permainan, telusuri profil seluruh karakter dan gunakan fitur kalkulator sinergi tim untuk menguji kekuatan formasi live kamu.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/karakter"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-pink-600 shadow-md hover:bg-pink-50 transition-colors"
                >
                  <span>Lihat Daftar Karakter</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tim"
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-800/60 hover:bg-pink-800/80 border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors"
                >
                  <span>Coba Susun Tim</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

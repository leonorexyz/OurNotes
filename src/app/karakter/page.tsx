"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Star,
  Sparkles,
  ArrowLeft,
  X,
  Scale,
  Check,
  Shield,
  Zap,
  Music,
  ExternalLink,
} from "lucide-react";
import { CHARACTERS_DATA, BANDS_DATA, Character } from "@/data/charactersData";
import { CharacterCard } from "@/components/CharacterCard";

export default function KarakterPage() {
  const [selectedBand, setSelectedBand] = useState<string>("all");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"power" | "rarity" | "name">("power");

  // Character comparison state (max 2 characters)
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Toggle character in comparison
  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((item) => item !== id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], id]); // Replace oldest
      } else {
        setCompareList([...compareList, id]);
      }
    }
  };

  // Filter & sort characters
  const filteredCharacters = useMemo(() => {
    return CHARACTERS_DATA.filter((c) => {
      const matchBand = selectedBand === "all" || c.bandId === selectedBand;
      const matchAttr = selectedAttribute === "all" || c.attribute === selectedAttribute;
      const matchRole = selectedRole === "all" || c.role === selectedRole;
      const matchQuery =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.japaneseName.includes(searchQuery) ||
        c.bandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skill.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchBand && matchAttr && matchRole && matchQuery;
    }).sort((a, b) => {
      if (sortBy === "power") return b.stats.total - a.stats.total;
      if (sortBy === "rarity") return b.rarity - a.rarity;
      return a.name.localeCompare(b.name);
    });
  }, [selectedBand, selectedAttribute, selectedRole, searchQuery, sortBy]);

  const comparedChars = CHARACTERS_DATA.filter((c) => compareList.includes(c.id));

  const attributeStyles = {
    Power: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200",
    Pure: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200",
    Cool: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200",
    Happy: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Panduan
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Daftar Karakter</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-pink-200/60 dark:border-pink-900/40 bg-gradient-to-r from-pink-50/70 via-purple-50/40 to-background dark:from-pink-950/20 dark:via-purple-950/10 dark:to-background p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 dark:bg-pink-950/60 px-3 py-1 text-xs font-semibold text-pink-700 dark:text-pink-300 border border-pink-200/60">
              <Users className="h-3.5 w-3.5" />
              <span>Katalog Karakter & Band (Fase 2)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Profil Karakter Bang Dream! Our Notes
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Jelajahi profil lengkap seluruh karakter dari 9 band. Cek statistik individual, efek skill Score Booster, cerita singkat, dan bandingkan dua karakter secara berdampingan.
            </p>
          </div>
        </div>

        {/* Band Pills Filter */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Telusuri Berdasarkan Band:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
            <button
              onClick={() => setSelectedBand("all")}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedBand === "all"
                  ? "bg-pink-600 text-white shadow-sm scale-105"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Semua Band ({CHARACTERS_DATA.length})
            </button>
            {BANDS_DATA.map((band) => (
              <button
                key={band.id}
                onClick={() => setSelectedBand(band.id)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  selectedBand === band.id
                    ? "bg-pink-600 text-white shadow-sm scale-105"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {band.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama karakter, skill, band..."
                className="w-full rounded-xl border border-input bg-background py-2 pl-10 pr-9 text-xs sm:text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown & Compare Button */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="power">Total Power Tertinggi</option>
                  <option value="rarity">Rarity (★5 dulu)</option>
                  <option value="name">Nama (A-Z)</option>
                </select>
              </div>

              {/* Compare Trigger Button */}
              {compareList.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity animate-in fade-in"
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>Bandingkan ({compareList.length}/2)</span>
                </button>
              )}
            </div>
          </div>

          {/* Secondary filter chips (Attribute & Role) */}
          <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Attribute filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-muted-foreground font-semibold">Atribut:</span>
              {["all", "Power", "Pure", "Cool", "Happy"].map((attr) => (
                <button
                  key={attr}
                  onClick={() => setSelectedAttribute(attr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedAttribute === attr
                      ? "bg-foreground text-background font-bold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {attr === "all" ? "Semua" : attr}
                </button>
              ))}
            </div>

            {/* Role filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-muted-foreground font-semibold">Role:</span>
              {["all", "Vocal", "Guitar", "Bass"].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedRole === r
                      ? "bg-foreground text-background font-bold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r === "all" ? "Semua" : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Menampilkan <strong>{filteredCharacters.length}</strong> karakter</span>
          {compareList.length > 0 && (
            <button
              onClick={() => setCompareList([])}
              className="text-pink-600 hover:underline font-semibold"
            >
              Kosongkan Pilihan Bandingkan ({compareList.length})
            </button>
          )}
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isComparing={compareList.includes(char.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>

        {/* COMPARISON MODAL (Adu Statistik Dua Karakter) */}
        {showCompareModal && comparedChars.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-card border border-border rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-600 text-white">
                    <Scale className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                      Adu Statistik Karakter Berdampingan
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Bandingkan kekuatan total, atribut, dan efek skill dua karakter.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCompareModal(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {comparedChars.length === 1 ? (
                <div className="text-center py-8 text-xs text-muted-foreground space-y-2">
                  <p>Kamu baru memilih 1 karakter. Pilih 1 karakter lagi di daftar untuk membandingkan keduanya!</p>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold"
                  >
                    Pilih Karakter Kedua
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 text-xs">
                  {comparedChars.map((c, idx) => (
                    <div key={c.id} className="space-y-4 p-4 rounded-2xl bg-muted/30 border border-border">
                      <div className={`p-4 rounded-xl bg-gradient-to-tr ${c.avatarBg} text-white space-y-1`}>
                        <div className="text-[10px] opacity-80">{c.bandName}</div>
                        <h4 className="font-extrabold text-base sm:text-lg">{c.name}</h4>
                        <div className="text-[11px] font-semibold">{c.role} • {c.attribute}</div>
                      </div>

                      {/* Stat Comparison Table */}
                      <div className="space-y-2 font-mono">
                        <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                          <span>Total Power</span>
                          <strong className="text-foreground text-sm font-bold">{c.stats.total.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                          <span>Performance</span>
                          <strong>{c.stats.performance.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                          <span>Technique</span>
                          <strong>{c.stats.technique.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                          <span>Visual</span>
                          <strong>{c.stats.visual.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Skill details */}
                      <div className="p-3 rounded-xl bg-card border border-border space-y-1 font-sans">
                        <div className="text-[10px] font-bold text-pink-600">{c.skill.boostValue} Boost</div>
                        <strong className="text-foreground font-semibold block">{c.skill.name}</strong>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{c.skill.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Tutup Perbandingan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

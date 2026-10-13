"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  RotateCcw,
  Flame,
  Leaf,
  Snowflake,
  Sun,
  Mic,
  Guitar,
  Radio,
  Drum,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { CHARACTERS_DATA, BANDS_DATA, Character } from "@/data/charactersData";
import { CharacterCard } from "@/components/CharacterCard";

const ROLES: Array<{ id: string; label: string }> = [
  { id: "all", label: "Semua Role" },
  { id: "Vocal", label: "Vocal" },
  { id: "Guitar", label: "Guitar" },
  { id: "Bass", label: "Bass" },
  { id: "Drums", label: "Drums" },
  { id: "Keyboard", label: "Keyboard" },
  { id: "DJ", label: "DJ" },
  { id: "Violin", label: "Violin" },
];

const ATTRIBUTES: Array<{ id: string; label: string; icon: any; color: string }> = [
  { id: "all", label: "Semua Atribut", icon: Sparkles, color: "text-foreground" },
  { id: "Power", label: "Power", icon: Flame, color: "text-red-500" },
  { id: "Pure", label: "Pure", icon: Leaf, color: "text-emerald-500" },
  { id: "Cool", label: "Cool", icon: Snowflake, color: "text-blue-500" },
  { id: "Happy", label: "Happy", icon: Sun, color: "text-amber-500" },
];

function KarakterContent() {
  const searchParams = useSearchParams();

  // Read initial filter from URL params if available
  const initialBand = searchParams.get("band") || "all";
  const initialRole = searchParams.get("role") || "all";
  const initialAttr = searchParams.get("attr") || "all";

  const [selectedBand, setSelectedBand] = useState<string>(initialBand);
  const [selectedAttribute, setSelectedAttribute] = useState<string>(initialAttr);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("power");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  // Sync state if URL search params change
  useEffect(() => {
    const bandParam = searchParams.get("band");
    if (bandParam && bandParam !== selectedBand) {
      setSelectedBand(bandParam);
    }
  }, [searchParams]);

  // Character comparison state (max 2 characters)
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((item) => item !== id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], id]);
      } else {
        setCompareList([...compareList, id]);
      }
    }
  };

  const resetAllFilters = () => {
    setSelectedBand("all");
    setSelectedAttribute("all");
    setSelectedRole("all");
    setSelectedRarity("all");
    setSearchQuery("");
    setSortBy("power");
    setSortDirection("desc");
  };

  const isFiltered =
    selectedBand !== "all" ||
    selectedAttribute !== "all" ||
    selectedRole !== "all" ||
    selectedRarity !== "all" ||
    searchQuery.trim().length > 0;

  // Filter & sort logic with ascending/descending direction
  const filteredCharacters = useMemo(() => {
    const multiplier = sortDirection === "desc" ? 1 : -1;

    return CHARACTERS_DATA.filter((c) => {
      const matchBand = selectedBand === "all" || c.bandId === selectedBand;
      const matchAttr = selectedAttribute === "all" || c.attribute === selectedAttribute;
      const matchRole = selectedRole === "all" || c.role === selectedRole;
      const matchRarity = selectedRarity === "all" || c.rarity.toString() === selectedRarity;
      const matchQuery =
        searchQuery.trim() === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.japaneseName.includes(searchQuery) ||
        c.bandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase());

      return matchBand && matchAttr && matchRole && matchRarity && matchQuery;
    }).sort((a, b) => {
      if (sortBy === "power") return multiplier * (b.stats.total - a.stats.total);
      if (sortBy === "rarity") return multiplier * (b.rarity - a.rarity);
      if (sortBy === "hp") return multiplier * (b.stats.hp - a.stats.hp);
      if (sortBy === "performance") return multiplier * (b.stats.performance - a.stats.performance);
      if (sortBy === "technique") return multiplier * (b.stats.technique - a.stats.technique);
      if (sortBy === "visual") return multiplier * (b.stats.visual - a.stats.visual);
      if (sortBy === "name") {
        return sortDirection === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [selectedBand, selectedAttribute, selectedRole, selectedRarity, searchQuery, sortBy, sortDirection]);

  // Breakdown of attributes in active filtered results
  const resultAttributeCounts = useMemo(() => {
    const counts = { Power: 0, Pure: 0, Cool: 0, Happy: 0 };
    filteredCharacters.forEach((c) => {
      if (counts[c.attribute] !== undefined) {
        counts[c.attribute]++;
      }
    });
    return counts;
  }, [filteredCharacters]);

  // Count active criteria
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBand !== "all") count++;
    if (selectedAttribute !== "all") count++;
    if (selectedRole !== "all") count++;
    if (selectedRarity !== "all") count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [selectedBand, selectedAttribute, selectedRole, selectedRarity, searchQuery]);

  const comparedChars = CHARACTERS_DATA.filter((c) => compareList.includes(c.id));

  return (
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
            <span>Katalog Karakter Bang Dream!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Profil Karakter Bang Dream! Our Notes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Filter karakter berdasarkan band favorit, role panggung, atribut Live, dan tingkat kelangkaan. Bandingkan statistik untuk menyusun tim optimal.
          </p>
        </div>
      </div>

      {/* Band Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Filter Berdasarkan Band:</span>
          <Link href="/band" className="text-pink-600 hover:text-pink-700 font-semibold normal-case flex items-center gap-1">
            <span>Daftar 9 Band Lengkap</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
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
          {BANDS_DATA.map((band) => {
            const count = CHARACTERS_DATA.filter((c) => c.bandId === band.id).length;
            return (
              <button
                key={band.id}
                onClick={() => setSelectedBand(band.id)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedBand === band.id
                    ? "bg-pink-600 text-white shadow-sm scale-105"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{band.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Filter Bar */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-5">
        {/* Row 1: Search, Sorting, and Compare */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama karakter, skill, atribut..."
              className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-9 text-xs sm:text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                title="Hapus pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-pink-500"
              >
                <option value="power">Total BP</option>
                <option value="rarity">Rarity (Bintang)</option>
                <option value="performance">Stat Performance</option>
                <option value="technique">Stat Technique</option>
                <option value="visual">Stat Visual</option>
                <option value="hp">Max Life / HP</option>
                <option value="name">Nama Karakter</option>
              </select>
            </div>

            {/* Ascending / Descending Toggle Button */}
            <button
              onClick={() => setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-2xs"
              title={sortDirection === "desc" ? "Urutan Menurun (Tertinggi ke Terendah)" : "Urutan Menaik (Terendah ke Tertinggi)"}
            >
              {sortDirection === "desc" ? (
                <>
                  <ArrowDown className="h-3.5 w-3.5 text-pink-600" />
                  <span>Turun (↓)</span>
                </>
              ) : (
                <>
                  <ArrowUp className="h-3.5 w-3.5 text-pink-600" />
                  <span>Naik (↑)</span>
                </>
              )}
            </button>

            {/* Quick Reset Button if active */}
            {(isFiltered || sortDirection !== "desc" || sortBy !== "power") && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-xs font-bold text-pink-700 dark:text-pink-300 transition-colors"
                title="Reset semua filter dan arah pengurutan"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}

            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
              >
                <Scale className="h-3.5 w-3.5" />
                <span>Bandingkan ({compareList.length}/2)</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Secondary Filter Criteria (Attribute, Role, Rarity) */}
        <div className="pt-4 border-t border-border/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Attribute Selection */}
          <div className="space-y-1.5">
            <span className="font-bold text-muted-foreground block">Atribut Live:</span>
            <div className="flex flex-wrap gap-1.5">
              {ATTRIBUTES.map((attr) => {
                const Icon = attr.icon;
                return (
                  <button
                    key={attr.id}
                    onClick={() => setSelectedAttribute(attr.id)}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors ${
                      selectedAttribute === attr.id
                        ? "bg-foreground text-background shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className={`h-3 w-3 ${attr.color}`} />
                    <span>{attr.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <span className="font-bold text-muted-foreground block">Posisi / Role:</span>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedRole === role.id
                      ? "bg-foreground text-background shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity Selection */}
          <div className="space-y-1.5">
            <span className="font-bold text-muted-foreground block">Rarity Kartu:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "Semua Rarity" },
                { id: "5", label: "★5 Bintang" },
                { id: "4", label: "★4 Bintang" },
              ].map((rarity) => (
                <button
                  key={rarity.id}
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedRarity === rarity.id
                      ? "bg-foreground text-background shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {rarity.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Active Filter Chips & Clear */}
        {isFiltered && (
          <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-muted-foreground font-semibold">Filter Aktif:</span>

              {selectedBand !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-medium">
                  Band: {BANDS_DATA.find((b) => b.id === selectedBand)?.name || selectedBand}
                  <button onClick={() => setSelectedBand("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {selectedAttribute !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                  Atribut: {selectedAttribute}
                  <button onClick={() => setSelectedAttribute("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {selectedRole !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium">
                  Role: {selectedRole}
                  <button onClick={() => setSelectedRole("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {selectedRarity !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">
                  ★{selectedRarity}
                  <button onClick={() => setSelectedRarity("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-foreground font-medium">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 font-bold text-pink-600 hover:text-pink-700 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Result Count Status & Real-time Breakdown */}
      <div
        aria-live="polite"
        className="rounded-2xl border border-border/70 bg-card/60 p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 font-bold">
            <Users className="h-3.5 w-3.5" />
            <span>
              Ditemukan <strong>{filteredCharacters.length}</strong> dari {CHARACTERS_DATA.length} Karakter
            </span>
            <span className="text-[10px] font-normal opacity-80">
              ({Math.round((filteredCharacters.length / CHARACTERS_DATA.length) * 100)}%)
            </span>
          </div>

          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold">
              <Filter className="h-3 w-3" />
              <span>{activeFiltersCount} Kriteria Aktif</span>
            </span>
          )}

          {/* Mini Attribute Breakdown in Filtered Results */}
          <div className="hidden sm:flex items-center gap-1.5 pl-1 text-[11px] font-semibold text-muted-foreground border-l border-border/60">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
              🔥 Power: {resultAttributeCounts.Power}
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              🌿 Pure: {resultAttributeCounts.Pure}
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              ❄️ Cool: {resultAttributeCounts.Cool}
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              ⭐ Happy: {resultAttributeCounts.Happy}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto text-muted-foreground">
          <span className="text-[11px]">
            Arah: <strong>{sortDirection === "desc" ? "Menurun (↓)" : "Menaik (↑)"}</strong>
          </span>

          {compareList.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>{compareList.length} Dipilih</span>
            </button>
          )}
        </div>
      </div>

      {/* Characters Cards Grid */}
      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isCompared={compareList.includes(char.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
            <Filter className="h-8 w-8 opacity-60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Tidak Ada Karakter yang Cocok</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Tidak ditemukan kartu karakter dengan kombinasi filter atau kata kunci saat ini. Silakan ubah filter atau lakukan reset.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}

      {/* Comparison Modal Dialog */}
      {showCompareModal && comparedChars.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">Adu Statistik Karakter</h3>
                  <p className="text-xs text-muted-foreground">
                    Perbandingan langsung statistik, skill, dan atribut kartu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Side-by-side comparison grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparedChars.map((char) => (
                <div
                  key={char.id}
                  className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${char.avatarBg} text-white flex items-center justify-center font-black text-xl shadow-xs`}
                      >
                        {char.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-pink-600">
                          {char.bandName} • {char.role}
                        </div>
                        <h4 className="text-base font-extrabold text-foreground">{char.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          {Array.from({ length: char.rarity }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats Comparison Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-border/30">
                        <span className="text-muted-foreground">Total BP:</span>
                        <span className="font-mono font-bold text-pink-600">{char.stats.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-border/30">
                        <span className="text-muted-foreground">Performance:</span>
                        <span className="font-mono font-semibold">{char.stats.performance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-border/30">
                        <span className="text-muted-foreground">Technique:</span>
                        <span className="font-mono font-semibold">{char.stats.technique.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-border/30">
                        <span className="text-muted-foreground">Visual:</span>
                        <span className="font-mono font-semibold">{char.stats.visual.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Max HP / Life:</span>
                        <span className="font-mono font-semibold text-emerald-600">{char.stats.hp}</span>
                      </div>
                    </div>

                    {/* Skill Info */}
                    <div className="rounded-xl bg-card border border-border p-3 space-y-1">
                      <div className="text-[11px] font-bold text-pink-600 uppercase tracking-wider">
                        {char.skill.name} ({char.skill.type})
                      </div>
                      <p className="text-xs text-muted-foreground">{char.skill.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCompare(char.id)}
                    className="w-full py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Hapus dari Perbandingan
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              {comparedChars.length === 2 && (
                <Link
                  href={`/karakter/bandingkan?c1=${comparedChars[0].id}&c2=${comparedChars[1].id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors shadow-xs"
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>Buka Analisis Komparasi Lengkap</span>
                </Link>
              )}
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity sm:ml-auto"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function KarakterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />
      <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground">Memuat katalog karakter...</div>}>
        <KarakterContent />
      </Suspense>
      <Footer />
    </div>
  );
}

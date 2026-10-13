"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Scale,
  ArrowLeft,
  ArrowRightLeft,
  Star,
  Zap,
  Shield,
  Music2,
  Sparkles,
  Trophy,
  ExternalLink,
  Flame,
  Leaf,
  Snowflake,
  Sun,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CHARACTERS_DATA, Character } from "@/data/charactersData";

function BandingkanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const c1Param = searchParams.get("c1") || CHARACTERS_DATA[0]?.id || "char-kasumi-toyama";
  const c2Param = searchParams.get("c2") || CHARACTERS_DATA[1]?.id || "char-yukina-minato";

  const [char1Id, setChar1Id] = useState<string>(c1Param);
  const [char2Id, setChar2Id] = useState<string>(c2Param);

  const char1 = useMemo(
    () => CHARACTERS_DATA.find((c) => c.id === char1Id) || CHARACTERS_DATA[0],
    [char1Id]
  );
  const char2 = useMemo(
    () => CHARACTERS_DATA.find((c) => c.id === char2Id) || CHARACTERS_DATA[1],
    [char2Id]
  );

  const swapCharacters = () => {
    const temp = char1Id;
    setChar1Id(char2Id);
    setChar2Id(temp);
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

  // Delta calculations
  const totalDiff = char1.stats.total - char2.stats.total;
  const perfDiff = char1.stats.performance - char2.stats.performance;
  const techDiff = char1.stats.technique - char2.stats.technique;
  const visDiff = char1.stats.visual - char2.stats.visual;
  const hpDiff = char1.stats.hp - char2.stats.hp;

  const sameBand = char1.bandId === char2.bandId;
  const sameAttr = char1.attribute === char2.attribute;

  // Tally category wins
  const char1Wins = [
    char1.stats.total > char2.stats.total,
    char1.stats.performance > char2.stats.performance,
    char1.stats.technique > char2.stats.technique,
    char1.stats.visual > char2.stats.visual,
    char1.stats.hp > char2.stats.hp,
  ].filter(Boolean).length;

  const char2Wins = [
    char2.stats.total > char1.stats.total,
    char2.stats.performance > char1.stats.performance,
    char2.stats.technique > char1.stats.technique,
    char2.stats.visual > char1.stats.visual,
    char2.stats.hp > char1.stats.hp,
  ].filter(Boolean).length;

  const renderDelta = (v1: number, v2: number) => {
    const diff = v1 - v2;
    if (diff === 0) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          Imbang
        </span>
      );
    }
    const pct = ((Math.abs(diff) / v2) * 100).toFixed(1);
    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
          +{diff.toLocaleString()} (+{pct}%) ▲
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
        -{Math.abs(diff).toLocaleString()} (-{pct}%) ▼
      </span>
    );
  };

  // Quick preset finders for Character 2
  const pickMateFromBand = () => {
    const mate = CHARACTERS_DATA.find((c) => c.bandId === char1.bandId && c.id !== char1.id);
    if (mate) setChar2Id(mate.id);
  };

  const pickMateFromRole = () => {
    const mate = CHARACTERS_DATA.find((c) => c.role === char1.role && c.id !== char1.id);
    if (mate) setChar2Id(mate.id);
  };

  const pickMateFromAttr = () => {
    const mate = CHARACTERS_DATA.find((c) => c.attribute === char1.attribute && c.id !== char1.id);
    if (mate) setChar2Id(mate.id);
  };

  return (
    <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/karakter" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
          <ArrowLeft className="h-3.5 w-3.5" />
          Katalog Karakter
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Bandingkan Dua Karakter</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl border border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-r from-purple-50/70 via-pink-50/40 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-950/60 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-200/60">
            <Scale className="h-3.5 w-3.5" />
            <span>Fitur Komparasi Statistik Interaktif</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Adu Statistik Dua Karakter
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Bandingkan Total Band Power (BP), trio parameter (Performance, Technique, Visual), Life poin, serta tipe skill booster untuk menentukan formasi tim panggung terbaik.
          </p>
        </div>
      </div>

      {/* Character Selector Controls & Quick Match Presets */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Character 1 Dropdown */}
          <div className="w-full sm:flex-1 space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground block">
              Pilih Karakter Pertama (Sisi Kiri):
            </label>
            <select
              value={char1Id}
              onChange={(e) => setChar1Id(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:border-pink-500"
            >
              {CHARACTERS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.bandName} - {c.role} - ★{c.rarity})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="self-center pt-2 sm:pt-4">
            <button
              onClick={swapCharacters}
              className="p-3 rounded-2xl bg-muted/80 hover:bg-pink-100 dark:hover:bg-pink-950/60 text-muted-foreground hover:text-pink-600 transition-colors shadow-2xs"
              title="Tukar Posisi Karakter"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Character 2 Dropdown */}
          <div className="w-full sm:flex-1 space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground block">
              Pilih Karakter Kedua (Sisi Kanan):
            </label>
            <select
              value={char2Id}
              onChange={(e) => setChar2Id(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:border-pink-500"
            >
              {CHARACTERS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.bandName} - {c.role} - ★{c.rarity})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Presets */}
        <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground font-semibold">Preset Cepat Lawan Tanding:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={pickMateFromBand}
              className="px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 text-pink-700 dark:text-pink-300 font-semibold transition-colors"
            >
              Rekan Se-Band ({char1.bandName})
            </button>
            <button
              onClick={pickMateFromRole}
              className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-semibold transition-colors"
            >
              Rival Se-Role ({char1.role})
            </button>
            <button
              onClick={pickMateFromAttr}
              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold transition-colors"
            >
              Rekan Se-Atribut ({char1.attribute})
            </button>
          </div>
        </div>
      </div>

      {/* Head-to-Head Tally Score Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-muted/30 to-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Skor Adu 5 Parameter Utama
            </span>
            <h3 className="text-lg font-black text-foreground">
              {char1Wins > char2Wins ? (
                <>
                  <span className="text-pink-600">{char1.name}</span> Unggul ({char1Wins} vs {char2Wins})
                </>
              ) : char2Wins > char1Wins ? (
                <>
                  <span className="text-purple-600">{char2.name}</span> Unggul ({char2Wins} vs {char1Wins})
                </>
              ) : (
                <>Hasil Imbang ({char1Wins} vs {char2Wins})</>
              )}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
            {char1.name}: {char1Wins} Poin
          </span>
          <span className="text-muted-foreground">vs</span>
          <span className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
            {char2.name}: {char2Wins} Poin
          </span>
        </div>
      </div>

      {/* Side-by-Side Hero Character Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${char1.avatarBg} text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0`}
              >
                {char1.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono text-muted-foreground block truncate">
                  {char1.japaneseName}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-foreground truncate">
                  {char1.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-pink-600">{char1.bandName}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-medium text-foreground">{char1.role}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
              <div className="flex items-center gap-1.5 font-bold">
                {getAttrIcon(char1.attribute)}
                <span>Atribut {char1.attribute}</span>
              </div>
              <div className="flex items-center text-amber-500">
                {Array.from({ length: char1.rarity }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                ))}
              </div>
            </div>

            {/* Total BP Box */}
            <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/50 dark:border-pink-900/40 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Band Power (BP)
              </span>
              <span className="text-2xl sm:text-3xl font-black text-pink-600 font-mono">
                {char1.stats.total.toLocaleString()}
              </span>
              {totalDiff > 0 && (
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <Trophy className="h-3 w-3" />
                  <span>+{totalDiff.toLocaleString()} lebih tinggi</span>
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/karakter/${char1.id}`}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-xs font-bold text-foreground transition-colors"
          >
            <span>Lihat Profil Lengkap {char1.name}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Card 2 */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${char2.avatarBg} text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0`}
              >
                {char2.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono text-muted-foreground block truncate">
                  {char2.japaneseName}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-foreground truncate">
                  {char2.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-pink-600">{char2.bandName}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-medium text-foreground">{char2.role}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
              <div className="flex items-center gap-1.5 font-bold">
                {getAttrIcon(char2.attribute)}
                <span>Atribut {char2.attribute}</span>
              </div>
              <div className="flex items-center text-amber-500">
                {Array.from({ length: char2.rarity }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                ))}
              </div>
            </div>

            {/* Total BP Box */}
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/40 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Band Power (BP)
              </span>
              <span className="text-2xl sm:text-3xl font-black text-purple-600 font-mono">
                {char2.stats.total.toLocaleString()}
              </span>
              {totalDiff < 0 && (
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <Trophy className="h-3 w-3" />
                  <span>+{Math.abs(totalDiff).toLocaleString()} lebih tinggi</span>
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/karakter/${char2.id}`}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-xs font-bold text-foreground transition-colors"
          >
            <span>Lihat Profil Lengkap {char2.name}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Head-to-Head Detailed Parameter Comparison Matrix */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Perbandingan Parameter Lengkap</h2>
          <p className="text-xs text-muted-foreground">
            Sorotan nilai parameter individu dengan indikator pemenang statistik
          </p>
        </div>

        <div className="space-y-4">
          {/* Row 1: Total Band Power */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="text-pink-600 font-mono font-bold text-sm sm:text-base">
                  {char1.stats.total.toLocaleString()}
                </span>
                {renderDelta(char1.stats.total, char2.stats.total)}
              </div>
              <span className="text-foreground font-extrabold uppercase tracking-wider text-[11px]">
                Total Band Power (BP)
              </span>
              <div className="flex items-center gap-2">
                {renderDelta(char2.stats.total, char1.stats.total)}
                <span className="text-purple-600 font-mono font-bold text-sm sm:text-base">
                  {char2.stats.total.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 h-3 rounded-full overflow-hidden bg-muted">
              <div
                className={`h-full rounded-l-full transition-all ${
                  char1.stats.total >= char2.stats.total ? "bg-pink-500" : "bg-pink-300 dark:bg-pink-900"
                }`}
                style={{ width: `${(char1.stats.total / (char1.stats.total + char2.stats.total)) * 200}%` }}
              />
              <div
                className={`h-full rounded-r-full transition-all ml-auto ${
                  char2.stats.total >= char1.stats.total ? "bg-purple-500" : "bg-purple-300 dark:bg-purple-900"
                }`}
                style={{ width: `${(char2.stats.total / (char1.stats.total + char2.stats.total)) * 200}%` }}
              />
            </div>
          </div>

          {/* Row 2: Performance */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">
                  {char1.stats.performance.toLocaleString()}
                </span>
                {renderDelta(char1.stats.performance, char2.stats.performance)}
              </div>
              <span className="font-semibold text-muted-foreground text-[11px]">Performance</span>
              <div className="flex items-center gap-2">
                {renderDelta(char2.stats.performance, char1.stats.performance)}
                <span className="font-mono font-bold text-foreground">
                  {char2.stats.performance.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 h-2.5 rounded-full overflow-hidden bg-muted">
              <div
                className="h-full bg-red-400 rounded-l-full"
                style={{
                  width: `${(char1.stats.performance / (char1.stats.performance + char2.stats.performance)) * 200}%`,
                }}
              />
              <div
                className="h-full bg-red-500 rounded-r-full ml-auto"
                style={{
                  width: `${(char2.stats.performance / (char1.stats.performance + char2.stats.performance)) * 200}%`,
                }}
              />
            </div>
          </div>

          {/* Row 3: Technique */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">
                  {char1.stats.technique.toLocaleString()}
                </span>
                {renderDelta(char1.stats.technique, char2.stats.technique)}
              </div>
              <span className="font-semibold text-muted-foreground text-[11px]">Technique</span>
              <div className="flex items-center gap-2">
                {renderDelta(char2.stats.technique, char1.stats.technique)}
                <span className="font-mono font-bold text-foreground">
                  {char2.stats.technique.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 h-2.5 rounded-full overflow-hidden bg-muted">
              <div
                className="h-full bg-blue-400 rounded-l-full"
                style={{
                  width: `${(char1.stats.technique / (char1.stats.technique + char2.stats.technique)) * 200}%`,
                }}
              />
              <div
                className="h-full bg-blue-500 rounded-r-full ml-auto"
                style={{
                  width: `${(char2.stats.technique / (char1.stats.technique + char2.stats.technique)) * 200}%`,
                }}
              />
            </div>
          </div>

          {/* Row 4: Visual */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">
                  {char1.stats.visual.toLocaleString()}
                </span>
                {renderDelta(char1.stats.visual, char2.stats.visual)}
              </div>
              <span className="font-semibold text-muted-foreground text-[11px]">Visual</span>
              <div className="flex items-center gap-2">
                {renderDelta(char2.stats.visual, char1.stats.visual)}
                <span className="font-mono font-bold text-foreground">
                  {char2.stats.visual.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 h-2.5 rounded-full overflow-hidden bg-muted">
              <div
                className="h-full bg-amber-400 rounded-l-full"
                style={{
                  width: `${(char1.stats.visual / (char1.stats.visual + char2.stats.visual)) * 200}%`,
                }}
              />
              <div
                className="h-full bg-amber-500 rounded-r-full ml-auto"
                style={{
                  width: `${(char2.stats.visual / (char1.stats.visual + char2.stats.visual)) * 200}%`,
                }}
              />
            </div>
          </div>

          {/* Row 5: Max HP */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">
                  {char1.stats.hp}
                </span>
                {renderDelta(char1.stats.hp, char2.stats.hp)}
              </div>
              <span className="font-semibold text-muted-foreground text-[11px]">Max Life / HP</span>
              <div className="flex items-center gap-2">
                {renderDelta(char2.stats.hp, char1.stats.hp)}
                <span className="font-mono font-bold text-foreground">
                  {char2.stats.hp}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 h-2.5 rounded-full overflow-hidden bg-muted">
              <div
                className="h-full bg-emerald-400 rounded-l-full"
                style={{ width: `${(char1.stats.hp / (char1.stats.hp + char2.stats.hp)) * 200}%` }}
              />
              <div
                className="h-full bg-emerald-500 rounded-r-full ml-auto"
                style={{ width: `${(char2.stats.hp / (char1.stats.hp + char2.stats.hp)) * 200}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skill Comparison Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-pink-500" />
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              Skill: {char1.skill.name}
            </h3>
          </div>
          <div className="inline-block px-2.5 py-1 rounded-lg bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 text-xs font-bold">
            Tipe: {char1.skill.type} ({char1.skill.boostValue})
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {char1.skill.description}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              Skill: {char2.skill.name}
            </h3>
          </div>
          <div className="inline-block px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-xs font-bold">
            Tipe: {char2.skill.type} ({char2.skill.boostValue})
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {char2.skill.description}
          </p>
        </div>
      </section>

      {/* Synergy Analysis & Recommendation */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-bold tracking-tight">Analisis Sinergi & Rekomendasi Tim</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-border/80 bg-muted/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-foreground">
              {sameBand ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Satu Band ({char1.bandName})</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Band Berbeda ({char1.bandName} vs {char2.bandName})</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground">
              {sameBand
                ? "Dapat mengaktifkan bonus instrumen & poster band hingga +20% BP saat dimasukkan ke dalam tim yang sama."
                : "Tidak berbagi bonus area item band, tetapi masih dapat dikombinasikan jika atribut kartu seirama."}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-muted/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-foreground">
              {sameAttr ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Satu Atribut ({char1.attribute})</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Atribut Berbeda ({char1.attribute} vs {char2.attribute})</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground">
              {sameAttr
                ? `Sangat ideal untuk event live bertema ${char1.attribute} dengan multiplier skor poin event +20% hingga +50%.`
                : "Atribut berbeda memberikan fleksibilitas untuk memenuhi syarat beragam event mingguan."}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/tim"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-700 transition-colors shadow-sm"
          >
            <Music2 className="h-4 w-4" />
            <span>Simulasikan Formasi di Susun Tim</span>
          </Link>
          <Link
            href="/karakter"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-input bg-card hover:bg-muted text-foreground font-bold text-xs transition-colors"
          >
            <span>Kembali ke Katalog Karakter</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function BandingkanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />
      <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground">Memuat perbandingan karakter...</div>}>
        <BandingkanContent />
      </Suspense>
      <Footer />
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import {
  Layers,
  ArrowLeft,
  Users,
  Sparkles,
  Zap,
  Star,
  Plus,
  Trash2,
  Crown,
  Trophy,
  Flame,
  Leaf,
  Snowflake,
  Sun,
  RotateCcw,
  Wand2,
  CheckCircle2,
  Info,
  Scale,
  ExternalLink,
  ChevronRight,
  Shield,
  X,
  Search,
} from "lucide-react";
import { CHARACTERS_DATA, BANDS_DATA, Character } from "@/data/charactersData";
import { RECOMMENDED_TEAMS, RecommendedTeam } from "@/data/recommendedTeamsData";

interface TeamSlot {
  slotNumber: number;
  isCenter: boolean;
  character: Character | null;
}

const DEFAULT_SLOTS: TeamSlot[] = [
  { slotNumber: 1, isCenter: false, character: null },
  { slotNumber: 2, isCenter: false, character: null },
  { slotNumber: 3, isCenter: true, character: null }, // Center slot
  { slotNumber: 4, isCenter: false, character: null },
  { slotNumber: 5, isCenter: false, character: null },
];

function TimBuilderContent() {
  const searchParams = useSearchParams();
  const leadParam = searchParams.get("lead");

  const [slots, setSlots] = useState<TeamSlot[]>(() => {
    const initial = [...DEFAULT_SLOTS];
    if (leadParam) {
      const leadChar = CHARACTERS_DATA.find((c) => c.id === leadParam);
      if (leadChar) {
        initial[2] = { ...initial[2], character: leadChar };
      }
    } else {
      // Default sample team: Kasumi Center, Yukina, Ran, Saya, Arisa
      initial[0] = { ...initial[0], character: CHARACTERS_DATA.find((c) => c.id === "char-ran-mitake") || null };
      initial[1] = { ...initial[1], character: CHARACTERS_DATA.find((c) => c.id === "char-saya-yamabuki") || null };
      initial[2] = { ...initial[2], character: CHARACTERS_DATA.find((c) => c.id === "char-kasumi-toyama") || null };
      initial[3] = { ...initial[3], character: CHARACTERS_DATA.find((c) => c.id === "char-arisa-ichigaya") || null };
      initial[4] = { ...initial[4], character: CHARACTERS_DATA.find((c) => c.id === "char-yukina-minato") || null };
    }
    return initial;
  });

  const [activePickerSlot, setActivePickerSlot] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState<string>("");
  const [pickerBand, setPickerBand] = useState<string>("all");
  const [pickerAttr, setPickerAttr] = useState<string>("all");

  // Recommended team states
  const [selectedDetailTeam, setSelectedDetailTeam] = useState<RecommendedTeam | null>(null);
  const [teamCategoryFilter, setTeamCategoryFilter] = useState<string>("all");

  const applyRecommendedTeam = (team: RecommendedTeam) => {
    const newSlots = [...DEFAULT_SLOTS];
    team.memberIds.forEach((charId, idx) => {
      const char = CHARACTERS_DATA.find((c) => c.id === charId) || null;
      newSlots[idx] = {
        slotNumber: idx + 1,
        isCenter: charId === team.centerMemberId || (idx === 2 && !team.memberIds.includes(team.centerMemberId)),
        character: char,
      };
    });
    setSlots(newSlots);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  const centerSlot = slots.find((s) => s.isCenter) || slots[2];
  const centerChar = centerSlot.character;

  const activeCharacters = slots.map((s) => s.character).filter(Boolean) as Character[];

  // Assign character to slot
  const assignCharacter = (slotIndex: number, char: Character) => {
    setSlots((prev) => {
      const next = [...prev];
      // If character is already in another slot, swap or clear that slot
      const existingIdx = next.findIndex((s) => s.character?.id === char.id);
      if (existingIdx !== -1 && existingIdx !== slotIndex) {
        next[existingIdx] = { ...next[existingIdx], character: null };
      }
      next[slotIndex] = { ...next[slotIndex], character: char };
      return next;
    });
    setActivePickerSlot(null);
  };

  const removeCharacter = (slotIndex: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = { ...next[slotIndex], character: null };
      return next;
    });
  };

  const setAsCenter = (slotIndex: number) => {
    setSlots((prev) =>
      prev.map((s, idx) => ({
        ...s,
        isCenter: idx === slotIndex,
      }))
    );
  };

  // Calculations
  const rawStats = useMemo(() => {
    return activeCharacters.reduce(
      (acc, c) => ({
        total: acc.total + c.stats.total,
        performance: acc.performance + c.stats.performance,
        technique: acc.technique + c.stats.technique,
        visual: acc.visual + c.stats.visual,
        hp: acc.hp + c.stats.hp,
      }),
      { total: 0, performance: 0, technique: 0, visual: 0, hp: 0 }
    );
  }, [activeCharacters]);

  // Band Synergy
  const bandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeCharacters.forEach((c) => {
      counts[c.bandId] = (counts[c.bandId] || 0) + 1;
    });
    return counts;
  }, [activeCharacters]);

  const maxBandCount = Math.max(0, ...Object.values(bandCounts));
  const dominantBandId = Object.keys(bandCounts).find((k) => bandCounts[k] === maxBandCount);
  const dominantBand = BANDS_DATA.find((b) => b.id === dominantBandId);

  const bandBonusPercent = maxBandCount === 5 ? 20 : maxBandCount >= 3 ? 10 : 0;

  // Attribute Synergy
  const attrCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeCharacters.forEach((c) => {
      counts[c.attribute] = (counts[c.attribute] || 0) + 1;
    });
    return counts;
  }, [activeCharacters]);

  const maxAttrCount = Math.max(0, ...Object.values(attrCounts));
  const dominantAttr = Object.keys(attrCounts).find((k) => attrCounts[k] === maxAttrCount);

  const attrBonusPercent = maxAttrCount === 5 ? 20 : maxAttrCount >= 3 ? 10 : 0;

  // Effective Total Band Power including Synergies
  const effectiveBP = Math.round(
    rawStats.total * (1 + (bandBonusPercent + attrBonusPercent) / 100)
  );

  // Auto Presets
  const applyPreset = (presetName: string) => {
    const newSlots = [...DEFAULT_SLOTS];

    if (presetName === "poppin") {
      const popipa = CHARACTERS_DATA.filter((c) => c.bandId === "poppin-party");
      popipa.slice(0, 5).forEach((char, i) => {
        newSlots[i] = { ...newSlots[i], character: char, isCenter: i === 2 };
      });
    } else if (presetName === "roselia") {
      const roselia = CHARACTERS_DATA.filter((c) => c.bandId === "roselia");
      roselia.slice(0, 5).forEach((char, i) => {
        newSlots[i] = { ...newSlots[i], character: char, isCenter: i === 2 };
      });
    } else if (presetName === "high_power") {
      const sorted = [...CHARACTERS_DATA].sort((a, b) => b.stats.total - a.stats.total);
      sorted.slice(0, 5).forEach((char, i) => {
        newSlots[i] = { ...newSlots[i], character: char, isCenter: i === 2 };
      });
    } else if (presetName === "cool_synergy") {
      const coolChars = CHARACTERS_DATA.filter((c) => c.attribute === "Cool");
      coolChars.slice(0, 5).forEach((char, i) => {
        newSlots[i] = { ...newSlots[i], character: char, isCenter: i === 2 };
      });
    }

    setSlots(newSlots);
  };

  const clearAllSlots = () => {
    setSlots(DEFAULT_SLOTS.map((s) => ({ ...s, character: null })));
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

  // Filtered list for Picker Modal
  const pickerCharacters = useMemo(() => {
    return CHARACTERS_DATA.filter((c) => {
      const matchBand = pickerBand === "all" || c.bandId === pickerBand;
      const matchAttr = pickerAttr === "all" || c.attribute === pickerAttr;
      const matchSearch =
        c.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        c.japaneseName.includes(pickerSearch) ||
        c.bandName.toLowerCase().includes(pickerSearch.toLowerCase());
      return matchBand && matchAttr && matchSearch;
    });
  }, [pickerBand, pickerAttr, pickerSearch]);

  const filteredRecommendedTeams = useMemo(() => {
    if (teamCategoryFilter === "all") return RECOMMENDED_TEAMS;
    return RECOMMENDED_TEAMS.filter((t) => t.category === teamCategoryFilter);
  }, [teamCategoryFilter]);

  return (
    <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
          <ArrowLeft className="h-3.5 w-3.5" />
          Panduan Utama
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Susun Tim & Formasi Band</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl border border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-background dark:from-purple-950/20 dark:via-indigo-950/10 dark:to-background p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-950/60 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-200/60">
            <Layers className="h-3.5 w-3.5" />
            <span>Simulator Formasi 5 Slot</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Penyusun Tim & Sinergi Band Power
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pasang 5 kartu idolamu, aktifkan Leader Skill di Slot Center, dan raih bonus sinergi hingga +40% dari keselarasan Band serta Atribut Live Show!
          </p>
        </div>
      </div>

      {/* Team Preset Quick Controls */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-muted-foreground flex items-center gap-1.5">
            <Wand2 className="h-3.5 w-3.5 text-pink-500" />
            <span>Preset Cepat:</span>
          </span>
          <button
            onClick={() => applyPreset("high_power")}
            className="px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 font-bold transition-colors"
          >
            Total BP Tertinggi
          </button>
          <button
            onClick={() => applyPreset("poppin")}
            className="px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground font-semibold transition-colors"
          >
            Poppin&apos;Party Murni
          </button>
          <button
            onClick={() => applyPreset("roselia")}
            className="px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground font-semibold transition-colors"
          >
            Roselia Symphonic
          </button>
          <button
            onClick={() => applyPreset("cool_synergy")}
            className="px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground font-semibold transition-colors"
          >
            Atribut Cool Full (+20%)
          </button>
        </div>

        <button
          onClick={clearAllSlots}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-red-600 font-semibold transition-colors ml-auto sm:ml-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Kosongkan Semua Slot</span>
        </button>
      </div>

      {/* 5-Slot Interactive Stage */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <span>Panggung Formasi (5 Personel)</span>
            <span className="text-xs font-normal text-muted-foreground">
              ({activeCharacters.length}/5 Terisi)
            </span>
          </h2>

          <span className="text-xs text-pink-600 font-bold hidden sm:inline">
            Center Slot memicu efek Leader Skill di Multi-Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          {slots.map((slot, index) => {
            const char = slot.character;

            return (
              <div
                key={slot.slotNumber}
                className={`group relative rounded-3xl border transition-all duration-200 flex flex-col justify-between p-4 ${
                  slot.isCenter
                    ? "border-pink-500 bg-gradient-to-b from-pink-50/50 via-card to-card dark:from-pink-950/20 dark:via-card dark:to-card ring-2 ring-pink-500/20 shadow-md"
                    : "border-border bg-card shadow-xs hover:border-pink-300"
                }`}
              >
                {/* Slot Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-border/50 text-[11px]">
                  <span
                    className={`font-black flex items-center gap-1 ${
                      slot.isCenter ? "text-pink-600 uppercase" : "text-muted-foreground"
                    }`}
                  >
                    {slot.isCenter ? (
                      <>
                        <Crown className="h-3.5 w-3.5" />
                        <span>CENTER</span>
                      </>
                    ) : (
                      `Slot ${slot.slotNumber}`
                    )}
                  </span>

                  {char && !slot.isCenter && (
                    <button
                      onClick={() => setAsCenter(index)}
                      className="text-[10px] text-muted-foreground hover:text-pink-600 font-semibold"
                      title="Jadikan Center Leader"
                    >
                      Pilih Center
                    </button>
                  )}
                </div>

                {/* Character Content or Empty State */}
                {char ? (
                  <div className="py-3 space-y-3">
                    <div
                      className={`h-20 rounded-2xl bg-gradient-to-tr ${char.avatarBg} text-white p-3 flex flex-col justify-between shadow-xs relative overflow-hidden`}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 pointer-events-none" />
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono opacity-80 truncate">{char.bandName}</span>
                        <div className="flex text-amber-300">
                          {Array.from({ length: char.rarity }).map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 fill-amber-300" />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-white truncate leading-tight">
                          {char.name}
                        </h4>
                        <span className="text-[10px] font-semibold opacity-90">{char.role}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                          {getAttrIcon(char.attribute)}
                          {char.attribute}
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {char.stats.total.toLocaleString()} BP
                        </span>
                      </div>

                      {slot.isCenter && (
                        <div className="p-2 rounded-xl bg-pink-100/70 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-900/50 text-[10px] space-y-0.5">
                          <strong className="text-pink-700 dark:text-pink-300 block truncate">
                            {char.skill.name}
                          </strong>
                          <span className="text-muted-foreground block line-clamp-1">
                            {char.skill.boostValue} • {char.skill.type}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setActivePickerSlot(index)}
                    className="py-8 my-auto flex flex-col items-center justify-center text-center cursor-pointer group-hover:scale-105 transition-transform"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-pink-100 dark:group-hover:bg-pink-950 group-hover:text-pink-600 transition-colors">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground mt-2">
                      Pilih Karakter
                    </span>
                  </div>
                )}

                {/* Card Action Controls */}
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-1">
                  {char ? (
                    <>
                      <button
                        onClick={() => setActivePickerSlot(index)}
                        className="text-[11px] font-bold text-pink-600 hover:text-pink-700 py-1"
                      >
                        Ganti
                      </button>
                      <button
                        onClick={() => removeCharacter(index)}
                        className="text-muted-foreground hover:text-red-600 p-1 rounded-lg"
                        title="Lepas Karakter"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setActivePickerSlot(index)}
                      className="w-full py-1 text-center text-[11px] font-bold text-pink-600 hover:underline"
                    >
                      + Pasang
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real-time Team Statistics & Synergy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Band Power Card */}
        <div className="rounded-3xl border border-pink-200/70 dark:border-pink-900/50 bg-gradient-to-br from-pink-50/50 via-card to-card dark:from-pink-950/20 dark:via-card dark:to-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Band Power Efektif
            </span>
            <Trophy className="h-5 w-5 text-pink-500" />
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-pink-600 font-mono tracking-tight">
              {effectiveBP.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              BP Dasar: <strong>{rawStats.total.toLocaleString()}</strong> + Bonus Sinergi:{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                +{(bandBonusPercent + attrBonusPercent)}%
              </strong>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-border/60 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stat Performance:</span>
              <strong className="font-mono">{rawStats.performance.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stat Technique:</span>
              <strong className="font-mono">{rawStats.technique.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stat Visual:</span>
              <strong className="font-mono">{rawStats.visual.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Life Tim:</span>
              <strong className="font-mono text-emerald-600">{rawStats.hp} HP</strong>
            </div>
          </div>
        </div>

        {/* Synergy Buff Matrix */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="font-bold text-base text-foreground">Bonus Sinergi Band & Atribut</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Band Synergy Status */}
            <div className="p-3 rounded-2xl border border-border bg-muted/30 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-foreground">Sinergi Band:</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] ${
                    bandBonusPercent > 0
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  +{bandBonusPercent}% BP
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {dominantBand
                  ? `${maxBandCount} karakter dari ${dominantBand.name}`
                  : "Belum ada karakter yang terpasang"}
                {maxBandCount === 5 && " (Full 5 Personel Se-Band Bonus Maksimal!)"}
              </p>
            </div>

            {/* Attribute Synergy Status */}
            <div className="p-3 rounded-2xl border border-border bg-muted/30 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-foreground">Sinergi Atribut:</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] ${
                    attrBonusPercent > 0
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  +{attrBonusPercent}% BP
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {dominantAttr
                  ? `${maxAttrCount} karakter dengan atribut ${dominantAttr}`
                  : "Belum ada atribut aktif"}
                {maxAttrCount === 5 && " (Mono-Attribute Formasi Sempurna untuk Event!)"}
              </p>
            </div>
          </div>
        </div>

        {/* Center Skill Spotlight */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-base text-foreground">Efek Center Leader Skill</h3>
            </div>

            {centerChar ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 space-y-1">
                  <div className="font-bold text-pink-700 dark:text-pink-300 flex items-center justify-between">
                    <span>{centerChar.skill.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-pink-200 dark:bg-pink-900 text-pink-800 dark:text-pink-200">
                      {centerChar.skill.boostValue}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {centerChar.skill.description}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Skill ini akan aktif secara prioritas di Multi-Live dan memberikan dorongan skor terbesar untuk anggota tim lainnya.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Belum ada karakter yang dipasang pada Center Slot. Pasang karakter untuk mengaktifkan Center Skill.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center gap-2">
            <Link
              href="/karakter"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground transition-colors"
            >
              Katalog Karakter
            </Link>
            <Link
              href="/karakter/bandingkan"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 text-xs font-bold text-pink-700 dark:text-pink-300 transition-colors"
            >
              Adu Statistik
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Teams Catalog Section */}
      <section className="space-y-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              <span>Daftar & Rekomendasi Build Tim Meta</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Formasi teruji untuk mencetak skor tertinggi di Multi-Live, panen poin event, dan kelangsungan hidup di lagu sulit.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: "all", label: "Semua Kategori" },
              { id: "Score Meta", label: "Score Meta" },
              { id: "Mono-Band", label: "Mono-Band" },
              { id: "Event Point", label: "Event Point" },
              { id: "Survival / Healer", label: "Survival Healer" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setTeamCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  teamCategoryFilter === cat.id
                    ? "bg-pink-600 text-white shadow-2xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecommendedTeams.map((team) => {
            const members = team.memberIds
              .map((id) => CHARACTERS_DATA.find((c) => c.id === id))
              .filter(Boolean) as Character[];

            return (
              <div
                key={team.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-pink-300 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold text-[11px]">
                      {team.category}
                    </span>
                    <span className="font-semibold text-muted-foreground text-[11px] flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      {team.targetRoom}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                      {team.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {team.tagline}
                    </p>
                  </div>

                  {/* Members Roster preview row */}
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Susunan 5 Personel:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {members.map((m, idx) => {
                        const isCenter = m.id === team.centerMemberId;
                        return (
                          <div
                            key={m.id + idx}
                            className={`p-1.5 rounded-xl border text-center flex flex-col items-center justify-between min-h-[72px] ${
                              isCenter
                                ? "border-pink-500 bg-pink-50/50 dark:bg-pink-950/40 ring-1 ring-pink-500/20"
                                : "border-border/60 bg-muted/30"
                            }`}
                          >
                            <div
                              className={`h-7 w-7 rounded-lg bg-gradient-to-tr ${m.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shadow-2xs relative`}
                            >
                              {m.name.charAt(0)}
                              {isCenter && (
                                <Crown className="h-2.5 w-2.5 text-amber-300 absolute -top-1 -right-1" />
                              )}
                            </div>
                            <span className="text-[9px] font-bold text-foreground truncate w-full block mt-1">
                              {m.name.split(" ")[0]}
                            </span>
                            <span className="text-[8px] text-muted-foreground truncate w-full block">
                              {m.role}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Synergy tag badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {team.synergyTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                  <button
                    onClick={() => applyRecommendedTeam(team)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Terapkan ke Simulator</span>
                  </button>
                  <button
                    onClick={() => setSelectedDetailTeam(team)}
                    className="py-2.5 px-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                  >
                    Detail Strategi
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detail Modal for Selected Recommended Team */}
      {selectedDetailTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold text-xs">
                    {selectedDetailTeam.category}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {selectedDetailTeam.targetRoom}
                  </span>
                </div>
                <h3 className="text-xl font-black text-foreground">
                  {selectedDetailTeam.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetailTeam(null)}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Strategy Breakdown */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-pink-500" />
                  <span>Taktik & Alur Strategi Bermain:</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                  {selectedDetailTeam.strategy}
                </p>
              </div>

              {/* Recommended Area Items */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Rekomendasi Area Items (CiRCLE & Edogawa):</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDetailTeam.recommendedAreaItems.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-lg bg-card border border-border font-semibold text-xs text-foreground"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Song Suitability */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span>Kecocokan Lagu & Challenge:</span>
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {selectedDetailTeam.songSuitability}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  applyRecommendedTeam(selectedDetailTeam);
                  setSelectedDetailTeam(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Terapkan Build Ini ke Simulator
              </button>
              <button
                onClick={() => setSelectedDetailTeam(null)}
                className="py-2.5 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Character Picker Modal Dialog */}
      {activePickerSlot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-card border border-border flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-foreground">
                  Pilih Karakter untuk {slots[activePickerSlot]?.isCenter ? "Slot Center" : `Slot ${slots[activePickerSlot]?.slotNumber}`}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pilih karakter dari katalog untuk dimasukkan ke dalam formasi tim
                </p>
              </div>
              <button
                onClick={() => setActivePickerSlot(null)}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter & Search Bar inside Picker */}
            <div className="p-4 bg-muted/30 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Cari nama karakter atau band..."
                  className="w-full rounded-xl border border-input bg-card py-2 pl-10 pr-4 text-xs sm:text-sm focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-muted-foreground font-semibold">Band:</span>
                  <select
                    value={pickerBand}
                    onChange={(e) => setPickerBand(e.target.value)}
                    className="rounded-lg border border-input bg-card px-2 py-1 text-xs"
                  >
                    <option value="all">Semua Band</option>
                    {BANDS_DATA.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-muted-foreground font-semibold">Atribut:</span>
                  <select
                    value={pickerAttr}
                    onChange={(e) => setPickerAttr(e.target.value)}
                    className="rounded-lg border border-input bg-card px-2 py-1 text-xs"
                  >
                    <option value="all">Semua Atribut</option>
                    <option value="Power">Power (🔥)</option>
                    <option value="Pure">Pure (🌿)</option>
                    <option value="Cool">Cool (❄️)</option>
                    <option value="Happy">Happy (⭐)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Characters Grid inside Picker */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {pickerCharacters.map((char) => {
                const isAlreadySelected = slots.some((s) => s.character?.id === char.id);

                return (
                  <div
                    key={char.id}
                    onClick={() => assignCharacter(activePickerSlot, char)}
                    className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isAlreadySelected
                        ? "border-pink-500/80 bg-pink-50/20 dark:bg-pink-950/20"
                        : "border-border hover:border-pink-400 hover:shadow-xs bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${char.avatarBg} text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs`}
                      >
                        {char.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <span>{char.bandName}</span>
                          <span>•</span>
                          <span>{char.role}</span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-foreground truncate">
                          {char.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-semibold text-pink-600">
                            {char.attribute}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {char.stats.total.toLocaleString()} BP
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground text-[10px] truncate max-w-[150px]">
                        {char.skill.name}
                      </span>
                      <span className="font-bold text-pink-600">
                        {isAlreadySelected ? "Ganti Posisi" : "Pilih"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
              <button
                onClick={() => setActivePickerSlot(null)}
                className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs"
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

export default function TimPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />
      <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground">Memuat alat susun tim...</div>}>
        <TimBuilderContent />
      </Suspense>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

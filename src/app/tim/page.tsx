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
  ArrowLeftRight,
  ChevronLeft,
  SlidersHorizontal,
  AlertTriangle,
  Lightbulb,
  FileText,
  Save,
  Award,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
} from "lucide-react";
import { CHARACTERS_DATA, BANDS_DATA, Character } from "@/data/charactersData";
import { RECOMMENDED_TEAMS, RecommendedTeam } from "@/data/recommendedTeamsData";

interface TeamSlot {
  slotNumber: number;
  isCenter: boolean;
  character: Character | null;
}

export interface SavedUserTeam {
  id: string;
  name: string;
  category: string;
  note: string;
  memberIds: string[];
  centerMemberId: string;
  effectiveBP: number;
  totalHP: number;
  synergyPercent: number;
  createdAt: string;
}

const DEFAULT_SLOTS: TeamSlot[] = [
  { slotNumber: 1, isCenter: false, character: null },
  { slotNumber: 2, isCenter: false, character: null },
  { slotNumber: 3, isCenter: true, character: null }, // Center slot
  { slotNumber: 4, isCenter: false, character: null },
  { slotNumber: 5, isCenter: false, character: null },
];

const INITIAL_SAVED_TEAMS: SavedUserTeam[] = [
  {
    id: "saved-poppin-kirakira",
    name: "Poppin'Party All Stars Pure",
    category: "Mono-Band",
    note: "Formasi andalan untuk event Pure. Kasumi Center memberikan bonus 110% Score Fever.",
    memberIds: [
      "char-ran-mitake",
      "char-saya-yamabuki",
      "char-kasumi-toyama",
      "char-arisa-ichigaya",
      "char-yukina-minato",
    ],
    centerMemberId: "char-kasumi-toyama",
    effectiveBP: 168480,
    totalHP: 5000,
    synergyPercent: 20,
    createdAt: "12 Okt 2026",
  },
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
  const [pickerRole, setPickerRole] = useState<string>("all");
  const [pickerRarity, setPickerRarity] = useState<string>("all");
  const [pickerSort, setPickerSort] = useState<string>("bp-desc");

  // User Saved Teams states
  const [savedTeams, setSavedTeams] = useState<SavedUserTeam[]>(INITIAL_SAVED_TEAMS);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTeamName, setSaveTeamName] = useState("");
  const [saveTeamCategory, setSaveTeamCategory] = useState("Score Attack");
  const [saveTeamNote, setSaveTeamNote] = useState("");
  const [copyFeedbackId, setCopyFeedbackId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("our_notes_saved_user_teams");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedTeams(parsed);
          }
        } catch {
          // fallback
        }
      }
    }
  }, []);

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
  };

  const removeCharacter = (slotIndex: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = { ...next[slotIndex], character: null };
      return next;
    });
  };

  const swapSlots = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= 5 || toIndex < 0 || toIndex >= 5 || fromIndex === toIndex) return;
    setSlots((prev) => {
      const next = [...prev];
      const tempChar = next[fromIndex].character;
      next[fromIndex] = { ...next[fromIndex], character: next[toIndex].character };
      next[toIndex] = { ...next[toIndex], character: tempChar };
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

  // Preview prospective synergy impact of selecting a candidate character
  const getSynergyImpact = (candidate: Character, slotIndex: number) => {
    const otherChars = slots
      .filter((s, idx) => idx !== slotIndex && s.character && s.character.id !== candidate.id)
      .map((s) => s.character as Character);
    const prospective = [...otherChars, candidate];
    const bandCount = prospective.filter((c) => c.bandId === candidate.bandId).length;
    const attrCount = prospective.filter((c) => c.attribute === candidate.attribute).length;
    return {
      bandCount,
      attrCount,
      hasBandBuff: bandCount >= 3,
      hasAttrBuff: attrCount >= 3,
      bandBonus: bandCount === 5 ? 20 : bandCount >= 3 ? 10 : 0,
      attrBonus: attrCount === 5 ? 20 : attrCount >= 3 ? 10 : 0,
    };
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

  // Custom User Strategy Note
  const [customTeamNote, setCustomTeamNote] = useState<string>("");
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("our_notes_team_custom_note");
      if (saved) setCustomTeamNote(saved);
    }
  }, []);

  const saveCustomNote = (val: string) => {
    setCustomTeamNote(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("our_notes_team_custom_note", val);
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2000);
    }
  };

  // Comprehensive Synergy Score & Tactical Analysis
  const synergyAnalysis = useMemo(() => {
    let score = 0;
    const notes: { type: "positive" | "warning" | "neutral" | "tip"; text: string }[] = [];

    // Base score from filled slots (up to 40 pts)
    score += activeCharacters.length * 8;

    // Band synergy points (up to 25 pts)
    if (maxBandCount === 5) {
      score += 25;
      notes.push({
        type: "positive",
        text: `Full 5 Personel ${dominantBand?.name || "Band"}: Memicu bonus sinergi instrumen band studio maksimal (+20% BP).`,
      });
    } else if (maxBandCount >= 3) {
      score += 15;
      notes.push({
        type: "positive",
        text: `Mayoritas ${maxBandCount} personel dari ${dominantBand?.name || "Band"}: Mendapatkan bonus sinergi band +10% BP.`,
      });
      notes.push({
        type: "tip",
        text: `Tambahkan ${5 - maxBandCount} personel lagi dari ${dominantBand?.name} untuk membuka bonus instrumen panggung penuh (+20% BP).`,
      });
    } else if (activeCharacters.length >= 3) {
      notes.push({
        type: "warning",
        text: "Band masih tersebar (kurang dari 3 personel se-band). Sinergi band belum aktif (0% bonus).",
      });
    }

    // Attribute synergy points (up to 25 pts)
    if (maxAttrCount === 5) {
      score += 25;
      notes.push({
        type: "positive",
        text: `Mono-Attribute ${dominantAttr} Murni (5/5): Formasi sempurna untuk panen skor event boosted attribute (+20% BP).`,
      });
    } else if (maxAttrCount >= 3) {
      score += 15;
      notes.push({
        type: "positive",
        text: `Mayoritas atribut ${dominantAttr} (${maxAttrCount}/5): Mendapatkan bonus sinergi atribut +10% BP.`,
      });
      notes.push({
        type: "tip",
        text: `Lengkapi formasi menjadi 5 atribut ${dominantAttr} untuk meraih skor maksimal di event live bertema atribut ini.`,
      });
    } else if (activeCharacters.length >= 3) {
      notes.push({
        type: "warning",
        text: "Atribut karakter masih acak. Sinergi atribut belum aktif (0% bonus).",
      });
    }

    // Center Leader Skill evaluation (up to 10 pts)
    if (centerChar) {
      if (centerChar.skill.type === "Score Up") {
        score += 10;
        notes.push({
          type: "positive",
          text: `Center Slot dipegang oleh ${centerChar.name} dengan skill Score Boost (${centerChar.skill.boostValue}) — pilihan paling ideal untuk Multi-Live Fever.`,
        });
      } else if (centerChar.skill.type === "Recovery") {
        score += 7;
        notes.push({
          type: "neutral",
          text: `Center Slot memiliki skill Pemulihan Darah (${centerChar.skill.name}) — menjaga kelangsungan hidup di tingkat kesulitan tinggi.`,
        });
      } else {
        score += 8;
        notes.push({
          type: "neutral",
          text: `Center Slot memiliki skill ${centerChar.skill.type} (${centerChar.skill.name}).`,
        });
      }
    } else {
      notes.push({
        type: "warning",
        text: "Slot Center masih kosong. Skill Leader tidak aktif!",
      });
    }

    // Survival Check
    if (rawStats.hp >= 5000) {
      notes.push({
        type: "positive",
        text: `Total Life tim ${rawStats.hp.toLocaleString()} HP memberikan buffer tinggi dari kegagalan live saat bermain chart Expert/Special.`,
      });
    }

    // Rank grade determination
    let grade = "C";
    let gradeColor = "text-muted-foreground";
    let gradeBg = "bg-muted text-foreground border-border";
    if (score >= 90) {
      grade = "SS";
      gradeColor = "text-amber-500";
      gradeBg = "bg-amber-500/10 text-amber-600 border-amber-500/30";
    } else if (score >= 75) {
      grade = "S";
      gradeColor = "text-pink-600";
      gradeBg = "bg-pink-500/10 text-pink-600 border-pink-500/30";
    } else if (score >= 55) {
      grade = "A";
      gradeColor = "text-purple-600";
      gradeBg = "bg-purple-500/10 text-purple-600 border-purple-500/30";
    } else if (score >= 35) {
      grade = "B";
      gradeColor = "text-blue-600";
      gradeBg = "bg-blue-500/10 text-blue-600 border-blue-500/30";
    }

    // Multi-live qualified room
    let room = "Regular Room";
    let roomBadge = "bg-muted text-muted-foreground border-border";
    if (effectiveBP >= 250000) {
      room = "Master Room (250k+)";
      roomBadge = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800";
    } else if (effectiveBP >= 180000) {
      room = "Grand Room (180k+)";
      roomBadge = "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-800";
    } else if (effectiveBP >= 120000) {
      room = "Pro Room (120k+)";
      roomBadge = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-800";
    }

    // Area item recommendations
    const recommendedItems: string[] = [];
    if (dominantBand) {
      recommendedItems.push(`Studio Instrument ${dominantBand.name} (Mic, Guitar, Bass, Drum, Keyboard)`);
      recommendedItems.push(`Poster & Flyer ${dominantBand.name}`);
    }
    if (dominantAttr) {
      recommendedItems.push(`Dekorasi Cafeteria & Kolam Tema ${dominantAttr}`);
    }
    if (recommendedItems.length === 0) {
      recommendedItems.push("Pasang karakter untuk melihat rekomendasi item area studio & kafetaria");
    }

    // Projected Score range calculation in standard Multi-Live song (approx 1,000 combo)
    const minProjectedScore = Math.round(effectiveBP * 5.8);
    const maxProjectedScore = Math.round(effectiveBP * 8.4);

    return {
      score,
      grade,
      gradeColor,
      gradeBg,
      notes,
      room,
      roomBadge,
      recommendedItems,
      minProjectedScore,
      maxProjectedScore,
    };
  }, [activeCharacters, maxBandCount, dominantBand, maxAttrCount, dominantAttr, centerChar, rawStats, effectiveBP]);

  // Saved Team Actions
  const saveCurrentTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTeamName.trim()) return;

    const newTeam: SavedUserTeam = {
      id: "team-" + Date.now(),
      name: saveTeamName.trim(),
      category: saveTeamCategory,
      note: saveTeamNote.trim(),
      memberIds: slots.map((s) => s.character?.id || ""),
      centerMemberId: centerChar?.id || "",
      effectiveBP,
      totalHP: rawStats.hp,
      synergyPercent: bandBonusPercent + attrBonusPercent,
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const updated = [newTeam, ...savedTeams];
    setSavedTeams(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("our_notes_saved_user_teams", JSON.stringify(updated));
    }

    setIsSaveModalOpen(false);
    setSaveTeamName("");
    setSaveTeamNote("");
    setActionNotice(`Formasi "${newTeam.name}" berhasil disimpan!`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const deleteSavedTeam = (teamId: string) => {
    const updated = savedTeams.filter((t) => t.id !== teamId);
    setSavedTeams(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("our_notes_saved_user_teams", JSON.stringify(updated));
    }
    setActionNotice("Formasi tim dihapus dari daftar tersimpan.");
    setTimeout(() => setActionNotice(null), 3000);
  };

  const loadSavedTeamToSimulator = (team: SavedUserTeam) => {
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
    setActionNotice(`Formasi "${team.name}" berhasil dimuat ke simulator!`);
    setTimeout(() => setActionNotice(null), 3000);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  const copyTeamSummary = (team: SavedUserTeam) => {
    const memberNames = team.memberIds
      .map((id, idx) => {
        const char = CHARACTERS_DATA.find((c) => c.id === id);
        return `${idx + 1}. ${char ? char.name : "Kosong"}${id === team.centerMemberId ? " (★ CENTER)" : ""}`;
      })
      .join("\n");

    const text = `🎵 Formasi Bang Dream! Our Notes: ${team.name}\nKategori: ${team.category}\nTotal BP: ${team.effectiveBP.toLocaleString()}\nSinergi: +${team.synergyPercent}%\n\nPersonel:\n${memberNames}\n\nCatatan: ${team.note || "-"}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyFeedbackId(team.id);
      setTimeout(() => setCopyFeedbackId(null), 2000);
    }
  };

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

  // Filtered & Sorted list for Picker Modal
  const pickerCharacters = useMemo(() => {
    const query = pickerSearch.trim().toLowerCase();

    return CHARACTERS_DATA.filter((c) => {
      const matchBand = pickerBand === "all" || c.bandId === pickerBand;
      const matchAttr = pickerAttr === "all" || c.attribute === pickerAttr;
      const matchRole =
        pickerRole === "all" || c.role.toLowerCase().includes(pickerRole.toLowerCase());
      const matchRarity =
        pickerRarity === "all" || c.rarity.toString() === pickerRarity;

      const matchSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.japaneseName.toLowerCase().includes(query) ||
        c.bandName.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query) ||
        c.skill.name.toLowerCase().includes(query) ||
        c.skill.type.toLowerCase().includes(query);

      return matchBand && matchAttr && matchRole && matchRarity && matchSearch;
    }).sort((a, b) => {
      if (pickerSort === "bp-desc") return b.stats.total - a.stats.total;
      if (pickerSort === "bp-asc") return a.stats.total - b.stats.total;
      if (pickerSort === "perf-desc") return b.stats.performance - a.stats.performance;
      if (pickerSort === "tech-desc") return b.stats.technique - a.stats.technique;
      if (pickerSort === "vis-desc") return b.stats.visual - a.stats.visual;
      if (pickerSort === "rarity-desc") return b.rarity - a.rarity;
      if (pickerSort === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [pickerBand, pickerAttr, pickerRole, pickerRarity, pickerSearch, pickerSort]);

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

      {/* Action Notice Toast */}
      {actionNotice && (
        <div className="rounded-2xl border border-pink-200 dark:border-pink-900 bg-pink-50/90 dark:bg-pink-950/70 p-3.5 text-xs text-pink-700 dark:text-pink-300 font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-pink-600" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="p-1 hover:bg-pink-100 dark:hover:bg-pink-900 rounded-lg"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Team Preset & Storage Quick Controls */}
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

        <div className="flex items-center gap-2 ml-auto sm:ml-0 flex-wrap">
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors shadow-2xs"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Simpan Formasi Ini</span>
          </button>

          <a
            href="#tim-tersimpan"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted/80 hover:bg-muted font-bold text-foreground transition-colors"
          >
            <BookmarkCheck className="h-3.5 w-3.5 text-pink-600" />
            <span>Tim Tersimpan ({savedTeams.length})</span>
          </a>

          <button
            onClick={clearAllSlots}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-red-600 font-semibold transition-colors px-2 py-1.5 rounded-xl"
            title="Kosongkan Semua Slot"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
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
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-1 text-[11px]">
                  {char ? (
                    <>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => swapSlots(index, index - 1)}
                          disabled={index === 0}
                          title={index === 0 ? "Slot paling kiri" : `Tukar dengan Slot ${index}`}
                          className="p-1 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-25 disabled:hover:bg-transparent"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => swapSlots(index, index + 1)}
                          disabled={index === 4}
                          title={index === 4 ? "Slot paling kanan" : `Tukar dengan Slot ${index + 2}`}
                          className="p-1 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-25 disabled:hover:bg-transparent"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActivePickerSlot(index)}
                          className="px-2 py-0.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 font-bold hover:bg-pink-100 transition-colors"
                        >
                          Ganti
                        </button>
                        <button
                          onClick={() => removeCharacter(index)}
                          className="text-muted-foreground hover:text-red-600 p-1 rounded-lg transition-colors"
                          title="Lepas Karakter dari Slot"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setActivePickerSlot(index)}
                      className="w-full py-1 text-center text-[11px] font-bold text-pink-600 hover:underline"
                    >
                      + Pasang Karakter
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

      {/* Skor Sinergi & Catatan Taktis Formasi Section */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Award className="h-6 w-6 text-pink-500" />
              <span>Skor Sinergi & Catatan Taktis Formasi</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Evaluasi mendalam potensi formasi, proyeksi skor live, kualifikasi room Multi-Live, dan rekomendasi area item.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Skor Sinergi & Grade */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Evaluasi Potensi Formasi
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${synergyAnalysis.gradeBg}`}>
                  Grade {synergyAnalysis.grade}
                </span>
              </div>

              {/* Score Number & Meter */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-foreground">
                    {synergyAnalysis.score}
                    <span className="text-base sm:text-lg text-muted-foreground font-normal"> / 100</span>
                  </div>
                  <span className={`text-xs font-black ${synergyAnalysis.gradeColor}`}>
                    {synergyAnalysis.score >= 90
                      ? "Formasi Meta Sempurna!"
                      : synergyAnalysis.score >= 75
                      ? "Sinergi Sangat Bagus"
                      : synergyAnalysis.score >= 50
                      ? "Komposisi Cukup Seimbang"
                      : "Perlu Peningkatan Sinergi"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, synergyAnalysis.score)}%` }}
                  />
                </div>
              </div>

              {/* Multi-Live Room Qualifier & Projected Score */}
              <div className="space-y-2 pt-3 border-t border-border/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Kualifikasi Multi-Live:</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${synergyAnalysis.roomBadge}`}>
                    {synergyAnalysis.room}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimasi Skor Song:</span>
                  <span className="font-mono font-bold text-foreground">
                    ~{(synergyAnalysis.minProjectedScore / 1000).toFixed(0)}k - {(synergyAnalysis.maxProjectedScore / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bonus Sinergi BP:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +{(bandBonusPercent + attrBonusPercent)}% ({Math.round(rawStats.total * ((bandBonusPercent + attrBonusPercent) / 100)).toLocaleString()} BP)
                  </span>
                </div>
              </div>
            </div>

            {/* Area Item Recommendations */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-2 text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5 text-[11px]">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Rekomendasi Upgrade Area Item:</span>
              </span>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                {synergyAnalysis.recommendedItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-pink-600 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 2: Catatan Taktis Otomatis Formasi */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-base text-foreground">Catatan & Analisis Taktis</h3>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {synergyAnalysis.notes.length} Analisis
                </span>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {synergyAnalysis.notes.map((note, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                        note.type === "positive"
                          ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                          : note.type === "warning"
                          ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200"
                          : note.type === "tip"
                          ? "bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50 text-purple-900 dark:text-purple-200"
                          : "bg-muted/40 border-border text-foreground"
                      }`}
                    >
                      {note.type === "positive" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : note.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : note.type === "tip" ? (
                        <Lightbulb className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <span>{note.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
              Catatan diperbarui secara real-time saat Anda mengganti karakter atau mengubah posisi Center.
            </p>
          </div>

          {/* Card 3: Catatan Pribadi Pengguna */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-pink-500" />
                  <h3 className="font-bold text-base text-foreground">Catatan Formasi Pribadi</h3>
                </div>
                {noteSavedFeedback && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                    ✓ Tersimpan
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Tuliskan catatan strategi Anda, target skor lagu, atau persiapan event berikutnya. Catatan ini tersimpan di browser Anda.
              </p>

              <textarea
                value={customTeamNote}
                onChange={(e) => saveCustomNote(e.target.value)}
                placeholder="Contoh: Formasi ini untuk push event tier 1000, butuh naikin level skill Center Kasumi ke level 5..."
                className="w-full h-36 rounded-2xl border border-input bg-muted/20 p-3 text-xs focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/30 resize-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
              <span className="text-[11px] text-muted-foreground">
                {customTeamNote.length} karakter
              </span>
              {customTeamNote && (
                <button
                  onClick={() => saveCustomNote("")}
                  className="text-[11px] text-muted-foreground hover:text-red-600 transition-colors"
                >
                  Hapus Catatan
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Daftar Formasi Tim Tersimpan Pengguna */}
      <section id="tim-tersimpan" className="space-y-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-pink-600" />
              <span>Daftar Formasi Tim Tersimpan Saya</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                {savedTeams.length} Formasi
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Koleksi racikan tim yang Anda simpan di browser untuk rotasi cepat dan uji coba komposisi.
            </p>
          </div>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <BookmarkCheck className="h-4 w-4" />
            <span>+ Simpan Formasi Saat Ini</span>
          </button>
        </div>

        {savedTeams.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3 bg-card/50">
            <Bookmark className="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <h3 className="font-bold text-sm text-foreground">Belum Ada Formasi Tersimpan</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Susun formasi 5 karakter impianmu di atas, lalu klik tombol &quot;Simpan Formasi Saat Ini&quot; untuk menyimpannya ke koleksi pribadimu.
            </p>
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 font-bold text-xs hover:bg-pink-200"
            >
              Simpan Formasi Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedTeams.map((team) => (
              <div
                key={team.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {team.category}
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-foreground mt-1 group-hover:text-pink-600 transition-colors">
                        {team.name}
                      </h3>
                      <span className="text-[10px] text-muted-foreground">
                        Disimpan: {team.createdAt}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteSavedTeam(team.id)}
                      className="text-muted-foreground hover:text-red-600 p-1 rounded-lg transition-colors"
                      title="Hapus Formasi Ini"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 5-Member Roster Preview */}
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center justify-between">
                      <span>Susunan Personel (5 Slot):</span>
                      <span className="text-pink-600 font-bold">★ = Center</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {team.memberIds.map((charId, idx) => {
                        const char = CHARACTERS_DATA.find((c) => c.id === charId);
                        const isCenter = charId === team.centerMemberId;

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center text-center space-y-1"
                            title={char ? `${char.name} (${char.bandName})` : "Slot Kosong"}
                          >
                            <div
                              className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs relative ${
                                char
                                  ? `bg-gradient-to-tr ${char.avatarBg} text-white shadow-2xs`
                                  : "bg-muted text-muted-foreground border border-dashed border-border"
                              } ${isCenter ? "ring-2 ring-pink-500" : ""}`}
                            >
                              {isCenter && (
                                <Crown className="h-3 w-3 text-amber-300 absolute -top-1.5 -right-1" />
                              )}
                              {char ? char.name.charAt(0) : "+"}
                            </div>
                            <span className="text-[9px] font-medium text-foreground truncate w-full">
                              {char ? char.name.split(" ")[0] : "Kosong"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Team Stats Summary */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-muted/20 p-2.5 rounded-2xl font-mono">
                    <div>
                      <span className="text-[9px] text-muted-foreground block font-sans">BP Efektif</span>
                      <strong className="text-pink-600 font-bold">{team.effectiveBP.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground block font-sans">Bonus Sinergi</span>
                      <strong className="text-emerald-600 font-bold">+{team.synergyPercent}%</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground block font-sans">Total Life</span>
                      <strong className="text-foreground font-bold">{team.totalHP} HP</strong>
                    </div>
                  </div>

                  {/* Team Note (if any) */}
                  {team.note && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 bg-muted/20 p-2 rounded-xl italic">
                      &quot;{team.note}&quot;
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyTeamSummary(team)}
                    className="py-2 px-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    title="Salin Ringkasan Formasi"
                  >
                    {copyFeedbackId === team.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600 text-[11px]">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span className="text-[11px]">Salin</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => loadSavedTeamToSimulator(team)}
                    className="flex-1 py-2 px-3 rounded-xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 font-bold text-xs transition-colors text-center"
                  >
                    Muat ke Simulator
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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

      {/* Character Picker & Slot Editor Modal Dialog */}
      {activePickerSlot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-card border border-border flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-foreground flex items-center gap-1.5">
                    {slots[activePickerSlot]?.isCenter ? (
                      <>
                        <Crown className="h-4 w-4 text-pink-600" />
                        <span>Editor Slot Center (Leader)</span>
                      </>
                    ) : (
                      <span>Editor Slot {slots[activePickerSlot]?.slotNumber}</span>
                    )}
                  </h3>
                  {slots[activePickerSlot]?.character && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                      Terisi: {slots[activePickerSlot]?.character?.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pilih atau ganti karakter untuk formasi tim panggung
                </p>
              </div>

              <div className="flex items-center gap-2">
                {slots[activePickerSlot]?.character && (
                  <button
                    onClick={() => removeCharacter(activePickerSlot)}
                    className="hidden sm:inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Kosongkan Slot</span>
                  </button>
                )}
                <button
                  onClick={() => setActivePickerSlot(null)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* In-Modal 5-Slot Switcher Navigation Bar */}
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                Pilih Slot:
              </span>
              {slots.map((s, idx) => (
                <button
                  key={s.slotNumber}
                  onClick={() => setActivePickerSlot(idx)}
                  className={`flex-1 min-w-[100px] py-1.5 px-2.5 rounded-2xl text-left border transition-all flex items-center gap-2 ${
                    activePickerSlot === idx
                      ? "bg-card border-pink-500 shadow-xs ring-2 ring-pink-500/20"
                      : "bg-card/60 border-border/70 hover:bg-card hover:border-pink-300"
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      s.character
                        ? `bg-gradient-to-tr ${s.character.avatarBg} text-white shadow-2xs`
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.character ? s.character.name.charAt(0) : "+"}
                  </div>
                  <div className="min-w-0 flex-1 leading-none">
                    <span className="block text-[11px] font-bold truncate">
                      {s.isCenter ? "★ Center" : `Slot ${s.slotNumber}`}
                    </span>
                    <span className="block text-[10px] text-muted-foreground truncate mt-0.5">
                      {s.character ? s.character.name : "Kosong"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Filter & Search Bar inside Picker */}
            <div className="p-4 bg-muted/20 border-b border-border space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Cari nama karakter, band, role, atau skill..."
                  className="w-full rounded-2xl border border-input bg-card py-2 pl-10 pr-10 text-xs sm:text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                />
                {pickerSearch && (
                  <button
                    onClick={() => setPickerSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Band select */}
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-semibold">Band:</span>
                    <select
                      value={pickerBand}
                      onChange={(e) => setPickerBand(e.target.value)}
                      className="rounded-xl border border-input bg-card px-2.5 py-1 text-xs"
                    >
                      <option value="all">Semua Band</option>
                      {BANDS_DATA.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Attribute select */}
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-semibold">Atribut:</span>
                    <select
                      value={pickerAttr}
                      onChange={(e) => setPickerAttr(e.target.value)}
                      className="rounded-xl border border-input bg-card px-2.5 py-1 text-xs"
                    >
                      <option value="all">Semua Atribut</option>
                      <option value="Power">Power (🔥)</option>
                      <option value="Pure">Pure (🌿)</option>
                      <option value="Cool">Cool (❄️)</option>
                      <option value="Happy">Happy (⭐)</option>
                    </select>
                  </div>

                  {/* Role select */}
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-semibold">Role:</span>
                    <select
                      value={pickerRole}
                      onChange={(e) => setPickerRole(e.target.value)}
                      className="rounded-xl border border-input bg-card px-2.5 py-1 text-xs"
                    >
                      <option value="all">Semua Role</option>
                      <option value="Vocal">Vocalist</option>
                      <option value="Guitar">Guitarist</option>
                      <option value="Bass">Bassist</option>
                      <option value="Drum">Drummer</option>
                      <option value="Keyboard">Keyboardist / DJ</option>
                    </select>
                  </div>

                  {/* Rarity select */}
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-semibold">Bintang:</span>
                    <select
                      value={pickerRarity}
                      onChange={(e) => setPickerRarity(e.target.value)}
                      className="rounded-xl border border-input bg-card px-2.5 py-1 text-xs"
                    >
                      <option value="all">Semua Bintang</option>
                      <option value="5">★5 (Bintang 5)</option>
                      <option value="4">★4 (Bintang 4)</option>
                    </select>
                  </div>

                  {/* Sort select */}
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-semibold">Urutkan:</span>
                    <select
                      value={pickerSort}
                      onChange={(e) => setPickerSort(e.target.value)}
                      className="rounded-xl border border-input bg-card px-2.5 py-1 text-xs font-semibold text-pink-600"
                    >
                      <option value="bp-desc">BP Tertinggi</option>
                      <option value="bp-asc">BP Terendah</option>
                      <option value="perf-desc">Performance Tertinggi</option>
                      <option value="tech-desc">Technique Tertinggi</option>
                      <option value="vis-desc">Visual Tertinggi</option>
                      <option value="rarity-desc">Bintang Tertinggi</option>
                      <option value="name-asc">Nama (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* Reset Filters button */}
                {(pickerSearch ||
                  pickerBand !== "all" ||
                  pickerAttr !== "all" ||
                  pickerRole !== "all" ||
                  pickerRarity !== "all" ||
                  pickerSort !== "bp-desc") && (
                  <button
                    onClick={() => {
                      setPickerSearch("");
                      setPickerBand("all");
                      setPickerAttr("all");
                      setPickerRole("all");
                      setPickerRarity("all");
                      setPickerSort("bp-desc");
                    }}
                    className="text-xs text-pink-600 hover:text-pink-700 font-semibold"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* Counter status */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  Menampilkan <strong>{pickerCharacters.length}</strong> dari {CHARACTERS_DATA.length} karakter
                </span>
                {slots[activePickerSlot]?.isCenter && (
                  <span className="text-pink-600 font-semibold flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Center Slot: Skill karakter ini akan menjadi Leader Skill tim
                  </span>
                )}
              </div>
            </div>

            {/* Characters Grid inside Picker */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {pickerCharacters.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground space-y-2">
                  <p className="font-semibold text-sm">Tidak ada karakter yang cocok dengan kriteria pencarian.</p>
                  <button
                    onClick={() => {
                      setPickerSearch("");
                      setPickerBand("all");
                      setPickerAttr("all");
                      setPickerRole("all");
                      setPickerRarity("all");
                      setPickerSort("bp-desc");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 font-bold text-xs"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                pickerCharacters.map((char) => {
                  const existingSlot = slots.find((s) => s.character?.id === char.id);
                  const isCurrentSlot = slots[activePickerSlot]?.character?.id === char.id;
                  const synergyImpact = getSynergyImpact(char, activePickerSlot);

                  return (
                    <div
                      key={char.id}
                      onClick={() => assignCharacter(activePickerSlot, char)}
                      className={`group rounded-2xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isCurrentSlot
                          ? "border-pink-500 bg-pink-50/40 dark:bg-pink-950/30 ring-1 ring-pink-500"
                          : existingSlot
                          ? "border-amber-400/70 bg-amber-50/20 dark:bg-amber-950/20"
                          : "border-border hover:border-pink-400 hover:shadow-xs bg-card"
                      }`}
                    >
                      {/* Character Basic Info */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${char.avatarBg} text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs relative overflow-hidden`}
                          >
                            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/15 skew-x-12" />
                            {char.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span className="truncate">{char.bandName}</span>
                              <div className="flex text-amber-400">
                                {Array.from({ length: char.rarity }).map((_, i) => (
                                  <Star key={i} className="h-2 w-2 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-pink-600 transition-colors">
                              {char.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                                {getAttrIcon(char.attribute)}
                                {char.attribute}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-foreground">
                                {char.stats.total.toLocaleString()} BP
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stat Breakdown Chips */}
                        <div className="grid grid-cols-3 gap-1 text-[10px] bg-muted/30 p-1.5 rounded-xl text-center font-mono">
                          <div>
                            <span className="text-[9px] text-muted-foreground block">Perf</span>
                            <span className="font-semibold">{char.stats.performance.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block">Tech</span>
                            <span className="font-semibold">{char.stats.technique.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block">Vis</span>
                            <span className="font-semibold">{char.stats.visual.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Center Leader Skill Info (if center slot) */}
                        {slots[activePickerSlot]?.isCenter && (
                          <div className="p-2 rounded-xl bg-pink-100/60 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-900/40 text-[10px] space-y-0.5">
                            <span className="font-bold text-pink-700 dark:text-pink-300 block truncate">
                              ★ Leader Skill: {char.skill.name}
                            </span>
                            <span className="text-muted-foreground block line-clamp-1">
                              {char.skill.boostValue} ({char.skill.type})
                            </span>
                          </div>
                        )}

                        {/* Prospective Synergy Badges */}
                        <div className="flex flex-wrap gap-1">
                          {synergyImpact.hasBandBuff && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[9px]">
                              +{synergyImpact.bandBonus}% Sinergi Band ({synergyImpact.bandCount}/5)
                            </span>
                          )}
                          {synergyImpact.hasAttrBuff && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[9px]">
                              +{synergyImpact.attrBonus}% Sinergi Atribut ({synergyImpact.attrCount}/5)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom Action */}
                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground text-[10px] truncate max-w-[140px]">
                          {char.role}
                        </span>
                        <div>
                          {isCurrentSlot ? (
                            <span className="font-bold text-pink-600 bg-pink-100 dark:bg-pink-950 px-2 py-0.5 rounded-md text-[10px]">
                              Sedang Terpasang
                            </span>
                          ) : existingSlot ? (
                            <span className="font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md text-[10px]">
                              Tukar dari Slot {existingSlot.slotNumber}
                            </span>
                          ) : (
                            <span className="font-bold text-pink-600 group-hover:underline">
                              + Pasang ke Slot {activePickerSlot + 1}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePickerSlot(Math.max(0, activePickerSlot - 1))}
                  disabled={activePickerSlot === 0}
                  className="px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold transition-colors disabled:opacity-30 disabled:hover:bg-card"
                >
                  ← Slot Sebelumnya
                </button>
                <button
                  onClick={() => setActivePickerSlot(Math.min(4, activePickerSlot + 1))}
                  disabled={activePickerSlot === 4}
                  className="px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold transition-colors disabled:opacity-30 disabled:hover:bg-card"
                >
                  Slot Berikutnya →
                </button>
              </div>

              <div className="flex items-center gap-2">
                {slots[activePickerSlot]?.character && (
                  <button
                    onClick={() => removeCharacter(activePickerSlot)}
                    className="sm:hidden px-3 py-2 rounded-xl bg-red-100 text-red-600 font-bold text-xs"
                  >
                    Kosongkan
                  </button>
                )}
                <button
                  onClick={() => setActivePickerSlot(null)}
                  className="px-5 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog: Simpan Formasi Tim */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-border shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-pink-600" />
                <h3 className="font-black text-base sm:text-lg text-foreground">
                  Simpan Formasi Tim Saat Ini
                </h3>
              </div>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={saveCurrentTeam} className="p-5 space-y-4 text-xs">
              {/* Form Input: Nama Tim */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Nama Formasi Tim <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={saveTeamName}
                  onChange={(e) => setSaveTeamName(e.target.value)}
                  placeholder="Contoh: Tim Pure PoPiPa Event Tier 1000"
                  className="w-full rounded-xl border border-input bg-muted/20 px-3.5 py-2.5 text-xs sm:text-sm focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Form Input: Kategori */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Kategori / Tag</label>
                <select
                  value={saveTeamCategory}
                  onChange={(e) => setSaveTeamCategory(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2 text-xs"
                >
                  <option value="Score Attack">Score Attack (High Score Multi-Live)</option>
                  <option value="Event Grind">Event Grind (Point Farming)</option>
                  <option value="Survival Live">Survival Live (Healer / Full Combo Safe)</option>
                  <option value="Mono-Band">Mono-Band (5 Personel Satu Band)</option>
                  <option value="Eksperimen">Eksperimen / Racikan Bebas</option>
                </select>
              </div>

              {/* Form Input: Catatan */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Catatan / Strategi Formasi (Opsional)</label>
                <textarea
                  value={saveTeamNote}
                  onChange={(e) => setSaveTeamNote(e.target.value)}
                  placeholder="Contoh: Fokus lagu difficulty 26 ke atas, butuh fever 100%..."
                  className="w-full h-20 rounded-xl border border-input bg-muted/20 p-3 text-xs focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>

              {/* Snapshot Preview */}
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-2">
                <span className="font-bold text-muted-foreground block text-[11px]">
                  Ringkasan Yang Disimpan:
                </span>
                <div className="flex items-center justify-between font-mono">
                  <span>BP Efektif: <strong className="text-pink-600 font-bold">{effectiveBP.toLocaleString()}</strong></span>
                  <span>Sinergi: <strong className="text-emerald-600 font-bold">+{(bandBonusPercent + attrBonusPercent)}%</strong></span>
                  <span>Life: <strong>{rawStats.hp} HP</strong></span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Center Leader: <strong>{centerChar ? centerChar.name : "Belum ditentukan"}</strong>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!saveTeamName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Simpan Formasi
                </button>
              </div>
            </form>
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

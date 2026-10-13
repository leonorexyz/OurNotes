"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Sparkles,
  Music2,
  Heart,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  Save,
  RotateCcw,
  Star,
  Award,
  Layers,
  Calendar,
  Flame,
  Leaf,
  Snowflake,
  Sun,
  Zap,
  Volume2,
  Share2,
} from "lucide-react";
import { CHARACTERS_DATA, BANDS_DATA } from "@/data/charactersData";

interface ProducerProfileData {
  name: string;
  title: string;
  producerId: string;
  bio: string;
  favoriteBand: string;
  favoriteCharacterId: string;
  favoriteAttribute: "Power" | "Pure" | "Cool" | "Happy";
  rank: number;
  avatarUrl: string;
  noteSpeed: number;
  timingOffset: number;
  tapSoundEffect: string;
  showCutIn: boolean;
}

const DEFAULT_PROFILE: ProducerProfileData = {
  name: "Kasumi Producer",
  title: "Bintang Utama CiRCLE",
  producerId: "CIRC-2026-9812",
  bio: "Produser aktif CiRCLE Live House. Fokus mengoleksi kartu Pure Poppin'Party dan mencapai All Perfect pada lagu Expert level 27+.",
  favoriteBand: "Poppin'Party",
  favoriteCharacterId: "char-kasumi-toyama",
  favoriteAttribute: "Pure",
  rank: 185,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&auto=format&fit=crop&q=80",
  noteSpeed: 10.4,
  timingOffset: 0.0,
  tapSoundEffect: "Tambourine",
  showCutIn: true,
};

const TITLE_PRESETS = [
  "Bintang Utama CiRCLE",
  "Full Combo Specialist",
  "Roselia Devotee",
  "Top 100 Marathon Tierer",
  "Kira-Kira Doki-Doki Chaser",
  "Master of Rhythm Tap",
  "Live House Resident Producer",
];

const AVATAR_PRESETS = [
  {
    name: "Kasumi Toyama",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&auto=format&fit=crop&q=80",
  },
  {
    name: "Yukina Minato",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=180&auto=format&fit=crop&q=80",
  },
  {
    name: "Aya Maruyama",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=180&auto=format&fit=crop&q=80",
  },
  {
    name: "Ran Mitake",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=180&auto=format&fit=crop&q=80",
  },
  {
    name: "Kokoro Tsurumaki",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80",
  },
];

export function ProducerProfileClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProducerProfileData>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<"info" | "band" | "gameplay">("info");
  const [copiedId, setCopiedId] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load from localStorage & server
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ournotes_user_profile");
      if (stored) {
        setProfile((prev) => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch {}

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setProfile((prev) => ({
            ...prev,
            name: data.user.name || prev.name,
            avatarUrl: data.user.avatarUrl || prev.avatarUrl,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.producerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem("ournotes_user_profile", JSON.stringify(profile));

      await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          avatarUrl: profile.avatarUrl,
        }),
      }).catch(() => {});

      setToastMessage("Profil produser berhasil disimpan!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage("Gagal menyimpan profil.");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setSaving(false);
    }
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

  const selectedOshi = CHARACTERS_DATA.find((c) => c.id === profile.favoriteCharacterId);

  return (
    <div className="space-y-8">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-foreground text-background text-xs font-semibold px-4 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-300 text-xs font-bold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CiRCLE Producer Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Profil & Kartu Produser Saya
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Ubah identitas produser, band favorit, kartu oshi utama, dan preferensi pengaturan rhythm live Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/favorit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-input bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-2xs"
          >
            <Heart className="h-3.5 w-3.5 text-pink-500" />
            <span>Koleksi Favorit</span>
          </Link>
          <Link
            href="/tim"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Susun Tim</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live CiRCLE Producer Pass (Preview) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-900/60 via-purple-900/50 to-indigo-950/70 p-6 sm:p-7 text-white shadow-2xl backdrop-blur-md">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            {/* Pass Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500 text-white font-black text-xs shadow-md">
                  ★
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-pink-200 font-mono block">
                    BanG Dream! Our Notes
                  </span>
                  <span className="text-xs font-black tracking-tight text-white">
                    CiRCLE PRODUCER PASS
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[10px] font-bold text-pink-200 font-mono">
                RANK {profile.rank}
              </span>
            </div>

            {/* Avatar & Main Credentials */}
            <div className="relative z-10 flex items-start gap-4 mb-5">
              <div className="relative shrink-0">
                <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl overflow-hidden border-2 border-pink-400/80 shadow-lg shadow-pink-500/30 bg-black/40">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white ring-2 ring-black text-[10px]">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-white truncate">
                  {profile.name}
                </h3>
                <p className="text-xs text-pink-200/90 font-medium flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-300" />
                  <span>{profile.title}</span>
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="font-mono text-[11px] text-white/80 bg-black/30 px-2 py-0.5 rounded-lg border border-white/10">
                    {profile.producerId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    title="Salin ID Produser"
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                  >
                    {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bio Box */}
            <div className="relative z-10 p-3 rounded-2xl bg-black/30 border border-white/10 text-xs text-white/90 leading-relaxed mb-5 italic">
              &quot;{profile.bio}&quot;
            </div>

            {/* Key Stats Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5 text-xs mb-5">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-pink-200/80 block">Band Favorit</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Music2 className="h-3.5 w-3.5 text-pink-400" />
                  <span className="truncate">{profile.favoriteBand}</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-pink-200/80 block">Oshi Utama</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-300" />
                  <span className="truncate">{selectedOshi ? selectedOshi.name : "Kasumi Toyama"}</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-pink-200/80 block">Atribut Andalan</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {getAttrIcon(profile.favoriteAttribute)}
                  <span>{profile.favoriteAttribute}</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-pink-200/80 block">Kecepatan Catatan</span>
                <span className="font-bold text-white font-mono flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-yellow-300" />
                  <span>Speed {profile.noteSpeed.toFixed(1)}</span>
                </span>
              </div>
            </div>

            {/* Pass Footer */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-white/60 pt-3 border-t border-white/15">
              <span>Status: Terverifikasi</span>
              <span>CiRCLE Live House 2026</span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Editor Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSave}
            className="rounded-3xl border border-pink-500/20 bg-card p-6 sm:p-8 shadow-xl space-y-6"
          >
            {/* Editor Tabs */}
            <div className="grid grid-cols-3 p-1 bg-muted/60 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === "info"
                    ? "bg-background text-pink-600 dark:text-pink-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Informasi Dasar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("band")}
                className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === "band"
                    ? "bg-background text-pink-600 dark:text-pink-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Band & Oshi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("gameplay")}
                className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === "gameplay"
                    ? "bg-background text-pink-600 dark:text-pink-400 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Preferensi Live
              </button>
            </div>

            {/* TAB 1: INFORMASI DASAR */}
            {activeTab === "info" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Nama Produser</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      required
                      placeholder="Kasumi Producer"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Rank / Level Produser</label>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={profile.rank}
                      onChange={(e) => setProfile({ ...profile, rank: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Title / Gelar with Presets */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Gelar / Gelar Produser</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="Bintang Utama CiRCLE"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {TITLE_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setProfile({ ...profile, title: t })}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          profile.title === t
                            ? "bg-pink-500/15 border-pink-500 text-pink-600 dark:text-pink-400 font-bold"
                            : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Bio & Motto Produser</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Ceritakan gaya bermainmu..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs leading-relaxed text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                {/* Avatar Presets */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Pilih Foto Profil Avatar</label>
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((av) => (
                      <button
                        key={av.name}
                        type="button"
                        onClick={() => setProfile({ ...profile, avatarUrl: av.url })}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 shrink-0 ${
                          profile.avatarUrl === av.url
                            ? "border-pink-500 ring-2 ring-pink-500/40 scale-105"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BAND & OSHI */}
            {activeTab === "band" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Band Favorit Utama</label>
                  <select
                    value={profile.favoriteBand}
                    onChange={(e) => setProfile({ ...profile, favoriteBand: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  >
                    {BANDS_DATA.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Karakter Favorit (Oshi)</label>
                  <select
                    value={profile.favoriteCharacterId}
                    onChange={(e) => setProfile({ ...profile, favoriteCharacterId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  >
                    {CHARACTERS_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.bandName} • {c.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Atribut Utama Tim</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["Power", "Pure", "Cool", "Happy"] as const).map((attr) => (
                      <button
                        key={attr}
                        type="button"
                        onClick={() => setProfile({ ...profile, favoriteAttribute: attr })}
                        className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          profile.favoriteAttribute === attr
                            ? "border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-300 ring-1 ring-pink-500"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {getAttrIcon(attr)}
                        <span>{attr}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PREFERENSI GAMEPLAY */}
            {activeTab === "gameplay" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Kecepatan Catatan (Speed)</span>
                    <span className="text-pink-600 dark:text-pink-400 font-mono text-sm">
                      {profile.noteSpeed.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="12.0"
                    step="0.1"
                    value={profile.noteSpeed}
                    onChange={(e) => setProfile({ ...profile, noteSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-pink-600"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>5.0 (Pelan)</span>
                    <span>10.0 (Standar)</span>
                    <span>12.0 (Ekstrem)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Timing Offset Kalibrasi</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                      {profile.timingOffset > 0 ? `+${profile.timingOffset.toFixed(1)}` : profile.timingOffset.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10.0"
                    max="10.0"
                    step="0.5"
                    value={profile.timingOffset}
                    onChange={(e) => setProfile({ ...profile, timingOffset: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>-10 (Lebih Cepat)</span>
                    <span>0.0 (Netral)</span>
                    <span>+10 (Lebih Lambat)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Efek Suara Ketukan (Tap SE)</label>
                    <select
                      value={profile.tapSoundEffect}
                      onChange={(e) => setProfile({ ...profile, tapSoundEffect: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    >
                      <option value="Tambourine">Tambourine (Default)</option>
                      <option value="Clap">Hand Clap</option>
                      <option value="Taiko">Taiko Drum</option>
                      <option value="Electro">808 Synth Beat</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Animasi Cut-in Skill</label>
                    <div className="flex items-center h-10">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                        <input
                          type="checkbox"
                          checked={profile.showCutIn}
                          onChange={(e) => setProfile({ ...profile, showCutIn: e.target.checked })}
                          className="rounded border-input text-pink-600 focus:ring-pink-500"
                        />
                        <span>Tampilkan potong animasi saat skill aktif</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit & Reset Buttons */}
            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setProfile(DEFAULT_PROFILE);
                  localStorage.setItem("ournotes_user_profile", JSON.stringify(DEFAULT_PROFILE));
                  setToastMessage("Pengaturan profil direset ke standar.");
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-xs font-semibold text-muted-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Standar</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? "Menyimpan..." : "Simpan Profil Produser"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

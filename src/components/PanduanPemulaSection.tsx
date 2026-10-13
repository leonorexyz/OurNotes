"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Volume2,
  Smartphone,
  Music,
  Users,
  Gift,
  ArrowRight,
  Info,
  Sliders,
  Play,
  RotateCcw,
} from "lucide-react";

interface StepDetail {
  number: number;
  title: string;
  badge: string;
  duration: string;
  summary: string;
  illustrationType: "settings" | "reroll" | "rhythm" | "formation" | "daily";
  instructions: {
    heading: string;
    description: string;
    proTip?: string;
  }[];
  charactersMentioned: { name: string; band: string; role: string }[];
}

export function PanduanPemulaSection() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "cl-1": true,
    "cl-2": true,
    "cl-3": false,
    "cl-4": false,
    "cl-5": false,
  });

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stepsData: StepDetail[] = [
    {
      number: 1,
      title: "Pengaturan Awal & Kalibrasi Layar",
      badge: "Langkah Pertama",
      duration: "3 Menit",
      summary: "Mengatur kenyamanan visual dan audio sebelum mulai bermain adalah kunci utama meraih Full Combo.",
      illustrationType: "settings",
      charactersMentioned: [
        { name: "Kasumi Toyama", band: "Poppin'Party", role: "Vocal & Guitar" },
      ],
      instructions: [
        {
          heading: "1. Sesuaikan Note Speed (Kecepatan Note)",
          description: "Kecepatan bawaan (5.0 atau 6.0) menyebabkan note terlalu rapat dan sulit dibaca. Naikkan perlahan ke angka 8.5 - 9.5 untuk jarak note yang lebih renggang dan refleks yang lebih santai.",
          proTip: "Naikkan +0.2 setiap 3 lagu sampai kamu menemukan kecepatan refleks paling natural.",
        },
        {
          heading: "2. Lakukan Kalibrasi Audio (Timing Adjustment)",
          description: "Buka menu Options > Live Settings > Sound Calibration. Ketuk layar sesuai ketukan metronom agar ketukan sinkron dengan suara headphone atau speaker HP-mu.",
        },
        {
          heading: "3. Nonaktifkan Efek Potongan Karakter (Cut-in Effect)",
          description: "Jika HP terasa patah-patah saat skill aktif, matikan opsi 'Skill Cut-in' dan kurangi efek partikel ke mode Ringan (Lite).",
          proTip: "Mode Lite sangat direkomendasikan pada ponsel dengan refresh rate 60Hz agar frame rate terkunci tanpa drop.",
        },
      ],
    },
    {
      number: 2,
      title: "Gacha Awal & Strategi Reroll",
      badge: "Investasi Akun",
      duration: "5 Menit",
      summary: "Mendapatkan 1-2 kartu Bintang 5 atau Bintang 4 di awal mempermudah menyelesaikan misi pemula dan membuka reward Stars lebih cepat.",
      illustrationType: "reroll",
      charactersMentioned: [
        { name: "Yukina Minato", band: "Roselia", role: "Vocal (Score Booster)" },
        { name: "Kokoro Tsurumaki", band: "Hello, Happy World!", role: "Vocal (Score / Healer)" },
      ],
      instructions: [
        {
          heading: "1. Target Utama: Kartu Score Boost 110%+",
          description: "Kartu dengan efek 'Meningkatkan skor 110% (atau hingga 125% jika Perfect)' adalah prioritas tertinggi karena melipatgandakan kontribusi poin di Multi-Live.",
        },
        {
          heading: "2. Ambil Hadiah Pra-Registrasi & Tiket Awal",
          description: "Buka Present Box di beranda. Ambil 2.500+ Stars dan Ticket Bintang 4 Garansi yang dibagikan untuk akun baru.",
          proTip: "Tarik banner 'Novice Special 10-Pull' yang memberikan potongan harga Stars.",
        },
        {
          heading: "3. Kaitkan Akun Setelah Puas dengan Hasil",
          description: "Jangan lupa buat Data Transfer Password atau tautkan ke Google Play / Apple ID sebelum melanjutkan.",
        },
      ],
    },
    {
      number: 3,
      title: "Kuasai 4 Jenis Ketukan Note",
      badge: "Mekanik Live",
      duration: "7 Menit",
      summary: "Memahami timing dan gesture untuk Tap, Flick merah, Slide hijau, dan Hold kuning.",
      illustrationType: "rhythm",
      charactersMentioned: [
        { name: "Ran Mitake", band: "Afterglow", role: "Vocal & Guitar" },
        { name: "Mashiro Kurata", band: "Morfonica", role: "Vocal" },
      ],
      instructions: [
        {
          heading: "1. Tap Note Biasa (Warna Biru / Pink)",
          description: "Ketuk saat note tepat berada di tengah garis judgment. Akurasi 'Perfect' memberikan 100% skor, 'Great' memberi 80%.",
        },
        {
          heading: "2. Flick Note (Panah Merah / Merah Muda)",
          description: "Geser jari secara tegas ke arah mana saja (atas, samping kanan, atau samping kiri). Flick tidak memerlukan ayunan panjang, cukup hentakan kecil.",
          proTip: "Flick ke arah atas umumnya paling stabil bagi pemain yang menggunakan jempol (thumb player).",
        },
        {
          heading: "3. Long Hold & Curved Slide Note (Kuning / Hijau)",
          description: "Tahan jari sejak awal note hingga ujung garis. Ikuti pergeseran lane bila note berkelok.",
        },
      ],
    },
    {
      number: 4,
      title: "Membangun Susunan Band Pertama",
      badge: "Team Synergy",
      duration: "5 Menit",
      summary: "Formasi terdiri dari 5 anggota: 1 Center dan 4 Sub-member. Perhatikan kesamaan atribut dan band.",
      illustrationType: "formation",
      charactersMentioned: [
        { name: "Aya Maruyama", band: "Pastel＊Palettes", role: "Leader & Vocal" },
        { name: "LAYER (Rei)", band: "RAISE A SUILEN", role: "Bass & Vocal" },
      ],
      instructions: [
        {
          heading: "1. Tentukan Center Terbaik",
          description: "Skill Center aktif di awal dan akhir solo live, serta aktif di Multi-Live. Pilih kartu dengan persentase Score Up tertinggi sebagai Center.",
        },
        {
          heading: "2. Sinergi Atribut yang Seragam",
          description: "Setiap kartu memiliki satu atribut: Power (Merah), Pure (Hijau), Cool (Biru), atau Happy (Kuning). Tim dengan 5 atribut seragam mendapat bonus item area hingga +20%.",
          proTip: "Di awal game, utamakan kartu bintang tertinggi (Bintang 4 & 5) terlebih dahulu sebelum memaksakan tim mono-atribut.",
        },
        {
          heading: "3. Naikkan Level Kartu dengan Practice Ticket",
          description: "Masuk ke Member > Training > Practice. Bintang 4 dapat dinaikkan hingga level 50, dan Bintang 5 hingga level 60.",
        },
      ],
    },
    {
      number: 5,
      title: "Rutinitas Harian & Panen Stars Gratis",
      badge: "Progres Teratur",
      duration: "4 Menit",
      summary: "Maksimalkan pendapatan Stars gratis untuk tabungan gacha karakter impianmu selanjutnya.",
      illustrationType: "daily",
      charactersMentioned: [
        { name: "Tomori Takamatsu", band: "MyGO!!!!!", role: "Vocal" },
      ],
      instructions: [
        {
          heading: "1. Selesaikan Daily Missions Setiap Hari",
          description: "Cukup mainkan 2-3 Multi-Live per hari untuk menyelesaikan semua misi harian dan mengklaim Stars serta koin.",
        },
        {
          heading: "2. Baca Episode Cerita Karakter (Memories)",
          description: "Tiap kartu Bintang 3 ke atas memiliki 2 episode cerita. Buka dengan shards untuk memperoleh 25 - 50 Stars gratis per episode!",
          proTip: "Membaca seluruh episode kartu bintang 2 dan 3 yang kamu miliki bisa menghasilkan hingga ribuan Stars gratis di minggu pertama.",
        },
        {
          heading: "3. Full Combo Lagu Baru di Berbagai Tingkat Kesulitan",
          description: "Mencapai S-Rank dan Full Combo di Hard/Expert memberikan reward Stars tambahan pada setiap lagu.",
        },
      ],
    },
  ];

  const currentStepData = stepsData.find((s) => s.number === activeStep) || stepsData[0];

  return (
    <div className="space-y-8 rounded-3xl border border-pink-100 dark:border-pink-950/60 bg-gradient-to-b from-white to-pink-50/20 dark:from-card dark:to-card/60 p-6 sm:p-8 lg:p-10 shadow-sm">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
              Panduan Pemula Lengkap
            </span>
            <span className="text-xs text-muted-foreground">• 5 Langkah Bernomor</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Langkah Bernomor: Menjadi Mahir dalam 5 Tahap
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Ikuti alur bernomor di bawah ini secara berurutan. Setiap tahap dilengkapi ilustrasi panduan visual, tips pro, dan karakter terkait.
          </p>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {stepsData.map((s) => (
            <button
              key={s.number}
              onClick={() => setActiveStep(s.number)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeStep === s.number
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                {s.number}
              </span>
              <span className="hidden sm:inline">Tahap {s.number}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main step content layout: 2 Columns (Details on left, Visual Illustration on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Numbered Instructions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/50">
                Langkah #{currentStepData.number} dari 5
              </span>
              <span className="text-xs text-muted-foreground">• Estimasi: {currentStepData.duration}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {currentStepData.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStepData.summary}
            </p>
          </div>

          {/* Numbered instruction list */}
          <div className="space-y-4">
            {currentStepData.instructions.map((inst, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-2 shadow-xs transition-hover hover:border-blue-400/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white text-xs font-bold shadow-xs">
                    {idx + 1}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h5 className="text-sm sm:text-base font-bold text-foreground">
                      {inst.heading}
                    </h5>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {inst.description}
                    </p>

                    {inst.proTip && (
                      <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-amber-800/40">
                        <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                          <strong className="font-semibold">Tips Pro:</strong> {inst.proTip}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Characters Mentioned Links (PRD: "Klik link ke karakter yang disebut") */}
          {currentStepData.charactersMentioned.length > 0 && (
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                Karakter Terkait di Tahap Ini:
              </h5>
              <div className="flex flex-wrap gap-2">
                {currentStepData.charactersMentioned.map((char) => (
                  <Link
                    key={char.name}
                    href={`/karakter#${char.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-all hover:border-pink-500 hover:text-pink-600 shadow-2xs"
                  >
                    <Users className="h-3.5 w-3.5 text-pink-500" />
                    <span><strong>{char.name}</strong> ({char.band})</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {char.role}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground ml-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons between steps */}
          <div className="pt-4 flex items-center justify-between border-t border-border/50">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeStep === 1
                  ? "opacity-40 cursor-not-allowed text-muted-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              ← Langkah Sebelumnya
            </button>

            <span className="text-xs text-muted-foreground font-medium">
              Tahap {activeStep} / 5
            </span>

            <button
              onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
              disabled={activeStep === 5}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeStep === 5
                  ? "opacity-40 cursor-not-allowed text-muted-foreground"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              }`}
            >
              Langkah Selanjutnya →
            </button>
          </div>
        </div>

        {/* Right Column: Visual Illustration & Interactive Mockup (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dynamic Illustration Board based on current step */}
          <div className="rounded-3xl border border-border/80 bg-muted/40 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-2 border-b border-border/50">
              <span className="flex items-center gap-1.5 text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                Ilustrasi Visual Tahap {currentStepData.number}
              </span>
              <span className="text-[11px] bg-card px-2 py-0.5 rounded border border-border">
                Visual Mockup
              </span>
            </div>

            {/* ILLUSTRATION 1: SETTINGS / TIMING CALIBRATION */}
            {currentStepData.illustrationType === "settings" && (
              <div className="space-y-4 rounded-2xl bg-card border border-border p-4 text-xs">
                <div className="flex items-center justify-between font-bold text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-blue-500" />
                    Live Setting Recomended
                  </span>
                  <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Optimal
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-muted/60 space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Note Speed</span>
                      <strong className="text-foreground font-bold">8.8 ~ 9.5 (Ideal)</strong>
                    </div>
                    <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[85%]" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/60 space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Sound Timing Calibration</span>
                      <strong className="text-foreground font-bold">±0 ms (Tergantung HP)</strong>
                    </div>
                    <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[50%]" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/60 flex items-center justify-between">
                    <span>Cut-in / Skill Window</span>
                    <span className="text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                      OFF (Rekomendasi)
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                  💡 Tips: Setting ini mengurangi distraction visual sehingga mata lebih fokus ke judgment line.
                </p>
              </div>
            )}

            {/* ILLUSTRATION 2: REROLL & TARGET CARD */}
            {currentStepData.illustrationType === "reroll" && (
              <div className="space-y-4 rounded-2xl bg-card border border-border p-4 text-xs">
                <div className="flex items-center justify-between font-bold text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-pink-500" />
                    Target Kartu Awal Terbaik
                  </span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    Bintang 5 / 4
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200/50 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-foreground text-xs font-bold">Score Booster Tipe A</strong>
                      <span className="text-[10px] font-bold text-pink-600 bg-white dark:bg-pink-900/60 px-1.5 py-0.5 rounded">
                        Tier SSS
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      &quot;Score +115% selama 7 detik (menjadi +130% jika Perfect)&quot;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/60 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-foreground text-xs font-bold">Recovery / Healer</strong>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                        Tier S
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      &quot;Life +450 & Score +80%&quot; — Menyelamatkan jika sering Miss di Expert.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2.5 text-[11px] text-blue-900 dark:text-blue-200">
                  🎉 Dapat minimal 1 kartu Score Booster = <strong>Akun Siap Dimainkan!</strong>
                </div>
              </div>
            )}

            {/* ILLUSTRATION 3: RHYTHM NOTE LANES */}
            {currentStepData.illustrationType === "rhythm" && (
              <div className="space-y-4 rounded-2xl bg-card border border-border p-4 text-xs">
                <div className="flex items-center justify-between font-bold text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-indigo-500" />
                    Panduan Visual Note Lane
                  </span>
                  <span className="text-xs font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    7 Lanes
                  </span>
                </div>

                {/* Rhythm Lane Mockup */}
                <div className="relative h-28 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-3 text-white overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-around opacity-40 text-[9px] font-mono border-b border-white/20 pb-1">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
                  </div>

                  {/* Notes floating */}
                  <div className="flex justify-around items-center py-2">
                    <div className="w-5 h-2.5 bg-pink-400 rounded-full shadow-lg shadow-pink-500/50 text-[8px] flex items-center justify-center font-bold">Tap</div>
                    <div className="w-5 h-2.5 bg-red-500 rounded-full shadow-lg shadow-red-500/50 text-[8px] flex items-center justify-center font-bold">▲</div>
                    <div className="w-8 h-2.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 text-[8px] flex items-center justify-center font-bold">Hold</div>
                    <div className="w-6 h-2.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50 text-[8px] flex items-center justify-center font-bold">Slide</div>
                  </div>

                  {/* Judgment line */}
                  <div className="border-t-2 border-pink-500 flex justify-between items-center text-[10px] font-mono pt-1 text-pink-300">
                    <span>PERFECT LINE</span>
                    <span className="text-emerald-400 font-bold">100% COMBO</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-medium">
                    🔴 <strong>Flick:</strong> Geser tegas ke atas.
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">
                    🟢 <strong>Slide:</strong> Tahan & ikuti kurva note.
                  </div>
                </div>
              </div>
            )}

            {/* ILLUSTRATION 4: BAND FORMATION */}
            {currentStepData.illustrationType === "formation" && (
              <div className="space-y-4 rounded-2xl bg-card border border-border p-4 text-xs">
                <div className="flex items-center justify-between font-bold text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    Slot Formasi 5 Anggota
                  </span>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                    5 Member
                  </span>
                </div>

                {/* 5 Slot visual */}
                <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                  <div className="p-2 rounded-xl bg-muted/60 border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground">Slot 1</div>
                    <div className="text-[9px] font-bold text-foreground">Sub</div>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/60 border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground">Slot 2</div>
                    <div className="text-[9px] font-bold text-foreground">Sub</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-pink-100 dark:bg-pink-950/70 border-2 border-pink-500 shadow-sm space-y-1 scale-105">
                    <div className="text-[9px] font-bold text-pink-600">CENTER</div>
                    <div className="text-[8px] font-bold text-pink-700 dark:text-pink-300">Score Up</div>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/60 border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground">Slot 4</div>
                    <div className="text-[9px] font-bold text-foreground">Sub</div>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/60 border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground">Slot 5</div>
                    <div className="text-[9px] font-bold text-foreground">Sub</div>
                  </div>
                </div>

                <div className="rounded-xl bg-purple-50 dark:bg-purple-950/40 p-3 space-y-1 text-[11px] text-purple-900 dark:text-purple-200">
                  <strong className="font-bold">Kunci Sinergi:</strong>
                  <p>
                    Pasang 5 anggota dengan Atribut sama (mis. Power / Cool) untuk mendongkrak Band Power hingga +25%.
                  </p>
                </div>
              </div>
            )}

            {/* ILLUSTRATION 5: DAILY REWARDS */}
            {currentStepData.illustrationType === "daily" && (
              <div className="space-y-4 rounded-2xl bg-card border border-border p-4 text-xs">
                <div className="flex items-center justify-between font-bold text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-amber-500" />
                    Sumber Stars Gratis Harian
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Free Stars
                  </span>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/60">
                    <span>Misi Harian</span>
                    <strong className="text-amber-600 font-bold">+50 Stars / hari</strong>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/60">
                    <span>Baca Cerita Kartu (Ep 1 & 2)</span>
                    <strong className="text-emerald-600 font-bold">+75 Stars / kartu</strong>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/60">
                    <span>Full Combo Lagu Baru</span>
                    <strong className="text-blue-600 font-bold">+50 Stars / song</strong>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                  Dalam minggu pertama, kamu bisa mengumpulkan lebih dari 10.000 Stars hanya dari membaca cerita kartu dan menyelesaikan misi!
                </p>
              </div>
            )}
          </div>

          {/* Interactive Checklist for New Players */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-sm text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Checklist Mandiri Pemain Baru
              </h5>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                {Object.values(checklist).filter(Boolean).length} / 5 Selesai
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Centang tugas yang sudah kamu selesaikan di game untuk memantau kesiapan akunmu:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { id: "cl-1", text: "Selesaikan live tutorial pertama & dapatkan hadiah awal" },
                { id: "cl-2", text: "Atur Note Speed minimal di angka 8.5" },
                { id: "cl-3", text: "Dapatkan minimal 1 kartu Bintang 4/5 Score Booster" },
                { id: "cl-4", text: "Bentuk formasi band dan naikkan kartu center ke Level Maks" },
                { id: "cl-5", text: "Mainkan 1 kali Multi-Live room bersama pemain lain" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex items-start gap-2.5 w-full p-2.5 rounded-xl border text-left transition-all ${
                    checklist[item.id]
                      ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-foreground"
                      : "bg-muted/40 border-border hover:bg-muted/70 text-muted-foreground"
                  }`}
                >
                  {checklist[item.id] ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                  )}
                  <span className={`leading-relaxed ${checklist[item.id] ? "line-through text-muted-foreground font-medium" : "font-normal"}`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

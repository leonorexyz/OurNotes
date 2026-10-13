"use client";

import { useState } from "react";
import {
  Lightbulb,
  Zap,
  Sparkles,
  Users2,
  TrendingUp,
  Check,
  X,
  Calculator,
  Flame,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";

interface TipGroup {
  id: string;
  category: "stamina" | "studio" | "multi" | "resource";
  categoryLabel: string;
  title: string;
  icon: typeof Zap;
  impact: "Dampak Tinggi" | "Dampak Sedang";
  impactColor: string;
  quickStat: string;
  summary: string;
  keyPoints: string[];
  doAndDont: {
    doText: string;
    dontText: string;
  };
}

export function TipsTrikSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [boostMultiplier, setBoostMultiplier] = useState<number>(3);

  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "stamina", label: "⚡ Stamina & Flame" },
    { id: "studio", label: "🎸 Studio & Area Items" },
    { id: "multi", label: "🤝 Multi-Live & Etika" },
    { id: "resource", label: "📈 Pelatihan & Resource" },
  ];

  const tipsData: TipGroup[] = [
    {
      id: "tip-stamina",
      category: "stamina",
      categoryLabel: "Stamina & Flame",
      title: "Optimasi Live Boost (Flame): Raih Reward Maksimal Tanpa Boros",
      icon: Zap,
      impact: "Dampak Tinggi",
      impactColor: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
      quickStat: "1 Flame = 30 Menit",
      summary: "Memilih pengganda Live Boost (1x, 2x, atau 3x) menentukan seberapa cepat bahan materi terkumpul dan event poin tercapai.",
      keyPoints: [
        "Pengganda 1x Boost memberi reward bahan & koin tertinggi per flame (100% efisiensi resource).",
        "Pengganda 3x Boost menghemat waktu 3 kali lipat dengan perolehan event point 15x lipat dalam satu lagu.",
        "Pantau sisa EXP akun — setiap naik level memberi 10 flame gratis instan.",
      ],
      doAndDont: {
        doText: "Gunakan 3x boost saat waktu bermain mepet atau sedang mengejar tier ranking event di menit akhir.",
        dontText: "Jangan gunakan Stars berbayar untuk isi ulang flame kecuali sedang bersaing di Top 100 event.",
      },
    },
    {
      id: "tip-studio",
      category: "studio",
      categoryLabel: "Studio & Area Items",
      title: "Investasi Dekorasi Studio: Kunci Lonjakan Band Power Tersembunyi",
      icon: Sparkles,
      impact: "Dampak Tinggi",
      impactColor: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
      quickStat: "Hingga +35% Stat",
      summary: "Banyak pemain baru mengabaikan instrumen di kafetaria dan studio Edogawa. Area items memberi buff pasif permanen untuk seluruh karakter.",
      keyPoints: [
        "Fokus upgrade instrumen (Gitar, Bass, Drum, Keyboard, Mic) milik 1 band favoritmu hingga level maksimal terlebih dahulu.",
        "Pasang Poster & Flyer atribut (Power, Pure, Cool, Happy) yang sesuai dengan mayoritas warna kartu timmu.",
        "Kumpulkan jutaan koin emas dari room khusus Gold Day setiap akhir pekan di Multi-Live.",
      ],
      doAndDont: {
        doText: "Investasikan koin pada instrumen band yang sering kamu pakai di Multi-Live.",
        dontText: "Jangan menyebar upgrade ke semua instrumen secara merata di awal karena akan kehabisan koin.",
      },
    },
    {
      id: "tip-multi",
      category: "multi",
      categoryLabel: "Multi-Live & Etika",
      title: "Etika & Strategi Multi-Live: Bermain Bersama untuk Skor S-Rank",
      icon: Users2,
      impact: "Dampak Sedang",
      impactColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
      quickStat: "Reward 3x Solo",
      summary: "Multi-Live mempertemukan 5 pemain dalam satu lagu, menggabungkan skill center kelimanya untuk melipatgandakan drop item.",
      keyPoints: [
        "Pasang karakter dengan skill Score Booster (bukan Healer) sebagai Center jika bermain di Grand Room.",
        "Pilih tingkat kesulitan yang bisa kamu selesaikan dengan aman; Full Combo di Hard lebih baik daripada mati di Expert.",
        "Kirim sticker salam (misal 'よろしく / Salam Kenal') di lobby untuk suasana ruang yang ramah.",
      ],
      doAndDont: {
        doText: "Selalu bertahan hingga lagu selesai meskipun kamu miss beberapa note.",
        dontText: "Hindari menutup game (disconnect) sengaja di tengah lagu karena merugikan skor 4 pemain lainnya.",
      },
    },
    {
      id: "tip-resource",
      category: "resource",
      categoryLabel: "Pelatihan & Resource",
      title: "Prioritas Resource: Tiket Latihan, Shard Kristal, & Miracle Crystal",
      icon: TrendingUp,
      impact: "Dampak Sedang",
      impactColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
      quickStat: "+20 Lv Special Training",
      summary: "Mengelola Shard dan Skill Ticket dengan efisien agar kartu bintang tinggi dapat segera dibuka potensinya.",
      keyPoints: [
        "Lakukan Special Training (evolusi) segera setelah kartu mencapai level awal maksimum untuk membuka batas level +10.",
        "Simpan Miracle Crystal untuk kartu Bintang 4 & 5; jangan dihabiskan untuk kartu Bintang 2.",
        "Simpan Skill Ticket Emas hanya untuk kartu dengan persentase score up 115% atau lebih.",
      ],
      doAndDont: {
        doText: "Buka Episode 1 dan Memorial Episode pada setiap kartu untuk tambahan stat dan Stars gratis.",
        dontText: "Jangan menaikkan level skill kartu bintang 2 atau 3 dengan tiket latihan langka.",
      },
    },
  ];

  const filteredTips = tipsData.filter(
    (t) => activeCategory === "all" || t.category === activeCategory
  );

  // Boost calculation constants
  const boostCalc = {
    1: { expMultiplier: "1x", eventMultiplier: "5x", resourceRatio: "100% (Maksimal)", timeRatio: "Santai" },
    2: { expMultiplier: "2x", eventMultiplier: "10x", resourceRatio: "85% (Optimal)", timeRatio: "Cepat" },
    3: { expMultiplier: "3x", eventMultiplier: "15x", resourceRatio: "70% (Hemat Waktu)", timeRatio: "Sangat Cepat" },
  }[boostMultiplier as 1 | 2 | 3] || { expMultiplier: "3x", eventMultiplier: "15x", resourceRatio: "70%", timeRatio: "Sangat Cepat" };

  return (
    <div className="space-y-8 rounded-3xl border border-amber-100 dark:border-amber-950/60 bg-gradient-to-b from-white to-amber-50/20 dark:from-card dark:to-card/60 p-6 sm:p-8 lg:p-10 shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold">
              Kompilasi Tips Praktis
            </span>
            <span className="text-xs text-muted-foreground">• Terkelompok & Mudah Dipindai</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Tips & Trik Efisiensi: Main Cerdas Setiap Hari
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Rangkuman cepat strategi harian agar kamu tidak membuang stamina, koin, dan tiket latihan. Pindai ringkasan atau gunakan kalkulator flame di bawah.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Live Boost Flame Calculator Card */}
      <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/60 via-orange-50/40 to-background dark:from-amber-950/30 dark:via-orange-950/20 dark:to-background p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                Kalkulator Efisiensi Live Boost (Flame)
              </h4>
              <p className="text-xs text-muted-foreground">
                Pilih pengali konsumsi flame untuk melihat rasio perolehan reward vs penghematan waktu:
              </p>
            </div>
          </div>

          {/* Flame Multiplier Buttons */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setBoostMultiplier(num)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  boostMultiplier === num
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm scale-105"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                <Flame className={`h-3.5 w-3.5 ${boostMultiplier === num ? "fill-white" : "text-amber-500"}`} />
                <span>{num}x Flame</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculation metrics result */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <div className="text-[11px] text-muted-foreground">EXP & Player Rank</div>
            <div className="text-base font-extrabold text-foreground font-mono">{boostCalc.expMultiplier}</div>
            <div className="text-[10px] text-muted-foreground">Kelipatan EXP akun</div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <div className="text-[11px] text-muted-foreground">Event Points Poin</div>
            <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">{boostCalc.eventMultiplier}</div>
            <div className="text-[10px] text-muted-foreground">Kelipatan skor event</div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <div className="text-[11px] text-muted-foreground">Efisiensi Bahan Drop</div>
            <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{boostCalc.resourceRatio}</div>
            <div className="text-[10px] text-muted-foreground">Rasio koin & kristal</div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <div className="text-[11px] text-muted-foreground">Kecepatan Bermain</div>
            <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">{boostCalc.timeRatio}</div>
            <div className="text-[10px] text-muted-foreground">Rekomendasi grinding</div>
          </div>
        </div>
      </div>

      {/* Scannable Cards Grid for Tips & Tricks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTips.map((tip) => {
          const IconComponent = tip.icon;
          return (
            <div
              key={tip.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition-all"
            >
              <div className="space-y-3.5">
                {/* Header with badge & stat */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/40">
                      {tip.categoryLabel}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tip.impactColor}`}>
                      {tip.impact}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {tip.quickStat}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex items-start gap-2">
                  <IconComponent className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{tip.title}</span>
                </h4>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {tip.summary}
                </p>

                {/* Scannable Bullet Points */}
                <div className="space-y-2 pt-1 border-t border-border/40">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Poin Penting Cepat:
                  </span>
                  {tip.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-foreground">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scannable DO & DON'T Matrix Box */}
              <div className="pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>LAKUKAN</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                    {tip.doAndDont.doText}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                    <X className="h-3.5 w-3.5 text-rose-600" />
                    <span>HINDARI</span>
                  </div>
                  <p className="text-[11px] text-rose-900/80 dark:text-rose-200/80 leading-relaxed">
                    {tip.doAndDont.dontText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

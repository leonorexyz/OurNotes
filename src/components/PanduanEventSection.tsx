"use client";

import { useState } from "react";
import {
  Trophy,
  Calendar,
  Clock,
  Gift,
  Award,
  Sparkles,
  Flame,
  Star,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface EventSchedule {
  id: string;
  name: string;
  type: "Marathon" | "VS Live" | "Live Goals";
  status: "Sedang Berlangsung" | "Akan Datang" | "Selesai";
  startDate: string;
  endDate: string;
  daysRemaining?: string;
  featuredAttribute: "Power" | "Cool" | "Pure" | "Happy";
  attributeColor: string;
  featuredCharacters: { name: string; band: string; bonus: string }[];
  description: string;
  pointRewards: { points: string; reward: string; icon: string; isKeyReward?: boolean }[];
  tierRankingRewards: { rank: string; reward: string; badge: string }[];
  badgeShopHighlights: { item: string; cost: string; limit: string; priority: "Wajib" | "Tinggi" | "Normal" }[];
}

export function PanduanEventSection() {
  const [selectedEventId, setSelectedEventId] = useState<string>("ev-1");
  const [activeRewardTab, setActiveRewardTab] = useState<"points" | "ranking" | "shop">("points");

  const eventsList: EventSchedule[] = [
    {
      id: "ev-1",
      name: "Melodi Senja di Panggung Bintang (Twilight Melodies)",
      type: "Marathon",
      status: "Sedang Berlangsung",
      startDate: "10 Oktober 2026",
      endDate: "19 Oktober 2026, 20:59 WIB",
      daysRemaining: "6 Hari Lagi",
      featuredAttribute: "Cool",
      attributeColor: "bg-blue-500 text-white",
      description: "Event Marathon bertema kolaborasi musik senja. Kumpulkan Event Point dari Solo atau Multi-Live untuk membuka cerita event eksklusif dan menukarkan badge di toko.",
      featuredCharacters: [
        { name: "Kasumi Toyama", band: "Poppin'Party", bonus: "+50%" },
        { name: "Ran Mitake", band: "Afterglow", bonus: "+50%" },
        { name: "Yukina Minato", band: "Roselia", bonus: "+50%" },
        { name: "Mashiro Kurata", band: "Morfonica", bonus: "+50%" },
        { name: "Tomori Takamatsu", band: "MyGO!!!!!", bonus: "+50%" },
      ],
      pointRewards: [
        { points: "20.000 Pts", reward: "50 Stars & 10.000 Koin", icon: "Star" },
        { points: "75.000 Pts", reward: "Kostum Panggung 'Twilight Outfit'", icon: "Sparkles", isKeyReward: true },
        { points: "150.000 Pts", reward: "★3 Kasumi [Harmoni Senja] (Eksklusif Event)", icon: "Trophy", isKeyReward: true },
        { points: "250.000 Pts", reward: "Miracle Crystal x5 & 250 Stars", icon: "Award" },
        { points: "350.000 Pts", reward: "Skill Ticket Emas x2", icon: "TrendingUp" },
        { points: "500.000 Pts", reward: "Rare Stamp Kasumi: 'Ayo Bersinar!'", icon: "Gift", isKeyReward: true },
      ],
      tierRankingRewards: [
        { rank: "Top 1 - 100", reward: "Gelar Khusus 'Top 100 Legend', 1.000 Stars, 3x Tiket Gacha ★4", badge: "Gold Legend" },
        { rank: "Top 101 - 1.000", reward: "Gelar 'Top 1.000 Maestro', 750 Stars, 2x Tiket Gacha ★4", badge: "Silver Master" },
        { rank: "Top 1.001 - 5.000", reward: "Gelar 'Top 5.000 Performer', 500 Stars, 1x Tiket Gacha ★4", badge: "Bronze Performer" },
        { rank: "Top 5.001 - 20.000", reward: "Gelar 'Top 20.000 Partisipan', 250 Stars, Shard Kristal", badge: "Participant" },
      ],
      badgeShopHighlights: [
        { item: "★3 Kartu Event Kasumi (Duplikat Skill Lv)", cost: "5.000 Badges", limit: "1x", priority: "Wajib" },
        { item: "Miracle Crystal (Material Terlangka)", cost: "3.000 Badges", limit: "10x", priority: "Wajib" },
        { item: "Skill Practice Ticket Emas", cost: "2.000 Badges", limit: "5x", priority: "Tinggi" },
        { item: "Koin Emas x100.000", cost: "1.000 Badges", limit: "20x", priority: "Normal" },
      ],
    },
    {
      id: "ev-2",
      name: "Pertarungan Ritme: VS Live Neon Beats",
      type: "VS Live",
      status: "Akan Datang",
      startDate: "22 Oktober 2026",
      endDate: "30 Oktober 2026, 20:59 WIB",
      daysRemaining: "Dimulai dalam 9 hari",
      featuredAttribute: "Power",
      attributeColor: "bg-red-500 text-white",
      description: "Mode duel 5 pemain dengan sistem penilaian skor langsung. Center skill aktif lebih sering dan memberikan bonus poin ekstra berdasarkan posisi peringkat di room.",
      featuredCharacters: [
        { name: "LAYER (Rei)", band: "RAISE A SUILEN", bonus: "+50%" },
        { name: "Kokoro Tsurumaki", band: "Hello, Happy World!", bonus: "+50%" },
        { name: "Aya Maruyama", band: "Pastel＊Palettes", bonus: "+50%" },
      ],
      pointRewards: [
        { points: "150.000 Pts", reward: "★3 LAYER [Bass Tremor] (Eksklusif)", icon: "Trophy", isKeyReward: true },
        { points: "300.000 Pts", reward: "Special Stamp LAYER 'Showtime!'", icon: "Gift" },
      ],
      tierRankingRewards: [
        { rank: "Top 1 - 500", reward: "Gelar 'VS Master Top 500', 800 Stars", badge: "VS Master" },
      ],
      badgeShopHighlights: [
        { item: "Power Shard Kristal x100", cost: "1.500 Badges", limit: "15x", priority: "Tinggi" },
      ],
    },
  ];

  const currentEvent = eventsList.find((e) => e.id === selectedEventId) || eventsList[0];

  return (
    <div className="space-y-8 rounded-3xl border border-emerald-100 dark:border-emerald-950/60 bg-gradient-to-b from-white to-emerald-50/20 dark:from-card dark:to-card/60 p-6 sm:p-8 lg:p-10 shadow-sm">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
              Kalender & Panduan Event
            </span>
            <span className="text-xs text-muted-foreground">• Jadwal Tanggal & Daftar Hadiah</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Panduan Event: Jadwal, Multiplier & Hadiah
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Ketahui tanggal mulai & berakhir, daftar hadiah poin, target tier ranking, dan bonus multiplier karakter untuk memaksimalkan perolehan badge.
          </p>
        </div>

        {/* Event selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {eventsList.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedEventId === ev.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${ev.status === "Sedang Berlangsung" ? "bg-emerald-300 animate-pulse" : "bg-amber-400"}`} />
              <span>{ev.name.split(":")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Event Overview Card */}
      <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-card p-6 sm:p-8 shadow-xs space-y-6">
        {/* Event banner & metadata header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border/60">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                {currentEvent.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-muted font-semibold text-muted-foreground">
                Format: {currentEvent.type}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${currentEvent.attributeColor}`}>
                Atribut: {currentEvent.featuredAttribute} (+20%)
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {currentEvent.name}
            </h4>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {currentEvent.description}
            </p>
          </div>

          {/* Date & Countdown Box */}
          <div className="rounded-2xl bg-muted/60 border border-border p-4 text-xs space-y-2 shrink-0 md:w-64">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span>Jadwal & Periode Event</span>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Mulai:</span>
                <strong className="text-foreground">{currentEvent.startDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Berakhir:</span>
                <strong className="text-rose-600 dark:text-rose-400">{currentEvent.endDate}</strong>
              </div>
            </div>
            <div className="pt-1 border-t border-border/40 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Sisa Waktu
              </span>
              <span className="bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded">
                {currentEvent.daysRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Bonus Characters (Multiplier) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              Karakter Bonus Multiplier Poin (+50% Match Bonus)
            </h5>
            <span className="text-[11px] text-muted-foreground">Maksimal Total Bonus: +250%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {currentEvent.featuredCharacters.map((char) => (
              <div
                key={char.name}
                className="p-3 rounded-xl border border-border bg-muted/30 text-xs space-y-1 hover:border-emerald-400 transition-colors"
              >
                <div className="font-bold text-foreground truncate">{char.name}</div>
                <div className="text-[11px] text-muted-foreground">{char.band}</div>
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded inline-block">
                  {char.bonus} Poin
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Section with Tabs (Points, Ranking, Badge Shop) */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-emerald-500" />
              <h5 className="font-bold text-base text-foreground">
                Katalog Daftar Hadiah Event
              </h5>
            </div>

            {/* Reward type tabs */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveRewardTab("points")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeRewardTab === "points"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hadiah Poin Kumulatif
              </button>
              <button
                onClick={() => setActiveRewardTab("ranking")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeRewardTab === "ranking"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hadiah Tier Ranking
              </button>
              <button
                onClick={() => setActiveRewardTab("shop")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeRewardTab === "shop"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Toko Badge Exchange
              </button>
            </div>
          </div>

          {/* TAB 1: POINT MILESTONES */}
          {activeRewardTab === "points" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentEvent.pointRewards.map((reward, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      reward.isKeyReward
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-2xs"
                        : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-foreground">
                        {reward.points}
                      </span>
                      {reward.isKeyReward && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                          ⭐ Hadiah Kunci
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Award className={`h-3.5 w-3.5 ${reward.isKeyReward ? "text-emerald-500" : "text-muted-foreground"}`} />
                      <span>{reward.reward}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Target Utama:</strong> Raih minimal <strong>150.000 Pts</strong> untuk mengamankan Karakter Eksklusif ★3 Event sebelum periode berakhir!
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: RANKING REWARDS */}
          {activeRewardTab === "ranking" && (
            <div className="space-y-3">
              <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card text-xs">
                {currentEvent.tierRankingRewards.map((rankItem, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground font-mono w-28">
                        {rankItem.rank}
                      </span>
                      <span className="font-semibold text-muted-foreground">
                        {rankItem.reward}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/50 shrink-0">
                      Badge: {rankItem.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BADGE SHOP */}
          {activeRewardTab === "shop" && (
            <div className="space-y-3">
              <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card text-xs">
                {currentEvent.badgeShopHighlights.map((shopItem, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-foreground">{shopItem.item}</div>
                      <div className="text-[11px] text-muted-foreground">Batas Pembelian: {shopItem.limit}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {shopItem.cost}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          shopItem.priority === "Wajib"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : shopItem.priority === "Tinggi"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        Prioritas {shopItem.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

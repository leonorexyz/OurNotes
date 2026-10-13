"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Trophy,
  Flame,
  Leaf,
  Snowflake,
  Sun,
  Star,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import { GACHA_BANNERS_DATA, GachaBanner } from "@/data/gachaData";

interface RunningGameEvent {
  id: string;
  name: string;
  type: "Marathon" | "VS Live" | "Live Goals" | "Challenge Live";
  status: "Sedang Berlangsung" | "Akan Datang" | "Selesai";
  startDay: number; // day in October 2026
  endDay: number;
  startDate: string;
  endDate: string;
  featuredAttribute: "Power" | "Pure" | "Cool" | "Happy";
  description: string;
  bonusSummary: string;
  correspondingGachaId?: string;
}

export const RUNNING_EVENTS_DATA: RunningGameEvent[] = [
  {
    id: "ev-twilight",
    name: "Melodi Senja di Panggung Bintang (Twilight Melodies)",
    type: "Marathon",
    status: "Sedang Berlangsung",
    startDay: 10,
    endDay: 19,
    startDate: "10 Okt 2026",
    endDate: "19 Okt 2026",
    featuredAttribute: "Cool",
    description: "Event Marathon bertema kolaborasi musik senja dengan bonus poin dari kartu atribut Cool.",
    bonusSummary: "+50% Event Points untuk kartu Kasumi, Ran, Yukina, Mashiro, Tomori",
    correspondingGachaId: "gacha-kirafes-vol1",
  },
  {
    id: "ev-neon-beats",
    name: "Pertarungan Ritme: VS Live Neon Beats",
    type: "VS Live",
    status: "Sedang Berlangsung",
    startDay: 12,
    endDay: 23,
    startDate: "12 Okt 2026",
    endDate: "23 Okt 2026",
    featuredAttribute: "Power",
    description: "Pertarungan 5 pemain langsung di Multi-Live room dengan hadiah tier ranking eksklusif.",
    bonusSummary: "+50% Event Points untuk kartu LAYER, Kokoro, Aya Maruyama",
    correspondingGachaId: "gacha-event-neon-beats",
  },
  {
    id: "ev-ave-nocturne",
    name: "Simfoni Bayangan Topeng: Ave Mujica Debut",
    type: "Live Goals",
    status: "Akan Datang",
    startDay: 25,
    endDay: 31,
    startDate: "25 Okt 2026",
    endDate: "4 Nov 2026",
    featuredAttribute: "Cool",
    description: "Event tantangan target kombo dan akurasi debut panggung Ave Mujica.",
    bonusSummary: "+50% Event Points untuk semua kartu personil Ave Mujica",
    correspondingGachaId: "gacha-upcoming-ave-mujica",
  },
];

export function GachaEventCalendar() {
  // Current active viewing day (default to 13 October)
  const [selectedDay, setSelectedDay] = useState<number>(13);

  const daysInMonth = 31; // October has 31 days
  const startDayOfWeek = 4; // Thursday 1st October 2026 (index 4: Mon=1..Sun=7)

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

  // Find events on selected day
  const eventsOnSelectedDay = useMemo(() => {
    return RUNNING_EVENTS_DATA.filter(
      (ev) => selectedDay >= ev.startDay && selectedDay <= ev.endDay
    );
  }, [selectedDay]);

  // Find gacha banners on selected day
  const gachasOnSelectedDay = useMemo(() => {
    return GACHA_BANNERS_DATA.filter((b) => {
      const start = new Date(b.startAt).getDate();
      const end = new Date(b.endAt).getDate();
      // For banners in current month
      if (b.status === "Selesai") return false;
      return selectedDay >= start && selectedDay <= end;
    });
  }, [selectedDay]);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-md">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Kalender Jadwal Event & Gacha Berjalan
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Oktober 2026 • Sinkronisasi jadwal event live show dan banner gacha aktif
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold text-xs">
            Hari Ini: 13 Okt 2026
          </span>
        </div>
      </div>

      {/* Calendar Grid View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
          <span>Pilih tanggal untuk melihat event & banner yang sedang berlangsung:</span>
          <span>Bulan: <strong>Oktober 2026</strong></span>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[11px] font-bold text-muted-foreground py-1">
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span className="text-blue-500">Sab</span>
          <span className="text-pink-500">Min</span>
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells before start of month (Thursday = 3 empty cells Mon, Tue, Wed) */}
          {[...Array(3)].map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="h-14 sm:h-20 rounded-2xl bg-muted/10 border border-transparent opacity-30 pointer-events-none"
            />
          ))}

          {/* Days 1 to 31 */}
          {[...Array(daysInMonth)].map((_, idx) => {
            const day = idx + 1;
            const isSelected = selectedDay === day;
            const isToday = day === 13;

            // Check if any event is active on this day
            const hasEvent = RUNNING_EVENTS_DATA.some(
              (ev) => day >= ev.startDay && day <= ev.endDay
            );
            // Check if any gacha is active on this day
            const hasGacha = GACHA_BANNERS_DATA.some((b) => {
              const start = new Date(b.startAt).getDate();
              const end = new Date(b.endAt).getDate();
              return b.status !== "Selesai" && day >= start && day <= end;
            });

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-14 sm:h-20 p-1.5 sm:p-2 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? "border-pink-500 bg-pink-50/50 dark:bg-pink-950/40 ring-2 ring-pink-500/20 shadow-xs"
                    : isToday
                    ? "border-purple-400 bg-purple-50/30 dark:bg-purple-950/20"
                    : "border-border/80 bg-card hover:border-pink-300 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-black text-xs sm:text-sm ${
                      isSelected
                        ? "text-pink-600 dark:text-pink-400 font-extrabold"
                        : isToday
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-foreground"
                    }`}
                  >
                    {day}
                  </span>

                  {isToday && (
                    <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-purple-600 text-white font-black text-[9px]">
                      HARI INI
                    </span>
                  )}
                </div>

                {/* Event & Gacha Indicators */}
                <div className="flex items-center gap-1 flex-wrap">
                  {hasEvent && (
                    <span
                      className="h-2 w-2 rounded-full bg-blue-500 shrink-0"
                      title="Ada Event Berjalan"
                    />
                  )}
                  {hasGacha && (
                    <span
                      className="h-2 w-2 rounded-full bg-pink-500 shrink-0"
                      title="Ada Banner Gacha Aktif"
                    />
                  )}
                  {hasEvent && hasGacha && (
                    <span className="hidden sm:inline text-[9px] font-bold text-muted-foreground truncate">
                      Event + Gacha
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>Event Live Show Berjalan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
            <span>Banner Gacha Aktif / Pickup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <span>Tanggal Hari Ini (13 Okt)</span>
          </div>
        </div>
      </div>

      {/* Selected Day Agenda Detail Panel */}
      <div className="p-5 sm:p-6 rounded-3xl bg-muted/20 border border-border space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-pink-600" />
            <h3 className="font-black text-sm sm:text-base text-foreground">
              Agenda Aktif pada Tanggal {selectedDay} Oktober 2026:
            </h3>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {eventsOnSelectedDay.length} Event • {gachasOnSelectedDay.length} Banner
          </span>
        </div>

        {/* Two-Column List: Running Events & Gachas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Running Events Column */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-blue-500" />
              <span>Event Game yang Sedang Berjalan:</span>
            </span>

            {eventsOnSelectedDay.length === 0 ? (
              <div className="p-4 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
                Tidak ada event resmi yang aktif pada tanggal ini.
              </div>
            ) : (
              <div className="space-y-3">
                {eventsOnSelectedDay.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-card shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                        Mode: {ev.type}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                        {getAttrIcon(ev.featuredAttribute)}
                        <span>Boost {ev.featuredAttribute}</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-foreground text-sm leading-snug">
                      {ev.name}
                    </h4>

                    <p className="text-muted-foreground text-[11px]">
                      {ev.description}
                    </p>

                    <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                      <span className="text-blue-600 font-semibold">{ev.bonusSummary}</span>
                      <span className="text-muted-foreground">
                        {ev.startDate} - {ev.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gacha Banners Column */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span>Banner Gacha yang Sedang Aktif:</span>
            </span>

            {gachasOnSelectedDay.length === 0 ? (
              <div className="p-4 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
                Tidak ada banner gacha aktif pada tanggal ini.
              </div>
            ) : (
              <div className="space-y-3">
                {gachasOnSelectedDay.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-pink-200/60 dark:border-pink-900/40 bg-card shadow-2xs space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold text-[10px]">
                        {b.category}
                      </span>
                      <span className="font-bold text-pink-600 font-mono text-[11px]">
                        ★4: {b.pickupRates.maxRarityRate}
                      </span>
                    </div>

                    <h4 className="font-bold text-foreground text-sm leading-snug">
                      {b.title}
                    </h4>

                    {/* Featured character mini pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {b.featuredCharacters.map((c) => (
                        <div
                          key={c.id}
                          className="px-2 py-1 rounded-xl bg-muted/50 border border-border flex items-center gap-1.5 text-[10px]"
                        >
                          <span className="font-bold text-foreground">{c.name}</span>
                          <span className="text-pink-600 font-mono">({c.pickupRate})</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-600 font-bold">
                        Pity: {b.pitySystem.pityThreshold} Seal
                      </span>
                      <Link
                        href={`/gacha/${b.id}`}
                        className="text-pink-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <span>Lihat Rincian</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

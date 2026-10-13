"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Bell,
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Coins,
  Download,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Star,
  ExternalLink,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  Leaf,
  Snowflake,
  Sun,
  X,
} from "lucide-react";
import {
  GachaReminderModal,
  GachaReminderItem,
  downloadIcsFile,
  generateIcsCalendar,
} from "@/components/GachaReminderModal";
import { GACHA_BANNERS_DATA, GachaBanner } from "@/data/gachaData";

const STORAGE_KEY = "ournotes_gacha_reminders_v1";

export default function GachaRemindersPage() {
  const [reminders, setReminders] = useState<GachaReminderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBannerForModal, setSelectedBannerForModal] = useState<GachaBanner | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [browserPermission, setBrowserPermission] = useState<string>("default");

  // Load reminders from localStorage
  const loadReminders = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      } else {
        const defaultSample: GachaReminderItem = {
          id: "rem-sample-1",
          bannerId: "gacha-kirafes-vol1",
          bannerTitle: "Kira-Kira Festival Vol. 1",
          bannerCategory: "Kirafes / Festival",
          bannerEndAt: "2026-10-20T23:59:59Z",
          targetCharacterName: "Kasumi Toyama",
          targetCharacterTitle: "Melodi Senja di Panggung Bintang",
          notificationTiming: "h-1",
          targetSpark: 75000,
          currentStars: 42500,
          notes: "Target wajib Kirafes dengan double rate ★4 6.00%!",
          createdAt: new Date().toISOString(),
        };
        setReminders([defaultSample]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultSample]));
      }
    } catch (err) {
      console.warn("Storage error", err);
    }
  };

  useEffect(() => {
    loadReminders();
    if (typeof window !== "undefined" && "Notification" in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    setNotificationToast("Pengingat berhasil dihapus.");
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const handleUpdateStars = (id: string, newStars: number) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, currentStars: Math.max(0, newStars) } : r));
    setReminders(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleTestNotification = (rem: GachaReminderItem) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(`Pengingat: ${rem.bannerTitle}`, {
        body: `Banner untuk "${rem.targetCharacterName}" segera berakhir! Target Stars: ${rem.targetSpark.toLocaleString('id-ID')}`,
        icon: "/favicon.ico",
      });
      setNotificationToast(`Notifikasi push berhasil dikirim untuk "${rem.bannerTitle}"!`);
    } else {
      setNotificationToast(
        `Notifikasi browser belum aktif. Klik "Izinkan Notifikasi" di bawah atau gunakan kalender .ics.`
      );
    }
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleRequestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationToast("Browser ini tidak mendukung notifikasi push web.");
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setBrowserPermission(res);
      if (res === "granted") {
        setNotificationToast("Izin notifikasi browser berhasil diaktifkan!");
        new Notification("Bang Dream! Our Notes", {
          body: "Notifikasi pengingat gacha aktif untuk browser ini.",
          icon: "/favicon.ico",
        });
      } else {
        setNotificationToast("Izin notifikasi tidak diaktifkan.");
      }
    } catch {
      setNotificationToast("Gagal meminta izin browser.");
    }
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleExportAllIcs = () => {
    if (reminders.length === 0) return;
    const allEvents = reminders.map((r) => generateIcsCalendar(r)).join("\n");
    const blob = new Blob([allEvents], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `semua-pengingat-gacha-ournotes.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotificationToast("Semua jadwal pengingat berhasil diekspor ke format Kalender (.ics)!");
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Metrics
  const totalTargetStars = useMemo(() => {
    return reminders.reduce((acc, curr) => acc + curr.targetSpark, 0);
  }, [reminders]);

  const totalCurrentStars = useMemo(() => {
    return reminders.reduce((acc, curr) => acc + curr.currentStars, 0);
  }, [reminders]);

  const totalRemainingStarsNeeded = Math.max(0, totalTargetStars - totalCurrentStars);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-purple-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/gacha" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Daftar Jadwal Gacha
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Daftar Pengingat Gacha Incaran</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-purple-200/70 dark:border-purple-900/40 bg-gradient-to-r from-purple-50/80 via-pink-50/40 to-background dark:from-purple-950/30 dark:via-pink-950/15 dark:to-background p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-950/70 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-200/70">
              <Bell className="h-3.5 w-3.5" />
              <span>Alarm Banner & Spark Savings Plan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Daftar Pengingat Gacha & Target Spark
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Pantau jadwal banner incaran, lacak akumulasi Stars menuju jaminan 300 Gacha Seal (Spark), dan sinkronkan alarm ke Google / Apple Calendar agar tidak melewatkan kartu impian.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="mt-6 pt-6 border-t border-purple-200/50 dark:border-purple-900/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Banner Diingatkan:</span>
              <strong className="text-foreground font-black text-sm sm:text-base">
                {reminders.length} Banner
              </strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Tabungan Stars:</span>
              <strong className="text-amber-500 font-black text-sm sm:text-base font-mono">
                {totalCurrentStars.toLocaleString("id-ID")}
              </strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Total Target Spark:</span>
              <strong className="text-purple-600 font-black text-sm sm:text-base font-mono">
                {totalTargetStars.toLocaleString("id-ID")}
              </strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Kurang Stars:</span>
              <strong className="text-pink-600 font-black text-sm sm:text-base font-mono">
                {totalRemainingStarsNeeded.toLocaleString("id-ID")}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Bar & Notification Alert */}
        {notificationToast && (
          <div className="rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/90 dark:bg-purple-950/70 p-4 text-xs text-purple-900 dark:text-purple-200 font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
              <span>{notificationToast}</span>
            </div>
            <button onClick={() => setNotificationToast(null)} className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => {
                setSelectedBannerForModal(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Pengingat Baru</span>
            </button>

            <button
              onClick={handleExportAllIcs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-pink-600" />
              <span>Ekspor Semua ke Kalender (.ics)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestPermission}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${
                browserPermission === "granted"
                  ? "border-emerald-200 bg-emerald-50/70 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bell className="h-3.5 w-3.5" />
              <span>
                Notifikasi Browser: {browserPermission === "granted" ? "Aktif" : "Minta Izin"}
              </span>
            </button>
          </div>
        </div>

        {/* Reminders List Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Daftar Pengingat Aktif ({reminders.length})
            </h2>
            <Link
              href="/gacha"
              className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1"
            >
              <span>Lihat Jadwal Banner Lengkap</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {reminders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto stroke-1" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Belum ada banner yang diingatkan</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Tambahkan banner gacha favoritmu agar tidak melewatkan Kirafes, limited pickup, atau jaminan penukaran spark seal!
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Setel Pengingat Pertama</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reminders.map((rem) => {
                const percent = Math.min(100, Math.round((rem.currentStars / rem.targetSpark) * 100));
                const remaining = Math.max(0, rem.targetSpark - rem.currentStars);
                const pullsPossible = Math.floor(rem.currentStars / 250);
                const pullsNeeded = Math.ceil(remaining / 250);

                return (
                  <div
                    key={rem.id}
                    className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
                  >
                    <div className="space-y-3.5">
                      {/* Top banner tag & delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/50">
                            {rem.bannerCategory}
                          </span>
                          <h3 className="font-extrabold text-base text-foreground leading-snug">
                            {rem.bannerTitle}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-purple-600" />
                            <span>
                              Selesai:{" "}
                              {new Date(rem.bannerEndAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteReminder(rem.id)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Hapus Pengingat"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Character Card Box */}
                      <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground block">Target Karakter:</span>
                          <strong className="text-foreground font-bold text-sm">
                            {rem.targetCharacterName}
                          </strong>
                          {rem.targetCharacterTitle && (
                            <span className="text-[11px] text-pink-600 font-medium block">
                              [{rem.targetCharacterTitle}]
                            </span>
                          )}
                        </div>

                        <div className="text-right space-y-0.5">
                          <span className="text-[10px] text-muted-foreground block">Waktu Alarm:</span>
                          <span className="font-bold text-purple-600 text-xs">
                            {rem.notificationTiming === "h-1"
                              ? "H-1 Sebelum Tutup"
                              : rem.notificationTiming === "h-3"
                              ? "H-3 Sebelum Tutup"
                              : rem.notificationTiming === "6-hours"
                              ? "6 Jam Terakhir"
                              : "Saat Rilis"}
                          </span>
                        </div>
                      </div>

                      {/* Spark Target & Stars Progress */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Coins className="h-3.5 w-3.5 text-amber-500" />
                            <span>Tabungan: {rem.currentStars.toLocaleString("id-ID")} Stars</span>
                          </span>
                          <span className="font-mono font-bold text-foreground">
                            Target Spark: {rem.targetSpark.toLocaleString("id-ID")}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              percent >= 100
                                ? "bg-emerald-500"
                                : percent >= 60
                                ? "bg-amber-500"
                                : "bg-purple-600"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            {percent}% Siap ({pullsPossible}x Pull)
                          </span>
                          <span className={remaining === 0 ? "font-bold text-emerald-600" : "font-bold text-pink-600"}>
                            {remaining === 0
                              ? "✓ Cukup untuk Spark 300 Seal!"
                              : `Kurang ${remaining.toLocaleString("id-ID")} Stars (${pullsNeeded}x Pull)`}
                          </span>
                        </div>

                        {/* Quick Adjust Stars */}
                        <div className="pt-1 flex items-center gap-1.5 text-[11px]">
                          <span className="text-muted-foreground text-[10px]">Update Stars:</span>
                          <button
                            onClick={() => handleUpdateStars(rem.id, rem.currentStars + 2500)}
                            className="px-2 py-0.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-mono text-[10px] cursor-pointer"
                          >
                            +2.500 (10x)
                          </button>
                          <button
                            onClick={() => handleUpdateStars(rem.id, rem.currentStars + 12500)}
                            className="px-2 py-0.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-mono text-[10px] cursor-pointer"
                          >
                            +12.500 (50x)
                          </button>
                          <button
                            onClick={() => handleUpdateStars(rem.id, rem.targetSpark)}
                            className="px-2 py-0.5 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold cursor-pointer"
                          >
                            Set Max Spark
                          </button>
                        </div>
                      </div>

                      {rem.notes && (
                        <p className="text-[11px] text-muted-foreground italic border-l-2 border-purple-400 pl-2.5">
                          &quot;{rem.notes}&quot;
                        </p>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3.5 border-t border-border flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTestNotification(rem)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
                        >
                          <Send className="h-3 w-3" />
                          <span>Tes Alarm</span>
                        </button>

                        <button
                          onClick={() => downloadIcsFile(rem)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-[11px] cursor-pointer"
                        >
                          <Download className="h-3 w-3 text-pink-600" />
                          <span>.ics Kalender</span>
                        </button>
                      </div>

                      <Link
                        href={`/gacha/${rem.bannerId}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:underline"
                      >
                        <span>Lihat Banner</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Informative Guidance Section */}
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Panduan Mengatur Jadwal Gacha & Jaminan Spark
              </h3>
              <p className="text-xs text-muted-foreground">
                Tips memaksimalkan efisiensi Stars untuk pemain gratis (F2P) dan kolektor kartu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
              <strong className="text-foreground block font-bold text-sm">
                1. Fokus pada Kirafes (Rate 6%)
              </strong>
              <p className="text-muted-foreground leading-relaxed">
                Selalu prioritaskan banner Kira-Kira Festival karena rate kartu ★4 naik dua kali lipat menjadi 6.00%. Hindari roll banner permanen standar tanpa rate up ganda.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
              <strong className="text-foreground block font-bold text-sm">
                2. Siapkan 75.000 Stars (300 Seal)
              </strong>
              <p className="text-muted-foreground leading-relaxed">
                Jika memiliki kartu waifu atau meta yang wajib didapat, pastikan tabungan Stars mencapai 75.000 agar dapat langsung menukarkan 300 Gacha Seal jika tidak hoki.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
              <strong className="text-foreground block font-bold text-sm">
                3. Manfaatkan File .ics Kalender
              </strong>
              <p className="text-muted-foreground leading-relaxed">
                Impor file .ics ke Google Calendar atau kalender ponselmu. Kamu akan menerima notifikasi otomatis sebelum banner ditutup tanpa harus membuka aplikasi setiap saat.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Embedded Modal Component */}
      <GachaReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBanner={selectedBannerForModal}
        onReminderSaved={() => {
          loadReminders();
          setNotificationToast("Pengingat gacha baru berhasil ditambahkan!");
          setTimeout(() => setNotificationToast(null), 3500);
        }}
      />
    </div>
  );
}

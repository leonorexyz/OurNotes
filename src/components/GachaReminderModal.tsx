"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  AlertCircle,
  X,
  Target,
  Coins,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { GachaBanner, GACHA_BANNERS_DATA } from "@/data/gachaData";

export interface GachaReminderItem {
  id: string;
  bannerId: string;
  bannerTitle: string;
  bannerCategory: string;
  bannerEndAt: string;
  targetCharacterName: string;
  targetCharacterTitle?: string;
  notificationTiming: "release" | "h-3" | "h-1" | "6-hours";
  targetSpark: number; // e.g. 75000
  currentStars: number;
  email?: string;
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = "ournotes_gacha_reminders_v1";

// Helper to generate iCalendar (.ics) content for gacha schedule
export function generateIcsCalendar(reminder: GachaReminderItem): string {
  const end = new Date(reminder.bannerEndAt);
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bang Dream Our Notes//Gacha Reminder//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:gacha-${reminder.id}@ournotes.gg`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:Bang Dream! Banner: ${reminder.bannerTitle}`,
    `DESCRIPTION:Pengingat penarikan gacha incaran: ${reminder.targetCharacterName}. Target Stars: ${reminder.targetSpark.toLocaleString('id-ID')}. Jangan lewatkan sebelum banner ditutup!\\nCatatan: ${reminder.notes || 'Siapkan Stars untuk Spark!'}\\nInfo: https://ournotes.gg/gacha/${reminder.bannerId}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "DESCRIPTION:Banner Gacha Bang Dream Akan Segera Berakhir!",
    "ACTION:DISPLAY",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return icsContent;
}

export function downloadIcsFile(reminder: GachaReminderItem) {
  const ics = generateIcsCalendar(reminder);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `pengingat-gacha-${reminder.bannerId}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface GachaReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBanner?: GachaBanner | null;
  onReminderSaved?: (reminder: GachaReminderItem) => void;
}

export function GachaReminderModal({
  isOpen,
  onClose,
  initialBanner,
  onReminderSaved,
}: GachaReminderModalProps) {
  const [selectedBannerId, setSelectedBannerId] = useState<string>(
    initialBanner ? initialBanner.id : GACHA_BANNERS_DATA[0].id
  );
  const [selectedCharacterName, setSelectedCharacterName] = useState<string>("Semua Karakter Pickup");
  const [notificationTiming, setNotificationTiming] = useState<"release" | "h-3" | "h-1" | "6-hours">("h-1");
  const [currentStars, setCurrentStars] = useState<number>(5000);
  const [targetSpark, setTargetSpark] = useState<number>(75000);
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("Incar kartu pickup utama sebelum batas spark!");
  const [browserNotificationStatus, setBrowserNotificationStatus] = useState<string>("default");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialBanner) {
      setSelectedBannerId(initialBanner.id);
      if (initialBanner.featuredCharacters.length > 0) {
        setSelectedCharacterName(initialBanner.featuredCharacters[0].name);
      } else {
        setSelectedCharacterName("Semua Karakter Pickup");
      }
    }
  }, [initialBanner]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setBrowserNotificationStatus(Notification.permission);
    }
  }, []);

  const currentBanner = useMemo(() => {
    return GACHA_BANNERS_DATA.find((b) => b.id === selectedBannerId) || GACHA_BANNERS_DATA[0];
  }, [selectedBannerId]);

  const requestBrowserPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatusMessage("Browser ini tidak mendukung notifikasi push web.");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserNotificationStatus(permission);
      if (permission === "granted") {
        setStatusMessage("Notifikasi browser berhasil diizinkan!");
        new Notification("Bang Dream! Our Notes", {
          body: "Pengingat gacha aktif! Kami akan mengingatkanmu saat banner incaran hampir ditutup.",
          icon: "/favicon.ico",
        });
      } else {
        setStatusMessage("Izin notifikasi ditolak oleh browser.");
      }
    } catch {
      setStatusMessage("Gagal meminta izin notifikasi browser.");
    }
  };

  const remainingStarsNeeded = Math.max(0, targetSpark - currentStars);
  const pullsPossibleWithCurrent = Math.floor(currentStars / 250);
  const pullsNeededToTarget = Math.ceil(remainingStarsNeeded / 250);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReminder: GachaReminderItem = {
      id: `rem-${Date.now()}`,
      bannerId: currentBanner.id,
      bannerTitle: currentBanner.title,
      bannerCategory: currentBanner.category,
      bannerEndAt: currentBanner.endAt,
      targetCharacterName: selectedCharacterName,
      targetCharacterTitle: currentBanner.featuredCharacters.find(
        (c) => c.name === selectedCharacterName
      )?.cardTitle,
      notificationTiming,
      targetSpark,
      currentStars,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    // Save to LocalStorage
    try {
      const existingStr = localStorage.getItem(STORAGE_KEY);
      const existingList: GachaReminderItem[] = existingStr ? JSON.parse(existingStr) : [];
      // Replace existing reminder for this banner if present or append
      const filtered = existingList.filter((item) => item.bannerId !== newReminder.bannerId);
      const updated = [newReminder, ...filtered];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not save to localStorage", err);
    }

    if (onReminderSaved) {
      onReminderSaved(newReminder);
    }

    setStatusMessage(`Pengingat untuk "${currentBanner.title}" berhasil disimpan!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl animate-in zoom-in-95 space-y-5 p-6 text-xs text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight">
                Setel Pengingat Gacha & Target Kartu
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Jadwalkan alarm penarikan dan hitung target Stars untuk jaminan Spark
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {statusMessage && (
          <div className="rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/50 p-3.5 font-bold text-purple-800 dark:text-purple-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
              <span>{statusMessage}</span>
            </span>
            <button
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Banner Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground block">
              Pilih Banner Gacha:
            </label>
            <select
              value={selectedBannerId}
              onChange={(e) => {
                setSelectedBannerId(e.target.value);
                const b = GACHA_BANNERS_DATA.find((x) => x.id === e.target.value);
                if (b && b.featuredCharacters.length > 0) {
                  setSelectedCharacterName(b.featuredCharacters[0].name);
                } else {
                  setSelectedCharacterName("Semua Karakter Pickup");
                }
              }}
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-xs focus:border-purple-500 focus:outline-none"
            >
              {GACHA_BANNERS_DATA.map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.status}] {b.title} ({b.category})
                </option>
              ))}
            </select>
          </div>

          {/* Target Character Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground block">
              Target Karakter Incaran:
            </label>
            <select
              value={selectedCharacterName}
              onChange={(e) => setSelectedCharacterName(e.target.value)}
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-xs focus:border-purple-500 focus:outline-none"
            >
              <option value="Semua Karakter Pickup">Semua Karakter Pickup Unggulan</option>
              {currentBanner.featuredCharacters.map((c) => (
                <option key={c.name} value={c.name}>
                  ★{c.rarity} {c.name} — [{c.cardTitle}] ({c.attribute})
                </option>
              ))}
            </select>
          </div>

          {/* Spark Target & Stars Calculator */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span className="flex items-center gap-1.5 text-xs text-pink-600">
                <Target className="h-4 w-4" />
                <span>Kalkulator Target Spark (Gacha Seal)</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                1 Pull = 250 Stars
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground block">Tabungan Stars Saat Ini:</span>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                  <input
                    type="number"
                    min={0}
                    step={250}
                    value={currentStars}
                    onChange={(e) => setCurrentStars(Number(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-card text-xs font-mono font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground block">Target Spark Guarantee:</span>
                <select
                  value={targetSpark}
                  onChange={(e) => setTargetSpark(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl border border-input bg-card text-xs font-mono font-bold focus:border-purple-500 focus:outline-none"
                >
                  <option value={2500}>2.500 Stars (10 Pulls / Coba Keberuntungan)</option>
                  <option value={12500}>12.500 Stars (50 Pulls)</option>
                  <option value={25000}>25.000 Stars (100 Pulls / 100 Seal)</option>
                  <option value={50000}>50.000 Stars (200 Pulls / 200 Seal)</option>
                  <option value={75000}>75.000 Stars (300 Pulls / Jaminan Spark 300 Seal)</option>
                </select>
              </div>
            </div>

            {/* Calculations summary banner */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-muted-foreground">Bisa Tarik: </span>
                <strong className="text-foreground font-mono">{pullsPossibleWithCurrent}x Pull</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Kurang Stars: </span>
                <strong className={remainingStarsNeeded === 0 ? "text-emerald-600 font-bold" : "text-pink-600 font-mono font-bold"}>
                  {remainingStarsNeeded === 0 ? "Tercapai!" : `${remainingStarsNeeded.toLocaleString("id-ID")} Stars (${pullsNeededToTarget}x Pull)`}
                </strong>
              </div>
            </div>
          </div>

          {/* Timing Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground block">
              Kapan Ingin Menerima Peringatan?
            </label>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {[
                { id: "h-1", label: "H-1 Banner Berakhir", desc: "Direkomendasikan agar siap" },
                { id: "h-3", label: "H-3 Banner Berakhir", desc: "Waktu review sisa stars" },
                { id: "6-hours", label: "6 Jam Terakhir", desc: "Peringatan mendesak" },
                { id: "release", label: "Saat Banner Rilis", desc: "Langsung saat hari-1" },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setNotificationTiming(t.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    notificationTiming === t.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="font-bold text-foreground">{t.label}</div>
                  <div className="text-[10px] text-muted-foreground font-normal">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Reminder Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground block">
              Catatan Pribadi (Target / Rencana Tarik):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jangan pull sebelum punya minimal 50.000 stars!"
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2 text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Push & Calendar Sync Controls */}
          <div className="rounded-2xl border border-border p-3.5 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-purple-600" />
                <span>Integrasi Notifikasi & Kalender</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">
                Status: {browserNotificationStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-[11px] transition-colors cursor-pointer"
              >
                Izinkan Notifikasi Browser
              </button>

              <button
                type="button"
                onClick={() => {
                  downloadIcsFile({
                    id: "preview",
                    bannerId: currentBanner.id,
                    bannerTitle: currentBanner.title,
                    bannerCategory: currentBanner.category,
                    bannerEndAt: currentBanner.endAt,
                    targetCharacterName: selectedCharacterName,
                    notificationTiming,
                    targetSpark,
                    currentStars,
                    notes,
                    createdAt: new Date().toISOString(),
                  });
                  setStatusMessage("File kalender (.ics) berhasil diunduh!");
                }}
                className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5 text-pink-600" />
                <span>Unduh File Kalender (.ics)</span>
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
            >
              Simpan Pengingat Gacha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Active Reminders Manager component (displays saved reminders list with actions)
export function GachaReminderManager() {
  const [reminders, setReminders] = useState<GachaReminderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBannerForModal, setActiveBannerForModal] = useState<GachaBanner | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadReminders = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      } else {
        // Initialize default sample reminder for rich UX
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
  }, []);

  const handleDelete = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    setNotice("Pengingat berhasil dihapus.");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleTestNotification = (rem: GachaReminderItem) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(`Pengingat: ${rem.bannerTitle}`, {
        body: `Banner untuk kartu "${rem.targetCharacterName}" segera ditutup! Target Stars: ${rem.targetSpark.toLocaleString('id-ID')}`,
        icon: "/favicon.ico",
      });
      setNotice(`Notifikasi push dikirim untuk "${rem.bannerTitle}"!`);
    } else {
      setNotice(`Notifikasi browser belum diizinkan. Cek file .ics untuk kalender!`);
    }
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="rounded-3xl border border-purple-200/70 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/50 via-background to-pink-50/30 dark:from-purple-950/20 dark:via-background dark:to-pink-950/10 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-700 dark:text-purple-300">
            <Bell className="h-3.5 w-3.5" />
            <span>Pengingat Banner & Target Spark</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Daftar Pengingat Gacha Incaran Saya
          </h3>
          <p className="text-xs text-muted-foreground">
            Kelola banner impian, pantau akumulasi Stars menuju jaminan Spark 300 Seal, dan ekspor ke Kalender.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveBannerForModal(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Bell className="h-4 w-4" />
          <span>+ Tambah Pengingat Baru</span>
        </button>
      </div>

      {notice && (
        <div className="rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/90 dark:bg-purple-950/60 p-3.5 text-xs text-purple-800 dark:text-purple-200 font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Reminder Cards List */}
      {reminders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-3">
          <Bell className="h-8 w-8 text-muted-foreground mx-auto stroke-1" />
          <h4 className="font-bold text-sm text-foreground">Belum ada banner gacha yang dipasang pengingat</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Pasang alarm untuk banner atau karakter impianmu agar tidak melewatkan Kirafes atau event limited!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Setel Pengingat Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((rem) => {
            const percent = Math.min(100, Math.round((rem.currentStars / rem.targetSpark) * 100));
            const remaining = Math.max(0, rem.targetSpark - rem.currentStars);

            return (
              <div
                key={rem.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        {rem.bannerCategory}
                      </span>
                      <h4 className="font-bold text-sm text-foreground leading-snug">
                        {rem.bannerTitle}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDelete(rem.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Hapus Pengingat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Target Card */}
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Kartu Incaran:</span>
                      <strong className="text-foreground font-semibold">
                        {rem.targetCharacterName}
                      </strong>
                      {rem.targetCharacterTitle && (
                        <span className="text-[10px] text-pink-600 block">
                          [{rem.targetCharacterTitle}]
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">Peringatan:</span>
                      <span className="font-bold text-purple-600 text-[11px]">
                        {rem.notificationTiming === "h-1" ? "H-1 Penutupan" : rem.notificationTiming === "h-3" ? "H-3 Penutupan" : rem.notificationTiming === "6-hours" ? "6 Jam Terakhir" : "Saat Rilis"}
                      </span>
                    </div>
                  </div>

                  {/* Progress Stars Goal */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5 text-amber-500" />
                        <span>Tabungan Stars:</span>
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {rem.currentStars.toLocaleString("id-ID")} / {rem.targetSpark.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent >= 100 ? "bg-emerald-500" : percent >= 60 ? "bg-amber-500" : "bg-purple-600"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{percent}% Menuju Target Spark</span>
                      <span className="font-bold text-pink-600">
                        {remaining === 0 ? "Target Stars Cukup!" : `Kurang ${remaining.toLocaleString("id-ID")} Stars`}
                      </span>
                    </div>
                  </div>

                  {rem.notes && (
                    <p className="text-[11px] text-muted-foreground italic border-l-2 border-purple-400 pl-2">
                      &quot;{rem.notes}&quot;
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => handleTestNotification(rem)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
                  >
                    <Send className="h-3 w-3" />
                    <span>Tes Notifikasi</span>
                  </button>

                  <button
                    onClick={() => downloadIcsFile(rem)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-[11px] cursor-pointer"
                  >
                    <Download className="h-3 w-3 text-pink-600" />
                    <span>Kalender (.ics)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Embedded Modal Component */}
      <GachaReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialBanner={activeBannerForModal}
        onReminderSaved={() => {
          loadReminders();
        }}
      />
    </div>
  );
}

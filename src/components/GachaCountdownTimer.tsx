"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle, Flame, CheckCircle2 } from "lucide-react";

interface GachaCountdownTimerProps {
  targetDate: string; // ISO string e.g. "2026-10-20T23:59:59Z"
  startDate?: string;
  variant?: "compact" | "banner" | "detailed";
  showProgressBar?: boolean;
  onExpire?: () => void;
  className?: string;
}

export function GachaCountdownTimer({
  targetDate,
  startDate,
  variant = "compact",
  showProgressBar = false,
  onExpire,
  className = "",
}: GachaCountdownTimerProps) {
  // Safe client-side time tracking for Next.js 16 Partial Prerendering
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 1,
    isExpired: false,
  });

  useEffect(() => {
    setMounted(true);

    const updateTimer = () => {
      const now = Date.now();
      const end = new Date(targetDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalMs: 0,
          isExpired: true,
        });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalMs: diff,
        isExpired: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (!mounted) {
    // SSR / prerender skeleton placeholder
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono animate-pulse ${className}`}>
        <Clock className="h-3.5 w-3.5" />
        <span>Menghitung sisa waktu...</span>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-muted text-muted-foreground border border-border/80 ${className}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Banner Telah Ditutup</span>
      </div>
    );
  }

  // Calculate percentage elapsed if startDate is provided
  let elapsedPercent = 50;
  if (startDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(targetDate).getTime();
    const total = end - start;
    if (total > 0) {
      const currentElapsed = Date.now() - start;
      elapsedPercent = Math.min(100, Math.max(0, Math.round((currentElapsed / total) * 100)));
    }
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;
  const isCritical = timeLeft.days === 0 && timeLeft.hours < 6;

  // 1. Compact Variant (for cards or badge headers)
  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
          isCritical
            ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse"
            : isUrgent
            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            : "bg-muted/60 text-foreground border border-border"
        } ${className}`}
      >
        {isCritical ? (
          <Flame className="h-3.5 w-3.5 text-red-600 animate-bounce" />
        ) : isUrgent ? (
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
        ) : (
          <Clock className="h-3.5 w-3.5 text-pink-600" />
        )}
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}h ` : ""}
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        {isCritical && <span className="text-[10px] font-sans font-black uppercase text-red-600">Segera Tutup!</span>}
      </div>
    );
  }

  // 2. Banner Spotlight Variant (large digital blocks)
  if (variant === "banner") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 min-w-[50px] sm:min-w-[62px] rounded-2xl bg-card border border-border shadow-xs">
            <span className="font-mono text-lg sm:text-2xl font-black text-foreground">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Hari
            </span>
          </div>

          <span className="font-mono text-lg sm:text-xl font-bold text-muted-foreground pb-2">:</span>

          <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 min-w-[50px] sm:min-w-[62px] rounded-2xl bg-card border border-border shadow-xs">
            <span className="font-mono text-lg sm:text-2xl font-black text-foreground">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Jam
            </span>
          </div>

          <span className="font-mono text-lg sm:text-xl font-bold text-muted-foreground pb-2">:</span>

          <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 min-w-[50px] sm:min-w-[62px] rounded-2xl bg-card border border-border shadow-xs">
            <span className="font-mono text-lg sm:text-2xl font-black text-pink-600">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Menit
            </span>
          </div>

          <span className="font-mono text-lg sm:text-xl font-bold text-muted-foreground pb-2">:</span>

          <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 min-w-[50px] sm:min-w-[62px] rounded-2xl bg-card border border-border shadow-xs">
            <span className="font-mono text-lg sm:text-2xl font-black text-foreground">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Detik
            </span>
          </div>
        </div>

        {showProgressBar && (
          <div className="space-y-1 pt-1">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCritical ? "bg-red-500" : isUrgent ? "bg-amber-500" : "bg-pink-600"
                }`}
                style={{ width: `${100 - elapsedPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Durasi Berjalan ({elapsedPercent}%)</span>
              <span className={isCritical ? "text-red-600 font-bold" : ""}>
                {isCritical ? "Sisa Waktu Kritis!" : "Waktu Tersedia"}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Detailed Card Variant
  return (
    <div
      className={`rounded-2xl border p-3.5 space-y-2.5 ${
        isCritical
          ? "border-red-300 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20"
          : isUrgent
          ? "border-amber-300 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20"
          : "border-border bg-card"
      } ${className}`}
    >
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-1.5 text-foreground">
          {isCritical ? (
            <Flame className="h-4 w-4 text-red-600" />
          ) : (
            <Clock className="h-4 w-4 text-pink-600" />
          )}
          <span>Hitung Mundur Penutupan:</span>
        </span>

        <span className="font-mono font-bold text-pink-600">
          {timeLeft.days > 0 ? `${timeLeft.days} Hari ` : ""}
          {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>

      {showProgressBar && (
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCritical ? "bg-red-500" : isUrgent ? "bg-amber-500" : "bg-pink-600"
              }`}
              style={{ width: `${100 - elapsedPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

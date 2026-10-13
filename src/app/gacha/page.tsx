import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparkles, ArrowLeft, Clock, Calendar, ShieldCheck } from "lucide-react";

export default function GachaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Panduan Utama
          </Link>
          <span>/</span>
          <span>Info Jadwal Gacha</span>
        </div>

        <div className="rounded-3xl border border-pink-200/60 dark:border-pink-900/40 bg-gradient-to-r from-pink-50/60 via-rose-50/40 to-background dark:from-pink-950/20 dark:via-rose-950/10 dark:to-background p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 dark:bg-pink-950/60 px-3 py-1 text-xs font-semibold text-pink-700 dark:text-pink-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Info Banner & Pity Gacha (Fase 3)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Jadwal Banner Gacha & Panduan Pity Seal
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Halaman ini terhubung dari istilah &quot;Gacha Seal&quot; dan &quot;Reroll&quot; pada Panduan Pemula & FAQ. Di sini pemain dapat melihat banner aktif, tanggal penutupan, dan mengatur pengingat gacha.
          </p>
        </div>

        {/* Active Banner Mockup */}
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <span className="text-xs font-bold text-pink-600 bg-pink-50 dark:bg-pink-950 px-2 py-0.5 rounded-full">
                Banner Aktif Saat Ini
              </span>
              <h3 className="text-lg font-bold text-foreground mt-1">
                KiraKirameki Festival: Twilight Sparkle Gacha
              </h3>
            </div>
            <div className="text-xs text-muted-foreground">
              Periode: 10 Okt - 20 Okt 2026 (Sisa 7 Hari)
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Sistem Pity jaminan aktif: 300 Gacha Seal untuk menukar kartu Bintang 5 unggulan langsung di toko penukaran.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

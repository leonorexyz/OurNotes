import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Flame,
  Leaf,
  Snowflake,
  Sun,
  Star,
  ChevronRight,
  Info,
  Layers,
  Crown,
} from "lucide-react";
import { GACHA_BANNERS_DATA } from "@/data/gachaData";
import { CHARACTERS_DATA } from "@/data/charactersData";
import { GachaDetailActions } from "@/components/GachaDetailActions";
import { GachaCountdownTimer } from "@/components/GachaCountdownTimer";

export function generateStaticParams() {
  return GACHA_BANNERS_DATA.map((banner) => ({
    id: banner.id,
  }));
}

export default async function GachaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = GACHA_BANNERS_DATA.find((b) => b.id === id);

  if (!banner) {
    notFound();
  }

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/gacha"
            className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Daftar Jadwal Gacha
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
            {banner.title}
          </span>
        </div>

        {/* Hero Banner Header */}
        <div
          className={`rounded-3xl bg-gradient-to-r ${banner.bannerImageBg} text-white p-6 sm:p-10 shadow-lg relative overflow-hidden`}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs font-bold text-xs">
                {banner.category}
              </span>
              {banner.isRecommended && (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-950" />
                  Rekomendasi Utama
                </span>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-xs font-bold">
                <span
                  className={`h-2 w-2 rounded-full ${
                    banner.status === "Aktif"
                      ? "bg-emerald-400"
                      : banner.status === "Akan Datang"
                      ? "bg-amber-400"
                      : "bg-zinc-400"
                  }`}
                />
                <span>Status: {banner.status}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {banner.title}
              </h1>
              {banner.japaneseTitle && (
                <p className="text-sm text-white/70 font-mono">
                  {banner.japaneseTitle}
                </p>
              )}
            </div>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
              {banner.description}
            </p>

            {/* Quick Metrics */}
            <div className="pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
              <div>
                <span className="text-white/60 text-[11px] block">Periode Banner:</span>
                <strong className="text-white">
                  {new Date(banner.startAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  -{" "}
                  {new Date(banner.endAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </div>
              <div>
                <span className="text-white/60 text-[11px] block">Biaya 10x Pull:</span>
                <strong className="text-white">{banner.cost.tenPull} Stars</strong>
              </div>
              <div>
                <span className="text-white/60 text-[11px] block">Peluang ★4 Maksimal:</span>
                <strong className="text-pink-300 font-bold">
                  {banner.pickupRates.maxRarityRate}
                </strong>
              </div>
              <div>
                <span className="text-white/60 text-[11px] block">Jaminan Spark:</span>
                <strong className="text-emerald-300 font-bold">
                  {banner.pitySystem.pityThreshold} Seal
                </strong>
              </div>
            </div>

            {/* Live Countdown Timer Spotlight */}
            <div className="pt-4 border-t border-white/20">
              <div className="bg-black/30 backdrop-blur-xs p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Sisa Waktu Penarikan Banner
                  </span>
                  <p className="text-xs text-white/80">
                    Waktu terus berjalan hingga batas akhir pemeliharaan gacha.
                  </p>
                </div>
                <GachaCountdownTimer
                  targetDate={banner.endAt}
                  startDate={banner.startAt}
                  variant="banner"
                  showProgressBar={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Interactive Actions: Simulator & Reminder */}
        <GachaDetailActions banner={banner} />

        {/* Featured Characters / Hadiah Utama Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span>Karakter Hadiah Unggulan (Pickup Rate-Up)</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Kartu karakter utama dengan peluang rate up tertinggi di banner ini
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banner.featuredCharacters.map((char) => {
              const fullCharData = CHARACTERS_DATA.find((c) => c.id === char.id);

              return (
                <div
                  key={char.id}
                  className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header Character Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${char.avatarBg} text-white flex flex-col items-center justify-center font-black shadow-md shrink-0 relative overflow-hidden`}
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 skew-x-12" />
                          <span className="text-lg">★{char.rarity}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {char.attribute}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-foreground">{char.name}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[10px] font-bold">
                              {char.pickupRate} Pickup
                            </span>
                          </div>
                          <p className="text-xs text-pink-600 font-bold">[{char.cardTitle}]</p>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                            <span className="font-medium text-foreground">{char.bandName}</span>
                            <span>•</span>
                            <span>{char.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-muted/50 border border-border flex items-center gap-1 text-[11px] font-bold">
                        {getAttrIcon(char.attribute)}
                        <span>{char.attribute}</span>
                      </div>
                    </div>

                    {/* Skill Details */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          <Crown className="h-3.5 w-3.5 text-amber-500" />
                          <span>Skill: {char.skillName}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-black text-[10px]">
                          {char.skillType}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Efek: <strong className="text-foreground">{char.skillBoost}</strong> selama 7 detik saat live show. Paling efektif bila diletakkan di Slot Center untuk pengganda skor Fever Time Multi-Live!
                      </p>
                    </div>

                    {/* Stats Preview if available */}
                    {fullCharData && (
                      <div className="grid grid-cols-4 gap-2 text-center text-xs p-3 rounded-2xl bg-muted/20 border border-border/60">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Total BP</span>
                          <strong className="text-foreground font-black">
                            {fullCharData.stats.total.toLocaleString()}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Performance</span>
                          <strong className="text-pink-600 font-bold">
                            {fullCharData.stats.performance.toLocaleString()}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Technique</span>
                          <strong className="text-purple-600 font-bold">
                            {fullCharData.stats.technique.toLocaleString()}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Visual</span>
                          <strong className="text-blue-600 font-bold">
                            {fullCharData.stats.visual.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Character Action Buttons */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/karakter/${char.id}`}
                      className="inline-flex items-center gap-1 text-pink-600 font-bold hover:underline"
                    >
                      <span>Lihat Profil Karakter</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href={`/tim?lead=${char.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold transition-colors"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Tes di Tim Simulator</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Drop Rates & Pity Shop Full Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Drop Rates Table */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-pink-600" />
              <h3 className="font-bold text-base text-foreground">
                Rincian Drop Rate Lengkap
              </h3>
            </div>

            <div className="rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground font-bold">
                  <tr>
                    <th className="p-3">Kelangkaan (Tier)</th>
                    <th className="p-3 text-right">Peluang Muncul</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  <tr className="bg-pink-50/40 dark:bg-pink-950/20 font-bold">
                    <td className="p-3 text-pink-600">Kartu ★4 (Super Rare)</td>
                    <td className="p-3 text-right text-pink-600">
                      {banner.pickupRates.maxRarityRate}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3">Kartu ★3 (Rare)</td>
                    <td className="p-3 text-right">{banner.pickupRates.star3Rate}</td>
                  </tr>
                  <tr>
                    <td className="p-3">Kartu ★2 (Normal)</td>
                    <td className="p-3 text-right">{banner.pickupRates.star2Rate}</td>
                  </tr>
                  <tr className="bg-muted/20 font-bold">
                    <td className="p-3">Karakter Unggulan (Total Pickup)</td>
                    <td className="p-3 text-right text-emerald-600">
                      {banner.pickupRates.featuredTotalRate}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              *Tiap roll ke-10 pada penarikan 10x dijamin memberikan minimal 1 kartu ★3 atau lebih tinggi.
            </p>
          </div>

          {/* Pity Seal Exchange Details */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-base text-foreground">
                Toko Penukaran Gacha Seal (Pity)
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-emerald-800 dark:text-emerald-200">
                  Ambang Batas Penukaran (Spark):
                </span>
                <span className="text-emerald-700 dark:text-emerald-300 font-mono text-sm">
                  {banner.pitySystem.pityThreshold} Seal
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tiap 1 kali penarikan (250 Stars) memberikan 1 Gacha Seal. Saat mencapai {banner.pitySystem.pityThreshold} Seal (setara {banner.pitySystem.pityThreshold * 250} Stars), kamu bisa langsung menukar kartu:
              </p>
              <div className="pt-1 font-bold text-pink-600 text-xs">
                🎁 {banner.pitySystem.exchangeItem}
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-muted-foreground">
              <strong className="text-foreground block">Ketentuan Gacha Seal:</strong>
              <p>{banner.pitySystem.rules}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

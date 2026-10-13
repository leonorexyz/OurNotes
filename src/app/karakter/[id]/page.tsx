import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  Star,
  Zap,
  Layers,
  Heart,
  Music2,
  Users,
  Sparkles,
  BookOpen,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { CHARACTERS_DATA, BANDS_DATA } from "@/data/charactersData";

export function generateStaticParams() {
  return CHARACTERS_DATA.map((char) => ({
    id: char.id,
  }));
}

export default async function KarakterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = CHARACTERS_DATA.find((c) => c.id === id);

  if (!character) {
    notFound();
  }

  const band = BANDS_DATA.find((b) => b.id === character.bandId);
  const bandMates = CHARACTERS_DATA.filter(
    (c) => c.bandId === character.bandId && c.id !== character.id
  );

  const attributeStyles = {
    Power: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200",
    Pure: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200",
    Cool: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200",
    Happy: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/karakter" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Daftar Karakter
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{character.name}</span>
        </div>

        {/* Character Profile Hero Banner */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className={`p-8 sm:p-12 bg-gradient-to-tr ${character.avatarBg} text-white relative`}>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 skew-x-12 pointer-events-none" />

            <div className="relative max-w-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-xs text-xs font-bold text-white border border-white/20">
                  {character.bandName}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold">
                  {character.role}
                </span>
                <div className="flex text-amber-300">
                  {Array.from({ length: character.rarity }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-300" />
                  ))}
                </div>
              </div>

              <div className="text-xs font-mono opacity-80">{character.japaneseName}</div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
                {character.name}
              </h1>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed pt-1">
                {character.bio}
              </p>
            </div>
          </div>

          {/* Quick attribute & power strip */}
          <div className="p-4 sm:p-6 bg-muted/40 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full font-bold border text-xs ${attributeStyles[character.attribute]}`}>
                Atribut {character.attribute}
              </span>
              <span className="text-muted-foreground">
                Role Panggung: <strong className="text-foreground">{character.role}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block">Total Band Power</span>
                <span className="text-base font-extrabold text-foreground font-mono">
                  {character.stats.total.toLocaleString()}
                </span>
              </div>

              <Link
                href={`/tim?lead=${character.id}`}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Gunakan di Susun Tim
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Columns Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Detailed Stats Breakdown */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-base text-foreground">
                Statistik Maksimal (Level 60)
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Performance (Kelincahan)</span>
                  <strong className="text-foreground font-bold">{character.stats.performance.toLocaleString()}</strong>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full"
                    style={{ width: `${(character.stats.performance / 14000) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technique (Ketepatan)</span>
                  <strong className="text-foreground font-bold">{character.stats.technique.toLocaleString()}</strong>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${(character.stats.technique / 14000) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visual (Daya Tarik)</span>
                  <strong className="text-foreground font-bold">{character.stats.visual.toLocaleString()}</strong>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(character.stats.visual / 14000) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border flex justify-between items-center text-xs">
                <span>Darah Hidup (Life HP)</span>
                <strong className="text-emerald-600 font-bold">{character.stats.hp} HP</strong>
              </div>
            </div>
          </div>

          {/* Column 2: Live Skill Deep-Dive */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Zap className="h-5 w-5 text-pink-500" />
              <h3 className="font-bold text-base text-foreground">
                Kemampuan Khusus (Center Skill)
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{character.skill.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-pink-600 text-white font-bold text-[10px]">
                    {character.skill.boostValue}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {character.skill.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Efek Multi-Live:</strong> Skill aktif memberikan buff score up kepada seluruh pemain di ruangan.</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Durasi Skill:</strong> Berlangsung selama 7 detik aktif saat note skill dilewati.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories & Episode Rewards */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-base text-foreground">
              Episode Cerita Karakter (Sumber Stars Gratis)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-foreground text-sm font-bold">Episode 1: Awal Melodi</strong>
                <span className="text-amber-600 font-bold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                  +25 Stars Gratis
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Kisah perkenalan karakter saat bergabung ke dalam band dan motivasi di balik instrumen musiknya.
              </p>
              <div className="text-[11px] text-muted-foreground font-mono">Syarat: Capai Level Kartu Maksimal</div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-foreground text-sm font-bold">Memorial Episode: Panggung Megah</strong>
                <span className="text-amber-600 font-bold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                  +50 Stars Gratis
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Kisah pendalaman emosional setelah membuka Special Training dan interaksi dengan sesama anggota.
              </p>
              <div className="text-[11px] text-muted-foreground font-mono">Syarat: Selesaikan Special Training</div>
            </div>
          </div>
        </div>

        {/* Bandmates & Team Synergy Recommendations */}
        {band && (
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <h3 className="font-bold text-base text-foreground">
                  Rekan Satu Band ({band.name})
                </h3>
              </div>
              <span className="text-xs text-muted-foreground">Sinergi Band Power +20%</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Memasangkan {character.name} dengan rekan satu band di formasi tim akan mengaktifkan buff maksimal dari area items instrumen musik {band.name} di studio.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {bandMates.map((mate) => (
                <Link
                  key={mate.id}
                  href={`/karakter/${mate.id}`}
                  className="p-3 rounded-2xl border border-border bg-muted/30 hover:bg-muted/70 transition-all text-xs space-y-1 block"
                >
                  <div className="font-bold text-foreground truncate">{mate.name}</div>
                  <div className="text-[11px] text-muted-foreground">{mate.role}</div>
                  <div className="text-[10px] text-pink-600 font-semibold">{mate.attribute}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

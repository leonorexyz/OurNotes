import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  Music2,
  Users,
  Disc3,
  Sparkles,
  Guitar,
  Mic,
  Radio,
  Drum,
  Award,
  ExternalLink,
  BookOpen,
  MapPin,
  Flame,
} from "lucide-react";
import { BAND_DETAILS } from "@/data/bandDetailsData";
import { BANDS_DATA } from "@/data/charactersData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return BANDS_DATA.map((band) => ({
    id: band.id,
  }));
}

export default async function BandDetailPage({ params }: PageProps) {
  const { id } = await params;
  const band = BAND_DETAILS[id];

  if (!band) {
    notFound();
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Vocal":
        return <Mic className="h-4 w-4 text-red-500" />;
      case "Guitar":
        return <Guitar className="h-4 w-4 text-amber-500" />;
      case "Bass":
        return <Guitar className="h-4 w-4 text-blue-500" />;
      case "Drums":
        return <Drum className="h-4 w-4 text-emerald-500" />;
      case "Keyboard":
        return <Radio className="h-4 w-4 text-purple-500" />;
      case "DJ":
        return <Radio className="h-4 w-4 text-pink-500" />;
      case "Violin":
        return <Sparkles className="h-4 w-4 text-sky-500" />;
      default:
        return <Music2 className="h-4 w-4 text-pink-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/band" className="hover:text-pink-600 transition-colors">
            Daftar Band
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{band.name}</span>
        </div>

        {/* Hero Header */}
        <div
          className={`rounded-3xl border border-border bg-gradient-to-br ${band.theme} p-6 sm:p-10 text-white shadow-md relative overflow-hidden`}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 skew-x-12 pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/90 border border-white/20">
              <Music2 className="h-3.5 w-3.5" />
              <span>{band.genre}</span>
            </div>

            <div>
              <span className="text-xs sm:text-sm font-mono tracking-widest uppercase opacity-85 block">
                {band.japaneseName}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{band.name}</h1>
            </div>

            <p className="text-sm sm:text-base text-white/90 italic font-medium leading-relaxed">
              &quot;{band.tagline}&quot;
            </p>

            {/* Quick Metadata Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="rounded-xl bg-black/25 backdrop-blur-md px-3 py-1.5 text-xs font-medium border border-white/10">
                Pemimpin: <strong>{band.leader}</strong>
              </span>
              <span className="rounded-xl bg-black/25 backdrop-blur-md px-3 py-1.5 text-xs font-medium border border-white/10">
                Formasi: <strong>{band.formationYear}</strong>
              </span>
              <span className="rounded-xl bg-black/25 backdrop-blur-md px-3 py-1.5 text-xs font-medium border border-white/10">
                Anggota: <strong>5 Personel Resmi</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-3">
              <Link
                href="/band"
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2 text-xs font-bold transition-colors border border-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Daftar Band
              </Link>
              <Link
                href={`/karakter?band=${band.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 hover:bg-white/90 px-4 py-2 text-xs font-bold transition-colors shadow-sm"
              >
                <span>Lihat Kartu Karakter {band.name}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 1: Kisah & Filosofi Musik */}
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Kisah & Filosofi Musik</h2>
              <p className="text-xs text-muted-foreground">Perjalanan dan identitas khas panggung {band.name}</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {band.description}
          </p>

          <div className="rounded-2xl border border-border/70 bg-muted/40 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Latar Belakang & Sejarah Pembentukan:
            </h3>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {band.lore}
            </p>
          </div>
        </section>

        {/* Section 2: Personel & Anggota Band */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Personel & Susunan Anggota</h2>
                <p className="text-xs text-muted-foreground">5 musisi yang mengisi panggung harmoni {band.name}</p>
              </div>
            </div>

            <Link
              href={`/karakter?band=${band.id}`}
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Telusuri Kartu Karakter</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {band.members.map((member, idx) => (
              <div
                key={member.name}
                className="group rounded-3xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 hover:border-pink-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-2xl ${member.avatarBg} text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-mono text-muted-foreground truncate block">
                        {member.japaneseName}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base text-foreground truncate">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {getRoleIcon(member.role)}
                        <span className="text-[11px] font-bold text-muted-foreground">{member.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs pt-2 border-t border-border/60">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-muted-foreground shrink-0">Instrumen:</span>
                      <span className="font-medium text-foreground text-right">{member.instrument}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-muted-foreground shrink-0">Sekolah:</span>
                      <span className="font-medium text-foreground text-right truncate">{member.school}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-muted-foreground shrink-0">Pengisi Suara (CV):</span>
                      <span className="font-bold text-pink-600 text-right">{member.seiyuu}</span>
                    </div>
                  </div>
                </div>

                {member.characterId ? (
                  <Link
                    href={`/karakter/${member.characterId}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-xs font-bold text-pink-700 dark:text-pink-300 transition-colors"
                  >
                    <span>Profil & Skill Karakter</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <Link
                    href={`/karakter?band=${band.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-muted/60 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>Cari Kartu di Katalog</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Lagu Ikonik (Original Songs) */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
              <Disc3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Daftar Lagu Ikonik</h2>
              <p className="text-xs text-muted-foreground">Original song unggulan untuk Live Show & Multi-Live</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {band.songs.map((song) => (
              <div
                key={song.title}
                className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                      {song.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-extrabold text-[11px] shrink-0">
                      EX Lv {song.levelExpert}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {song.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                  <span>BPM: <strong>{song.bpm}</strong></span>
                  <span>Total Notes: <strong>{song.notesCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Sinergi Area Items & Studio Buffs */}
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Rekomendasi Area Items & Studio Buff</h2>
              <p className="text-xs text-muted-foreground">Tingkatkan total BP band dengan memasang area item berikut</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {band.areaItems.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground">{item.name}</h3>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 shrink-0">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </span>
                </div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200 text-xs font-bold">
                  {item.bonus}
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

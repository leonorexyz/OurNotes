import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Users, ArrowLeft, Sparkles, Star, Shield, Music2 } from "lucide-react";

export default function KarakterPage() {
  const sampleCharacters = [
    { name: "Kasumi Toyama", band: "Poppin'Party", attribute: "Power", role: "Vocal & Guitar", rarity: 5, skill: "Score Boost 115% (130% jika Perfect)" },
    { name: "Yukina Minato", band: "Roselia", attribute: "Cool", role: "Vocal", rarity: 5, skill: "Score Boost 120% & Life Recovery" },
    { name: "Ran Mitake", band: "Afterglow", attribute: "Power", role: "Vocal & Guitar", rarity: 5, skill: "Score Boost 115%" },
    { name: "Aya Maruyama", band: "Pastel＊Palettes", attribute: "Pure", role: "Leader & Vocal", rarity: 4, skill: "Score Boost 100%" },
    { name: "Kokoro Tsurumaki", band: "Hello, Happy World!", attribute: "Happy", role: "Leader & Vocal", rarity: 5, skill: "Score Boost 110% + Life +450" },
    { name: "Mashiro Kurata", band: "Morfonica", attribute: "Cool", role: "Vocal", rarity: 4, skill: "Score Boost 100%" },
    { name: "LAYER (Rei)", band: "RAISE A SUILEN", attribute: "Power", role: "Bass & Vocal", rarity: 5, skill: "Score Boost 125%" },
    { name: "Tomori Takamatsu", band: "MyGO!!!!!", attribute: "Pure", role: "Vocal", rarity: 5, skill: "Score Boost 120%" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb back to Panduan */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Panduan Utama
          </Link>
          <span>/</span>
          <span>Daftar Karakter</span>
        </div>

        {/* Hero banner */}
        <div className="rounded-3xl border border-pink-200/60 dark:border-pink-900/40 bg-gradient-to-r from-pink-50/60 via-purple-50/40 to-background dark:from-pink-950/20 dark:via-purple-950/10 dark:to-background p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 dark:bg-pink-950/60 px-3 py-1 text-xs font-semibold text-pink-700 dark:text-pink-300">
            <Users className="h-3.5 w-3.5" />
            <span>Katalog Karakter & Band (Fase 2)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Basis Data Profil Karakter Bang Dream! Our Notes
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Halaman ini terhubung langsung dari istilah panduan. Di sini kamu dapat menelusuri seluruh karakter, memfilter berdasarkan Band atau Atribut, dan memeriksa skill Score Booster.
          </p>
        </div>

        {/* Characters Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sampleCharacters.map((char) => (
            <div
              key={char.name}
              id={char.name.toLowerCase().replace(/\s+/g, "-")}
              className="p-5 rounded-2xl border border-border bg-card space-y-3 hover:border-pink-400 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                  {char.band}
                </span>
                <div className="flex text-amber-400">
                  {Array.from({ length: char.rarity }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-foreground">{char.name}</h3>
                <p className="text-xs text-muted-foreground">{char.role} • Atribut {char.attribute}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 text-[11px] text-muted-foreground space-y-0.5">
                <strong className="text-foreground block font-semibold">Skill:</strong>
                <p>{char.skill}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

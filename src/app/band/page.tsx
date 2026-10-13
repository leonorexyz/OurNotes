"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Music2,
  Users,
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Guitar,
  Volume2,
  ExternalLink,
} from "lucide-react";
import { BANDS_DATA, CHARACTERS_DATA, Band } from "@/data/charactersData";

export default function BandListPage() {
  const [query, setQuery] = useState("");

  const filteredBands = BANDS_DATA.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.japaneseName.includes(query) ||
      b.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Beranda
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Daftar Band</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-purple-50/70 via-pink-50/40 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-950/60 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-200/60">
              <Music2 className="h-3.5 w-3.5" />
              <span>9 Band Musik Panggung Utama</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Daftar Band Bang Dream! Our Notes
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Kenali warna musik, filosofi, instrumen studio, dan seluruh anggota dari 9 band resmi di Our Notes. Pilih band untuk menelusuri kartu karakter terkait.
            </p>
          </div>
        </div>

        {/* Search & Counter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama band..."
              className="w-full rounded-xl border border-input bg-card py-2 pl-10 pr-4 text-xs sm:text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <span className="text-xs text-muted-foreground">
            Menampilkan <strong>{filteredBands.length}</strong> dari {BANDS_DATA.length} band
          </span>
        </div>

        {/* Bands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBands.map((band) => {
            const members = CHARACTERS_DATA.filter((c) => c.bandId === band.id);

            return (
              <div
                key={band.id}
                className="group rounded-3xl border border-border bg-card p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 hover:border-pink-300"
              >
                <div className="space-y-4">
                  {/* Top Gradient Banner */}
                  <div
                    className={`h-28 rounded-2xl bg-gradient-to-tr ${band.theme} p-4 text-white flex flex-col justify-between shadow-xs relative overflow-hidden`}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 pointer-events-none" />
                    <span className="text-[11px] font-mono opacity-80">{band.japaneseName}</span>
                    <div>
                      <h3 className="font-black text-xl tracking-tight leading-tight">{band.name}</h3>
                      <span className="text-[11px] font-semibold opacity-90">5 Anggota Band</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {band.description}
                  </p>

                  {/* Members Avatars / Pill List */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Anggota Terdaftar:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {members.map((member) => (
                        <Link
                          key={member.id}
                          href={`/karakter/${member.id}`}
                          className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
                        >
                          {member.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-3 border-t border-border/60">
                  <Link
                    href={`/karakter?band=${band.id}`}
                    className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-muted/50 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-xs font-bold text-foreground hover:text-pink-600 transition-colors"
                  >
                    <span>Lihat Karakter {band.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

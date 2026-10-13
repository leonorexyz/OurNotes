"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Scale,
  X,
  Layers,
  Star,
  Check,
  Zap,
} from "lucide-react";
import { Character, CHARACTERS_DATA } from "@/data/charactersData";
import { FavoriteButton } from "@/components/FavoriteButton";

interface CharacterDetailActionsProps {
  character: Character;
}

export function CharacterDetailActions({ character }: CharacterDetailActionsProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [targetCharId, setTargetCharId] = useState<string>(
    CHARACTERS_DATA.find((c) => c.id !== character.id)?.id || ""
  );

  const targetCharacter = CHARACTERS_DATA.find((c) => c.id === targetCharId);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </button>

        {/* Tombol Bandingkan */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold shadow-xs transition-all"
        >
          <Scale className="h-4 w-4" />
          <span>Bandingkan Karakter Ini</span>
        </button>

        {/* Tombol Susun Tim */}
        <Link
          href={`/tim?lead=${character.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-pink-200 dark:border-pink-900 bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-bold hover:bg-pink-100 transition-colors"
        >
          <Layers className="h-4 w-4 text-pink-500" />
          <span>Pakai di Susun Tim</span>
        </Link>

        {/* Tombol Favorit Karakter */}
        <FavoriteButton
          item={{
            id: character.id,
            type: "character",
            title: character.name,
            subtitle: `${character.bandName} • ${character.role} • Atribut ${character.attribute}`,
            categoryLabel: "Karakter Favorit",
            url: `/karakter/${character.id}`,
            badge: `★4 ${character.attribute}`,
            badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
            notes: `Total Power: ${character.stats.total.toLocaleString()} • Skill: ${character.skill.name}`,
          }}
          variant="button"
        />
      </div>

      {/* Comparison Modal on Detail Page */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-600 text-white">
                  <Scale className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-foreground">
                  Adu Statistik: {character.name} vs ...
                </h3>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Target Character Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground block">
                Pilih Karakter Pembanding:
              </label>
              <select
                value={targetCharId}
                onChange={(e) => setTargetCharId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold text-foreground focus:outline-none"
              >
                {CHARACTERS_DATA.filter((c) => c.id !== character.id).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.bandName} • {c.attribute} • {c.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Side-by-Side Comparison Grid */}
            {targetCharacter && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Character 1 (Current) */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${character.avatarBg} text-white space-y-1`}>
                    <div className="text-[10px] opacity-80">{character.bandName}</div>
                    <div className="font-bold text-sm truncate">{character.name}</div>
                    <div className="text-[10px] font-semibold">{character.role} • {character.attribute}</div>
                  </div>

                  <div className="space-y-1.5 font-mono">
                    <div className="flex justify-between p-1.5 rounded bg-card">
                      <span className="text-muted-foreground">Total Power:</span>
                      <strong className="text-foreground">{character.stats.total.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-card">
                      <span className="text-muted-foreground">Performance:</span>
                      <strong>{character.stats.performance.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-card">
                      <span className="text-muted-foreground">Technique:</span>
                      <strong>{character.stats.technique.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-card">
                      <span className="text-muted-foreground">Visual:</span>
                      <strong>{character.stats.visual.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-card border border-border/50 text-[11px]">
                    <span className="font-bold text-pink-600 block">{character.skill.name}</span>
                    <span className="text-muted-foreground">{character.skill.boostValue}</span>
                  </div>
                </div>

                {/* Character 2 (Target) */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${targetCharacter.avatarBg} text-white space-y-1`}>
                    <div className="text-[10px] opacity-80">{targetCharacter.bandName}</div>
                    <div className="font-bold text-sm truncate">{targetCharacter.name}</div>
                    <div className="text-[10px] font-semibold">{targetCharacter.role} • {targetCharacter.attribute}</div>
                  </div>

                  <div className="space-y-1.5 font-mono">
                    <div className="flex justify-between p-1.5 rounded bg-card">
                      <span className="text-muted-foreground">Total Power:</span>
                      <strong className="text-foreground">{targetCharacter.stats.total.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-card">
                      <span className="text-muted-foreground">Performance:</span>
                      <strong>{targetCharacter.stats.performance.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-card">
                      <span className="text-muted-foreground">Technique:</span>
                      <strong>{targetCharacter.stats.technique.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-card">
                      <span className="text-muted-foreground">Visual:</span>
                      <strong>{targetCharacter.stats.visual.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-card border border-border/50 text-[11px]">
                    <span className="font-bold text-pink-600 block">{targetCharacter.skill.name}</span>
                    <span className="text-muted-foreground">{targetCharacter.skill.boostValue}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <Link
                href={`/karakter/bandingkan?c1=${character.id}&c2=${targetCharId}`}
                className="text-xs text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1"
              >
                <span>Buka di Halaman Bandingkan Penuh</span>
                <Scale className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

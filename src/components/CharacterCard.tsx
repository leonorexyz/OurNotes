"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Zap,
  Scale,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Music,
} from "lucide-react";
import { Character } from "@/data/charactersData";

interface CharacterCardProps {
  character: Character;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
  onSelect?: (character: Character) => void;
  showCompareButton?: boolean;
}

export function CharacterCard({
  character,
  isComparing = false,
  onToggleCompare,
  onSelect,
  showCompareButton = true,
}: CharacterCardProps) {
  const [showStats, setShowStats] = useState(false);

  const attributeStyles = {
    Power: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200/60",
    Pure: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60",
    Cool: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60",
    Happy: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60",
  };

  return (
    <div
      className={`group rounded-3xl border transition-all duration-200 bg-card p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md ${
        isComparing
          ? "border-pink-500 ring-2 ring-pink-500/20"
          : "border-border/80 hover:border-pink-300/80"
      }`}
    >
      <div className="space-y-3.5">
        {/* Header: Band & Rarity Stars */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-bold px-2.5 py-0.5 rounded-full bg-muted text-foreground text-[11px]">
            {character.bandName}
          </span>

          <div className="flex items-center text-amber-400">
            {Array.from({ length: character.rarity }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
            ))}
          </div>
        </div>

        {/* Character Card Hero Image / Gradient Avatar */}
        <Link
          href={`/karakter/${character.id}`}
          onClick={() => onSelect?.(character)}
          className={`h-24 rounded-2xl bg-gradient-to-tr ${character.avatarBg} p-4 text-white flex flex-col justify-between shadow-xs relative overflow-hidden cursor-pointer group-hover:scale-[1.01] transition-transform block`}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 pointer-events-none" />
          <div className="text-[11px] font-mono opacity-80">{character.japaneseName}</div>
          <div>
            <h3 className="font-extrabold text-lg tracking-tight leading-tight group-hover:underline">
              {character.name}
            </h3>
            <span className="text-[11px] font-semibold opacity-90">{character.role}</span>
          </div>
        </Link>

        {/* Attribute & Total Power */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${attributeStyles[character.attribute]}`}>
            Atribut {character.attribute}
          </span>
          <span className="font-mono font-bold text-foreground">
            Total Power: {character.stats.total.toLocaleString()}
          </span>
        </div>

        {/* Skill Overview Box */}
        <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <strong className="text-foreground font-semibold flex items-center gap-1.5 text-[11px]">
              <Zap className="h-3.5 w-3.5 text-pink-500" />
              {character.skill.name}
            </strong>
            <span className="text-[10px] font-bold text-pink-600 bg-pink-50 dark:bg-pink-950 px-1.5 py-0.5 rounded">
              {character.skill.boostValue}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {character.skill.description}
          </p>
        </div>

        {/* Expandable Stats Breakdown */}
        <div>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center justify-between w-full p-2 rounded-xl bg-muted/30 hover:bg-muted text-[11px] font-semibold text-muted-foreground transition-colors"
          >
            <span>Rincian Statistik (Perf/Tech/Vis)</span>
            {showStats ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showStats && (
            <div className="mt-2 space-y-1.5 p-2.5 rounded-xl bg-muted/20 border border-border/40 text-[11px] font-mono animate-in fade-in duration-150">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Performance:</span>
                <strong className="text-foreground">{character.stats.performance.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Technique:</span>
                <strong className="text-foreground">{character.stats.technique.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visual:</span>
                <strong className="text-foreground">{character.stats.visual.toLocaleString()}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Bio Brief */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {character.bio}
        </p>
      </div>

      {/* Comparison Action Button */}
      {showCompareButton && (
        <div className="pt-3 border-t border-border/50">
          <button
            onClick={() => onToggleCompare?.(character.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all w-full justify-center ${
              isComparing
                ? "bg-pink-600 text-white shadow-xs"
                : "bg-muted/70 hover:bg-muted text-foreground"
            }`}
          >
            {isComparing ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Dipilih untuk Perbandingan</span>
              </>
            ) : (
              <>
                <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Bandingkan Karakter</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

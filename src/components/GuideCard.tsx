"use client";

import { useState } from "react";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { GuideItem } from "@/data/guidesData";

interface GuideCardProps {
  guide: GuideItem;
}

export function GuideCard({ guide }: GuideCardProps) {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    Dasar: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200",
    Menengah: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200",
    Lanjutan: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200",
  };

  return (
    <div className="group rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Header badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {guide.difficulty && (
              <span
                className={`px-2.5 py-0.5 rounded-full font-medium border text-[11px] ${
                  difficultyColors[guide.difficulty] || ""
                }`}
              >
                {guide.difficulty}
              </span>
            )}
            {guide.featuredBandOrCharacter && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border border-pink-200/50 font-medium text-[11px]">
                <Sparkles className="h-3 w-3 text-pink-500" />
                {guide.featuredBandOrCharacter}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <Clock className="h-3 w-3" />
            <span>{guide.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-pink-600 transition-colors">
          {guide.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {guide.summary}
        </p>

        {/* Step-by-step breakdown */}
        {guide.steps && guide.steps.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-pink-500" />
                {guide.steps.length} Langkah Penting Panduan
              </span>
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {expanded && (
              <div className="mt-3 space-y-3 pl-2 border-l-2 border-pink-400/40 ml-2 animate-in fade-in duration-200">
                {guide.steps.map((step, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <h5 className="font-semibold text-foreground">{step.title}</h5>
                    <p className="text-muted-foreground leading-relaxed pl-1">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer tags */}
      <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag className="h-3 w-3 text-muted-foreground" />
          {guide.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded bg-muted text-[11px] text-muted-foreground font-medium"
            >
              #{t}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-pink-600 hover:text-pink-700 font-semibold text-xs flex items-center gap-1 hover:underline ml-auto"
        >
          <span>{expanded ? "Ringkas" : "Baca Detail"}</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

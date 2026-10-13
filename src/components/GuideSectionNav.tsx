"use client";

import { BookOpen, Lightbulb, Trophy, HelpCircle, LayoutGrid } from "lucide-react";
import { GUIDE_SECTIONS } from "@/data/guidesData";

interface GuideSectionNavProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  counts: Record<string, number>;
}

export function GuideSectionNav({
  activeSection,
  onSelectSection,
  counts,
}: GuideSectionNavProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case "pemula":
        return BookOpen;
      case "tips":
        return Lightbulb;
      case "event":
        return Trophy;
      case "faq":
        return HelpCircle;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="w-full">
      {/* Tab bar / Grid cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GUIDE_SECTIONS.map((sec) => {
          const Icon = getIcon(sec.id);
          const isActive = activeSection === sec.id;
          const count = counts[sec.id] ?? sec.count;

          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`group relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 ${
                isActive
                  ? "bg-card border-pink-500 shadow-md shadow-pink-500/10 ring-2 ring-pink-500/20"
                  : "bg-card/60 hover:bg-card border-border hover:border-pink-300/60"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-sm"
                      : "bg-muted text-muted-foreground group-hover:bg-pink-50 group-hover:text-pink-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count} {sec.id === "faq" ? "Q&A" : "Artikel"}
                </span>
              </div>

              <div className="space-y-1">
                <span className={`text-base font-bold tracking-tight block ${isActive ? "text-pink-600 dark:text-pink-400" : "text-foreground"}`}>
                  {sec.title}
                </span>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {sec.subtitle}
                </p>
              </div>

              {isActive && (
                <div className="absolute -bottom-px left-6 right-6 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* "Lihat Semua" pill toggle */}
      <div className="mt-4 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>Menampilkan:</span>
          <span className="font-semibold text-foreground">
            {activeSection === "all"
              ? "Semua 4 Bagian Panduan"
              : GUIDE_SECTIONS.find((s) => s.id === activeSection)?.title}
          </span>
        </div>
        {activeSection !== "all" && (
          <button
            onClick={() => onSelectSection("all")}
            className="flex items-center gap-1 text-pink-600 hover:text-pink-700 font-semibold transition-colors hover:underline"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Tampilkan Semua Bagian Sekaligus
          </button>
        )}
      </div>
    </div>
  );
}

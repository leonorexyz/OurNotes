"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Search,
  X,
  ThumbsUp,
  ThumbsDown,
  ChevronsUpDown,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { FAQ_LIST, FaqItem } from "@/data/guidesData";

export function FaqAccordion() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "faq-1": true,
    "faq-2": true,
  });
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [feedback, setFeedback] = useState<Record<string, "yes" | "no">>({});

  const categories = [
    "Semua",
    "Gacha & Akun",
    "Teknis & Pengaturan",
    "Gameplay",
    "Team Building",
    "Event",
  ];

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const nextState: Record<string, boolean> = {};
    FAQ_LIST.forEach((f) => {
      nextState[f.id] = true;
    });
    setOpenIds(nextState);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  const handleFeedback = (id: string, type: "yes" | "no") => {
    setFeedback((prev) => ({ ...prev, [id]: type }));
  };

  const filteredFaqs = FAQ_LIST.filter((faq) => {
    const matchesCategory =
      activeCategory === "Semua" || faq.category === activeCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="rounded-2xl border border-pink-200/70 dark:border-pink-900/60 bg-gradient-to-r from-pink-50/50 via-purple-50/30 to-background dark:from-pink-950/20 dark:via-purple-950/10 dark:to-background p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input with Clear Button */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pertanyaan seputar gacha, timing, transfer akun..."
              className="w-full rounded-xl border border-input bg-card py-2 pl-10 pr-9 text-xs sm:text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-xs"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                title="Hapus Pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Toggle Controls */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
            >
              Buka Semua
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* Category Pills & Result Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-pink-600 text-white shadow-xs"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-muted-foreground shrink-0 font-medium">
            Menampilkan <strong className="text-foreground font-bold">{filteredFaqs.length}</strong> dari {FAQ_LIST.length} pertanyaan
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border bg-muted/20 space-y-3">
            <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-sm">
                Pertanyaan tidak ditemukan
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Coba gunakan kata kunci lain (mis. &quot;gacha&quot;, &quot;flame&quot;, &quot;fever&quot;, &quot;akun&quot;) atau pilih kategori &quot;Semua&quot;.
              </p>
            </div>
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory("Semua");
              }}
              className="px-3 py-1.5 rounded-xl bg-pink-600 text-white text-xs font-bold shadow-xs hover:bg-pink-700 transition-colors"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq: FaqItem) => {
            const isOpen = !!openIds[faq.id];
            const currentFeedback = feedback[faq.id];

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-card border-pink-300/80 dark:border-pink-900 shadow-xs"
                    : "bg-card/70 border-border/80 hover:border-pink-200 hover:bg-card"
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="flex items-center justify-between w-full p-4 sm:p-5 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start gap-3.5 pr-2">
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isOpen
                          ? "bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-xs"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </div>

                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-2 py-0.5 rounded-full">
                        {faq.category}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                        {faq.question}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-pink-600" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-border/40 bg-muted/10 space-y-3.5 animate-in fade-in duration-150">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>

                    {/* Interactive Helpful Feedback */}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-[11px] text-muted-foreground">
                        Apakah jawaban ini membantu Anda?
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleFeedback(faq.id, "yes")}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                            currentFeedback === "yes"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "border-border bg-card text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>Membantu</span>
                        </button>

                        <button
                          onClick={() => handleFeedback(faq.id, "no")}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                            currentFeedback === "no"
                              ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                              : "border-border bg-card text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                          <span>Kurang Jelas</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Community Question Box */}
      <div className="rounded-2xl border border-dashed border-border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-card/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 shrink-0">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h5 className="font-bold text-foreground text-sm">
              Punya Pertanyaan Lain yang Belum Terjawab?
            </h5>
            <p className="text-muted-foreground">
              Tanyakan langsung di Blog Diskusi Komunitas atau cek forum panduan kami.
            </p>
          </div>
        </div>

        <a
          href="/blog"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <span>Buka Forum Diskusi</span>
          <Sparkles className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

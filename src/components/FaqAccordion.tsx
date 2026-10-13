"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { FAQ_LIST, FaqItem } from "@/data/guidesData";

export function FaqAccordion() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "faq-1": true, // Default first open
  });
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = ["Semua", "Gacha & Akun", "Teknis & Pengaturan", "Gameplay", "Team Building", "Event"];

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
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
      {/* Category filter & mini search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-pink-600 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search FAQ */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari dalam FAQ..."
            className="w-full rounded-full border border-input bg-card py-1.5 pl-8 pr-3 text-xs focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-xl">
            Tidak ada pertanyaan FAQ yang cocok dengan pencarian Anda.
          </div>
        ) : (
          filteredFaqs.map((faq: FaqItem) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="flex items-center justify-between w-full p-4 sm:p-5 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start gap-3 pr-2">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-300">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1">
                        {faq.category}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-foreground">
                        {faq.question}
                      </h4>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-pink-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, Bell, X, CheckCircle2 } from "lucide-react";
import { GachaBanner } from "@/data/gachaData";

interface GachaDetailActionsProps {
  banner: GachaBanner;
}

export function GachaDetailActions({ banner }: GachaDetailActionsProps) {
  const [reminderNotice, setReminderNotice] = useState<string | null>(null);
  const [simResults, setSimResults] = useState<
    { name: string; rarity: number; attribute: string; isPickup: boolean }[] | null
  >(null);

  const handleSimulateTenPull = () => {
    const results = [];
    const isKirafes = banner.pickupRates.isDoubleRate;
    const star4Rate = isKirafes ? 0.06 : 0.03;
    const star3Rate = 0.085;

    for (let i = 0; i < 10; i++) {
      const roll = Math.random();
      const isGuaranteedSlot = i === 9;

      if (roll < star4Rate) {
        const pickupRoll = Math.random();
        if (pickupRoll < 0.5 && banner.featuredCharacters.length > 0) {
          const char =
            banner.featuredCharacters[
              Math.floor(Math.random() * banner.featuredCharacters.length)
            ];
          results.push({
            name: `${char.name} [${char.cardTitle}]`,
            rarity: 4,
            attribute: char.attribute,
            isPickup: true,
          });
        } else {
          results.push({
            name: "Kartu ★4 Acak",
            rarity: 4,
            attribute: ["Power", "Pure", "Cool", "Happy"][Math.floor(Math.random() * 4)],
            isPickup: false,
          });
        }
      } else if (roll < star4Rate + star3Rate || isGuaranteedSlot) {
        results.push({
          name: "Kartu ★3 Rare",
          rarity: 3,
          attribute: ["Power", "Pure", "Cool", "Happy"][Math.floor(Math.random() * 4)],
          isPickup: false,
        });
      } else {
        results.push({
          name: "Kartu ★2 Normal",
          rarity: 2,
          attribute: ["Power", "Pure", "Cool", "Happy"][Math.floor(Math.random() * 4)],
          isPickup: false,
        });
      }
    }

    setSimResults(results);
  };

  const handleSetReminder = () => {
    setReminderNotice(
      `Pengingat untuk banner "${banner.title}" berhasil diaktifkan di browser lokal!`
    );
    setTimeout(() => setReminderNotice(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Notice Toast */}
      {reminderNotice && (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/90 dark:bg-emerald-950/70 p-4 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{reminderNotice}</span>
          </div>
          <button
            onClick={() => setReminderNotice(null)}
            className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Simulator Trigger & CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleSimulateTenPull}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Tes Simulasi Tarik 10x</span>
        </button>

        <button
          onClick={handleSetReminder}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span>Pasang Pengingat Banner</span>
        </button>
      </div>

      {/* Simulator Results Box */}
      {simResults && (
        <div className="rounded-3xl border border-pink-300 dark:border-pink-800 bg-card p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-600" />
              <h3 className="font-black text-lg text-foreground">
                Hasil Simulasi Tarik 10x ({banner.title})
              </h3>
            </div>
            <button
              onClick={() => setSimResults(null)}
              className="text-xs text-muted-foreground hover:text-foreground font-bold"
            >
              Tutup Hasil
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {simResults.map((res, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center space-y-1.5 ${
                  res.rarity === 4
                    ? "border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-2 ring-pink-500/30"
                    : res.rarity === 3
                    ? "border-amber-400 bg-amber-400/10 text-amber-700 dark:text-amber-300"
                    : "border-border bg-muted/20 text-muted-foreground"
                }`}
              >
                <div className="font-black text-sm">★{res.rarity}</div>
                <div className="text-[11px] truncate font-bold">{res.name}</div>
                {res.isPickup && (
                  <span className="inline-block px-2 py-0.5 rounded bg-pink-600 text-white text-[9px] font-black">
                    HADIAH UTAMA!
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Total Seal Diperoleh: <strong>+10 Gacha Seal</strong>
            </span>
            <button
              onClick={handleSimulateTenPull}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors cursor-pointer"
            >
              Tarik 10x Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

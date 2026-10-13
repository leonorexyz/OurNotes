import Link from "next/link";
import { Music2, Heart, Shield, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 mt-16 text-muted-foreground text-sm">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500 text-white">
                <Music2 className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground text-base">Bang Dream! Our Notes</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
              Pusat panduan komprehensif, basis data karakter, kalkulator sinergi tim, dan jadwal gacha untuk pemain Bang Dream! Our Notes Indonesia.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80 pt-1">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              <span>Dibuat oleh komunitas untuk komunitas pemain.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Navigasi Panduan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#pemula" className="hover:text-pink-600 transition-colors">
                  Panduan Pemula
                </Link>
              </li>
              <li>
                <Link href="#tips" className="hover:text-pink-600 transition-colors">
                  Tips & Trik Harian
                </Link>
              </li>
              <li>
                <Link href="#event" className="hover:text-pink-600 transition-colors">
                  Strategi Event & Poin
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-pink-600 transition-colors">
                  Pertanyaan Umum (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seluruh aset gambar, karakter, dan merek dagang Bang Dream! adalah hak cipta milik Bushiroad, Craft Egg, atau penerbit terkait. Situs ini adalah proyek penggemar non-resmi.
            </p>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p>© 2026 Our Notes Guide. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Dirancang dengan</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk pemain rhythm game.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

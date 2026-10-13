"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  Layers,
  Sparkles,
  FileText,
  Search,
  Menu,
  X,
  Music2,
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "Panduan", icon: BookOpen },
    { href: "/karakter", label: "Karakter", icon: Users },
    { href: "/tim", label: "Susun Tim", icon: Layers },
    { href: "/gacha", label: "Jadwal Gacha", icon: Sparkles },
    { href: "/blog", label: "Blog Komunitas", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white shadow-md shadow-pink-500/20">
            <Music2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-indigo-300">
                Our Notes
              </span>
              <span className="rounded-full bg-pink-100 dark:bg-pink-950/60 px-2 py-0.5 text-[10px] font-semibold text-pink-700 dark:text-pink-300">
                Guide
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium hidden sm:block">
              Bang Dream! Our Notes Hub
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLinkActive(item.href)
                    ? "bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-300 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isLinkActive(item.href) ? "text-pink-600 dark:text-pink-400" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden lg:block w-48 xl:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari panduan..."
              readOnly
              onClick={() => {
                const el = document.getElementById("search-guide-input");
                if (el) {
                  el.focus();
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full rounded-full border border-input bg-muted/40 py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-input text-muted-foreground hover:text-foreground"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isLinkActive(item.href)
                    ? "bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

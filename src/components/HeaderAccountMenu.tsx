"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Heart,
  Layers,
  Bell,
  PenSquare,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Settings,
  Star,
} from "lucide-react";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export function HeaderAccountMenu() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchAuthUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setIsOpen(false);
      router.push("/masuk");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  if (loading) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 h-8 w-24 rounded-full bg-muted/50 animate-pulse" />
    );
  }

  // Not logged in: Show Masuk & Daftar buttons
  if (!user) {
    return (
      <div className="hidden sm:flex items-center gap-1.5">
        <Link
          href="/masuk"
          className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 text-xs font-bold text-pink-600 dark:text-pink-300 hover:bg-pink-500/20 transition-all"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Masuk</span>
        </Link>
        <Link
          href="/daftar"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-pink-500/20 hover:opacity-95 transition-all"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Daftar</span>
        </Link>
      </div>
    );
  }

  // Logged in: Show Avatar button with dropdown menu
  const isAdmin = user.role === "admin";
  const avatar =
    user.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

  return (
    <div className="relative hidden sm:block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/15 py-1 pl-1 pr-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500/40"
      >
        <div className="h-7 w-7 rounded-full overflow-hidden border border-pink-500/40 ring-1 ring-background shrink-0 bg-muted">
          <img src={avatar} alt={user.name} className="h-full w-full object-cover" />
        </div>
        <span className="text-xs font-bold text-foreground max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-pink-500/20 bg-background/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 origin-top-right">
          {/* User profile header card */}
          <div className="p-3 rounded-xl bg-muted/50 border border-border/50 mb-1.5 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl overflow-hidden border border-pink-500/40 shrink-0">
                <img src={avatar} alt={user.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <div className="pt-1.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 text-[10px] font-bold text-pink-600 dark:text-pink-300">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="h-3 w-3 text-indigo-500" />
                    <span>Staff Admin</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 text-pink-500" />
                    <span>Produser CiRCLE</span>
                  </>
                )}
              </span>
              <span className="text-[10px] text-muted-foreground">Aktif</span>
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="space-y-0.5 text-xs font-medium">
            <Link
              href="/akun"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
            >
              <User className="h-4 w-4 text-pink-500" />
              <span>Profil Produser</span>
            </Link>

            <Link
              href="/favorit"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
            >
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Koleksi Favorit</span>
            </Link>

            <Link
              href="/tim"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
            >
              <Layers className="h-4 w-4 text-amber-500" />
              <span>Formasi Tim Saya</span>
            </Link>

            <Link
              href="/gacha/pengingat"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
            >
              <Bell className="h-4 w-4 text-purple-500" />
              <span>Pengingat Gacha</span>
            </Link>

            <Link
              href="/blog/tulis"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
            >
              <PenSquare className="h-4 w-4 text-emerald-500" />
              <span>Tulis Panduan / Artikel</span>
            </Link>
          </div>

          <div className="my-1.5 border-t border-border/60" />

          {/* Account Actions */}
          <div className="space-y-0.5 text-xs font-medium">
            <Link
              href="/masuk"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Ganti Akun</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-left"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileAccountDrawer() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/masuk");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="pt-2 border-t border-border/60 flex items-center gap-2">
        <Link
          href="/masuk"
          className="flex-1 py-2 text-center text-xs font-bold rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-300 hover:bg-pink-500/20"
        >
          Masuk Produser
        </Link>
        <Link
          href="/daftar"
          className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white"
        >
          Daftar Baru
        </Link>
      </div>
    );
  }

  const avatar =
    user.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

  return (
    <div className="pt-3 border-t border-border/60 space-y-2">
      <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/40">
        <img src={avatar} alt={user.name} className="h-9 w-9 rounded-lg object-cover" />
        <div className="min-w-0 flex-1 text-xs">
          <p className="font-bold truncate text-foreground">{user.name}</p>
          <p className="text-muted-foreground truncate text-[11px]">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Link
          href="/akun"
          className="py-2 px-3 text-center rounded-xl bg-pink-500/10 text-pink-600 font-bold"
        >
          Profil Produser
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="py-2 px-3 text-center rounded-xl border border-destructive/20 text-destructive font-semibold hover:bg-destructive/10"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}

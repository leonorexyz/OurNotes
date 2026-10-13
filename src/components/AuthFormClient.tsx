"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Music2,
  ArrowRight,
  LogIn,
  UserPlus,
  Heart,
  Star,
  Zap,
} from "lucide-react";

interface AuthFormClientProps {
  initialMode?: "login" | "register";
}

const PRESET_BANDS = [
  { id: "popipa", name: "Poppin'Party", color: "from-pink-500 to-rose-500", textColor: "text-pink-500" },
  { id: "afterglow", name: "Afterglow", color: "from-red-500 to-amber-600", textColor: "text-red-500" },
  { id: "pasupare", name: "Pastel*Palettes", color: "from-teal-400 to-emerald-500", textColor: "text-teal-500" },
  { id: "roselia", name: "Roselia", color: "from-indigo-600 to-purple-600", textColor: "text-indigo-400" },
  { id: "harohapi", name: "Hello, Happy World!", color: "from-yellow-400 to-orange-500", textColor: "text-amber-500" },
  { id: "morfonica", name: "Morfonica", color: "from-blue-400 to-cyan-500", textColor: "text-blue-400" },
  { id: "ras", name: "RAISE A SUILEN", color: "from-emerald-500 to-teal-700", textColor: "text-emerald-400" },
  { id: "mygo", name: "MyGO!!!!!", color: "from-sky-500 to-blue-700", textColor: "text-sky-400" },
];

const PRESET_AVATARS = [
  {
    id: "kasumi",
    name: "Kasumi (Vocal)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "yukina",
    name: "Yukina (Vocal)",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "aya",
    name: "Aya (Idol)",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "ran",
    name: "Ran (Rock)",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
  },
];

export function AuthFormClient({ initialMode = "login" }: AuthFormClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/akun";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states - Login
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Form states - Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [selectedBand, setSelectedBand] = useState("Poppin'Party");
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleQuickLogin = async (email: string) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal masuk");
      }

      setSuccessMessage(`Berhasil masuk sebagai ${data.user.name}! Mengalihkan...`);
      setTimeout(() => {
        router.push(redirectTarget);
        router.refresh();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat masuk.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setErrorMessage("Silakan masukkan email atau ID produser Anda.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginIdentifier.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal masuk.");
      }

      setSuccessMessage(`Selamat datang kembali, ${data.user.name}!`);
      setTimeout(() => {
        router.push(redirectTarget);
        router.refresh();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal masuk. Periksa kembali data login Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMessage("Nama produser wajib diisi.");
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setErrorMessage("Alamat email tidak valid.");
      return;
    }
    if (regPassword && regPassword !== regConfirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Anda harus menyetujui ketentuan CiRCLE Live House.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          avatarUrl: selectedAvatar,
          favoriteBand: selectedBand,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mendaftar.");
      }

      setSuccessMessage(`Pendaftaran berhasil! Selamat datang di CiRCLE, ${data.user.name}.`);
      setTimeout(() => {
        router.push(redirectTarget);
        router.refresh();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mendaftarkan akun. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Decorative Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-300 text-xs font-bold tracking-wide">
          <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-pulse" />
          <span>CiRCLE Live House • Kartu Produser</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {mode === "login" ? "Masuk ke Akun Produser" : "Daftar Akun Produser Baru"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          {mode === "login"
            ? "Akses sinkronisasi formasi tim tersimpan, koleksi favorit, dan jadwal pengingat gacha."
            : "Bergabung bersama ribuan produser BanG Dream! Our Notes dan buat tim impianmu."}
        </p>
      </div>

      {/* Main Card Container */}
      <div className="relative rounded-3xl border border-pink-500/20 bg-card/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Glow ambient decoration */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Switcher Tabs */}
        <div className="relative z-10 grid grid-cols-2 p-1 bg-muted/60 rounded-2xl border border-border">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === "login"
                ? "bg-background text-foreground shadow-sm shadow-pink-500/10 text-pink-600 dark:text-pink-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>Masuk</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === "register"
                ? "bg-background text-foreground shadow-sm shadow-pink-500/10 text-pink-600 dark:text-pink-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Daftar Baru</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Mode 1: LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Alamat Email / ID Produser</span>
                <span className="text-[11px] text-muted-foreground">Demo: producer@ournotes.id</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="producer@ournotes.id"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/80 text-sm text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="text-foreground">Kata Sandi</label>
                <Link href="/lupa-password" className="text-pink-500 hover:underline">
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background/80 text-sm text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-input text-pink-600 focus:ring-pink-500"
                />
                <span>Ingat sesi saya di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Masuk ke Akun Saya</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Mode 2: REGISTER FORM */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Nama Produser</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Kasumi Toyama"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-input bg-background/80 text-sm text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="produser@domain.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-input bg-background/80 text-sm text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-input bg-background/80 text-sm text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-input bg-background/80 text-sm text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Favorite Band Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Music2 className="h-3.5 w-3.5 text-pink-500" />
                <span>Band Favorit Utama</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_BANDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBand(b.name)}
                    className={`p-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                      selectedBand === b.name
                        ? "border-pink-500 bg-pink-500/10 text-foreground ring-1 ring-pink-500"
                        : "border-border bg-background/60 text-muted-foreground hover:border-input"
                    }`}
                  >
                    <span className="truncate block">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                <span>Pilih Foto Profil Produser</span>
              </label>
              <div className="flex items-center gap-3">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                      selectedAvatar === av.url
                        ? "border-pink-500 ring-2 ring-pink-500/30 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-input text-pink-600 focus:ring-pink-500"
                />
                <span>Saya menyetujui peraturan komunitas CiRCLE Live House Our Notes</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Mendaftarkan...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar Akun Sekarang</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Atau Masuk Cepat Demo
          </span>
        </div>

        {/* Quick Demo Switcher Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
          <button
            type="button"
            onClick={() => handleQuickLogin("producer@ournotes.id")}
            disabled={loading}
            className="group flex items-center gap-3 p-3 rounded-2xl border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 text-left transition-all"
          >
            <div className="h-10 w-10 rounded-xl overflow-hidden border border-pink-500/30 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Kasumi Producer"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground truncate">Kasumi Producer</span>
                <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-600 dark:text-pink-300 text-[10px] font-semibold">User</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">producer@ournotes.id</p>
            </div>
            <Zap className="h-4 w-4 text-pink-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin("admin@ournotes.id")}
            disabled={loading}
            className="group flex items-center gap-3 p-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-left transition-all"
          >
            <div className="h-10 w-10 rounded-xl overflow-hidden border border-indigo-500/30 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                alt="CiRCLE Staff Admin"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground truncate">CiRCLE Staff Admin</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-semibold">Admin</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">admin@ournotes.id</p>
            </div>
            <ShieldCheck className="h-4 w-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {/* Bottom helper text */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          {mode === "login" ? (
            <p>
              Belum punya akun produser?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-bold text-pink-600 dark:text-pink-400 hover:underline"
              >
                Daftar sekarang gratis
              </button>
            </p>
          ) : (
            <p>
              Sudah memiliki akun produser?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-bold text-pink-600 dark:text-pink-400 hover:underline"
              >
                Masuk di sini
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

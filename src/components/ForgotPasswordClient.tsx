"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";

type Step = "request" | "verify" | "new_password" | "done";

export function ForgotPasswordClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Silakan masukkan alamat email yang valid.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memproses permohonan.");
      }

      setDemoCode(data.demoVerificationCode || "123456");
      setVerificationCode(data.demoVerificationCode || "");
      setResendCooldown(60);
      setStep("verify");
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim() || verificationCode.trim().length < 6) {
      setErrorMessage("Kode verifikasi harus 6 digit angka.");
      return;
    }

    setErrorMessage(null);
    setStep("new_password");
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage("Kata sandi baru minimal harus 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          newPassword,
          verificationCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengatur ulang kata sandi.");
      }

      setStep("done");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengubah kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "bg-muted", width: "0%" };
    if (pwd.length < 6) return { label: "Sangat Lemah", color: "bg-red-500", width: "25%" };
    if (pwd.length < 8) return { label: "Cukup", color: "bg-amber-500", width: "50%" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { label: "Sangat Kuat", color: "bg-emerald-500", width: "100%" };
    }
    return { label: "Kuat", color: "bg-blue-500", width: "75%" };
  };

  const strength = calculatePasswordStrength(newPassword);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-300 text-xs font-bold tracking-wide">
          <KeyRound className="h-3.5 w-3.5 text-pink-500" />
          <span>Pemulihan Akun Produser CiRCLE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {step === "request" && "Lupa Kata Sandi?"}
          {step === "verify" && "Verifikasi Kode OTP"}
          {step === "new_password" && "Buat Kata Sandi Baru"}
          {step === "done" && "Kata Sandi Berhasil Direset!"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
          {step === "request" &&
            "Masukkan alamat email akun produser Anda untuk menerima tautan dan kode pemulihan sandi."}
          {step === "verify" &&
            `Masukkan 6 digit kode pemulihan yang dikirim ke ${email}.`}
          {step === "new_password" &&
            "Tentukan kata sandi baru yang aman untuk akun produser Our Notes Anda."}
          {step === "done" &&
            "Akun produser Anda kini aman dan siap digunakan kembali untuk live show."}
        </p>
      </div>

      {/* Main Card */}
      <div className="relative rounded-3xl border border-pink-500/20 bg-card/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Progress Indicators */}
        <div className="relative z-10 flex items-center justify-between px-2 pb-2 border-b border-border/50 text-[11px] font-bold">
          <span className={step === "request" ? "text-pink-600 dark:text-pink-400" : "text-muted-foreground"}>
            1. Email
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={step === "verify" ? "text-pink-600 dark:text-pink-400" : "text-muted-foreground"}>
            2. Verifikasi
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={step === "new_password" ? "text-pink-600 dark:text-pink-400" : "text-muted-foreground"}>
            3. Sandi Baru
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={step === "done" ? "text-emerald-500" : "text-muted-foreground"}>
            4. Selesai
          </span>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: REQUEST EMAIL */}
        {step === "request" && (
          <form onSubmit={handleRequestSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Alamat Email Terdaftar</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="producer@ournotes.id"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/80 text-sm text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Demo Quick-fill buttons */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Atau pilih akun demo terdaftar:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEmail("producer@ournotes.id")}
                  className="px-2.5 py-1 rounded-lg border border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-300 text-xs font-semibold hover:bg-pink-500/20"
                >
                  producer@ournotes.id
                </button>
                <button
                  type="button"
                  onClick={() => setEmail("admin@ournotes.id")}
                  className="px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20"
                >
                  admin@ournotes.id
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Mengirim Tautan...</span>
              ) : (
                <>
                  <span>Kirim Kode Pemulihan</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFICATION OTP */}
        {step === "verify" && (
          <form onSubmit={handleVerifySubmit} className="space-y-4 relative z-10">
            {demoCode && (
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-700 dark:text-pink-300 flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Kode Verifikasi Simulasi:</span>
                  <span className="font-mono text-base font-black tracking-widest text-pink-600 dark:text-pink-400">
                    {demoCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVerificationCode(demoCode)}
                  className="px-2.5 py-1 rounded-lg bg-pink-600 text-white text-[11px] font-bold"
                >
                  Gunakan Kode
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">6-Digit Kode Verifikasi</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/80 text-sm font-mono tracking-widest text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => setStep("request")}
                className="hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Ganti Email</span>
              </button>
              {resendCooldown > 0 ? (
                <span>Kirim ulang dalam {resendCooldown}d</span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestSubmit}
                  className="text-pink-500 font-semibold hover:underline"
                >
                  Kirim Ulang Kode
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Verifikasi & Lanjut</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === "new_password" && (
          <form onSubmit={handleResetSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
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

              {/* Password strength bar */}
              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Kekuatan Sandi: <strong>{strength.label}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Ulangi Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/80 text-sm text-foreground focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Menyimpan Sandi Baru...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Simpan Kata Sandi Baru</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "done" && (
          <div className="text-center space-y-4 relative z-10 py-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Sandi Berhasil Diperbarui!
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Kata sandi baru Anda untuk akun <strong>{email}</strong> telah aktif. Silakan masuk kembali ke Live House CiRCLE.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/masuk"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Back to Login Link */}
        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/40">
          <Link
            href="/masuk"
            className="inline-flex items-center gap-1 font-bold text-pink-600 dark:text-pink-400 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

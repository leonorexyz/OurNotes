import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Layers, ArrowLeft, Sparkles, Users, CheckCircle } from "lucide-react";

export default function TimPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Panduan Utama
          </Link>
          <span>/</span>
          <span>Susun Tim & Sinergi</span>
        </div>

        <div className="rounded-3xl border border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-r from-purple-50/60 via-indigo-50/40 to-background dark:from-purple-950/20 dark:via-indigo-950/10 dark:to-background p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-950/60 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300">
            <Layers className="h-3.5 w-3.5" />
            <span>Kalkulator & Formasi Band (Fase 2)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Alat Penyusun Tim & Cek Sinergi Band Power
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Halaman ini terhubung dari istilah &quot;Band Power&quot; dan &quot;Center Skill&quot; di Panduan Pemula. Di sini kamu akan dapat memasang 5 slot karakter dan menguji bonus persentase atribut dan alat musik area.
          </p>
        </div>

        {/* 5-Slot Mockup preview */}
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
          <h3 className="font-bold text-base text-foreground">Preview Slot Tim Standar</h3>
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
            {["Slot 1 (Sub)", "Slot 2 (Sub)", "CENTER (Score Up)", "Slot 4 (Sub)", "Slot 5 (Sub)"].map((slot, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border ${
                  i === 2
                    ? "bg-pink-50 dark:bg-pink-950/50 border-pink-500 font-bold text-pink-600"
                    : "bg-muted/40 border-border text-muted-foreground"
                }`}
              >
                <div>{slot}</div>
                <div className="text-[10px] mt-1 text-muted-foreground">Kosong</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Fitur penyusunan interaktif lengkap akan tersedia penuh di Fase 2 pengembangan Our Notes.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

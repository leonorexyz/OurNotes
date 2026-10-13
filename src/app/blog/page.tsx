import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText, ArrowLeft, MessageSquare, ThumbsUp, Tag } from "lucide-react";

export default function BlogPage() {
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
          <span>Blog & Diskusi Komunitas</span>
        </div>

        <div className="rounded-3xl border border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-background dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-background p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <FileText className="h-3.5 w-3.5" />
            <span>Blog & Tulisan Komunitas (Fase 3)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Forum Artikel & Diskusi Komunitas Our Notes
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Halaman ini terhubung dari tombol &quot;Tanya Komunitas&quot; di FAQ dan navigasi utama. Tempat pemain berbagi pengalaman, tips lagu Expert, dan cerita band.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
          <h3 className="font-bold text-base text-foreground">Artikel Komunitas Terbaru</h3>
          <p className="text-xs text-muted-foreground">
            Fitur menulis dan berkomentar akan segera aktif setelah sistem otentikasi Better Auth dipasang di Fase 3 & 4.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

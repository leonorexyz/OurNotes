"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  PenSquare,
  ArrowLeft,
  Eye,
  Edit3,
  Sparkles,
  Tag,
  CheckCircle2,
  Clock,
  BookOpen,
  Info,
  Send,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Leaf,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";
import { BlogPost, BLOG_POSTS_DATA } from "@/data/blogData";

const TEMPLATES = [
  {
    name: "Panduan Lagu & All Perfect",
    category: "Tips & Gameplay" as const,
    title: "Tips Menaklukkan Note Flick dan Tangga Cepat pada Lagu Level 26+",
    excerpt: "Panduan melatih jari telunjuk dan mengatur offset kecepatan note agar tidak mudah Miss pada bagian refrain lagu cepat.",
    tags: ["Tips & Trik", "All Perfect", "Expert"],
    content: `### 1. Menentukan Kecepatan Note
Kecepatan note ideal untuk level 26 ke atas adalah 10.3 - 10.7. Dengan jarak note yang lebih lebar, mata dapat membaca alur ketukan tanpa kebingungan.

### 2. Tips Note Flick
- Jangan menggeser jari terlalu jauh; flick cukup dengan dorongan cepat 1 cm ke arah atas atau samping.
- Pastikan layar bebas dari minyak tangan; gunakan bedak bayi atau sarung jemari khusus game bila perlu.

### 3. Latihan Bertahap
Mulai dari lagu dengan BPM stabil seperti "Tokimeki Experience!" sebelum mencoba lagu dengan pergantian tempo mendadak seperti "Ringing Bloom".`,
  },
  {
    name: "Analisis Meta & Susunan Tim",
    category: "Meta & Tim" as const,
    title: "Bedah Sinergi Tim Cool Roselia: Capai Skor Maksimal di Free Live",
    excerpt: "Eksplorasi build tim seragam Cool untuk Roselia dengan dorongan instrumen studio Lv. 6 dan leader skill +130%.",
    content: `### Mengapa Cool Roselia Sangat Kuat?
Roselia memiliki stat gabungan Technique dan Visual tertinggi di antara band generasi pertama.

### Komposisi Rekomendasi:
1. **Yukina Minato ★4 [Bunga Biru Keabadian]**: Leader boost 130% Perfect Tap.
2. **Sayo Hikawa ★4 [Presisi Melodi]**: Skill durasi 7 detik.
3. **Lisa Imai ★4 [Dukungan Hangat]**: Stat booster 58.000.
4. **Ako Udagawa ★4 [Iblis Kegelapan]**: Score boost + recovery.
5. **Rinko Shirokane ★4 [Melodi Lembut]**: Visual specialist.

Upgrade item area bunga mawar biru di Ryuseido untuk bonus tambahan +20%!`,
  },
  {
    name: "Ulasan Cerita & Lore Band",
    category: "Lore & Karakter" as const,
    title: "Eksplorasi Kedalaman Hubungan Ran Mitake dan Yukina Minato di Our Notes",
    excerpt: "Analisis interaksi rivalitas musikal yang saling menghormati antara Afterglow dan Roselia dari event live show ke event studio.",
    tags: ["Lore", "Roselia", "Afterglow"],
    content: `### Rivalitas yang Membangun
Pertemuan antara Afterglow dan Roselia selalu memunculkan percikan ide musikal baru. Ran dengan semangat masa mudanya dan Yukina dengan standar kesempurnaan vokalnya saling mendorong batas kemampuan masing-masing.

### Makna Lirik Kolaborasi
Saat kedua vokalis menyanyikan bagian refrain bersama, kontras vokal serak emosional Ran berpadu indah dengan nada tinggi operatik Yukina, menciptakan harmoni yang belum pernah ada sebelumnya.`,
  },
];

export default function TulisBlogPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BlogPost["category"]>("Tips & Gameplay");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Tips", "OurNotes"]);
  const [authorName, setAuthorName] = useState("Pemain Our Notes");
  const [authorRole, setAuthorRole] = useState("Kontributor Komunitas");
  const [coverBg, setCoverBg] = useState("from-indigo-600 via-purple-600 to-pink-600");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Estimated read time
  const estimatedReadTime = useMemo(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 160));
    return `${minutes} Menit Baca`;
  }, [content]);

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().replace(/^#/, "")]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setExcerpt(tmpl.excerpt);
    setContent(tmpl.content);
    setTags(tmpl.tags ? [...tmpl.tags] : []);
    setSuccessToast(`Template "${tmpl.name}" berhasil dimuat ke editor!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Harap isi judul dan konten artikel sebelum mempublikasikan.");
      return;
    }

    const newSlug = `post-${Date.now()}`;
    const newPost: BlogPost = {
      id: newSlug,
      title: title.trim(),
      excerpt: excerpt.trim() || content.slice(0, 150) + "...",
      content: content.trim(),
      category,
      tags,
      author: {
        name: authorName.trim() || "Pemain Our Notes",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        role: authorRole.trim() || "Pemain",
        badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
      },
      publishedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      readTime: estimatedReadTime,
      likes: 1,
      commentsCount: 0,
      views: 1,
      isFeatured: false,
      coverImageBg: coverBg,
    };

    // Store in localStorage
    try {
      const stored = localStorage.getItem("ournotes_custom_blog_posts");
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem("ournotes_custom_blog_posts", JSON.stringify([newPost, ...list]));
    } catch (err) {
      console.warn("Storage error", err);
    }

    setSuccessToast(`Artikel "${newPost.title}" berhasil dipublikasikan!`);
    setTimeout(() => {
      router.push("/blog");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground flex items-center gap-1 font-semibold text-indigo-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Daftar Blog
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Tulis Artikel Baru</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-background dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-background p-6 sm:p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60">
            <PenSquare className="h-3.5 w-3.5" />
            <span>Editor Komunitas Our Notes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bagikan Panduan, Analisis, dan Catatan Permainanmu
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Tulis pengalaman live show, susunan sinergi kartu, atau bedah lagu favorit. Kamu juga bisa menggunakan template instan di bawah untuk mempermudah penulisan.
          </p>

          {/* Quick Mock Template Buttons */}
          <div className="pt-3 border-t border-indigo-200/40 dark:border-indigo-900/40 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-muted-foreground font-bold text-[11px] flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Template Tiruan Siap Pakai:
            </span>
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white/60 dark:bg-black/30 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] transition-colors cursor-pointer"
              >
                + {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Success Notice Toast */}
        {successToast && (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/90 dark:bg-emerald-950/70 p-4 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Tab Controls: Edit Mode vs Live Preview Mode */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "edit"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Mode Tulis (Editor)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Pratinjau Artikel (Preview)</span>
            </button>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              <span>Estimasi: {estimatedReadTime}</span>
            </span>
          </div>
        </div>

        {/* Edit Form */}
        {activeTab === "edit" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Title */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-xs text-foreground block">
                  Judul Artikel: <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tips Meraih All Perfect pada Lagu Expert Level 27"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-input bg-card text-xs sm:text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-foreground block">
                  Kategori Topik:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-input bg-card text-xs font-semibold focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="Tips & Gameplay">Tips & Gameplay</option>
                  <option value="Meta & Tim">Meta & Tim</option>
                  <option value="Lore & Karakter">Lore & Karakter</option>
                  <option value="Gacha & Stars">Gacha & Stars</option>
                  <option value="Event & Skor">Event & Skor</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-foreground block">
                Ringkasan Singkat (Excerpt):
              </label>
              <textarea
                rows={2}
                placeholder="Tulis 1-2 kalimat ringkasan tentang apa yang dibahas dalam artikel ini..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-input bg-card text-xs focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Author details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border">
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-foreground block">
                  Nama Penulis / Panggilan:
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-input bg-card text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-xs text-foreground block">
                  Peran / Gelar Penulis:
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-input bg-card text-xs"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <label className="font-bold text-xs text-foreground block">
                Tag Artikel:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tambahkan tag (misal: Expert, PoPiPa, Tips)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-input bg-card text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs cursor-pointer"
                >
                  + Tambah Tag
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-foreground block">
                  Isi Konten Artikel (Mendukung Markdown): <span className="text-pink-600">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Gunakan ### untuk judul bagian, - untuk daftar
                </span>
              </div>
              <textarea
                required
                rows={12}
                placeholder="Mulai menulis artikel panduanmu di sini...

### 1. Judul Bagian Utama
Jelaskan konsep dasar atau strategi...

### 2. Cara Eksekusi
- Poin langkah pertama
- Poin langkah kedua"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 rounded-2xl border border-input bg-card font-mono text-xs sm:text-sm focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Submit Action Bar */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
              <Link
                href="/blog"
                className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs"
              >
                Batal
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs cursor-pointer"
                >
                  Lihat Pratinjau
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Publikasikan Artikel</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Live Preview Mode */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 text-xs text-indigo-800 dark:text-indigo-200 flex items-center justify-between">
              <span>Ini adalah tampilan bagaimana artikelmu akan terlihat oleh pemain lain.</span>
              <button
                onClick={() => setActiveTab("edit")}
                className="font-bold underline cursor-pointer"
              >
                Kembali ke Editor
              </button>
            </div>

            {/* Article Preview Render */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold">
                    {category}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground font-mono">{estimatedReadTime}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                  {title || "Judul Artikel Belum Diisi"}
                </h1>

                {excerpt && (
                  <p className="text-sm text-muted-foreground italic border-l-4 border-indigo-500 pl-3 py-0.5">
                    &quot;{excerpt}&quot;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-border text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{authorName}</span>
                <span>•</span>
                <span>{authorRole}</span>
              </div>

              {/* Rendered Body */}
              <div className="space-y-4 pt-4 border-t border-border text-xs sm:text-sm leading-relaxed text-foreground">
                {content ? (
                  content.split("\n\n").map((block, idx) => {
                    if (block.startsWith("### ")) {
                      return (
                        <h3 key={idx} className="text-base sm:text-lg font-black tracking-tight pt-3 text-foreground">
                          {block.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (block.startsWith("- ")) {
                      return (
                        <ul key={idx} className="space-y-1.5 pl-4 list-disc marker:text-indigo-600">
                          {block.split("\n").map((l, lIdx) => (
                            <li key={lIdx}>{l.replace("- ", "")}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={idx} className="text-muted-foreground leading-relaxed">{block}</p>;
                  })
                ) : (
                  <p className="text-muted-foreground italic">Konten artikel belum diisi.</p>
                )}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-border flex items-center gap-1.5 flex-wrap">
                {tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-muted text-[11px] font-medium text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className="px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs"
              >
                Kembali Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                Publikasikan Sekarang
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

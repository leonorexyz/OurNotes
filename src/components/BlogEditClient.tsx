"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  PenSquare,
  ArrowLeft,
  Eye,
  Edit3,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  X,
  Send,
  Clock,
  Tag,
  Sparkles,
} from "lucide-react";
import { BlogPost, BLOG_POSTS_DATA } from "@/data/blogData";

interface BlogEditClientProps {
  postId: string;
  defaultPost: BlogPost | null;
}

export function BlogEditClient({ postId, defaultPost }: BlogEditClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState(defaultPost?.title || "");
  const [category, setCategory] = useState<BlogPost["category"]>(
    defaultPost?.category || "Tips & Gameplay"
  );
  const [excerpt, setExcerpt] = useState(defaultPost?.excerpt || "");
  const [content, setContent] = useState(defaultPost?.content || "");
  const [tags, setTags] = useState<string[]>(defaultPost?.tags || ["Tips"]);
  const [tagInput, setTagInput] = useState("");
  const [authorName, setAuthorName] = useState(defaultPost?.author.name || "Pemain Our Notes");
  const [authorRole, setAuthorRole] = useState(defaultPost?.author.role || "Kontributor Komunitas");
  const [coverBg, setCoverBg] = useState(defaultPost?.coverImageBg || "from-indigo-600 via-purple-600 to-pink-600");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check localStorage if this was a custom user-created article
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ournotes_custom_blog_posts");
      if (stored) {
        const list: BlogPost[] = JSON.parse(stored);
        const match = list.find((p) => p.id === postId);
        if (match) {
          setTitle(match.title);
          setCategory(match.category);
          setExcerpt(match.excerpt);
          setContent(match.content);
          setTags(match.tags);
          setAuthorName(match.author.name);
          setAuthorRole(match.author.role);
          setCoverBg(match.coverImageBg);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }, [postId]);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Harap isi judul dan isi konten artikel.");
      return;
    }

    const updatedPost: BlogPost = {
      id: postId,
      title: title.trim(),
      excerpt: excerpt.trim() || content.slice(0, 150) + "...",
      content: content.trim(),
      category,
      tags,
      author: {
        name: authorName.trim() || "Pemain Our Notes",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        role: authorRole.trim() || "Kontributor Komunitas",
        badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
      },
      publishedAt: defaultPost?.publishedAt || new Date().toLocaleDateString("id-ID"),
      readTime: estimatedReadTime,
      likes: defaultPost?.likes || 1,
      commentsCount: defaultPost?.commentsCount || 0,
      views: (defaultPost?.views || 1) + 1,
      isFeatured: defaultPost?.isFeatured || false,
      coverImageBg: coverBg,
    };

    // Save to localStorage
    try {
      const stored = localStorage.getItem("ournotes_custom_blog_posts");
      const list: BlogPost[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter((p) => p.id !== postId);
      localStorage.setItem("ournotes_custom_blog_posts", JSON.stringify([updatedPost, ...filtered]));
    } catch (err) {
      console.warn(err);
    }

    setToastMessage(`Perubahan artikel "${updatedPost.title}" berhasil disimpan!`);
    setTimeout(() => {
      router.push(`/blog/${postId}`);
    }, 1200);
  };

  const handleDelete = () => {
    try {
      const stored = localStorage.getItem("ournotes_custom_blog_posts");
      if (stored) {
        const list: BlogPost[] = JSON.parse(stored);
        const filtered = list.filter((p) => p.id !== postId);
        localStorage.setItem("ournotes_custom_blog_posts", JSON.stringify(filtered));
      }
    } catch (err) {
      console.warn(err);
    }

    setToastMessage("Artikel berhasil dihapus.");
    setIsDeleteModalOpen(false);
    setTimeout(() => {
      router.push("/blog");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href={`/blog/${postId}`} className="hover:text-foreground flex items-center gap-1 font-semibold text-indigo-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Artikel
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Ubah Artikel</span>
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-indigo-200/60 dark:border-indigo-900/40 bg-card p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Edit3 className="h-3.5 w-3.5" />
              <span>Editor Perubahan Artikel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ubah Konten Artikel Komunitas
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Perbarui judul, ringkasan, atau isi panduanmu dengan dukungan pratinjau langsung.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Artikel</span>
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/90 dark:bg-emerald-950/70 p-4 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Tab Controls: Edit Mode vs Preview Mode */}
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
              <span>Pratinjau Hasil (Preview)</span>
            </button>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              <span>Estimasi: {estimatedReadTime}</span>
            </span>
          </div>
        </div>

        {/* Tab: Edit Mode */}
        {activeTab === "edit" ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-xs text-foreground block">
                  Judul Artikel: <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-input bg-card text-xs sm:text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>

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

            <div className="space-y-1.5">
              <label className="font-bold text-xs text-foreground block">
                Ringkasan Singkat (Excerpt):
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-input bg-card text-xs focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-xs text-foreground block">
                Tag Artikel:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tambah tag baru..."
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
                  + Tambah
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

            <div className="space-y-1.5">
              <label className="font-bold text-xs text-foreground block">
                Isi Konten Artikel (Markdown): <span className="text-pink-600">*</span>
              </label>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 rounded-2xl border border-input bg-card font-mono text-xs sm:text-sm focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
              <Link
                href={`/blog/${postId}`}
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
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Preview Mode */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 text-xs text-indigo-800 dark:text-indigo-200 flex items-center justify-between">
              <span>Pratinjau tampilan artikel setelah perubahan disimpan.</span>
              <button
                onClick={() => setActiveTab("edit")}
                className="font-bold underline cursor-pointer"
              >
                Kembali ke Mode Edit
              </button>
            </div>

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
                  {title}
                </h1>

                {excerpt && (
                  <p className="text-sm text-muted-foreground italic border-l-4 border-indigo-500 pl-3 py-0.5">
                    &quot;{excerpt}&quot;
                  </p>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-border text-xs sm:text-sm leading-relaxed text-foreground">
                {content.split("\n\n").map((block, idx) => {
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
                })}
              </div>

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
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                Simpan Perubahan Sekarang
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-red-600 font-black text-base">
                <AlertTriangle className="h-5 w-5" />
                <span>Konfirmasi Hapus Artikel</span>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-foreground font-semibold leading-relaxed">
                Apakah kamu yakin ingin menghapus artikel:
              </p>
              <div className="p-3 rounded-2xl bg-muted/40 border border-border font-bold text-foreground line-clamp-2">
                &quot;{title}&quot;
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Tindakan ini akan menghapus artikel dari daftar blog. Data yang dihapus tidak dapat dipulihkan.
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md cursor-pointer transition-colors"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

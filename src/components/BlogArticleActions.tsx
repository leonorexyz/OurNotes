"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ThumbsUp,
  Bookmark,
  Share2,
  Check,
  MessageSquare,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
} from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";

interface BlogArticleActionsProps {
  initialLikes: number;
  commentsCount: number;
  title: string;
  postId?: string;
  category?: string;
  excerpt?: string;
}

export function BlogArticleActions({
  initialLikes,
  commentsCount,
  title,
  postId,
  category,
  excerpt,
}: BlogArticleActionsProps) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConfirmDelete = () => {
    if (postId) {
      try {
        const stored = localStorage.getItem("ournotes_custom_blog_posts");
        if (stored) {
          const list = JSON.parse(stored);
          const updated = list.filter((p: any) => p.id !== postId);
          localStorage.setItem("ournotes_custom_blog_posts", JSON.stringify(updated));
        }
      } catch (err) {
        console.warn(err);
      }
    }

    setNotice(`Artikel "${title}" berhasil dihapus.`);
    setIsDeleteModalOpen(false);

    setTimeout(() => {
      router.push("/blog");
    }, 1200);
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap text-xs">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold transition-all cursor-pointer ${
            hasLiked
              ? "border-pink-300 bg-pink-50 dark:bg-pink-950/60 text-pink-600 shadow-2xs"
              : "border-border bg-card hover:bg-muted text-foreground"
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-pink-600 text-pink-600" : "text-muted-foreground"}`} />
          <span>{likes} Suka</span>
        </button>

        {/* Favorite Button */}
        {postId && (
          <FavoriteButton
            item={{
              id: postId,
              type: "guide",
              title,
              subtitle: excerpt || "Panduan & Catatan Komunitas BanG Dream!",
              categoryLabel: category || "Panduan Komunitas",
              url: `/blog/${postId}`,
              badge: category || "Artikel",
              badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
              coverBg: "from-indigo-600 via-purple-600 to-pink-600",
            }}
            variant="button"
          />
        )}

        {/* Share / Copy Link Button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600">Tautan Disalin!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span>Bagikan</span>
            </>
          )}
        </button>

        {/* Edit Article Action */}
        {postId && (
          <Link
            href={`/blog/edit/${postId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-foreground hover:text-indigo-600 font-bold transition-colors cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Ubah</span>
          </Link>
        )}

        {/* Delete Article Action */}
        {postId && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-red-50 dark:hover:bg-red-950/50 text-foreground hover:text-red-600 font-bold transition-colors cursor-pointer"
            title="Hapus Artikel"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
            <span>Hapus</span>
          </button>
        )}

        {/* Comments Anchor */}
        <a
          href="#diskusi-komentar"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold transition-all ml-auto"
        >
          <MessageSquare className="h-4 w-4 text-indigo-500" />
          <span>{commentsCount} Komentar</span>
        </a>
      </div>

      {notice && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950 p-4 text-xs font-bold text-emerald-800 dark:text-emerald-200 shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

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
                Artikel ini akan dihapus dari daftar komunitas. Tindakan ini tidak dapat dibatalkan.
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
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md cursor-pointer transition-colors"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

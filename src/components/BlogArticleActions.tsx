"use client";

import { useState } from "react";
import { ThumbsUp, Bookmark, Share2, Check, MessageSquare } from "lucide-react";

interface BlogArticleActionsProps {
  initialLikes: number;
  commentsCount: number;
  title: string;
}

export function BlogArticleActions({
  initialLikes,
  commentsCount,
  title,
}: BlogArticleActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
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

  return (
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

      {/* Bookmark Button */}
      <button
        onClick={handleBookmark}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold transition-all cursor-pointer ${
          isBookmarked
            ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 shadow-2xs"
            : "border-border bg-card hover:bg-muted text-foreground"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-indigo-600 text-indigo-600" : "text-muted-foreground"}`} />
        <span>{isBookmarked ? "Tersimpan" : "Simpan"}</span>
      </button>

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

      {/* Comments Anchor */}
      <a
        href="#diskusi-komentar"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold transition-all ml-auto"
      >
        <MessageSquare className="h-4 w-4 text-indigo-500" />
        <span>{commentsCount} Komentar</span>
      </a>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Reply,
  Send,
  User,
  Heart,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  Sparkles,
  Flame,
  ShieldCheck,
  X,
} from "lucide-react";

export interface BlogReply {
  id: string;
  authorName: string;
  authorBadge?: string;
  createdAt: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  authorBadge?: string;
  createdAt: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
  replies: BlogReply[];
}

interface BlogCommentsSectionProps {
  postId: string;
  defaultCommentsCount?: number;
}

export function BlogCommentsSection({
  postId,
  defaultCommentsCount = 2,
}: BlogCommentsSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("popular");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const storageKey = `ournotes_blog_comments_${postId}`;

  // Initial mock comments
  const defaultSampleComments: BlogComment[] = [
    {
      id: "comm-1",
      postId,
      authorName: "Hina_Boomer",
      authorBadge: "Lv. 140 Pro",
      createdAt: "2 jam yang lalu",
      content:
        "Panduan yang sangat komprehensif! Penjelasan timing offset audio bluetooth dan speed note 10.4 langsung menyelamatkan saya di bagian refrain cepat lagu Fire Bird.",
      likes: 24,
      hasLiked: false,
      replies: [
        {
          id: "rep-1-1",
          authorName: "Rui 'RhythmGod'",
          authorBadge: "Penulis Artikel",
          createdAt: "1 jam yang lalu",
          content:
            "Senang bisa membantu! Jangan lupa juga bersihkan layar dengan kain microfiber agar jari tidak seret saat flick beruntun.",
          likes: 9,
          hasLiked: false,
        },
        {
          id: "rep-1-2",
          authorName: "Lisa_Fanboy",
          authorBadge: "Pemain Roselia",
          createdAt: "45 menit yang lalu",
          content: "Betul banget, pake bedak bayi tipis-tipis di jempol juga efektif banget buat lagu level 27!",
          likes: 5,
          hasLiked: false,
        },
      ],
    },
    {
      id: "comm-2",
      postId,
      authorName: "Moca_Bread",
      authorBadge: "Lv. 118",
      createdAt: "5 jam yang lalu",
      content:
        "Setuju banget dengan komparasi jempol vs telunjuk. Waktu pertama kali coba taruh HP di meja rasanya canggung, tapi setelah 3 hari terbiasa akurasi All Perfect naik drastis.",
      likes: 18,
      hasLiked: false,
      replies: [],
    },
  ];

  // Load comments from localStorage or initialize defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        setComments(defaultSampleComments);
        localStorage.setItem(storageKey, JSON.stringify(defaultSampleComments));
      }
    } catch {
      setComments(defaultSampleComments);
    }
    // Expand replies by default
    setExpandedReplies({ "comm-1": true });
  }, [postId]);

  const saveComments = (newComments: BlogComment[]) => {
    setComments(newComments);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newComments));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    const newComment: BlogComment = {
      id: `comm-${Date.now()}`,
      postId,
      authorName: newCommentName.trim() || "Pemain Our Notes",
      authorBadge: "Pemain",
      createdAt: "Baru saja",
      content: newCommentContent.trim(),
      likes: 0,
      hasLiked: false,
      replies: [],
    };

    const updated = [newComment, ...comments];
    saveComments(updated);
    setNewCommentContent("");
    setToast("Komentarmu berhasil ditambahkan!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    const newReply: BlogReply = {
      id: `rep-${Date.now()}`,
      authorName: replyName.trim() || "Pemain Our Notes",
      authorBadge: "Pemain",
      createdAt: "Baru saja",
      content: replyContent.trim(),
      likes: 0,
      hasLiked: false,
    };

    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...c.replies, newReply],
        };
      }
      return c;
    });

    saveComments(updated);
    setReplyContent("");
    setReplyingToId(null);
    setExpandedReplies({ ...expandedReplies, [commentId]: true });
    setToast("Balasanmu berhasil dikirim!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleLikeComment = (commentId: string) => {
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
          hasLiked: !c.hasLiked,
        };
      }
      return c;
    });
    saveComments(updated);
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: c.replies.map((r) => {
            if (r.id === replyId) {
              return {
                ...r,
                likes: r.hasLiked ? r.likes - 1 : r.likes + 1,
                hasLiked: !r.hasLiked,
              };
            }
            return r;
          }),
        };
      }
      return c;
    });
    saveComments(updated);
  };

  const handleDeleteComment = (commentId: string) => {
    const updated = comments.filter((c) => c.id !== commentId);
    saveComments(updated);
    setToast("Komentar berhasil dihapus.");
    setTimeout(() => setToast(null), 2500);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes - a.likes;
    }
    return 0; // maintain newest insertion
  });

  const totalCommentCount = comments.reduce((acc, curr) => acc + 1 + curr.replies.length, 0);

  return (
    <section id="diskusi-komentar" className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              Kolom Diskusi Komunitas ({totalCommentCount} Tanggapan)
            </h3>
            <p className="text-xs text-muted-foreground">
              Diskusikan strategi lagu, tanyakan tips ke penulis, atau bagikan hasil live show kamu
            </p>
          </div>
        </div>

        {/* Sort Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-muted-foreground font-semibold">Urutkan:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border">
            <button
              onClick={() => setSortBy("popular")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sortBy === "popular"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Terpopuler
            </button>
            <button
              onClick={() => setSortBy("newest")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sortBy === "newest"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Terbaru
            </button>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/90 dark:bg-emerald-950/70 p-3.5 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Comment Input Box */}
      <form onSubmit={handleAddComment} className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-1/3">
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Nama / Panggilan:
            </label>
            <input
              type="text"
              placeholder="Contoh: Kasumi_Spark"
              value={newCommentName}
              onChange={(e) => setNewCommentName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-input bg-card text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex-1">
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Isi Komentar / Tanggapan:
            </label>
            <textarea
              rows={3}
              required
              placeholder="Tulis pendapatmu, pengalaman bermain, atau pertanyaan seputar isi artikel..."
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              className="w-full p-3 rounded-xl border border-input bg-card text-xs focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted-foreground">
            Beri tanggapan yang ramah dan saling mendukung.
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Kirim Komentar</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground space-y-2">
            <MessageSquare className="h-6 w-6 mx-auto stroke-1 text-muted-foreground" />
            <p>Belum ada komentar untuk artikel ini. Jadilah yang pertama berkomentar!</p>
          </div>
        ) : (
          sortedComments.map((comment) => {
            const isReplying = replyingToId === comment.id;
            const repliesOpen = expandedReplies[comment.id] ?? false;

            return (
              <div
                key={comment.id}
                className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-3 text-xs"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-xs">
                      {comment.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-foreground font-bold">{comment.authorName}</strong>
                        {comment.authorBadge && (
                          <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">
                            {comment.authorBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{comment.createdAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Hapus Komentar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Comment Body */}
                <p className="text-muted-foreground leading-relaxed pl-10">
                  {comment.content}
                </p>

                {/* Comment Actions Bar */}
                <div className="pl-10 flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                      comment.hasLiked ? "text-pink-600" : "hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${comment.hasLiked ? "fill-pink-600" : ""}`} />
                    <span>{comment.likes} Suka</span>
                  </button>

                  <button
                    onClick={() => {
                      setReplyingToId(isReplying ? null : comment.id);
                    }}
                    className="inline-flex items-center gap-1 font-semibold hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    <span>Balas</span>
                  </button>

                  {comment.replies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 ml-auto cursor-pointer"
                    >
                      {repliesOpen ? (
                        <>
                          <span>Tutup Balasan ({comment.replies.length})</span>
                          <ChevronUp className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Lihat {comment.replies.length} Balasan</span>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Inline Reply Input Box */}
                {isReplying && (
                  <div className="ml-10 p-3 rounded-xl bg-muted/40 border border-border space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
                      <span>Balas komentar {comment.authorName}:</span>
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nama kamu..."
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-input bg-card text-xs focus:border-indigo-500 focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Tulis balasanmu..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-input bg-card text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1 rounded-lg bg-muted text-foreground text-xs font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddReply(comment.id)}
                        className="px-3.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs"
                      >
                        Kirim Balasan
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies List */}
                {repliesOpen && comment.replies.length > 0 && (
                  <div className="ml-10 space-y-2.5 pt-2 border-l-2 border-indigo-200 dark:border-indigo-900/60 pl-3.5">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-3 rounded-xl bg-muted/30 border border-border/50 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{reply.authorName}</span>
                            {reply.authorBadge && (
                              <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[9px] font-bold">
                                {reply.authorBadge}
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground">{reply.createdAt}</span>
                          </div>

                          <button
                            onClick={() => handleLikeReply(comment.id, reply.id)}
                            className={`inline-flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                              reply.hasLiked ? "text-pink-600 font-bold" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <ThumbsUp className={`h-3 w-3 ${reply.hasLiked ? "fill-pink-600" : ""}`} />
                            <span>{reply.likes}</span>
                          </button>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

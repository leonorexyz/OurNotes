import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Calendar,
  Sparkles,
  Tag,
  Share2,
  BookOpen,
  MessageSquare,
  ThumbsUp,
  User,
  ShieldCheck,
  Send,
} from "lucide-react";
import { BLOG_POSTS_DATA, BlogPost } from "@/data/blogData";
import { BlogArticleActions } from "@/components/BlogArticleActions";

export function generateStaticParams() {
  return BLOG_POSTS_DATA.map((post) => ({
    id: post.id,
  }));
}

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const postIndex = BLOG_POSTS_DATA.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    notFound();
  }

  const post = BLOG_POSTS_DATA[postIndex];
  const prevPost = postIndex > 0 ? BLOG_POSTS_DATA[postIndex - 1] : null;
  const nextPost = postIndex < BLOG_POSTS_DATA.length - 1 ? BLOG_POSTS_DATA[postIndex + 1] : null;
  const relatedPosts = BLOG_POSTS_DATA.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-foreground flex items-center gap-1 font-semibold text-pink-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Panduan Utama
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground font-semibold text-indigo-600">
            Blog & Komunitas
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">{post.title}</span>
        </div>

        {/* Article Hero Banner */}
        <header className="rounded-3xl border border-indigo-200/60 dark:border-indigo-900/40 bg-card p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60">
                {post.category}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.publishedAt}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.views} Dilihat
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed border-l-4 border-indigo-500 pl-4 py-1 italic bg-muted/20 rounded-r-xl">
              &quot;{post.excerpt}&quot;
            </p>
          </div>

          {/* Author Details & Engagement Bar */}
          <div className="pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                {post.author.name.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{post.author.name}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${post.author.badgeColor}`}>
                    {post.author.role}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Kontributor Komunitas Bang Dream! Our Notes</p>
              </div>
            </div>

            {/* Client Interactive Actions */}
            <BlogArticleActions
              initialLikes={post.likes}
              commentsCount={post.commentsCount}
              title={post.title}
              postId={post.id}
            />
          </div>
        </header>

        {/* Article Body Content */}
        <article className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-6 text-foreground text-sm sm:text-base leading-relaxed">
          {post.content.split("\n\n").map((block, idx) => {
            if (block.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-lg sm:text-xl font-black tracking-tight pt-4 text-foreground">
                  {block.replace("### ", "")}
                </h3>
              );
            }
            if (block.startsWith("- ")) {
              const lines = block.split("\n");
              return (
                <ul key={idx} className="space-y-2 pl-4 list-disc marker:text-indigo-600 text-sm">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx} className="leading-relaxed">
                      {line.replace("- ", "")}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.match(/^\d+\./)) {
              const lines = block.split("\n");
              return (
                <ol key={idx} className="space-y-2 pl-5 list-decimal marker:text-indigo-600 font-medium text-sm">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx} className="leading-relaxed">
                      {line.replace(/^\d+\.\s*/, "")}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={idx} className="text-muted-foreground leading-relaxed">
                {block}
              </p>
            );
          })}

          {/* Tags Footer */}
          <div className="pt-6 border-t border-border flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-muted-foreground flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              Tag Terkait:
            </span>
            {post.tags.map((t) => (
              <Link
                key={t}
                href="/blog"
                className="px-3 py-1 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>
        </article>

        {/* Navigation: Previous and Next Articles */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.id}`}
              className="p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-indigo-400 transition-colors flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-muted group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 text-muted-foreground group-hover:text-indigo-600 shrink-0">
                <ChevronLeft className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Artikel Sebelumnya
                </span>
                <p className="font-bold text-foreground text-xs line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {prevPost.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-border text-muted-foreground text-center flex items-center justify-center">
              Awal daftar artikel
            </div>
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.id}`}
              className="p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-indigo-400 transition-colors flex items-center justify-between gap-3 text-right group"
            >
              <div className="space-y-0.5 min-w-0 ml-auto">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Artikel Berikutnya
                </span>
                <p className="font-bold text-foreground text-xs line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {nextPost.title}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-muted group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 text-muted-foreground group-hover:text-indigo-600 shrink-0">
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-border text-muted-foreground text-center flex items-center justify-center">
              Akhir daftar artikel
            </div>
          )}
        </section>

        {/* Section: Artikel Terkait */}
        {relatedPosts.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Artikel Terkait ({post.category})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.id}`}
                  className="p-5 rounded-3xl border border-border bg-card hover:border-indigo-300 dark:hover:border-indigo-800 transition-all space-y-2 block group shadow-2xs"
                >
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {r.category}
                  </span>
                  <h4 className="font-bold text-sm text-foreground group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {r.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {r.excerpt}
                  </p>
                  <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{r.author.name}</span>
                    <span className="font-mono text-indigo-600 font-semibold">{r.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section: Diskusi Komunitas (Komentar) */}
        <section id="diskusi-komentar" className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Diskusi Komunitas ({post.commentsCount} Komentar)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Beri tanggapan, bagikan pengalaman skor, atau ajukan pertanyaan ke penulis
                </p>
              </div>
            </div>
          </div>

          {/* Comment Submission Form Box */}
          <div className="space-y-3">
            <textarea
              rows={3}
              placeholder="Tulis tanggapan atau pengalamanmu terkait artikel ini..."
              className="w-full rounded-2xl border border-input bg-muted/20 p-3.5 text-xs focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Gunakan bahasa yang sopan dan saling mendukung sesama pemain.
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim Komentar</span>
              </button>
            </div>
          </div>

          {/* Sample Community Comments */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">Hina_Boomer</span>
                  <span className="px-2 py-0.5 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 text-[10px] font-bold">
                    Lv. 140
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">2 jam yang lalu</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Terima kasih tipsnya! Setelah menaikkan note speed ke 10.4 akhirnya bisa Full Combo lagu Fire Bird Expert. Offset +3 sangat ngebantu earphone bluetooth saya.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">Moca_Bread</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                    Lv. 118
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">5 jam yang lalu</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Setuju banget dengan poin jempol vs telunjuk. Kalau main lagu Special level 28 ke atas emang wajib taruh HP di meja pakai telunjuk biar ga kram!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

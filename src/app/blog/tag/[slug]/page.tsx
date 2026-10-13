import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Tag,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  BLOG_POSTS_DATA,
  getAllUniqueTags,
  slugifyTag,
  REVERSE_CATEGORY_MAP,
} from "@/data/blogData";

export function generateStaticParams() {
  const tags = getAllUniqueTags();
  return tags.map((t) => ({
    slug: t.slug,
  }));
}

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const allTags = getAllUniqueTags();
  const matchedTag = allTags.find((t) => t.slug === slug);

  if (!matchedTag) {
    notFound();
  }

  const postsWithTag = BLOG_POSTS_DATA.filter((p) =>
    p.tags.some((t) => slugifyTag(t) === slug)
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 pb-28 md:pb-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground flex items-center gap-1 font-semibold text-indigo-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Semua Blog
          </Link>
          <span>/</span>
          <span className="text-muted-foreground font-medium">Tag</span>
          <span>/</span>
          <span className="text-foreground font-semibold">#{matchedTag.name}</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-background dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-background p-6 sm:p-10 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60">
            <Tag className="h-3.5 w-3.5" />
            <span>Tag Komunitas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            #{matchedTag.name}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Menampilkan seluruh tulisan dan panduan yang ditandai dengan label #{matchedTag.name}. Total ditemukan {postsWithTag.length} artikel relevan.
          </p>

          {/* Other Popular Tags */}
          <div className="pt-3 border-t border-indigo-200/40 dark:border-indigo-900/40 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-muted-foreground font-bold text-[11px]">Tag Populer Lain:</span>
            {allTags.map((t) => (
              <Link
                key={t.slug}
                href={`/blog/tag/${t.slug}`}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  t.slug === slug
                    ? "bg-indigo-600 text-white font-bold shadow-2xs"
                    : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                #{t.name} ({t.count})
              </Link>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Daftar Artikel ({postsWithTag.length})
            </h2>
            <Link href="/blog" className="text-xs font-bold text-indigo-600 hover:underline">
              Lihat Semua Artikel
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsWithTag.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-border bg-card shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="space-y-4">
                  <div className={`h-24 bg-gradient-to-r ${post.coverImageBg} p-4 text-white flex flex-col justify-between`}>
                    <Link
                      href={`/blog/kategori/${REVERSE_CATEGORY_MAP[post.category]}`}
                      className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-[10px] font-bold self-start hover:bg-black/50 transition-colors"
                    >
                      {post.category}
                    </Link>
                    <span className="text-[10px] text-white/80 font-mono self-end">
                      {post.readTime}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-base text-foreground leading-snug group-hover:text-indigo-600 transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {post.tags.slice(0, 3).map((t) => (
                        <Link
                          key={t}
                          href={`/blog/tag/${slugifyTag(t)}`}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                            slugifyTag(t) === slug
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold"
                              : "bg-muted text-muted-foreground hover:text-indigo-600"
                          }`}
                        >
                          #{t}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3">
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                        {post.author.name.charAt(0)}
                      </span>
                      <span className="font-bold text-foreground text-[11px]">
                        {post.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex items-center gap-1 text-pink-600 font-semibold">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                        <MessageSquare className="h-3 w-3" />
                        <span>{post.commentsCount}</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="w-full inline-flex items-center justify-center gap-1 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs transition-colors"
                  >
                    <span>Baca Artikel</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

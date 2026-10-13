import { notFound } from "next/navigation";
import { BLOG_POSTS_DATA } from "@/data/blogData";
import { BlogEditClient } from "@/components/BlogEditClient";

export function generateStaticParams() {
  return BLOG_POSTS_DATA.map((post) => ({
    id: post.id,
  }));
}

interface BlogEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogEditPage({ params }: BlogEditPageProps) {
  const { id } = await params;
  const initialPost = BLOG_POSTS_DATA.find((p) => p.id === id) || null;

  return <BlogEditClient postId={id} defaultPost={initialPost} />;
}

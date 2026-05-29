import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/data/repo';
import { BlogForm } from '@/components/admin/blog-form';
import { updateBlogPostAction } from '../../actions';

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const action = updateBlogPostAction.bind(null, slug);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
        >
          <ChevronLeft className="size-4" /> Back to blog
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Edit post</h1>
        <p className="text-sm text-ink/50">{post.title}</p>
      </div>

      <BlogForm initial={post} action={action} />
    </div>
  );
}

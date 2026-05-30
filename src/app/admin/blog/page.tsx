import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { listAllBlogPosts } from '@/lib/data/repo';
import { StatusBadge } from '@/components/admin/status-badge';
import { DeleteBlogButton } from '@/components/admin/delete-blog-button';

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(iso));
}

export default function AdminBlogPage() {
  const posts = listAllBlogPosts();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-ink/60">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90"
        >
          <Plus className="size-4" /> New post
        </Link>
      </header>

      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-4 py-3 font-medium">Cover</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-ink/50">
                    No posts yet. Create your first post above.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-black/[0.015]">
                    {/* Cover thumbnail */}
                    <td className="px-4 py-3">
                      <div className="relative h-10 w-16 overflow-hidden rounded-md bg-black/5">
                        {post.coverUrl && (
                          <Image
                            src={post.coverUrl}
                            alt={post.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-ink">{post.title}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={post.status} />
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-ink/50">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Published at */}
                    <td className="px-4 py-3 text-ink/60">
                      {formatDate(post.publishedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.slug}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-black/5"
                        >
                          <Pencil className="size-3.5" /> Edit
                        </Link>
                        <DeleteBlogButton slug={post.slug} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

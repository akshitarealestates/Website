import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { listBlogPosts } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';
import { SectionHeading } from '@/components/ui-kit/section-heading';

export const metadata: Metadata = {
  title: 'Insights — Akshita Realty',
  description:
    'Expert analysis, locality guides, and buying advice from the Akshita Realty team.',
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(iso));
}

export default function InsightsPage() {
  const posts = listBlogPosts({ publishedOnly: true });
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-cream pb-24">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="bg-ink text-white pt-24 pb-16">
        <Container>
          <SectionHeading
            overline="Insights"
            title="From our insights"
            italicWord="insights"
          />
          <p className="mt-4 max-w-xl text-white/60 leading-relaxed">
            Market trends, locality guides, and step-by-step buying advice from
            the Akshita Realty team.
          </p>
        </Container>
      </div>

      <Container className="pt-14">
        {posts.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-2xl font-semibold text-ink">
              No articles published yet.
            </p>
            <p className="mt-2 text-ink/50">Check back soon.</p>
          </div>
        )}

        {/* ── Featured first post ───────────────────────────────── */}
        {featured && (
          <article className="group mb-14">
            <Link href={`/insights/${featured.slug}`} className="block">
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={featured.coverUrl}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featured.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gold/90 px-3 py-1 text-xs font-medium text-ink capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-white leading-snug sm:text-3xl md:text-4xl max-w-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-white/70 leading-relaxed max-w-2xl line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-sm text-white/50">
                    <span>{featured.author}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={featured.publishedAt}>
                      {formatDate(featured.publishedAt)}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        )}

        {/* ── Remaining posts grid ─────────────────────────────── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article key={post.slug} className="group flex flex-col">
                <Link href={`/insights/${post.slug}`} className="block flex-1 flex flex-col">
                  {/* Cover */}
                  <div
                    className="relative w-full overflow-hidden rounded-2xl"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Card body */}
                  <div className="mt-5 flex flex-1 flex-col">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="font-display text-xl font-semibold leading-snug text-ink group-hover:text-gold transition-colors line-clamp-3">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mt-2 text-sm text-ink/60 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-ink/40 pt-3 border-t border-black/5">
                      <span>{post.author}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}

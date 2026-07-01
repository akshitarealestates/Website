import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { listBlogPosts, getBlogPostBySlug } from '@/lib/data/repo';
import { Container } from '@/components/ui-kit/container';

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return listBlogPosts({ publishedOnly: true }).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || post.status !== 'published') {
    return { title: 'Article not found — Akshita Real Estate' };
  }

  return {
    title: `${post.title} — Akshita Real Estate`,
    description: post.excerpt,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(iso));
}

/**
 * Very lightweight markdown renderer.
 * Handles: ## headings, paragraph blocks separated by blank lines.
 * Returns an array of React elements. No external dependency.
 */
function renderMarkdownBody(body: string): React.ReactNode[] {
  // Split on one-or-more blank lines
  const blocks = body.split(/\n\n+/).filter((b) => b.trim().length > 0);

  return blocks.map((block, i) => {
    const trimmed = block.trim();

    // ## Heading
    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3).trim();
      return (
        <h2
          key={i}
          className="font-display text-2xl font-semibold text-ink mt-10 mb-4 leading-snug"
        >
          {text}
        </h2>
      );
    }

    // Regular paragraph — preserve inline line-breaks as spaces
    const lines = trimmed.split('\n').join(' ');
    return (
      <p key={i} className="text-ink/80 leading-relaxed mb-0">
        {lines}
      </p>
    );
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Related posts: other published posts, exclude current, max 3
  const related = listBlogPosts({ publishedOnly: true })
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-cream pb-24">
      {/* ── Cover image ───────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '21/9' }}>
        <Image
          src={post.coverUrl}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/60" />
      </div>

      <Container className="pt-10">
        {/* ── Back link ─────────────────────────────────────────────── */}
        <nav className="mb-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/50 hover:text-ink transition-colors"
          >
            <span aria-hidden>←</span>
            Back to Insights
          </Link>
        </nav>

        {/* ── Article ──────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold capitalize"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Author + date */}
          <div className="mt-5 flex items-center gap-3 text-sm text-ink/50 pb-8 border-b border-black/8">
            <span className="font-medium text-ink/70">{post.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>

          {/* Excerpt — lead paragraph */}
          <p className="mt-8 text-lg text-ink/70 leading-relaxed font-medium">
            {post.excerpt}
          </p>

          {/* Body */}
          <div className="mt-8 space-y-5">
            {renderMarkdownBody(post.body)}
          </div>

          {/* CTA footer */}
          <div className="mt-16 rounded-2xl bg-ink text-white p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
              Ready to invest?
            </p>
            <h2 className="font-display text-2xl font-semibold leading-tight">
              Speak with an Akshita Real Estate advisor
            </h2>
            <p className="mt-3 text-white/60 leading-relaxed max-w-xl">
              Get personalised guidance on buying, selling, or investing in
              Lucknow real estate. Our team responds within 24 hours.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90 transition-colors"
            >
              Get in touch →
            </Link>
          </div>
        </div>

        {/* ── Related posts strip ────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-20 max-w-5xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/40 mb-6">
              More from Insights
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rp) => (
                <article key={rp.slug} className="group">
                  <Link href={`/insights/${rp.slug}`} className="block">
                    <div
                      className="relative w-full overflow-hidden rounded-2xl"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <Image
                        src={rp.coverUrl}
                        alt={rp.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {rp.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-gold capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-display text-base font-semibold text-ink leading-snug group-hover:text-gold transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <time
                        dateTime={rp.publishedAt}
                        className="mt-2 block text-xs text-ink/40"
                      >
                        {formatDate(rp.publishedAt)}
                      </time>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

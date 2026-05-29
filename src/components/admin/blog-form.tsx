'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/data/types';
import type { BlogFormState } from '@/app/admin/blog/actions';

const labelCls = 'block text-xs font-medium uppercase tracking-wide text-ink/50';
const inputCls =
  'mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20';

function Field({
  label,
  name,
  children,
  error,
  className,
}: {
  label: string;
  name?: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl bg-white p-5 ring-1 ring-black/5">
      <legend className="px-1 font-display text-base font-semibold text-ink">{title}</legend>
      {description && <p className="mb-4 text-sm text-ink/50">{description}</p>}
      <div className={description ? '' : 'mt-3'}>{children}</div>
    </fieldset>
  );
}

/**
 * Lightweight markdown preview that matches the public `/insights/[slug]` renderer.
 * Splits on blank lines; `## ` → h2 heading, everything else → paragraph.
 */
function MarkdownPreview({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/).filter((b) => b.trim().length > 0);

  if (blocks.length === 0) {
    return (
      <p className="text-sm text-ink/30 italic">Start typing to see a preview…</p>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={i}
              className="font-display text-xl font-semibold text-ink mt-6 mb-2 leading-snug"
            >
              {trimmed.slice(3).trim()}
            </h2>
          );
        }
        return (
          <p key={i} className="text-sm text-ink/80 leading-relaxed">
            {trimmed.split('\n').join(' ')}
          </p>
        );
      })}
    </div>
  );
}

export function BlogForm({
  initial,
  action,
}: {
  initial?: BlogPost;
  action: (prevState: BlogFormState, formData: FormData) => Promise<BlogFormState>;
}) {
  const [state, formAction, isPending] = useActionState<BlogFormState, FormData>(action, {});
  const errs = state.fieldErrors ?? {};

  const [body, setBody] = useState(initial?.body ?? '');

  // Format the initial publishedAt datetime-local value
  const defaultPublishedAt = initial?.publishedAt
    ? new Date(initial.publishedAt).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-600/20">
          {state.error}
        </div>
      )}

      {/* ── Meta ────────────────────────────────────────────────────── */}
      <Section title="Post details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" name="title" error={errs.title} className="sm:col-span-2">
            <input
              id="title"
              name="title"
              defaultValue={initial?.title ?? ''}
              className={inputCls}
              required
            />
          </Field>

          <Field label="Cover image URL" name="coverUrl" className="sm:col-span-2">
            <input
              id="coverUrl"
              name="coverUrl"
              type="url"
              defaultValue={initial?.coverUrl ?? ''}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>

          <Field label="Excerpt" name="excerpt" className="sm:col-span-2">
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={initial?.excerpt ?? ''}
              placeholder="Brief summary shown in listing and meta description…"
              className={inputCls}
            />
          </Field>

          <Field label="Author" name="author">
            <input
              id="author"
              name="author"
              defaultValue={initial?.author ?? 'Akshita Realty Team'}
              className={inputCls}
            />
          </Field>

          <Field label="Tags (comma-separated)" name="tags">
            <input
              id="tags"
              name="tags"
              defaultValue={(initial?.tags ?? []).join(', ')}
              placeholder="investment, lucknow, 2026"
              className={inputCls}
            />
          </Field>

          <Field label="Status" name="status">
            <select
              id="status"
              name="status"
              defaultValue={initial?.status ?? 'draft'}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>

          <Field label="Published at" name="publishedAt">
            <input
              id="publishedAt"
              name="publishedAt"
              type="datetime-local"
              defaultValue={defaultPublishedAt}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* ── Body + live preview ──────────────────────────────────────── */}
      <Section
        title="Body"
        description="Write in markdown. Use ## for section headings; separate paragraphs with a blank line."
      >
        <Field label="" name="body" error={errs.body}>
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Editor */}
            <div>
              <p className={labelCls + ' mb-1'}>Markdown source</p>
              <textarea
                id="body"
                name="body"
                rows={24}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`## Section heading\n\nYour paragraph here…`}
                className={inputCls + ' font-mono text-xs leading-relaxed'}
                required
              />
            </div>

            {/* Live preview */}
            <div>
              <p className={labelCls + ' mb-1'}>Preview</p>
              <div className="mt-1 min-h-24 rounded-lg border border-black/10 bg-cream/50 px-4 py-3">
                <MarkdownPreview body={body} />
              </div>
            </div>
          </div>
        </Field>
      </Section>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/90 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : initial ? 'Save changes' : 'Create post'}
        </button>
        <Link
          href="/admin/blog"
          className="inline-flex items-center rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

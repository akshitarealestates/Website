'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/data/repo';
import type { BlogPost } from '@/lib/data/types';

export interface BlogFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key);
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function csvList(fd: FormData, key: string): string[] {
  const v = str(fd, key);
  if (!v) return [];
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── Build a validated input from form data ───────────────────────────────────

function buildBlogInput(fd: FormData): {
  data?: Partial<BlogPost> & { title: string };
  fieldErrors?: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const title = str(fd, 'title');
  if (!title) fieldErrors.title = 'Title is required.';

  const body = str(fd, 'body');
  if (!body) fieldErrors.body = 'Body is required.';

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const statusRaw = str(fd, 'status');
  const status: BlogPost['status'] =
    statusRaw === 'published' ? 'published' : 'draft';

  const publishedAtRaw = str(fd, 'publishedAt');
  const publishedAt = publishedAtRaw
    ? new Date(publishedAtRaw).toISOString()
    : new Date().toISOString();

  const data: Partial<BlogPost> & { title: string } = {
    title: title!,
    coverUrl: str(fd, 'coverUrl') ?? '',
    excerpt: str(fd, 'excerpt') ?? '',
    body: body!,
    author: str(fd, 'author') ?? 'Akshita Realty Team',
    status,
    publishedAt,
    tags: csvList(fd, 'tags'),
  };

  return { data };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createBlogPostAction(
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const { data, fieldErrors } = buildBlogInput(formData);
  if (fieldErrors || !data) {
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  createBlogPost(data);
  revalidatePath('/admin/blog');
  revalidatePath('/insights');
  redirect('/admin/blog');
}

export async function updateBlogPostAction(
  slug: string,
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const { data, fieldErrors } = buildBlogInput(formData);
  if (fieldErrors || !data) {
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }

  const updated = updateBlogPost(slug, data);
  if (!updated) {
    return { error: 'Post not found.' };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/insights');
  revalidatePath(`/insights/${slug}`);
  redirect('/admin/blog');
}

export async function deleteBlogPostAction(slug: string): Promise<void> {
  deleteBlogPost(slug);
  revalidatePath('/admin/blog');
  revalidatePath('/insights');
}

import { Suspense } from 'react';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="mb-8 text-center font-display text-4xl">Welcome back</h1>
      <Suspense><AuthForm mode="login" /></Suspense>
      <p className="mt-6 text-center text-sm text-ink/60">
        New here? <Link href="/signup" className="underline">Create an account</Link>
      </p>
    </section>
  );
}

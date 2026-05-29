import { Suspense } from 'react';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function SignupPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="mb-8 text-center font-display text-4xl">Create your account</h1>
      <Suspense><AuthForm mode="signup" /></Suspense>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account? <Link href="/login" className="underline">Log in</Link>
      </p>
    </section>
  );
}

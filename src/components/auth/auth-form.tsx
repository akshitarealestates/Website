'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const CONFIGURED = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function google() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  async function emailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const supabase = createClient();
    const { error } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push(next); router.refresh();
  }

  if (!CONFIGURED) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border border-black/10 bg-white p-5 text-sm text-ink/70">
        Authentication isn&apos;t configured yet. Add Supabase environment variables to enable sign-in.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-5">
      <button onClick={google} className="w-full rounded-full border border-black/10 bg-white py-2.5 text-sm font-medium">
        Continue with Google
      </button>
      <div className="text-center text-xs text-ink/40">or</div>
      <form onSubmit={emailSubmit} className="space-y-3">
        <input className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" type="email"
          placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" type="password"
          placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-ink py-2.5 text-sm text-white disabled:opacity-60">
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}

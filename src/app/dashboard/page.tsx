import { createClient } from '@/lib/supabase/server';

async function getEmail() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.email ?? null;
  } catch {
    return null;
  }
}

export default async function Dashboard() {
  const email = await getEmail();
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="font-display text-4xl">Your dashboard</h1>
      <p className="mt-3 text-ink/70">{email ? `Signed in as ${email}` : 'Welcome'}</p>
      <form action="/auth/signout" method="post" className="mt-6">
        <button className="rounded-full border border-black/10 px-4 py-2 text-sm">Sign out</button>
      </form>
    </section>
  );
}

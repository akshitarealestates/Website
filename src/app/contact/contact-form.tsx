'use client';

// React 19 ships useActionState as the replacement for useFormState.
// Next.js 16 / React 19: useActionState is in the 'react' package.
import { useActionState } from 'react';
import { submitContactForm, type ContactFormState } from './actions';

const initialState: ContactFormState = { success: false };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-100 p-8 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="font-display text-xl font-semibold text-ink mb-2">
          Message received!
        </h3>
        <p className="text-sm text-ink/60">
          Thank you for reaching out. A specialist will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/5 transition-all"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">
            Mobile number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="10-digit mobile"
            pattern="[6-9][0-9]{9}"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/5 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
          Email address <span className="text-ink/40 text-xs font-normal">(optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/5 transition-all"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink mb-1.5">
          Message <span className="text-ink/40 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us what you're looking for, your budget, preferred locality, etc."
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/5 transition-all resize-none"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-ink text-white py-3.5 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? 'Sending…' : 'Send message'}
      </button>

      <p className="text-xs text-center text-ink/40">
        We typically respond within 24 hours on business days.
      </p>
    </form>
  );
}

'use client';

import { useActionState, useEffect, useState } from 'react';
import { submitEnquiry, type EnquiryFormState } from '@/app/properties/[slug]/actions';

const initialState: EnquiryFormState = { success: false };

export function EnquiryForm({
  slug,
  title,
  message,
}: {
  slug: string;
  title: string;
  /** Controlled message value, used to prefill from a chosen configuration. */
  message?: string;
}) {
  const [state, formAction, isPending] = useActionState(submitEnquiry, initialState);
  const defaultMessage = `I'm interested in ${title}. Please share more details.`;
  const [messageValue, setMessageValue] = useState(message ?? defaultMessage);

  // When a parent supplies a new prefilled message (e.g. a chosen
  // configuration), sync it into the editable field.
  useEffect(() => {
    if (message !== undefined) setMessageValue(message);
  }, [message]);

  if (state.success) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-100 p-6 text-center">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="font-display text-lg font-semibold text-ink mb-1">
          Enquiry sent!
        </h3>
        <p className="text-sm text-ink/60">
          A specialist will reach out about this property within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="propertySlug" value={slug} />

      <div>
        <label htmlFor="enq-name" className="block text-sm font-medium text-ink mb-1.5">
          Full name <span className="text-red-500">*</span>
        </label>
        <input
          id="enq-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your full name"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/5 transition-all"
        />
      </div>

      <div>
        <label htmlFor="enq-phone" className="block text-sm font-medium text-ink mb-1.5">
          Mobile number <span className="text-red-500">*</span>
        </label>
        <input
          id="enq-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          pattern="[6-9][0-9]{9}"
          placeholder="10-digit mobile"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/5 transition-all"
        />
      </div>

      <div>
        <label htmlFor="enq-email" className="block text-sm font-medium text-ink mb-1.5">
          Email <span className="text-ink/40 text-xs font-normal">(optional)</span>
        </label>
        <input
          id="enq-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/5 transition-all"
        />
      </div>

      <div>
        <label htmlFor="enq-message" className="block text-sm font-medium text-ink mb-1.5">
          Message <span className="text-ink/40 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="enq-message"
          name="message"
          rows={3}
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/5 transition-all resize-none"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-ink text-white py-3 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? 'Sending…' : 'Request a callback'}
      </button>
    </form>
  );
}

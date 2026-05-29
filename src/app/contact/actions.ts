'use server';

import { createLead } from '@/lib/data/repo';

export interface ContactFormState {
  success: boolean;
  error?: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const phone = (formData.get('phone') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const message = (formData.get('message') as string | null)?.trim() ?? '';

  if (!name || name.length < 2) {
    return { success: false, error: 'Please enter your full name.' };
  }

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  try {
    createLead({
      name,
      phone,
      email: email || null,
      message: message || null,
      sourceChannel: 'contact',
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

'use server';

import { createLead } from '@/lib/data/repo';

export interface EnquiryFormState {
  success: boolean;
  error?: string;
}

export async function submitEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const phone = (formData.get('phone') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const message = (formData.get('message') as string | null)?.trim() ?? '';
  const propertySlug = (formData.get('propertySlug') as string | null)?.trim() ?? '';

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
      propertySlug: propertySlug || null,
      sourceChannel: 'enquiry_form',
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

'use server';

import { estimateValuation, createLead } from '@/lib/data/repo';

// ─── Estimate action ──────────────────────────────────────────────────────────

export interface EstimateState {
  status: 'idle' | 'success' | 'error';
  low?: number;
  high?: number;
  basis?: string;
  localitySlug?: string;
  areaSqft?: number;
  bhk?: number;
  propertyType?: string;
  error?: string;
}

export async function estimateAction(
  _prevState: EstimateState,
  formData: FormData,
): Promise<EstimateState> {
  const localitySlug = (formData.get('localitySlug') as string | null)?.trim() ?? '';
  const areaSqftRaw = formData.get('areaSqft') as string | null;
  const bhkRaw = formData.get('bhk') as string | null;
  const propertyType = (formData.get('propertyType') as string | null)?.trim() ?? '';

  if (!localitySlug) {
    return { status: 'error', error: 'Please select a locality.' };
  }

  const areaSqft = areaSqftRaw ? Number(areaSqftRaw) : NaN;
  if (!areaSqft || areaSqft <= 0 || areaSqft > 100000) {
    return { status: 'error', error: 'Please enter a valid area (1–100,000 sq ft).' };
  }

  const bhk = bhkRaw ? Number(bhkRaw) || undefined : undefined;

  try {
    const result = estimateValuation({ localitySlug, areaSqft, bhk, type: propertyType });
    return {
      status: 'success',
      low: result.low,
      high: result.high,
      basis: result.basis,
      localitySlug,
      areaSqft,
      bhk,
      propertyType,
    };
  } catch {
    return { status: 'error', error: 'Estimation failed. Please try again.' };
  }
}

// ─── Lead action ──────────────────────────────────────────────────────────────

export interface ValuationLeadState {
  status: 'idle' | 'success' | 'error';
  error?: string;
}

export async function valuationLeadAction(
  _prevState: ValuationLeadState,
  formData: FormData,
): Promise<ValuationLeadState> {
  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const phone = (formData.get('phone') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const message = (formData.get('leadMessage') as string | null)?.trim() ?? '';

  if (!name || name.length < 2) {
    return { status: 'error', error: 'Please enter your full name.' };
  }
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return { status: 'error', error: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  try {
    createLead({
      name,
      phone,
      email: email || null,
      message: message || null,
      sourceChannel: 'valuation',
    });
    return { status: 'success' };
  } catch {
    return { status: 'error', error: 'Something went wrong. Please try again.' };
  }
}

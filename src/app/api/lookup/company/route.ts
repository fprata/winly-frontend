import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Validates a Portuguese NIF
 */
export function validateNIF(nif: string): boolean {
  if (!/^\d{9}$/.test(nif)) return false;
  
  const firstDigits = ['1', '2', '3', '5', '6', '8', '9'];
  if (!firstDigits.includes(nif[0]) && !['45', '70', '71', '72', '77', '79'].includes(nif.substring(0, 2))) return false;

  const checkDigit = parseInt(nif[8]);
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(nif[i]) * (9 - i);
  }
  
  const remainder = sum % 11;
  const calculatedCheckDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return checkDigit === calculatedCheckDigit;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vatId = searchParams.get('vatId');

  if (!vatId) {
    return NextResponse.json({ error: 'VAT ID is required' }, { status: 400 });
  }

  // Basic validation for PT NIFs (common case)
  const isPT = vatId.length === 9 && /^\d+$/.test(vatId);
  let isValid = true;
  if (isPT) {
    isValid = validateNIF(vatId);
  }

  const supabase = await createClient();

  // Lookup in our intelligence database
  const { data, error } = await supabase
    .from('intel_competitors')
    .select('name, persona_name, total_wins, win_rate_pct, total_revenue')
    .eq('vat_id', vatId)
    .maybeSingle();

  if (error) {
    console.error('Lookup error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({
    valid: isValid,
    found: !!data,
    company: data ? {
      name: data.name,
      persona: data.persona_name,
      stats: {
        wins: data.total_wins,
        winRate: data.win_rate_pct,
        revenue: data.total_revenue
      }
    } : null
  });
}

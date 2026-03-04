'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { onboardingSchema } from '@/lib/validations'
import { z } from 'zod'

const profileUpdateSchema = onboardingSchema.extend({
  email: z.string().email('Invalid email address'),
  id: z.string().uuid(),
})

export type ProfileState = {
  error?: string | null
  success?: boolean
  message?: string | null
  errors?: Record<string, string[]> | null
}

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const rawData = {
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
    services: formData.get('services'),
    tech_stack: formData.get('tech_stack'),
    minBudget: formData.get('minBudget') || null,
    maxBudget: formData.get('maxBudget') || null,
    cpv_codes: formData.get('cpv_codes'),
    major_competitors: formData.get('major_competitors'),
    vat_id: formData.get('vat_id'),
  }

  const validatedFields = z.object({
      id: z.string().uuid(),
      name: z.string().min(2),
      email: z.string().email(),
      services: z.string().min(10),
      tech_stack: z.string().optional().nullable(),
      minBudget: z.coerce.number().nullable().optional(),
      maxBudget: z.coerce.number().nullable().optional(),
      cpv_codes: z.string().optional().nullable(),
      major_competitors: z.string().optional().nullable(),
      vat_id: z.string().optional().nullable(),
  }).safeParse(rawData)

  if (!validatedFields.success) {
    console.error("Profile validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: 'Invalid form data. Please check the fields.',
    }
  }

  const { id, name, email, services, tech_stack, minBudget, maxBudget, cpv_codes, major_competitors: majorCompetitorsRaw, vat_id } = validatedFields.data
  const majorCompetitors = majorCompetitorsRaw ? JSON.parse(majorCompetitorsRaw) : []

  const { error } = await supabase
    .from('clients')
    .update({ 
        name,
        email,
        services,
        tech_stack: tech_stack,
        min_budget: minBudget,
        max_budget: maxBudget,
        cpv_codes,
        major_competitors: majorCompetitors,
        vat_id: vat_id
    })
    .eq('id', id)

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath('/profile')
  return {
    success: true,
    message: 'Profile updated successfully',
  }
}

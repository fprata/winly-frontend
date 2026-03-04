'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { onboardingSchema } from '@/lib/validations'

export type OnboardingState = {
  error?: string | null
  success?: boolean
  message?: string | null
  errors?: Record<string, string[]> | null
}

export async function updateProfile(prevState: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const rawData = {
    companyName: formData.get('companyName'),
    services: formData.get('services'),
    techStack: formData.get('techStack'),
    minBudget: formData.get('minBudget') || null,
    maxBudget: formData.get('maxBudget') || null,
    cpv_codes: formData.get('cpv_codes'),
    major_competitors: formData.get('major_competitors'),
  }

  const validatedFields = onboardingSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: 'Invalid form data',
    }
  }

  const { companyName, services, techStack, minBudget, maxBudget, cpv_codes, major_competitors: majorCompetitorsRaw } = validatedFields.data
  const majorCompetitors = majorCompetitorsRaw ? JSON.parse(majorCompetitorsRaw) : []

  // Upsert based on email
  const { error } = await supabase
    .from('clients')
    .upsert({ 
        name: companyName,
        email: user.email,
        services: services,
        tech_stack: techStack,
        min_budget: minBudget,
        max_budget: maxBudget,
        cpv_codes: cpv_codes,
        major_competitors: majorCompetitors
    }, { onConflict: 'email' })

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

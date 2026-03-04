'use server'

import { createClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/get-url'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type ForgotPasswordState = {
  error?: string | null
  success?: boolean
  message?: string | null
  errors?: Record<string, string[]> | null
}

export async function forgotPassword(prevState: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const validatedFields = forgotPasswordSchema.safeParse({ email })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: 'Invalid form data',
    }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}auth/callback?next=/update-password`,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    message: 'Check your email for a password reset link',
  }
}

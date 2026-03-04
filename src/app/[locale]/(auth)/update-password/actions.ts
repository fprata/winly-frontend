'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const updatePasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type UpdatePasswordState = {
  error?: string | null
  success?: boolean
  message?: string | null
  errors?: Record<string, string[]> | null
}

export async function updatePassword(prevState: UpdatePasswordState, formData: FormData): Promise<UpdatePasswordState> {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const validatedFields = updatePasswordSchema.safeParse({ password, confirmPassword })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: 'Invalid form data',
    }
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect('/dashboard?message=Password updated successfully')
}

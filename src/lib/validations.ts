import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AuthInput = z.infer<typeof authSchema>;

export const onboardingSchema = z.object({
  companyName: z.string().min(2, 'Company name is too short'),
  services: z.string().min(10, 'Please provide more details about your services'),
  techStack: z.string().optional(),
  minBudget: z.coerce.number().nullable().optional(),
  maxBudget: z.coerce.number().nullable().optional(),
  cpv_codes: z.string().optional(),
  major_competitors: z.string().optional(), // Will be parsed as JSON in the action if needed, or kept as string
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name is too short'),
  job_title: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

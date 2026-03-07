import ForgotPasswordForm from './ForgotPasswordForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Forgot Password | Winly AI",
  description: "Reset your Winly AI account password.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
      <ForgotPasswordForm />
    </div>
  )
}

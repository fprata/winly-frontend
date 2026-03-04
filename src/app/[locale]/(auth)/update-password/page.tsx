import UpdatePasswordForm from './UpdatePasswordForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Update Password | Winly AI",
  description: "Update your Winly AI account password.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <UpdatePasswordForm />
    </div>
  )
}

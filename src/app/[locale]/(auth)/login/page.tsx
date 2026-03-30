import LoginForm from './LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign In | Winly Procurement Platform",
  description: "Sign in to access your Winly procurement intelligence dashboard. Monitor TED & BASE tenders, view AI-matched opportunities, and track your bidding pipeline.",
  robots: {
    index: false,
    follow: true,
  },
}

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
      <LoginForm />
    </div>
  )
}

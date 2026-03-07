import { OnboardingForm } from '@/components/OnboardingForm'

export default function OnboardingPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 max-w-2xl mx-auto my-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-800">Complete your profile</h2>
        <p className="text-zinc-500">Tell us about your business to get matched with the right tenders.</p>
      </div>

      <OnboardingForm />
    </div>
  )
}

import { OnboardingForm } from '@/components/OnboardingForm'

export default function OnboardingPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto my-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Complete your profile</h2>
        <p className="text-slate-500">Tell us about your business to get matched with the right tenders.</p>
      </div>

      <OnboardingForm />
    </div>
  )
}

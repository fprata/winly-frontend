import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions for using the Winly procurement intelligence platform.',
}

export default function TermsPage() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm">
          <h1 className="text-3xl font-black mb-2">Terms and Conditions</h1>
          <p className="text-zinc-500 mb-8">Last updated: January 5, 2026</p>

          <div className="prose prose-slate max-w-none">
            <h3>1. Introduction</h3>
            <p>
              Welcome to Winly. By accessing our website and using our services, you agree to be bound by these Terms and Conditions.
            </p>

            <h3>2. Service Description</h3>
            <p>
              Winly provides a public procurement intelligence platform that aggregates data from public sources (such as TED and BASE) and uses artificial intelligence to provide analysis, matching, and insights.
            </p>

            <h3>3. User Accounts</h3>
            <p>
              To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h3>4. Subscription and Billing</h3>
            <p>
              Services are offered on a subscription basis. You agree to pay the fees associated with your chosen subscription plan. Subscriptions automatically renew unless cancelled.
            </p>

            <h3>5. Data Usage and Accuracy</h3>
            <p>
              While we strive for accuracy, our service relies on public data sources and AI predictions. We do not guarantee 100% accuracy of tender data, matching scores, or win probabilities. Decisions made based on our data are your sole responsibility.
            </p>

            <h3>6. Intellectual Property</h3>
            <p>
              The Winly platform, including its algorithms, design, and content, is the exclusive property of Winly. You retain ownership of your profile data.
            </p>

            <h3>7. Limitation of Liability</h3>
            <p>
              Winly shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service, including lost profits or missed business opportunities.
            </p>

            <h3>8. Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the new terms.
            </p>

            <h3>9. Governing Law</h3>
            <p>
              These terms are governed by the laws of Portugal and the European Union.
            </p>
            
            <div className="mt-8 pt-8 border-t border-zinc-100">
                <p className="text-sm text-zinc-500">
                    If you have any questions about these Terms, please contact us at <a href="mailto:support.winly@winly.me" className="text-blue-600 hover:underline">support.winly@winly.me</a>.
                </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

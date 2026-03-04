import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
          <p className="text-slate-500 mb-8">Last updated: January 5, 2026</p>

          <div className="prose prose-slate max-w-none">
            <h3>1. Data We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, company details, and payment information.
            </p>

            <h3>2. How We Use Your Data</h3>
            <p>
              We use your data to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve our services.</li>
                <li>Personalize your experience (e.g., tender matching algorithms).</li>
                <li>Process payments and send billing information.</li>
                <li>Send you technical notices, updates, and support messages.</li>
            </ul>

            <h3>3. Data Sharing</h3>
            <p>
              We do not sell your personal data. We may share your information with third-party vendors (such as payment processors and cloud hosting providers) who need access to perform services on our behalf.
            </p>

            <h3>4. Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your data. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
            </p>

            <h3>5. Your Rights (GDPR)</h3>
            <p>
              Under the General Data Protection Regulation (GDPR), you have the right to access, correct, delete, or restrict the processing of your personal data. You can manage most of these settings directly in your account dashboard.
            </p>

            <h3>6. Cookies</h3>
            <p>
              We use cookies to improve functionality and analyze traffic. You can control cookie preferences through your browser settings.
            </p>

            <h3>7. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@winly.ai" className="text-blue-600 hover:underline">privacy@winly.ai</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

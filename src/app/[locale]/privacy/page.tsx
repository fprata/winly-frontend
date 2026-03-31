import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Privacy Policy',
    description: 'Learn how Winly collects, uses, and protects your personal data. GDPR-compliant privacy practices.',
    alternates: {
      canonical: `https://winly.me/${locale}/privacy`,
      languages: { en: 'https://winly.me/en/privacy', pt: 'https://winly.me/pt/privacy' },
    },
  }
}

export default function PrivacyPage() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm">
          <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
          <p className="text-zinc-500 mb-8">Last updated: March 31, 2026</p>

          <div className="prose prose-slate max-w-none">
            <h3>1. Introduction</h3>
            <p>
              Winly (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a procurement intelligence platform operated from Lisbon, Portugal (Avenida da Liberdade, 110, 1250-146 Lisboa). We are the data controller responsible for your personal data under the General Data Protection Regulation (GDPR) and applicable Portuguese data protection law.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, share, and protect your personal data when you use our website at winly.me, our web application, and any related services (collectively, the &quot;Service&quot;). By using the Service, you acknowledge that you have read and understood this policy.
            </p>

            <h3>2. Data We Collect</h3>
            <p>We collect the following categories of personal data:</p>
            <p><strong>Account Data</strong> — Information you provide when registering: your name, email address, company name, and VAT/NIF number. This data is required to create and maintain your account.</p>
            <p><strong>Company Profile Data</strong> — Information you provide to configure your procurement profile: CPV codes (Common Procurement Vocabulary), target geographic regions, budget range, and business sector. This data powers our tender matching algorithms.</p>
            <p><strong>Usage Data</strong> — Information collected automatically as you use the Service: pages visited, features used, tender searches performed, timestamps, browser type, device type, and IP address.</p>
            <p><strong>Payment Data</strong> — Billing information processed through our payment provider, Lemon Squeezy. Winly does not store credit card numbers, debit card numbers, or other payment card details on its servers. We retain only transaction references, subscription status, and invoicing data.</p>
            <p><strong>AI Analysis Data</strong> — Tender documents you upload or submit for AI-powered analysis. These documents are processed to extract structured information and risk assessments. Documents are not stored long-term (see Section 7 on data retention).</p>
            <p><strong>Cookies &amp; Tracking Data</strong> — We use essential cookies for authentication sessions and optional analytics cookies. See Section 9 for details.</p>

            <h3>3. Legal Basis for Processing (GDPR Article 6)</h3>
            <p>We process your personal data under the following legal bases:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Contract performance (Art. 6(1)(b))</strong> — Processing your account data, company profile, and tender matching is necessary to deliver the Service you have subscribed to.</li>
              <li><strong>Legitimate interest (Art. 6(1)(f))</strong> — We use usage data for analytics, product improvement, platform security, and fraud prevention. Our legitimate interest does not override your fundamental rights; you may object at any time (see Section 8).</li>
              <li><strong>Consent (Art. 6(1)(a))</strong> — We rely on your explicit consent for marketing emails and the use of analytics cookies. You may withdraw consent at any time without affecting the lawfulness of prior processing.</li>
              <li><strong>Legal obligation (Art. 6(1)(c))</strong> — We retain invoicing and transaction records as required by Portuguese tax law and EU VAT regulations.</li>
            </ul>

            <h3>4. How We Use Your Data</h3>
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Provide and operate the Service</strong> — Account management, authentication, and access to platform features.</li>
              <li><strong>Personalize tender matching</strong> — Using your company profile (CPV codes, regions, budget, sector) to surface relevant public procurement opportunities.</li>
              <li><strong>Process payments</strong> — Managing subscriptions, generating invoices, and handling billing through Lemon Squeezy.</li>
              <li><strong>Communicate with you</strong> — Sending transactional emails (account confirmations, password resets, tender alerts, subscription updates) and, with your consent, marketing communications.</li>
              <li><strong>Analyze and improve the platform</strong> — Understanding how the Service is used, identifying bugs, and improving features through aggregated analytics.</li>
              <li><strong>Ensure security</strong> — Detecting and preventing unauthorized access, abuse, and fraudulent activity.</li>
              <li><strong>Process tender documents</strong> — Using AI models to analyze documents you submit, extracting structured data and risk assessments to help you evaluate procurement opportunities.</li>
            </ul>

            <h3>5. Data Sharing &amp; Sub-Processors</h3>
            <p>
              <strong>We never sell your personal data.</strong> We share data only with the third-party sub-processors listed below, strictly for the purposes described, and under data processing agreements that comply with GDPR requirements.
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-2 pr-4 font-semibold">Sub-Processor</th>
                  <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                  <th className="text-left py-2 font-semibold">Data Accessed</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 pr-4">Supabase (EU region)</td>
                  <td className="py-2 pr-4">Database hosting, user authentication</td>
                  <td className="py-2">Account data, company profile, usage metadata</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 pr-4">Google Cloud Platform (EU region)</td>
                  <td className="py-2 pr-4">Backend processing, data analytics (BigQuery), AI analysis (Vertex AI / Gemini)</td>
                  <td className="py-2">Tender data, company profile, uploaded documents</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 pr-4">Vercel (global CDN, EU processing)</td>
                  <td className="py-2 pr-4">Frontend hosting and content delivery</td>
                  <td className="py-2">IP address, request metadata</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 pr-4">Lemon Squeezy</td>
                  <td className="py-2 pr-4">Payment processing, subscription management</td>
                  <td className="py-2">Name, email, billing address, payment card details</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 pr-4">PostHog (US cloud)</td>
                  <td className="py-2 pr-4">Product analytics (privacy-friendly configuration, identified-only persons)</td>
                  <td className="py-2">Usage data, anonymized interaction events</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Resend</td>
                  <td className="py-2 pr-4">Transactional email delivery</td>
                  <td className="py-2">Email address, name</td>
                </tr>
              </tbody>
            </table>
            <p>
              We may also disclose personal data if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of Winly, our users, or the public.
            </p>

            <h3>6. International Data Transfers</h3>
            <p>
              The majority of your personal data is processed within the European Union (EU) and European Economic Area (EEA). Our primary infrastructure providers — Supabase and Google Cloud Platform — operate in EU regions.
            </p>
            <p>
              Where data is transferred outside the EEA, we ensure appropriate safeguards are in place:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>PostHog</strong> — Hosted in the United States. Transfers are protected by Standard Contractual Clauses (SCCs) as approved by the European Commission, and PostHog is configured in a privacy-friendly mode with identified-only person tracking.</li>
              <li><strong>Vercel</strong> — Uses a global CDN for performance. Processing and data storage are configured to EU regions. Edge network requests may be routed through global nodes, with transfers covered by SCCs.</li>
            </ul>
            <p>
              We do not transfer your personal data to any country that lacks an adequate level of data protection without implementing appropriate safeguards under GDPR Article 46.
            </p>

            <h3>7. Data Retention</h3>
            <p>We retain your personal data only for as long as necessary to fulfill the purposes described in this policy:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account data</strong> — Retained for the duration of your account. Upon account deletion, your data is permanently erased within 30 days, except where retention is required by law.</li>
              <li><strong>Payment and invoicing records</strong> — Retained for 7 years after the transaction date, as required by Portuguese tax law (Codigo do IRS / Codigo do IRC) and EU VAT Directive.</li>
              <li><strong>Usage and analytics data</strong> — Retained for 12 months from the date of collection, then automatically deleted or anonymized.</li>
              <li><strong>AI analysis results</strong> — Processed tender documents and their analysis results are retained for 90 days to allow you to access your results, then permanently deleted.</li>
            </ul>

            <h3>8. Your Rights Under GDPR</h3>
            <p>As a data subject, you have the following rights under the GDPR:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Right of access (Art. 15)</strong> — You can request a copy of the personal data we hold about you.</li>
              <li><strong>Right to rectification (Art. 16)</strong> — You can request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to erasure (Art. 17)</strong> — You can request deletion of your personal data (&quot;right to be forgotten&quot;), subject to legal retention obligations.</li>
              <li><strong>Right to restriction (Art. 18)</strong> — You can request that we restrict the processing of your data in certain circumstances.</li>
              <li><strong>Right to data portability (Art. 20)</strong> — You can request your data in a structured, commonly used, machine-readable format.</li>
              <li><strong>Right to object (Art. 21)</strong> — You can object to processing based on legitimate interest, including profiling.</li>
              <li><strong>Right to withdraw consent</strong> — Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.</li>
            </ul>
            <p>
              <strong>How to exercise your rights:</strong> You can manage most data preferences directly in your account settings. For formal requests, contact our Data Protection Officer at <a href="mailto:privacy@winly.me" className="text-blue-600 hover:underline">privacy@winly.me</a>. We will respond to your request within 30 days. If your request is complex or we receive a high volume of requests, we may extend this period by an additional 60 days, and we will notify you of such an extension.
            </p>

            <h3>9. Cookies</h3>
            <p>We use the following categories of cookies:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Essential cookies</strong> — Required for the Service to function. These include authentication session cookies managed by Supabase. They cannot be disabled.</li>
              <li><strong>Analytics cookies</strong> — Used by PostHog to understand how you interact with the Service. These are set only with your consent and can be disabled at any time.</li>
            </ul>
            <p>
              For a complete list of cookies, their purposes, and duration, please see our <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>.
            </p>

            <h3>10. Children&apos;s Privacy</h3>
            <p>
              The Service is designed for business professionals and is not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If we become aware that we have collected personal data from a person under 18, we will take steps to delete that data promptly. If you believe a child has provided us with personal data, please contact us at <a href="mailto:privacy@winly.me" className="text-blue-600 hover:underline">privacy@winly.me</a>.
            </p>

            <h3>11. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by email at least 30 days before the changes take effect and update the &quot;Last updated&quot; date at the top of this page. We encourage you to review this policy periodically.
            </p>

            <h3>12. Contact &amp; Complaints</h3>
            <p>
              If you have questions about this Privacy Policy or how we handle your personal data, please contact us:
            </p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>General support:</strong> <a href="mailto:support.winly@winly.me" className="text-blue-600 hover:underline">support.winly@winly.me</a></li>
              <li><strong>Data Protection Officer:</strong> <a href="mailto:privacy@winly.me" className="text-blue-600 hover:underline">privacy@winly.me</a></li>
              <li><strong>Address:</strong> Avenida da Liberdade, 110, 1250-146 Lisboa, Portugal</li>
            </ul>
            <p>
              If you believe that our processing of your personal data infringes the GDPR, you have the right to lodge a complaint with a supervisory authority. In Portugal, the competent authority is:
            </p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>CNPD</strong> — Comissao Nacional de Protecao de Dados</li>
              <li>Rua de Sao Bento 148, 1200-821 Lisboa, Portugal</li>
              <li><a href="https://www.cnpd.pt" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnpd.pt</a></li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

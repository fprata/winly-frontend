import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Cookie Policy',
    description: 'Learn about the cookies used by Winly and how to manage your preferences.',
    alternates: {
      canonical: `https://winly.me/${locale}/cookies`,
      languages: { en: 'https://winly.me/en/cookies', pt: 'https://winly.me/pt/cookies' },
    },
  }
}

export default function CookiePolicyPage() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm">
          <h1 className="text-3xl font-black mb-2">Cookie Policy</h1>
          <p className="text-zinc-500 mb-8">Last updated: March 31, 2026</p>

          <div className="prose prose-slate max-w-none">
            <h3>1. What Are Cookies</h3>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you signed in, and understand how you interact with the site. Cookies may be set by the website you are visiting (first-party cookies) or by third-party services embedded in the page.
            </p>

            <h3>2. Cookies We Use</h3>
            <p>
              The table below lists the cookies used on Winly, their purpose, and how long they persist.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-3 pr-4 font-semibold text-zinc-700">Cookie Name</th>
                    <th className="text-left py-3 pr-4 font-semibold text-zinc-700">Provider</th>
                    <th className="text-left py-3 pr-4 font-semibold text-zinc-700">Purpose</th>
                    <th className="text-left py-3 pr-4 font-semibold text-zinc-700">Duration</th>
                    <th className="text-left py-3 font-semibold text-zinc-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="py-3 pr-4 font-mono text-xs">sb-*</td>
                    <td className="py-3 pr-4">Supabase</td>
                    <td className="py-3 pr-4">Authentication session cookies that keep you signed in</td>
                    <td className="py-3 pr-4">Session</td>
                    <td className="py-3"><span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded text-xs font-medium">Essential</span></td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="py-3 pr-4 font-mono text-xs">NEXT_LOCALE</td>
                    <td className="py-3 pr-4">Winly</td>
                    <td className="py-3 pr-4">Stores your preferred language setting</td>
                    <td className="py-3 pr-4">1 year</td>
                    <td className="py-3"><span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded text-xs font-medium">Essential</span></td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="py-3 pr-4 font-mono text-xs">ph_*</td>
                    <td className="py-3 pr-4">PostHog</td>
                    <td className="py-3 pr-4">Analytics, page views, and feature usage tracking</td>
                    <td className="py-3 pr-4">1 year</td>
                    <td className="py-3"><span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">Analytics</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-zinc-500 mt-2">
              Analytics cookies are only set if you give consent via our cookie banner.
            </p>

            <h3>3. How to Control Cookies</h3>
            <p>
              You can manage your cookie preferences in the following ways:
            </p>
            <ul>
              <li><strong>Cookie consent banner</strong> — When you first visit Winly, a banner lets you accept all cookies or limit to essential cookies only.</li>
              <li><strong>Browser settings</strong> — Most browsers allow you to block or delete cookies. See your browser&apos;s help pages for instructions:
                <ul>
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                </ul>
              </li>
            </ul>
            <p>
              Please note that blocking essential cookies may prevent parts of the site from functioning correctly.
            </p>

            <h3>4. Changes to This Policy</h3>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we do, we will revise the &quot;Last updated&quot; date at the top of this page.
            </p>

            <h3>5. Contact</h3>
            <div className="mt-8 pt-8 border-t border-zinc-100">
              <p className="text-sm text-zinc-500">
                If you have any questions about our use of cookies, please contact us at <a href="mailto:support.winly@winly.me" className="text-blue-600 hover:underline">support.winly@winly.me</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

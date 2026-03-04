import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CheckCircle, Shield, Award, Users, Target } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: "About Winly AI | Democratizing EU Public Procurement Access",
  description: "Learn how Winly AI is leveling the playing field for SMEs in the €2T+ EU public procurement market. AI-powered intelligence platform combining TED & BASE data.",
  openGraph: {
    title: "About Winly AI | Our Mission to Democratize Procurement",
    description: "Discover how we're helping SMEs compete fairly in public procurement with AI-powered tender matching and competitive intelligence.",
  },
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6">
            {t('heroTitle')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">{t('heroHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Mission Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
             <h2 className="text-3xl font-bold mb-6">{t('missionTitle')}</h2>
             <p className="text-gray-600 text-lg mb-6 leading-relaxed">
               {t('missionDesc1')}
             </p>
             <p className="text-gray-600 text-lg leading-relaxed">
               {t('missionDesc2')}
             </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Target className="text-blue-600 mb-4" size={32} />
                <h3 className="font-bold text-xl mb-2">{t('precisionTitle')}</h3>
                <p className="text-gray-500 text-sm">{t('precisionDesc')}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Shield className="text-blue-600 mb-4" size={32} />
                <h3 className="font-bold text-xl mb-2">{t('transparencyTitle')}</h3>
                <p className="text-gray-500 text-sm">{t('transparencyDesc')}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Award className="text-blue-600 mb-4" size={32} />
                <h3 className="font-bold text-xl mb-2">{t('excellenceTitle')}</h3>
                <p className="text-gray-500 text-sm">{t('excellenceDesc')}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Users className="text-blue-600 mb-4" size={32} />
                <h3 className="font-bold text-xl mb-2">{t('communityTitle')}</h3>
                <p className="text-gray-500 text-sm">{t('communityDesc')}</p>
             </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-3xl font-bold mb-12">{t('teamTitle')}</h2>
           <p className="text-gray-500 max-w-2xl mx-auto mb-8">
             {t('teamDesc')}
           </p>
        </div>

      </main>

      <Footer />
    </div>
  )
}

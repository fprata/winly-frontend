import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Mail, MapPin, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
           {/* Contact Info */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-8">{t('infoTitle')}</h2>
              
              <div className="space-y-8">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                       <Mail size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-slate-900">{t('emailLabel')}</h3>
                       <p className="text-slate-500 mb-1">{t('emailDesc')}</p>
                       <a href="mailto:contact@winly.ai" className="text-blue-600 font-medium hover:underline">contact@winly.ai</a>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                       <Phone size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-slate-900">{t('salesLabel')}</h3>
                       <p className="text-slate-500 mb-1">{t('salesDesc')}</p>
                       <a href="tel:+351210000000" className="text-blue-600 font-medium hover:underline">+351 210 000 000</a>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                       <MapPin size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-slate-900">{t('addressLabel')}</h3>
                       <p className="text-slate-500 whitespace-pre-line">
                         {t('addressDesc')}
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Contact Form */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{t('formTitle')}</h2>
              <form className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('nameLabel')}</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder={t('namePlaceholder')} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder={t('emailPlaceholder')} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('messageLabel')}</label>
                    <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder={t('messagePlaceholder')} />
                 </div>
                 <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    {t('sendButton')}
                 </button>
              </form>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Mail, MapPin, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { ContactForm } from '@/components/ContactForm'

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
           {/* Contact Info */}
           <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-8">{t('infoTitle')}</h2>
              
              <div className="space-y-8">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                       <Mail size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-zinc-900">{t('emailLabel')}</h3>
                       <p className="text-zinc-500 mb-1">{t('emailDesc')}</p>
                       <a href="mailto:contact@winly.me" className="text-blue-600 font-medium hover:underline">contact@winly.me</a>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                       <Phone size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-zinc-900">{t('salesLabel')}</h3>
                       <p className="text-zinc-500 mb-1">{t('salesDesc')}</p>
                       <a href="tel:+351210000000" className="text-blue-600 font-medium hover:underline">+351 210 000 000</a>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                       <MapPin size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-zinc-900">{t('addressLabel')}</h3>
                       <p className="text-zinc-500 whitespace-pre-line">
                         {t('addressDesc')}
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Contact Form */}
           <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{t('formTitle')}</h2>
              <ContactForm />
           </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

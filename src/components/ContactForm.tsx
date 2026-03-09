'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error('failed');
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20';
  const isBusy = status === 'sending' || status === 'sent';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-zinc-700 mb-2">{t('nameLabel')}</label>
        <input
          type="text"
          required
          maxLength={100}
          className={inputClass}
          placeholder={t('namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isBusy}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-zinc-700 mb-2">Email</label>
        <input
          type="email"
          required
          maxLength={254}
          className={inputClass}
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isBusy}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-zinc-700 mb-2">{t('messageLabel')}</label>
        <textarea
          rows={4}
          required
          maxLength={2000}
          className={inputClass}
          placeholder={t('messagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isBusy}
        />
      </div>

      {status === 'sent' && (
        <p className="text-sm text-emerald-600 font-medium">{t('sent')}</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600 font-medium">{t('sendError')}</p>
      )}

      <button
        type="submit"
        disabled={isBusy}
        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? t('sending') : t('sendButton')}
      </button>
    </form>
  );
}

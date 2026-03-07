import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import { getTranslations } from 'next-intl/server';
import { ProfileForm } from '@/components/ProfileForm';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const t = await getTranslations('profile');
  const supabase = await createClient();

  const { user } = await getServerUser(supabase);
  if (!user) redirect('/login');

  const db = await getDataClient(supabase);

  const { data: profile } = await db
    .from('clients')
    .select('*')
    .eq('email', user.email)
    .single();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{t('title')}</h1>
        <p className="text-zinc-500">{t('subtitle')}</p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}

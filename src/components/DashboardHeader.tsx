import Link from "next/link";
import { Bell, Globe } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from 'next-intl/server';
import { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  user: User;
  signOutAction: () => Promise<void>;
}

export async function DashboardHeader({ user, signOutAction }: DashboardHeaderProps) {
  const supabase = await createClient();
  const t = await getTranslations('common');

  // Fetch Client Profile
  const { data: profile } = await supabase
    .from('clients')
    .select('id, name, tier, email')
    .eq('email', user.email)
    .single();

  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'WA';

  const tier = profile?.tier || 'Free';

  // Fetch Match Count
  let matchCount = 0;
  if (profile?.id) {
    const { count } = await supabase
      .from('tender_matches')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', profile.id);

    matchCount = count || 0;
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span className="text-xs font-medium text-gray-500">{t('systemOperational')}</span>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        <Link href="/matches" className="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
          <Bell size={18} />
          {matchCount > 0 && (
            <span className="absolute top-1 right-1 bg-teal-600 ring-2 ring-white text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {matchCount > 99 ? '99+' : matchCount}
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-gray-200"></div>

        <UserMenu
          initials={initials}
          tier={tier}
          email={user.email!}
          signOutAction={signOutAction}
        />
      </div>
    </header>
  );
}

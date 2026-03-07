"use client";

import { Link, usePathname } from '@/navigation'
import { LayoutDashboard, Star, User, Search, TrendingUp, Building2, Trophy, LogOut, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslations } from 'next-intl';

function SidebarLink({
  href,
  icon: Icon,
  children,
  onClick
}: {
  href: string;
  icon: any;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={twMerge(
        clsx(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 text-sm",
          isActive
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900"
        )
      )}
    >
      <Icon
        size={16}
        className={twMerge(clsx("transition-colors shrink-0", isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"))}
      />
      <span>{children}</span>
    </Link>
  );
}

export function Sidebar({
  signOutAction,
  mobileOpen = false,
  onCloseMobile
}: {
  signOutAction: () => Promise<void>;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const t = useTranslations('sidebar');

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <>
      <div className="px-4 py-5 border-b border-zinc-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">W</div>
          <span className="text-base font-bold text-zinc-900 tracking-tight">
            Winly<span className="text-blue-600">AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">{t('platform')}</div>
        <SidebarLink href="/dashboard" icon={LayoutDashboard} onClick={handleLinkClick}>
          {t('dashboard')}
        </SidebarLink>
        <SidebarLink href="/explorer" icon={Search} onClick={handleLinkClick}>
          {t('explorer')}
        </SidebarLink>
        <SidebarLink href="/matches" icon={Star} onClick={handleLinkClick}>
          {t('matches')}
        </SidebarLink>

        <div className="px-3 py-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5 mt-5">{t('intelligence')}</div>
        <SidebarLink href="/intelligence" icon={TrendingUp} onClick={handleLinkClick}>
          {t('marketOverview')}
        </SidebarLink>
        <SidebarLink href="/intelligence/buyers" icon={Building2} onClick={handleLinkClick}>
          {t('buyerProfiles')}
        </SidebarLink>
        <SidebarLink href="/intelligence/competitors" icon={Trophy} onClick={handleLinkClick}>
          {t('competitorIntel')}
        </SidebarLink>
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-zinc-100 space-y-0.5">
        <SidebarLink href="/profile" icon={User} onClick={handleLinkClick}>
          {t('profile') || 'Profile'}
        </SidebarLink>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 font-medium rounded-lg transition-all duration-200 group w-full text-zinc-500 hover:bg-red-50 hover:text-red-600 text-sm cursor-pointer"
          >
            <LogOut size={17} className="text-zinc-400 group-hover:text-red-500 transition-colors shrink-0" />
            <span>{t('signOut') || 'Sign Out'}</span>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-60 bg-white border-r border-zinc-200 fixed h-full hidden md:flex flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40 md:hidden"
            onClick={onCloseMobile}
          />
          <aside className="w-60 bg-white border-r border-zinc-200 fixed h-full left-0 top-0 flex flex-col z-50 md:hidden animate-slide-in-right">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

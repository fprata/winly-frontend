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
          "flex items-center gap-3 px-3.5 py-2.5 font-medium rounded-lg transition-all duration-200 group text-sm",
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )
      )}
    >
      <Icon
        size={18}
        className={twMerge(clsx("transition-colors", isActive ? "text-gray-300" : "text-gray-400 group-hover:text-gray-600"))}
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
      <div className="p-5 pb-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">W</div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            WINLY<span className="text-teal-600 font-extrabold">AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto styled-scrollbar">
        <div className="px-3.5 py-2 text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">{t('platform')}</div>
        <SidebarLink href="/dashboard" icon={LayoutDashboard} onClick={handleLinkClick}>
          {t('dashboard')}
        </SidebarLink>
        <SidebarLink href="/explorer" icon={Search} onClick={handleLinkClick}>
          {t('explorer')}
        </SidebarLink>
        <SidebarLink href="/matches" icon={Star} onClick={handleLinkClick}>
          {t('matches')}
        </SidebarLink>

        <div className="px-3.5 py-2 text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1 mt-6">{t('intelligence')}</div>
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

      <div className="px-3 pb-5 pt-3 border-t border-gray-100 space-y-0.5">
        <SidebarLink href="/profile" icon={User} onClick={handleLinkClick}>
          {t('profile') || 'Profile'}
        </SidebarLink>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3.5 py-2.5 font-medium rounded-lg transition-all duration-200 group w-full text-gray-500 hover:bg-red-50 hover:text-red-600 text-sm cursor-pointer"
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>{t('signOut') || 'Sign Out'}</span>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
            onClick={onCloseMobile}
          />
          <aside className="w-64 bg-white border-r border-gray-200 fixed h-full left-0 top-0 flex flex-col z-50 md:hidden animate-slide-in-right">
            <button
              onClick={onCloseMobile}
              className="absolute top-5 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

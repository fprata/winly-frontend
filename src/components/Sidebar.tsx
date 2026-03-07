"use client";

import { Link, usePathname } from '@/navigation'
import { LayoutDashboard, Star, Search, BarChart3, Building2, Users, Settings, LogOut, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslations } from 'next-intl';

function NavItem({
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
          "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-sm mb-0.5",
          isActive
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900"
        )
      )}
    >
      <Icon size={16} className={clsx("shrink-0", isActive ? "text-blue-600" : "text-zinc-400")} />
      <span>{children}</span>
    </Link>
  );
}

function NavSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.08em] px-3 mt-5 mb-2">
      {children}
    </div>
  );
}

export function Sidebar({
  signOutAction,
  mobileOpen = false,
  onCloseMobile,
  userInitials,
  userName,
  userEmail,
}: {
  signOutAction: () => Promise<void>;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  userInitials?: string;
  userName?: string;
  userEmail?: string;
}) {
  const t = useTranslations('sidebar');

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-200">
        <Link href="/" className="block">
          <span className="text-[22px] font-extrabold text-blue-600 tracking-tight leading-none">Winly</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <NavItem href="/dashboard" icon={LayoutDashboard} onClick={handleLinkClick}>
          {t('dashboard')}
        </NavItem>
        <NavItem href="/matches" icon={Star} onClick={handleLinkClick}>
          {t('matches')}
        </NavItem>
        <NavItem href="/explorer" icon={Search} onClick={handleLinkClick}>
          {t('explorer')}
        </NavItem>

        <NavSection>{t('intelligence')}</NavSection>

        <NavItem href="/intelligence" icon={BarChart3} onClick={handleLinkClick}>
          {t('marketOverview')}
        </NavItem>
        <NavItem href="/intelligence/buyers" icon={Building2} onClick={handleLinkClick}>
          {t('buyerProfiles')}
        </NavItem>
        <NavItem href="/intelligence/competitors" icon={Users} onClick={handleLinkClick}>
          {t('competitorIntel')}
        </NavItem>

        <div className="border-t border-zinc-200 my-3" />

        <NavItem href="/profile" icon={Settings} onClick={handleLinkClick}>
          {t('profile') || 'Settings'}
        </NavItem>
      </nav>

      {/* User Section */}
      <div className="px-5 py-4 border-t border-zinc-200 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
          {userInitials || 'WA'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-zinc-900 truncate">{userName || t('myAccount')}</div>
          <div className="text-[11px] text-zinc-400 truncate">{userEmail || ''}</div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            title="Sign out"
            className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer shrink-0"
          >
            <LogOut size={15} />
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
          <aside className="w-60 bg-white border-r border-zinc-200 fixed h-full left-0 top-0 flex flex-col z-50 md:hidden">
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

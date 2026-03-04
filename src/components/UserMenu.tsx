"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useTranslations } from 'next-intl';

interface UserMenuProps {
  initials: string;
  tier: string;
  email: string;
  signOutAction: () => Promise<void>;
}

export function UserMenu({ initials, tier, email, signOutAction }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('userMenu');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 group focus:outline-none"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{t('myAccount')}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{tier} {t('planSuffix')}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-teal-600/20 group-hover:shadow-lg transition-all">
          {initials}
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('signedInAs')}</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{email}</p>
          </div>
          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-teal-600 rounded-lg transition-colors"
            >
              <User size={16} />
              {t('profileSettings')}
            </Link>
            <form action={signOutAction}>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left">
                <LogOut size={16} />
                {t('signOut')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

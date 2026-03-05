import React from "react";
import { Link } from "@/navigation";
import { ArrowUpRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  subtitleLink?: { label: string; href: string };
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, subtitleLink, icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
      <div>
        {icon && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              {icon}
            </div>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {(subtitle || subtitleLink) && (
          <div className="flex items-center gap-4 mt-1">
            {subtitle && (
              <p className="text-sm text-slate-500 max-w-xl">
                {subtitle}
              </p>
            )}
            {subtitleLink && (
              <>
                <div className="h-4 w-px bg-slate-300" />
                <Link
                  href={subtitleLink.href}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  {subtitleLink.label} <ArrowUpRight size={14} />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

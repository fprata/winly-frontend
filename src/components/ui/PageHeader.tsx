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
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              {icon}
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          {title}
        </h1>
        {(subtitle || subtitleLink) && (
          <div className="flex items-center gap-3 mt-1">
            {subtitle && (
              <p className="text-sm text-zinc-500 max-w-xl">
                {subtitle}
              </p>
            )}
            {subtitleLink && (
              <>
                {subtitle && <div className="h-3.5 w-px bg-zinc-300" />}
                <Link
                  href={subtitleLink.href}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  {subtitleLink.label} <ArrowUpRight size={13} />
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

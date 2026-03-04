import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
      <div>
        {icon && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white">
              {icon}
            </div>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

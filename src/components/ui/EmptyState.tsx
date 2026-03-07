import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.memo(function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="py-16 text-center bg-white rounded-xl border border-dashed border-zinc-300">
      <div className="w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-zinc-300">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-zinc-700 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-zinc-400 mb-4 max-w-xs mx-auto">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
});

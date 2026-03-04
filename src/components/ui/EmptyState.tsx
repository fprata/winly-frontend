import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.memo(function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
      <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-5 text-gray-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {action}
    </div>
  );
});

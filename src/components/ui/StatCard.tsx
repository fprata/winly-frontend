import React from "react";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  color?: "teal" | "navy" | "amber";
  className?: string;
}

const colorMap = {
  teal: {
    iconBg: "bg-teal-50",
    iconText: "text-teal-600",
    labelText: "text-teal-600",
    accentBorder: "border-l-teal-500",
  },
  navy: {
    iconBg: "bg-slate-50",
    iconText: "text-slate-700",
    labelText: "text-slate-700",
    accentBorder: "border-l-slate-700",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    labelText: "text-amber-600",
    accentBorder: "border-l-amber-500",
  },
};

export const StatCard = React.memo(function StatCard({
  icon,
  label,
  value,
  subtitle,
  color = "teal",
  className,
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={twMerge(
        `bg-white p-6 rounded-xl border border-gray-200 border-l-4 ${c.accentBorder} shadow-sm hover:shadow-md transition-all duration-300`,
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-9 h-9 rounded-lg ${c.iconBg} ${c.iconText} flex items-center justify-center`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-medium ${c.labelText} uppercase tracking-wider`}
        >
          {label}
        </span>
      </div>
      <h3 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
        {value}
      </h3>
      {subtitle && (
        <div className="text-sm text-gray-500">{subtitle}</div>
      )}
    </div>
  );
});

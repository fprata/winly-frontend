import React from "react";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  color?: "blue" | "green" | "amber" | "indigo" | "zinc";
  className?: string;
}

const colorMap = {
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
  },
  green: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
  },
  indigo: {
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
  },
  zinc: {
    iconBg: "bg-zinc-100",
    iconText: "text-zinc-500",
  },
};

export const StatCard = React.memo(function StatCard({
  icon,
  label,
  value,
  subtitle,
  color = "blue",
  className,
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={twMerge(
        "bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-medium text-zinc-500">{label}</span>
        <div
          className={`w-8 h-8 rounded-lg ${c.iconBg} ${c.iconText} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
      </div>
      <div className="text-[32px] font-bold text-zinc-900 tracking-tight leading-none mb-2">
        {value}
      </div>
      {subtitle && (
        <div className="text-[13px] text-zinc-500 mt-2 flex items-center gap-1">{subtitle}</div>
      )}
    </div>
  );
});

import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const colorMap = {
  blue: "bg-sky-50 border-sky-200/60 text-sky-700",
  emerald: "bg-emerald-50 border-emerald-200/60 text-emerald-700",
  purple: "bg-violet-50 border-violet-200/60 text-violet-700",
  amber: "bg-amber-50 border-amber-200/60 text-amber-700",
  rose: "bg-rose-50 border-rose-200/60 text-rose-700",
  slate: "bg-gray-50 border-gray-200/60 text-gray-600",
  indigo: "bg-indigo-50 border-indigo-200/60 text-indigo-700",
  orange: "bg-orange-50 border-orange-200/60 text-orange-700",
  teal: "bg-teal-50 border-teal-200/60 text-teal-700",
};

interface BadgeProps {
  color?: keyof typeof colorMap;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge = React.memo(function Badge({
  color = "slate",
  children,
  className,
  icon,
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border",
          colorMap[color]
        ),
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
});

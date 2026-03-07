import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const colorMap = {
  blue: "bg-blue-50 border-blue-700/10 text-blue-700",
  green: "bg-emerald-50 border-emerald-600/10 text-emerald-700",
  indigo: "bg-indigo-50 border-indigo-600/10 text-indigo-700",
  amber: "bg-amber-50 border-amber-600/10 text-amber-700",
  rose: "bg-red-50 border-red-600/10 text-red-600",
  zinc: "bg-zinc-100 border-zinc-200 text-zinc-600",
  purple: "bg-violet-50 border-violet-600/10 text-violet-700",
  teal: "bg-teal-50 border-teal-600/10 text-teal-700",
  orange: "bg-orange-50 border-orange-600/10 text-orange-700",
};

interface BadgeProps {
  color?: keyof typeof colorMap;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge = React.memo(function Badge({
  color = "zinc",
  children,
  className,
  icon,
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
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

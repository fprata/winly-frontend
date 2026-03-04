"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg hover:-translate-y-px active:translate-y-0",
  secondary:
    "bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-px",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  danger:
    "bg-red-600 text-white shadow-md hover:bg-red-700 hover:-translate-y-px",
  accent:
    "bg-teal-600 text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 hover:shadow-teal-600/30 hover:-translate-y-px",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-sm",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}

export const Button = React.memo(function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
});

"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}
        <input
          className={twMerge(
            "w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all",
            icon && "pl-9",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={twMerge(
          "w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}

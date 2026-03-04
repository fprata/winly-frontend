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
        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-0.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={twMerge(
            "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all",
            icon && "pl-11",
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
        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-0.5">
          {label}
        </label>
      )}
      <textarea
        className={twMerge(
          "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}

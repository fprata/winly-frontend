"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  label?: string;
}

export function Select({
  options,
  value,
  onChange,
  icon,
  className,
  placeholder,
  label,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder || "";

  return (
    <div ref={ref} className={twMerge("relative", className)}>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-400 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-zinc-400">{icon}</span>}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown
          size={15}
          className={`text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full max-h-64 overflow-y-auto bg-white border border-zinc-200 rounded-lg shadow-lg z-30 p-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                value === opt.value
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <span className="truncate pr-3">{opt.label}</span>
              {value === opt.value && <Check size={14} className="text-blue-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

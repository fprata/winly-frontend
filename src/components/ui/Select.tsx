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
}

export function Select({
  options,
  value,
  onChange,
  icon,
  className,
  placeholder,
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
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-all shadow-sm group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="text-gray-400 group-hover:text-teal-600 transition-colors">
              {icon}
            </span>
          )}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-full max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-1 animate-scale-in styled-scrollbar">
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
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="truncate pr-3">{opt.label}</span>
              {value === opt.value && <Check size={14} className="text-teal-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  onSearch: (query: string) => Promise<Option[]>;
  placeholder?: string;
  label: string;
  maxSelections?: number;
}

export function SearchableSelect({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search...", 
  label,
  maxSelections 
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const results = await onSearch(query);
          setOptions(results);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setOptions([]);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const toggleOption = (opt: Option) => {
    if (value.includes(opt.value)) {
      onChange(value.filter(v => v !== opt.value));
    } else {
      if (maxSelections && value.length >= maxSelections) return;
      onChange([...value, opt.value]);
    }
    setQuery(""); 
  };

  const removeValue = (val: string) => {
    onChange(value.filter(v => v !== val));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>
      
      <div className="flex flex-wrap gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl min-h-[50px] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
        {value.map(val => (
          <span key={val} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 shadow-sm">
            {val}
            <button type="button" onClick={() => removeValue(val)} className="text-zinc-400 hover:text-rose-500">
              <X size={14} />
            </button>
          </span>
        ))}
        
        <div className="relative flex-1 min-w-[120px]">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full h-full bg-transparent outline-none text-zinc-800 font-medium px-2 py-1"
            placeholder={value.length === 0 ? placeholder : ""}
          />
          {loading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-zinc-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-zinc-100 z-50 max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleOption(opt)}
                className="w-full text-left px-4 py-3 hover:bg-zinc-50 flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="font-bold text-zinc-700">{opt.label}</div>
                  {opt.subLabel && <div className="text-xs text-zinc-400">{opt.subLabel}</div>}
                </div>
                {value.includes(opt.value) && <Check size={16} className="text-blue-600" />}
              </button>
            ))
          ) : query.length > 0 ? (
             <button
                type="button"
                onClick={() => {
                    toggleOption({ value: query, label: query, subLabel: "Custom Value" });
                    setQuery("");
                }}
                className="w-full text-left px-4 py-3 hover:bg-zinc-50 flex items-center gap-2 text-blue-600 font-bold"
              >
                <span>Add "{query}"</span>
              </button>
          ) : (
            <div className="px-4 py-3 text-zinc-400 text-sm font-medium">Type to search...</div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  description: string;
  metrics: { label: string; value: string }[];
}

interface PersonaCarouselProps {
  personas: Persona[];
}

export function PersonaCarousel({ personas }: PersonaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {personas.map((p) => (
          <div 
            key={p.id} 
            className={`min-w-[340px] max-w-[340px] h-[480px] snap-center p-8 rounded-2xl border-2 ${p.color} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group bg-white flex flex-col relative overflow-hidden`}
          >
            <div className="mb-6 flex justify-between items-start">
              <div className="p-4 bg-slate-50 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
            </div>
            <h3 className={`text-2xl font-bold ${p.textColor} mb-3`}>{p.name}</h3>
            <p className="text-slate-600 font-medium mb-6 leading-relaxed flex-grow text-sm overflow-y-auto hide-scrollbar">
              {p.description}
            </p>
            <div className="space-y-3 pt-6 border-t border-slate-100 mt-auto w-full">
              {p.metrics.map((m, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                  <span className={`font-black ${p.textColor}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

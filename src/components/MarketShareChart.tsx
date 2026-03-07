"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MarketShareChartProps {
  marketSharePct: number;
}

export function MarketShareChart({ marketSharePct }: MarketShareChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ensure value is between 0 and 100
  const share = Math.min(Math.max(marketSharePct, 0), 100);
  
  const data = [
    { name: 'Share', value: share },
    { name: 'Rest', value: 100 - share }
  ];

  const COLORS = ['#3b82f6', '#f1f5f9'];

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center relative">
        <div className="w-full h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        cornerRadius={5}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            {/* Centered Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                <span className="text-3xl font-black text-zinc-900 tracking-tight">
                    {share.toFixed(1)}%
                </span>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    Global Share
                </span>
            </div>
        </div>
        <p className="text-center text-xs text-zinc-400 px-8 mt-[-20px]">
            Based on total awarded value vs total market volume in active sectors.
        </p>
    </div>
  );
}

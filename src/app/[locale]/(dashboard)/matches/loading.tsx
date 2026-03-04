import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse"></div>
            <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="h-6 w-96 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="flex gap-2">
            <div className="w-24 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="w-32 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
        <div className="md:col-span-8 h-14 bg-slate-200 rounded-[20px] animate-pulse"></div>
        <div className="md:col-span-4 h-14 bg-slate-200 rounded-[20px] animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-64 bg-white rounded-[32px] border border-slate-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

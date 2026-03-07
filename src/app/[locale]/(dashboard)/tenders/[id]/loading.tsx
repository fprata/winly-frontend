import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <div className="h-6 w-32 bg-zinc-200 rounded animate-pulse mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card Skeleton */}
          <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm overflow-hidden h-[300px] animate-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="h-64 bg-zinc-200 rounded-xl animate-pulse"></div>
             <div className="h-64 bg-zinc-200 rounded-xl animate-pulse"></div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="h-80 bg-zinc-900 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

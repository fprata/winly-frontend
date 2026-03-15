import React from 'react';

function Shimmer({ className }: { className: string }) {
  return <div className={`bg-zinc-200 animate-pulse rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Shimmer className="h-4 w-28 mb-6" />

      {/* Hero Header */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 mb-8 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <Shimmer className="w-20 h-20 rounded-3xl" />
            <div>
              <Shimmer className="h-8 w-64 mb-2" />
              <Shimmer className="h-5 w-32 rounded-full" />
            </div>
          </div>
          <div className="flex gap-6">
            <div><Shimmer className="h-3 w-16 mb-1" /><Shimmer className="h-7 w-24" /></div>
            <div><Shimmer className="h-3 w-16 mb-1" /><Shimmer className="h-7 w-20" /></div>
            <div><Shimmer className="h-3 w-16 mb-1" /><Shimmer className="h-7 w-16" /></div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 p-8">
              <Shimmer className="h-4 w-40 mb-6" />
              <div className="space-y-4">
                <Shimmer className="h-7 w-28" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 h-[380px] animate-pulse">
            <Shimmer className="h-4 w-44 mb-8" />
            <Shimmer className="h-[280px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

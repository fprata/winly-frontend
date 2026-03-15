import React from 'react';

function Shimmer({ className }: { className: string }) {
  return <div className={`bg-zinc-200 animate-pulse rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex gap-3 mb-6">
        <Shimmer className="h-9 w-48 rounded-lg" />
        <Shimmer className="h-9 flex-1 rounded-lg" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="w-8 h-8 rounded-lg" />
            </div>
            <Shimmer className="h-8 w-28 mb-1" />
            <Shimmer className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 h-[520px] animate-pulse">
          <Shimmer className="h-5 w-40 mb-5" />
          <Shimmer className="h-[200px] w-48 rounded-full mx-auto mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shimmer className="w-2 h-2 rounded-full" />
                  <Shimmer className="h-3 w-32" />
                </div>
                <Shimmer className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 h-[520px] animate-pulse">
          <Shimmer className="h-5 w-48 mb-5" />
          <div className="flex items-end gap-3 h-[400px] pt-8">
            <div className="flex-1 h-[40%] bg-zinc-200 animate-pulse rounded-t" />
            <div className="flex-1 h-[65%] bg-zinc-200 animate-pulse rounded-t" />
            <div className="flex-1 h-[50%] bg-zinc-200 animate-pulse rounded-t" />
            <div className="flex-1 h-[80%] bg-zinc-200 animate-pulse rounded-t" />
            <div className="flex-1 h-[55%] bg-zinc-200 animate-pulse rounded-t" />
            <div className="flex-1 h-[70%] bg-zinc-200 animate-pulse rounded-t" />
          </div>
        </div>
      </div>

      {/* Top Buyers */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <Shimmer className="h-5 w-36" />
          <Shimmer className="h-3 w-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-4 bg-zinc-50 rounded-lg animate-pulse">
              <Shimmer className="h-4 w-3/4 mb-3" />
              <div className="flex justify-between">
                <Shimmer className="h-4 w-16" />
                <Shimmer className="h-4 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Health */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
        <Shimmer className="h-5 w-32 mb-5" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="text-center p-4 bg-zinc-50 rounded-xl animate-pulse">
              <Shimmer className="h-3 w-20 mx-auto mb-2" />
              <Shimmer className="h-8 w-16 mx-auto mb-1" />
              <Shimmer className="h-3 w-14 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

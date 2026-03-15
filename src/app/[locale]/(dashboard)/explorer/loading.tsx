import React from 'react';

function Shimmer({ className }: { className: string }) {
  return <div className={`bg-zinc-200 animate-pulse rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="pb-16">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <Shimmer className="h-8 w-56 mb-2" />
          <Shimmer className="h-4 w-80" />
        </div>
        <Shimmer className="h-7 w-28 rounded-lg" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="w-8 h-8 rounded-lg" />
            </div>
            <Shimmer className="h-9 w-20 mb-2" />
            <Shimmer className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Section title */}
      <Shimmer className="h-5 w-28 mb-3" />

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-2 mb-4">
        <Shimmer className="h-9 w-full rounded-lg" />
      </div>

      {/* Result cards */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 animate-pulse">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Shimmer className="h-5 w-3/4 mb-2" />
                <Shimmer className="h-3 w-48 mb-3" />
                <div className="flex gap-2">
                  <Shimmer className="h-5 w-16 rounded-full" />
                  <Shimmer className="h-5 w-20 rounded-full" />
                  <Shimmer className="h-5 w-14 rounded-full" />
                </div>
              </div>
              <div className="text-right shrink-0">
                <Shimmer className="h-6 w-24 mb-1" />
                <Shimmer className="h-3 w-16 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

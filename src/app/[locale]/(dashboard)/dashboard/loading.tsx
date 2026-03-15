import React from 'react';

function Shimmer({ className }: { className: string }) {
  return <div className={`bg-zinc-200 animate-pulse rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="pb-16">
      {/* Page Header */}
      <div className="mb-10">
        <Shimmer className="h-8 w-48 mb-2" />
        <Shimmer className="h-4 w-72" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="w-8 h-8 rounded-lg" />
            </div>
            <Shimmer className="h-9 w-20 mb-2" />
            <Shimmer className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Section title */}
      <Shimmer className="h-5 w-36 mb-2" />
      <Shimmer className="h-3 w-56 mb-5" />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <Shimmer className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1">
                <Shimmer className="h-4 w-32 mb-2" />
                <Shimmer className="h-3 w-48" />
              </div>
              <Shimmer className="w-5 h-5 rounded shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';

function Shimmer({ className }: { className: string }) {
  return <div className={`bg-zinc-200 animate-pulse rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Page Header */}
      <div className="mb-7">
        <Shimmer className="h-8 w-56 mb-2" />
        <Shimmer className="h-4 w-72" />
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-9 w-72 rounded-lg" />
      </div>

      {/* Result Cards */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 animate-pulse">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Shimmer className="h-5 w-2/3 mb-2" />
                <Shimmer className="h-3 w-28 mb-4" />
                <div className="flex gap-6">
                  <div><Shimmer className="h-6 w-12 mb-1" /><Shimmer className="h-2 w-14" /></div>
                  <div><Shimmer className="h-6 w-16 mb-1" /><Shimmer className="h-2 w-12" /></div>
                  <div><Shimmer className="h-6 w-10 mb-1" /><Shimmer className="h-2 w-16" /></div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Shimmer className="h-5 w-20 rounded-full" />
                <Shimmer className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

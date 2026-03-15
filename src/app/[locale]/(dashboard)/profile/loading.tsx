import React from 'react';

function Shimmer({ className }: { className: string }) {
  return <div className={`bg-zinc-200 animate-pulse rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="pb-16">
      {/* Page Header */}
      <div className="mb-8">
        <Shimmer className="h-8 w-40 mb-2" />
        <Shimmer className="h-4 w-64" />
      </div>

      {/* Subscription Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 mb-6 animate-pulse">
        <Shimmer className="h-3 w-20 mb-3" />
        <div className="flex items-center justify-between">
          <div>
            <Shimmer className="h-5 w-32 mb-1" />
            <Shimmer className="h-3 w-56" />
          </div>
          <Shimmer className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* General Info Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 mb-6 animate-pulse">
        <Shimmer className="h-3 w-24 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Shimmer className="h-3 w-16 mb-1" /><Shimmer className="h-9 w-full rounded-lg" /></div>
          <div><Shimmer className="h-3 w-24 mb-1" /><Shimmer className="h-9 w-full rounded-lg" /></div>
          <div><Shimmer className="h-3 w-20 mb-1" /><Shimmer className="h-9 w-full rounded-lg" /></div>
          <div><Shimmer className="h-3 w-16 mb-1" /><Shimmer className="h-9 w-full rounded-lg" /></div>
        </div>
      </div>

      {/* AI Keywords Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 mb-6 animate-pulse">
        <Shimmer className="h-3 w-28 mb-4" />
        <Shimmer className="h-20 w-full rounded-lg mb-4" />
        <Shimmer className="h-9 w-full rounded-lg mb-4" />
        <Shimmer className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

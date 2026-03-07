import React from 'react';

function Shimmer({ className }: { className: string }) {
  return <div className={`bg-zinc-200 animate-pulse rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="max-w-[1100px] mx-auto pb-20">
      {/* Back link */}
      <Shimmer className="h-4 w-24 mb-4" />

      {/* Page header */}
      <div className="mb-6">
        <Shimmer className="h-8 w-3/4 mb-2" />
        <Shimmer className="h-8 w-1/2 mb-3" />
        <div className="flex flex-wrap gap-1.5">
          <Shimmer className="h-5 w-14 rounded-full" />
          <Shimmer className="h-5 w-20 rounded-full" />
          <Shimmer className="h-5 w-12 rounded-full" />
          <Shimmer className="h-5 w-24 rounded-full" />
          <Shimmer className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex gap-1 border-b border-zinc-200 mb-6">
        <Shimmer className="h-9 w-24 rounded-t-lg" />
        <Shimmer className="h-9 w-28 rounded-t-lg" />
      </div>

      {/* Overview tab content skeleton */}
      <div className="space-y-4">
        {/* Row 1: 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
            <Shimmer className="h-5 w-36 mb-5" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-4/5" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-3/5" />
            <Shimmer className="h-4 w-full" />
          </div>
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
            <Shimmer className="h-5 w-36 mb-5" />
            <Shimmer className="h-7 w-28" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-4/5" />
            <Shimmer className="h-4 w-3/5" />
          </div>
        </div>

        {/* Row 2: full-width card */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-3">
          <Shimmer className="h-5 w-40 mb-5" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
        </div>

        {/* Row 3: 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
            <Shimmer className="h-5 w-32 mb-5" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-4/5" />
            <Shimmer className="h-4 w-full" />
          </div>
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
            <Shimmer className="h-5 w-32 mb-5" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-3/5" />
            <Shimmer className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from '@/navigation';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-6">
            <SearchX size={28} className="text-zinc-400" />
          </div>

          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">
            Page not found
          </h1>

          <p className="text-zinc-500 text-lg leading-relaxed mb-8">
            The page you are looking for does not exist or has been moved.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

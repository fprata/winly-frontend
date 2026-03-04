'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="rounded-full bg-red-100 p-4 mb-4">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We encountered an error while loading your dashboard. Please try again or contact support if the issue persists.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Reload page
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 max-w-2xl w-full">
            <details className="text-left bg-red-50 p-4 rounded-lg border border-red-100">
                <summary className="text-red-700 font-medium cursor-pointer text-sm">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                    {error.message}
                    {
                        '\n'
                    }
                    {error.stack}
                </pre>
            </details>
        </div>
      )}
    </div>
  )
}

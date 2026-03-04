'use client'

import { useActionState } from 'react'
import { forgotPassword, ForgotPasswordState } from './actions'

const initialState: ForgotPasswordState = {
  error: null,
  success: false,
  message: null,
  errors: null,
}

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPassword, initialState)

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Forgot password</h1>
        <p className="text-sm text-slate-500">Enter your email to reset your password</p>
      </div>

      {state.error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {state.error}
        </div>
      )}

      {state.message && (
        <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600 border border-emerald-200">
          {state.message}
        </div>
      )}
      
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="you@example.com"
            disabled={isPending}
          />
          {state.errors?.email && (
            <p className="text-xs text-red-500 mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Sending...' : 'Send reset link'}
        </button>

        <div className="text-center">
           <a href="/login" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
             Back to login
           </a>
        </div>
      </form>
    </div>
  )
}

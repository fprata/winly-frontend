'use client'

import { useActionState } from 'react'
import { updatePassword, UpdatePasswordState } from './actions'

const initialState: UpdatePasswordState = {
  error: null,
  success: false,
  message: null,
  errors: null,
}

export default function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState)

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-zinc-200">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">W</div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">WINLY<span className="text-zinc-400 font-medium">AI</span></span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Update password</h1>
        <p className="text-sm text-zinc-500">Enter your new password below</p>
      </div>

      {state.error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700" htmlFor="password">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="••••••••"
            disabled={isPending}
          />
          {state.errors?.password && (
            <p className="text-xs text-red-500 mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="••••••••"
            disabled={isPending}
          />
          {state.errors?.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{state.errors.confirmPassword[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}

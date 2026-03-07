'use client'

import { useActionState } from 'react'
import { login, signup } from './actions'
import { AuthState } from './actions'

const initialState: AuthState = {
  error: null,
  success: false,
  message: null,
  errors: null,
}

export default function LoginForm() {
  const [loginState, loginAction, isLoginPending] = useActionState(login, initialState)
  const [signupState, signupAction, isSignupPending] = useActionState(signup, initialState)

  const state = loginState.error || loginState.errors ? loginState : signupState
  const isPending = isLoginPending || isSignupPending

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-zinc-200">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">W</div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">WINLY<span className="text-zinc-400 font-medium">AI</span></span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome back</h1>
        <p className="text-sm text-zinc-500">Sign in to your account</p>
      </div>

      {state.error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {state.error}
        </div>
      )}

      {state.message && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          {state.message}
        </div>
      )}
      
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="you@example.com"
            disabled={isPending}
          />
          {state.errors?.email && (
            <p className="text-xs text-red-500 mt-1">{state.errors.email[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700" htmlFor="password">
            Password
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

        <div className="flex justify-end">
           <a href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
             Forgot password?
           </a>
        </div>
        
        <div className="mt-2 flex flex-col gap-3">
          <button
            formAction={loginAction}
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoginPending ? 'Logging in...' : 'Log in'}
          </button>
          <button
            formAction={signupAction}
            disabled={isPending}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignupPending ? 'Signing up...' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  )
}

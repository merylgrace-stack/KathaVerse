import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useStrings } from '../i18n'

interface LoginProps {
  mode: 'signin' | 'signup'
}

export function Login({ mode }: LoginProps) {
  const t = useStrings()
  const { signIn, signUp, serverReachable, user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const isSignup = mode === 'signup'

  if (user && !isSignup) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-xl border border-brown/12 bg-paper-deep/40 p-8 text-center">
          <p className="text-[.6rem] uppercase tracking-[.24em] text-terra">
            {t.auth.signedInAs}
          </p>
          <h1 className="mt-2 font-display text-2xl">{user.name}</h1>
          <p className="mt-1 text-sm text-brown/55">{user.email}</p>
          <Link
            to={user.role === 'reviewer' || user.role === 'admin' ? '/admin' : '/library'}
            className="mt-5 inline-block rounded-full bg-brown px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-paper hover:bg-terra"
          >
            {user.role === 'reviewer' || user.role === 'admin'
              ? t.nav.editorial
              : t.nav.library}
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!email.trim() || password.length < 8) {
      setError(t.auth.required)
      return
    }

    setBusy(true)
    try {
      if (isSignup) await signUp(name.trim() || email.split('@')[0], email.trim(), password)
      else await signIn(email.trim(), password)
      navigate(next ?? '/library', { replace: true })
    } catch (caught) {
      const message =
        caught instanceof ApiError
          ? caught.message
          : isSignup
            ? t.auth.registerFailed
            : t.auth.failed
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md">
        <p className="text-[.6rem] uppercase tracking-[.26em] text-terra">
          {isSignup ? t.auth.signUp : t.auth.signIn}
        </p>
        <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
          {isSignup ? t.auth.signUpTitle : t.auth.signInTitle}
        </h1>
        <p className="mt-3 text-[.88rem] leading-relaxed text-brown/65">
          {isSignup ? t.auth.signUpBlurb : t.auth.signInBlurb}
        </p>

        {!serverReachable && (
          <p className="mt-4 rounded-md border border-terra/40 bg-terra/10 px-3 py-2 text-[.78rem] leading-relaxed text-terra">
            The account API is not reachable. Start it with <code>npm run server</code>{' '}
            (port 8787) and try again.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-4 rounded-xl border border-brown/12 bg-paper-deep/40 p-6"
        >
          {isSignup && (
            <label className="block text-[.62rem] uppercase tracking-[.16em] text-brown/55">
              {t.auth.name}
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className={inputClass}
              />
            </label>
          )}

          <label className="block text-[.62rem] uppercase tracking-[.16em] text-brown/55">
            {t.auth.email}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className={inputClass}
            />
          </label>

          <label className="block text-[.62rem] uppercase tracking-[.16em] text-brown/55">
            {t.auth.password}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={8}
              required
              className={inputClass}
            />
            <span className="mt-1 block text-[.64rem] normal-case tracking-normal text-brown/40">
              {t.auth.passwordHint}
            </span>
          </label>

          {error && (
            <p className="rounded-md border border-terra/40 bg-terra/10 px-3 py-2 text-[.8rem] text-terra">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-terra px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-paper transition-colors hover:bg-brown disabled:opacity-50"
          >
            {busy ? t.auth.working : isSignup ? t.auth.signUp : t.auth.signIn}
          </button>
        </form>

        <p className="mt-5 text-center text-[.8rem] text-brown/55">
          {isSignup ? t.auth.haveAccount : t.auth.noAccount}{' '}
          <Link
            to={isSignup ? '/login' : '/register'}
            className="text-terra underline underline-offset-2"
          >
            {isSignup ? t.auth.signInLink : t.auth.createOne}
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputClass =
  'mt-1.5 w-full rounded-md border border-brown/20 bg-paper px-3 py-2 text-sm normal-case tracking-normal text-brown placeholder:text-brown/35 focus:border-terra focus:outline-none'

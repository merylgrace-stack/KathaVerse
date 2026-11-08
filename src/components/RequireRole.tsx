import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import type { Role } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useStrings } from '../i18n'

interface RequireRoleProps {
  roles: Role[]
  children: ReactNode
}

/**
 * Client-side gate only. The API repeats the role check on every editorial
 * route, because hiding a link is never security.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { user, loading, hasRole } = useAuth()
  const t = useStrings()
  const location = useLocation()

  if (loading) {
    return (
      <div className="container-page py-24 text-center text-sm text-brown/50">
        {t.auth.working}
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (!hasRole(...roles)) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-xl border border-brown/12 bg-paper-deep/40 p-8 text-center">
          <p className="text-[.6rem] uppercase tracking-[.24em] text-terra">403</p>
          <h1 className="mt-2 font-display text-2xl">{t.admin.denied}</h1>
          <p className="mt-3 text-[.88rem] leading-relaxed text-brown/60">
            {t.admin.deniedBody}
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-full bg-brown px-5 py-2.5 text-[.7rem] uppercase tracking-[.14em] text-paper hover:bg-terra"
          >
            {t.nav.home}
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

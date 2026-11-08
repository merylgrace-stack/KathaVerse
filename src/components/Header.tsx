import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useLanguage } from '../lib/language'
import { useBookmarks, useProgress } from '../lib/store'
import { useStrings } from '../i18n'

export function Header() {
  const { lang, setLang } = useLanguage()
  const t = useStrings()
  const { user, isStaff, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [bookmarks] = useBookmarks()
  const [progress] = useProgress()
  const location = useLocation()

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/explore', label: t.nav.explore },
    { to: '/about', label: t.nav.about },
    { to: '/contribute', label: t.nav.contribute },
    ...(isStaff ? [{ to: '/admin', label: t.nav.editorial }] : []),
  ]

  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-brown/10 bg-paper/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-baseline gap-0.5">
          <span className="font-display text-2xl tracking-tight text-brown">Katha</span>
          <span className="font-display text-2xl tracking-tight text-terra">Verse</span>
          <span className="ml-2 hidden text-[.58rem] uppercase tracking-[.24em] text-brown/45 sm:inline">
            Kerala heritage
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative text-[.82rem] tracking-wide transition-colors ${
                  isActive ? 'text-brown' : 'text-brown/60 hover:text-brown'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-terra transition-all ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-brown/15 p-0.5 sm:flex">
            {(['en', 'ml'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-full px-2.5 py-1 text-[.68rem] tracking-wide transition-colors ${
                  lang === code ? 'bg-brown text-paper' : 'text-brown/60 hover:text-brown'
                }`}
              >
                {code === 'en' ? 'EN' : 'മലയാളം'}
              </button>
            ))}
          </div>

          <div className="relative">
            {user ? (
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                className="rounded-full border border-brown/25 px-3 py-1.5 text-[.72rem] tracking-wide text-brown transition-colors hover:bg-brown hover:text-paper"
              >
                {user.name.split(' ')[0] || user.email}
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-brown/25 px-3 py-1.5 text-[.72rem] tracking-wide text-brown transition-colors hover:bg-brown hover:text-paper"
              >
                {t.nav.signIn}
              </Link>
            )}

            {profileOpen && user && (
              <>
                <button
                  type="button"
                  aria-label="Close profile panel"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-brown/15 bg-paper p-4 shadow-[0_24px_50px_-24px_rgba(56,41,31,.55)]">
                  <p className="text-[.58rem] uppercase tracking-[.24em] text-brown/45">
                    {t.nav.account}
                  </p>
                  <p className="mt-1.5 font-display text-lg leading-tight">{user.name}</p>
                  <p className="text-[.74rem] text-brown/55">{user.email}</p>
                  <p className="mt-1 inline-flex rounded-full border border-brown/15 px-2 py-0.5 text-[.58rem] uppercase tracking-[.14em] text-terra">
                    {t.auth.role}: {user.role}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-paper-deep/70 px-2 py-2">
                      <dt className="text-[.58rem] uppercase tracking-[.16em] text-brown/50">
                        Saved
                      </dt>
                      <dd className="font-display text-lg">{bookmarks.length}</dd>
                    </div>
                    <div className="rounded-lg bg-paper-deep/70 px-2 py-2">
                      <dt className="text-[.58rem] uppercase tracking-[.16em] text-brown/50">
                        Reading
                      </dt>
                      <dd className="font-display text-lg">{progress.length}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 space-y-1.5 text-[.82rem]">
                    <Link
                      to="/library"
                      className="block rounded-md px-2 py-1.5 text-brown/75 transition-colors hover:bg-paper-deep hover:text-brown"
                    >
                      {t.nav.library}
                    </Link>
                    {isStaff && (
                      <Link
                        to="/admin"
                        className="block rounded-md px-2 py-1.5 text-brown/75 transition-colors hover:bg-paper-deep hover:text-brown"
                      >
                        {t.nav.editorial}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => void signOut()}
                      className="block w-full rounded-md px-2 py-1.5 text-left text-brown/75 transition-colors hover:bg-paper-deep hover:text-brown"
                    >
                      {t.auth.signOut}
                    </button>
                  </div>

                  <p className="mt-3 border-t border-brown/10 pt-2.5 text-[.66rem] leading-relaxed text-brown/45">
                    {t.auth.localOnly}
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={t.nav.menu}
            className="rounded-md border border-brown/20 p-2 md:hidden"
          >
            <span className="block h-px w-4 bg-brown" />
            <span className="mt-1 block h-px w-4 bg-brown" />
            <span className="mt-1 block h-px w-4 bg-brown" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-brown/10 bg-paper px-5 pb-4 pt-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block border-b border-brown/8 py-2.5 text-sm ${
                  isActive ? 'text-terra' : 'text-brown/70'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-3 flex items-center gap-2">
            {(['en', 'ml'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  lang === code
                    ? 'border-brown bg-brown text-paper'
                    : 'border-brown/20 text-brown/60'
                }`}
              >
                {code === 'en' ? t.language.en : t.language.ml}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

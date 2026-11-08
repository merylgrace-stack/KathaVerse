import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useStrings } from '../i18n'

export function Footer() {
  const t = useStrings()
  const { isStaff } = useAuth()

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/explore', label: t.nav.explore },
    { to: '/library', label: t.nav.library },
    { to: '/about', label: t.nav.about },
    { to: '/contribute', label: t.nav.contribute },
    ...(isStaff ? [{ to: '/admin', label: t.nav.editorial }] : []),
  ]

  return (
    <footer className="mt-20 border-t border-brown/12 bg-paper-deep/40">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-2xl">
            Katha<span className="text-terra">Verse</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-brown/60">
            {t.footer.tagline}
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="text-[.6rem] uppercase tracking-[.22em] text-brown/45">
            {t.footer.explore}
          </p>
          <ul className="mt-3 space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-brown/65 transition-colors hover:text-terra"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="text-[.6rem] uppercase tracking-[.22em] text-brown/45">
            {t.footer.community}
          </p>
          <p className="mt-3 leading-relaxed text-brown/60">{t.footer.communityBody}</p>
          <a
            href="mailto:community@kathaverse.in"
            className="mt-3 inline-block text-[.72rem] uppercase tracking-[.14em] text-terra"
          >
            community@kathaverse.in
          </a>
        </div>
      </div>

      <div className="border-t border-brown/10">
        <div className="container-page flex flex-col gap-2 py-5 text-[.68rem] text-brown/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} KathaVerse. {t.footer.rights}
          </p>
          <p>{t.footer.collection}</p>
        </div>
      </div>
    </footer>
  )
}

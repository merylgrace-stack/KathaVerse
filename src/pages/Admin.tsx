import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError, type AuditRecord, type ContributionRecord } from '../lib/api'
import { useAuth } from '../lib/auth'
import { formatDate } from '../lib/meta'
import { RichText } from '../lib/text'
import { useStrings } from '../i18n'

const FILTERS = ['submitted', 'approved', 'rejected', 'all'] as const
type Filter = (typeof FILTERS)[number]

function chunkBlocks(text: string, perPage = 3) {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
  if (blocks.length === 0) return [['']]
  const pages: string[][] = []
  for (let i = 0; i < blocks.length; i += perPage) pages.push(blocks.slice(i, i + perPage))
  return pages
}

function BookPreview({
  submission,
  onClose,
}: {
  submission: ContributionRecord
  onClose: () => void
}) {
  const pages = useMemo(() => chunkBlocks(submission.content, 3), [submission.content])
  const [page, setPage] = useState(0)
  const left = pages[page - 1]?.join('\n\n') ?? ''
  const right = pages[page]?.join('\n\n') ?? ''

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setPage((p) => Math.min(p + 1, pages.length - 1))
      if (e.key === 'ArrowLeft') setPage((p) => Math.max(p - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, pages.length])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper/95 backdrop-blur">
      <div className="flex items-center justify-between border-b border-brown/10 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[.58rem] uppercase tracking-[.22em] text-terra">Book preview</p>
          <p className="truncate font-display text-lg">{submission.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-brown/20 px-3 py-1.5 text-[.68rem] uppercase tracking-[.12em] text-brown/65 hover:border-brown hover:text-brown"
        >
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="book-stage mx-auto max-w-5xl">
          <div className="book-spread">
            <section className="book-page book-page--left" aria-label="Left page">
              <div className="page-body h-full">
                {page === 0 ? (
                  <div className="flex h-full flex-col justify-between">
                    <p className="text-[.58rem] uppercase tracking-[.24em] text-terra">
                      KathaVerse · Editorial preview
                    </p>
                    <div>
                      <h2 className="font-display text-3xl leading-tight">{submission.title}</h2>
                      <p className="mt-3 text-[.88rem] leading-relaxed text-brown/65">
                        {submission.description}
                      </p>
                      <p className="mt-4 text-[.68rem] uppercase tracking-[.14em] text-brown/45">
                        {submission.category} · {submission.language === 'ml' ? 'മലയാളം' : 'English'} ·{' '}
                        {submission.authorName}
                      </p>
                    </div>
                    <p className="text-[.6rem] uppercase tracking-[.2em] text-brown/35">
                      Use ← → or buttons to turn pages
                    </p>
                  </div>
                ) : left ? (
                  <div className="h-full min-h-0 overflow-y-auto">
                    <RichText text={left} />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-brown/30">—</div>
                )}
              </div>
            </section>
            <section className="book-page book-page--right" aria-label="Right page">
              <div className="page-body h-full min-h-0 overflow-y-auto">
                {page === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <p className="font-display text-2xl text-brown/40">Open the book</p>
                      <button
                        type="button"
                        onClick={() => setPage(1)}
                        className="mt-4 rounded-full bg-terra px-5 py-2.5 text-[.7rem] uppercase tracking-[.16em] text-paper hover:bg-brown"
                      >
                        Turn page →
                      </button>
                    </div>
                  </div>
                ) : (
                  <RichText text={right || '— End of preview —'} />
                )}
              </div>
            </section>
          </div>
        </div>
        <div className="mx-auto mt-5 flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="rounded-full border border-brown/20 px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-brown/70 hover:border-brown disabled:opacity-35"
          >
            ← Previous
          </button>
          <p className="text-[.64rem] uppercase tracking-[.18em] text-brown/45">
            Spread {page + 1} of {pages.length}
          </p>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}
            disabled={page >= pages.length - 1}
            className="rounded-full bg-brown px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-paper hover:bg-terra disabled:opacity-35"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export function Admin() {
  const t = useStrings()
  const { user, serverReachable } = useAuth()
  const [filter, setFilter] = useState<Filter>('submitted')
  const [queue, setQueue] = useState<ContributionRecord[]>([])
  const [tab, setTab] = useState<'queue' | 'audit'>('queue')
  const [audit, setAudit] = useState<AuditRecord[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<ContributionRecord>>({})
  const [preview, setPreview] = useState<ContributionRecord | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadQueue = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { contributions } = await api.admin.queue()
      setQueue(contributions)
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not load the queue.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'queue') void loadQueue()
  }, [tab, loadQueue])

  useEffect(() => {
    if (tab !== 'audit' || user?.role !== 'admin') return
    void api.admin
      .audit()
      .then(({ entries }) => setAudit(entries))
      .catch((caught: unknown) =>
        setError(caught instanceof ApiError ? caught.message : 'Could not load the audit log.'),
      )
  }, [tab, user?.role])

  const decide = async (contribution: ContributionRecord, decision: 'approved' | 'rejected') => {
    setBusyId(contribution.id)
    setError(null)
    try {
      const { contribution: updated } = await api.admin.review(
        contribution.id,
        decision,
        notes[contribution.id] ?? '',
      )
      setQueue((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Review failed.')
    } finally {
      setBusyId(null)
    }
  }

  const startEdit = (submission: ContributionRecord) => {
    setEditId(submission.id)
    setOpenId(submission.id)
    setEditDraft({
      title: submission.title,
      description: submission.description,
      content: submission.content,
      sources: submission.sources,
      category: submission.category,
      language: submission.language,
    })
  }

  const saveEdit = async (id: string) => {
    setBusyId(id)
    setError(null)
    try {
      const { contribution: updated } = await api.admin.updateContribution(id, editDraft)
      setQueue((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      setEditId(null)
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not save edits.')
    } finally {
      setBusyId(null)
    }
  }

  const visible = filter === 'all' ? queue : queue.filter((entry) => entry.status === filter)

  return (
    <div className="container-page pb-8 pt-12">
      {preview && <BookPreview submission={preview} onClose={() => setPreview(null)} />}

      <header className="max-w-2xl">
        <p className="text-[.6rem] uppercase tracking-[.26em] text-terra">{t.admin.eyebrow}</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{t.admin.title}</h1>
        <p className="mt-4 text-[.94rem] leading-relaxed text-brown/70">
          Read submissions, edit text and image links, preview as a flippable book, and move each
          story through the review workflow. Login and review actions are recorded in the backend.
        </p>
        <p className="mt-3 text-[.72rem] uppercase tracking-[.14em] text-brown/45">
          {t.auth.signedInAs}: {user?.name} · {t.auth.role}: {user?.role}
        </p>
      </header>

      {!serverReachable && (
        <p className="mt-6 rounded-md border border-terra/40 bg-terra/10 px-3 py-2 text-[.8rem] text-terra">
          The API is not reachable. Start it with <code>npm run server</code>.
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-brown/12 pb-3">
        {(['queue', 'audit'] as const)
          .filter((entry) => entry === 'queue' || user?.role === 'admin')
          .map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setTab(entry)}
              className={`rounded-full border px-3.5 py-1.5 text-[.72rem] tracking-wide transition-colors ${
                tab === entry
                  ? 'border-brown bg-brown text-paper'
                  : 'border-brown/20 text-brown/60 hover:border-terra/60'
              }`}
            >
              {entry === 'queue' ? t.admin.queue : t.admin.audit}
            </button>
          ))}
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-terra/40 bg-terra/10 px-3 py-2 text-[.8rem] text-terra">
          {error}
        </p>
      )}

      {tab === 'queue' && (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {FILTERS.map((entry) => {
              const count =
                entry === 'all' ? queue.length : queue.filter((item) => item.status === entry).length
              return (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setFilter(entry)}
                  className={`rounded-full border px-3.5 py-1.5 text-[.72rem] tracking-wide transition-colors ${
                    filter === entry
                      ? 'border-brown bg-brown text-paper'
                      : 'border-brown/20 text-brown/60 hover:border-terra/60'
                  }`}
                >
                  {t.admin[entry]} ({count})
                </button>
              )
            })}
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-brown/50">{t.auth.working}</p>
            ) : visible.length === 0 ? (
              <div className="rounded-xl border border-dashed border-brown/25 bg-paper-deep/30 p-10 text-center">
                <p className="font-display text-2xl">{t.admin.empty}</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-brown/60">
                  No submissions match this filter. After a contributor submits a story, it appears here for review.
                </p>
                <Link
                  to="/contribute"
                  className="mt-5 inline-block rounded-full bg-brown px-5 py-2 text-[.7rem] uppercase tracking-[.14em] text-paper hover:bg-terra"
                >
                  {t.home.contributeCta}
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {visible.map((submission) => {
                  const expanded = openId === submission.id
                  const editing = editId === submission.id
                  return (
                    <li key={submission.id} className="rounded-xl border border-brown/12 bg-paper-deep/40 p-5">
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-display text-xl">{submission.title}</h2>
                            <StatusPill status={submission.status} />
                          </div>
                          <p className="mt-1.5 max-w-2xl text-[.85rem] leading-relaxed text-brown/65">
                            {submission.description}
                          </p>
                          <p className="mt-2 text-[.64rem] uppercase tracking-[.14em] text-brown/40">
                            {submission.category} · {submission.language === 'ml' ? 'മലയാളം' : 'English'} ·{' '}
                            {submission.authorName} · {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenId(expanded ? null : submission.id)
                              if (editing) setEditId(null)
                            }}
                            className="rounded-full border border-brown/20 px-3 py-1.5 text-[.66rem] uppercase tracking-[.12em] text-brown/60 hover:border-brown hover:text-brown"
                          >
                            {expanded ? t.admin.hide : t.admin.read}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreview(submission)}
                            className="rounded-full border border-brown/20 px-3 py-1.5 text-[.66rem] uppercase tracking-[.12em] text-brown/60 hover:border-brown hover:text-brown"
                          >
                            Preview book
                          </button>
                        </div>
                      </div>

                      {expanded && (
                        <div className="mt-4 space-y-4 border-t border-brown/10 pt-4">
                          {editing ? (
                            <div className="space-y-3">
                              <label className="block text-[.62rem] uppercase tracking-[.16em] text-brown/50">
                                Title
                                <input
                                  value={editDraft.title ?? ''}
                                  onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                                  className={inputClass}
                                />
                              </label>
                              <label className="block text-[.62rem] uppercase tracking-[.16em] text-brown/50">
                                Description
                                <textarea
                                  rows={2}
                                  value={editDraft.description ?? ''}
                                  onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                                  className={inputClass}
                                />
                              </label>
                              <label className="block text-[.62rem] uppercase tracking-[.16em] text-brown/50">
                                Story content (use blank lines between sections; add pictures with <code>![caption](url)</code>)
                                <textarea
                                  rows={12}
                                  value={editDraft.content ?? ''}
                                  onChange={(e) => setEditDraft((d) => ({ ...d, content: e.target.value }))}
                                  className={inputClass}
                                />
                              </label>
                              <label className="block text-[.62rem] uppercase tracking-[.16em] text-brown/50">
                                Sources
                                <textarea
                                  rows={2}
                                  value={editDraft.sources ?? ''}
                                  onChange={(e) => setEditDraft((d) => ({ ...d, sources: e.target.value }))}
                                  className={inputClass}
                                />
                              </label>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => void saveEdit(submission.id)}
                                  disabled={busyId === submission.id}
                                  className="rounded-full bg-brown px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-paper hover:bg-terra disabled:opacity-40"
                                >
                                  {busyId === submission.id ? 'Saving…' : 'Save edits'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditId(null)}
                                  className="rounded-full border border-brown/20 px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-brown/60 hover:border-brown"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="max-h-72 overflow-y-auto rounded-md bg-paper p-4">
                                <RichText text={submission.content} />
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEdit(submission)}
                                  className="rounded-full border border-brown/20 px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-brown/65 hover:border-brown hover:text-brown"
                                >
                                  Edit text / add pictures
                                </button>
                              </div>
                            </>
                          )}

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-[.6rem] uppercase tracking-[.16em] text-brown/45">{t.admin.sources}</p>
                              <p className="mt-1 whitespace-pre-wrap text-[.8rem] leading-relaxed text-brown/65">
                                {submission.sources || '—'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[.6rem] uppercase tracking-[.16em] text-brown/45">{t.admin.contributor}</p>
                              <p className="mt-1 text-[.8rem] leading-relaxed text-brown/65">
                                {submission.authorName}
                                <br />
                                {submission.authorEmail}
                              </p>
                            </div>
                          </div>

                          <label className="block text-[.6rem] uppercase tracking-[.16em] text-brown/45">
                            {t.admin.note}
                            <textarea
                              value={notes[submission.id] ?? ''}
                              onChange={(event) =>
                                setNotes((current) => ({ ...current, [submission.id]: event.target.value }))
                              }
                              rows={2}
                              placeholder={t.admin.notePlaceholder}
                              className={inputClass}
                            />
                          </label>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void decide(submission, 'approved')}
                              disabled={busyId === submission.id || submission.status === 'approved'}
                              className="rounded-full bg-green px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-paper transition-opacity hover:opacity-85 disabled:opacity-40"
                            >
                              {t.admin.approve}
                            </button>
                            <button
                              type="button"
                              onClick={() => void decide(submission, 'rejected')}
                              disabled={busyId === submission.id || submission.status === 'rejected'}
                              className="rounded-full border border-terra px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-terra transition-colors hover:bg-terra hover:text-paper disabled:opacity-40"
                            >
                              {t.admin.reject}
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {tab === 'audit' && (
        <div className="mt-6">
          {audit.length === 0 ? (
            <p className="rounded-xl border border-dashed border-brown/25 bg-paper-deep/30 p-8 text-center text-sm text-brown/60">
              {t.admin.auditEmpty}
            </p>
          ) : (
            <ul className="divide-y divide-brown/10 border-y border-brown/10">
              {audit.map((entry) => (
                <li key={entry.id} className="flex flex-wrap gap-3 py-3 text-[.82rem]">
                  <span className="w-40 shrink-0 text-brown/45">
                    {new Date(entry.createdAt).toLocaleString('en-IN')}
                  </span>
                  <span className="font-medium text-brown">{entry.action}</span>
                  <span className="text-brown/55">{entry.target}</span>
                  <span className="text-brown/45">{entry.actor?.name ?? 'system'}</span>
                  {entry.detail && <span className="text-brown/55">— {entry.detail}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

const inputClass =
  'mt-1.5 w-full rounded-md border border-brown/20 bg-paper px-3 py-2 text-sm normal-case tracking-normal text-brown placeholder:text-brown/35 focus:border-terra focus:outline-none'

function StatusPill({ status }: { status: ContributionRecord['status'] }) {
  const styles =
    status === 'approved' || status === 'published'
      ? 'border-green/50 bg-green/10 text-green'
      : status === 'rejected'
        ? 'border-terra/50 bg-terra/10 text-terra'
        : 'border-gold/60 bg-gold/15 text-brown/60'

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[.58rem] uppercase tracking-[.16em] ${styles}`}
    >
      {status}
    </span>
  )
}

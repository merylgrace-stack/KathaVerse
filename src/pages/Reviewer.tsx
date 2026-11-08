import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/stories'
import type { Submission } from '../data/types'
import { formatDate } from '../lib/meta'
import { useSubmissions } from '../lib/store'

const FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
] as const

export function Reviewer() {
  const [submissions, setSubmissions] = useSubmissions()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('pending')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [openId, setOpenId] = useState<string | null>(null)

  const visible =
    filter === 'all'
      ? submissions
      : submissions.filter((entry) => entry.status === filter)

  const decide = (
    submission: Submission,
    status: 'approved' | 'rejected',
  ) => {
    setSubmissions((current) =>
      current.map((entry) =>
        entry.id === submission.id
          ? { ...entry, status, reviewNote: notes[submission.id]?.trim() || undefined }
          : entry,
      ),
    )
  }

  return (
    <div className="container-page pb-8 pt-12">
      <header className="max-w-2xl">
        <p className="text-[.6rem] uppercase tracking-[.26em] text-terra">
          Editorial
        </p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Reviewer dashboard</h1>
        <p className="mt-4 text-[.94rem] leading-relaxed text-brown/70">
          Read submissions, add a note for the contributor and move the story to
          approved or rejected.
        </p>
        <p className="mt-3 rounded-md border border-gold/50 bg-gold/10 px-3 py-2 text-[.76rem] leading-relaxed text-brown/60">
          This dashboard is open preview tooling: it reads submissions stored in
          this browser. A published archive needs reviewer sign-in and server-side
          storage before launch.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {FILTERS.map((entry) => {
          const count =
            entry.id === 'all'
              ? submissions.length
              : submissions.filter((submission) => submission.status === entry.id).length
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setFilter(entry.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[.72rem] tracking-wide transition-colors ${
                filter === entry.id
                  ? 'border-brown bg-brown text-paper'
                  : 'border-brown/20 text-brown/60 hover:border-terra/60'
              }`}
            >
              {entry.label} ({count})
            </button>
          )
        })}
      </div>

      <div className="mt-8">
        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brown/25 bg-paper-deep/30 p-10 text-center">
            <p className="font-display text-2xl">Nothing in this queue</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brown/60">
              {submissions.length === 0
                ? 'No submissions exist on this device yet. Contribute a story to see it here.'
                : 'Try another status filter.'}
            </p>
            <Link
              to="/contribute"
              className="mt-5 inline-block rounded-full bg-brown px-5 py-2 text-[.7rem] uppercase tracking-[.14em] text-paper hover:bg-terra"
            >
              Contribute a story
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {visible.map((submission) => {
              const category =
                CATEGORIES.find((entry) => entry.id === submission.category)?.label
                  .en ?? submission.category
              const expanded = openId === submission.id

              return (
                <li
                  key={submission.id}
                  className="rounded-xl border border-brown/12 bg-paper-deep/40 p-5"
                >
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
                        {category} · {submission.language === 'ml' ? 'മലയാളം' : 'English'} ·{' '}
                        {submission.authorName} · {formatDate(submission.submittedAt)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenId(expanded ? null : submission.id)}
                      className="rounded-full border border-brown/20 px-3 py-1.5 text-[.66rem] uppercase tracking-[.12em] text-brown/60 hover:border-brown hover:text-brown"
                    >
                      {expanded ? 'Hide text' : 'Read submission'}
                    </button>
                  </div>

                  {expanded && (
                    <div className="mt-4 space-y-4 border-t border-brown/10 pt-4">
                      <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md bg-paper p-4 text-[.84rem] leading-relaxed text-brown/80">
                        {submission.content}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[.6rem] uppercase tracking-[.16em] text-brown/45">
                            Sources
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-[.8rem] leading-relaxed text-brown/65">
                            {submission.sources || '— none given —'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[.6rem] uppercase tracking-[.16em] text-brown/45">
                            Contributor
                          </p>
                          <p className="mt-1 text-[.8rem] leading-relaxed text-brown/65">
                            {submission.authorName}
                            <br />
                            {submission.authorEmail}
                          </p>
                        </div>
                      </div>

                      {submission.reviewNote && (
                        <p className="rounded-md border border-brown/15 bg-paper px-3 py-2 text-[.78rem] text-brown/65">
                          <span className="uppercase tracking-[.14em] text-brown/40">
                            Review note:{' '}
                          </span>
                          {submission.reviewNote}
                        </p>
                      )}

                      <label className="block text-[.6rem] uppercase tracking-[.16em] text-brown/45">
                        Reviewer note
                        <textarea
                          value={notes[submission.id] ?? ''}
                          onChange={(event) =>
                            setNotes((current) => ({
                              ...current,
                              [submission.id]: event.target.value,
                            }))
                          }
                          rows={2}
                          placeholder="Checks made, sources verified, changes requested…"
                          className="mt-1.5 w-full rounded-md border border-brown/20 bg-paper px-3 py-2 text-sm normal-case tracking-normal text-brown placeholder:text-brown/35 focus:border-terra focus:outline-none"
                        />
                      </label>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => decide(submission, 'approved')}
                          disabled={submission.status === 'approved'}
                          className="rounded-full bg-green px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-paper transition-opacity hover:opacity-85 disabled:opacity-40"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => decide(submission, 'rejected')}
                          disabled={submission.status === 'rejected'}
                          className="rounded-full border border-terra px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-terra transition-colors hover:bg-terra hover:text-paper disabled:opacity-40"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSubmissions((current) =>
                              current.filter((entry) => entry.id !== submission.id),
                            )
                          }
                          className="ml-auto text-[.66rem] uppercase tracking-[.12em] text-brown/40 hover:text-terra"
                        >
                          Delete
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
    </div>
  )
}

function StatusPill({ status }: { status: Submission['status'] }) {
  const styles =
    status === 'approved'
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

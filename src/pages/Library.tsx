import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CoverArt } from '../components/CoverArt'
import { STORIES } from '../data/stories'
import { useLanguage } from '../lib/language'
import { chapterTitle, formatDate } from '../lib/meta'
import { toggleBookmark, useBookmarks, useProgress } from '../lib/store'

export function Library() {
  const { pick } = useLanguage()
  const [tab, setTab] = useState<'saved' | 'history'>('saved')
  const [bookmarks] = useBookmarks()
  const [progress] = useProgress()

  const history = [...progress].sort((a, b) =>
    b.lastReadAt.localeCompare(a.lastReadAt),
  )

  return (
    <div className="container-page pb-8 pt-12">
      <header className="max-w-2xl">
        <p className="text-[.6rem] uppercase tracking-[.26em] text-terra">
          Personal shelf
        </p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">My library</h1>
        <p className="mt-4 text-[.94rem] leading-relaxed text-brown/70">
          Saved passages and reading history, kept on this device. Nothing leaves
          your browser.
        </p>
      </header>

      <div className="mt-8 flex gap-1 border-b border-brown/12">
        {(
          [
            { id: 'saved', label: `Saved (${bookmarks.length})` },
            { id: 'history', label: `Reading history (${history.length})` },
          ] as const
        ).map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setTab(entry.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-[.74rem] uppercase tracking-[.14em] transition-colors ${
              tab === entry.id
                ? 'border-terra text-brown'
                : 'border-transparent text-brown/50 hover:text-brown/80'
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {tab === 'saved' && (
        <div className="mt-8">
          {bookmarks.length === 0 ? (
            <EmptyState
              title="No saved passages yet"
              body="Open any story and tap Bookmark to keep a chapter here."
            />
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((bookmark) => {
                const story = STORIES.find((item) => item.id === bookmark.storyId)
                if (!story) return null
                return (
                  <li
                    key={bookmark.id}
                    className="flex flex-wrap items-center gap-4 rounded-lg border border-brown/12 bg-paper-deep/40 p-3"
                  >
                    <CoverArt
                      src={story.coverImage}
                      alt=""
                      className="h-20 w-16 shrink-0 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/stories/${story.id}/read`}
                        className="font-display text-lg hover:text-terra"
                      >
                        {pick(story.title)}
                      </Link>
                      <p className="mt-0.5 text-[.78rem] text-brown/60">
                        {pick(chapterTitle(story, bookmark.chapterId))}
                      </p>
                      <p className="mt-1 text-[.64rem] uppercase tracking-[.14em] text-brown/40">
                        Saved {formatDate(bookmark.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/stories/${story.id}/read`}
                        className="rounded-full border border-brown/20 px-3 py-1.5 text-[.66rem] uppercase tracking-[.12em] text-brown/65 hover:border-brown hover:text-brown"
                      >
                        Continue
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          toggleBookmark(bookmark.storyId, bookmark.chapterId)
                        }
                        className="rounded-full border border-brown/15 px-3 py-1.5 text-[.66rem] uppercase tracking-[.12em] text-brown/45 hover:border-terra/50 hover:text-terra"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="mt-8">
          {history.length === 0 ? (
            <EmptyState
              title="Nothing read yet"
              body="Stories you open appear here with your progress, so you can pick up mid-chapter."
            />
          ) : (
            <ul className="space-y-3">
              {history.map((entry) => {
                const story = STORIES.find((item) => item.id === entry.storyId)
                if (!story) return null
                return (
                  <li
                    key={entry.storyId}
                    className="rounded-lg border border-brown/12 bg-paper-deep/40 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/stories/${story.id}/read`}
                          className="font-display text-lg hover:text-terra"
                        >
                          {pick(story.title)}
                        </Link>
                        <p className="mt-0.5 text-[.78rem] text-brown/60">
                          {pick(chapterTitle(story, entry.chapterId))} · last read{' '}
                          {formatDate(entry.lastReadAt)}
                        </p>
                      </div>
                      <Link
                        to={`/stories/${story.id}/read`}
                        className="rounded-full bg-brown px-3.5 py-1.5 text-[.66rem] uppercase tracking-[.12em] text-paper hover:bg-terra"
                      >
                        Continue
                      </Link>
                    </div>
                    <div className="progress-track mt-3 overflow-hidden rounded-full">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.max(4, entry.progress)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[.62rem] uppercase tracking-[.14em] text-brown/40">
                      {entry.progress}% of the book
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-brown/25 bg-paper-deep/30 p-10 text-center">
      <p className="font-display text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brown/60">
        {body}
      </p>
      <Link
        to="/explore"
        className="mt-5 inline-block rounded-full bg-brown px-5 py-2 text-[.7rem] uppercase tracking-[.14em] text-paper hover:bg-terra"
      >
        Explore stories
      </Link>
    </div>
  )
}

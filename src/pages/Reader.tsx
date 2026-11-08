import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Chapter, Story } from '../data/types'
import { useLanguage } from '../lib/language'
import { findStory } from '../lib/meta'
import {
  bookmarkId,
  saveReadingProgress,
  toggleBookmark,
  useBookmarks,
} from '../lib/store'
import { RichText, toPlainText } from '../lib/text'

interface Leaf {
  id: string
  chapter?: Chapter
}

function MissingStory() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-[.6rem] uppercase tracking-[.24em] text-terra">Not found</p>
      <h1 className="mt-3 text-4xl">This book isn't on the shelf</h1>
      <Link
        to="/explore"
        className="mt-6 inline-block rounded-full bg-brown px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-paper hover:bg-terra"
      >
        Browse stories
      </Link>
    </div>
  )
}

export function Reader() {
  const { storyId } = useParams()
  const story = findStory(storyId)

  if (!story) return <MissingStory />
  return <BookReader story={story} />
}

function BookReader({ story }: { story: Story }) {
  const { lang, setLang, pick } = useLanguage()
  const navigate = useNavigate()
  const [bookmarks] = useBookmarks()

  const leaves = useMemo<Leaf[]>(
    () => [
      { id: 'cover' },
      ...story.chapters.map((chapter) => ({ id: chapter.id, chapter })),
    ],
    [story],
  )

  const [index, setIndex] = useState(0)
  const [flip, setFlip] = useState<'next' | 'prev' | null>(null)
  const [zoom, setZoom] = useState(1)
  const [showGlossary, setShowGlossary] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const flipTimer = useRef<number | null>(null)
  const touchStart = useRef<number | null>(null)

  const currentLeaf = leaves[index]
  const leftLeaf = leaves[index - 1]
  const currentChapter = currentLeaf?.chapter

  useEffect(() => {
    const chapter = currentLeaf?.chapter ?? story.chapters[0]
    if (!chapter) return
    saveReadingProgress({
      storyId: story.id,
      chapterId: chapter.id,
      progress: Math.round(((index + 1) / leaves.length) * 100),
      lastReadAt: new Date().toISOString(),
    })
  }, [index, leaves.length, story.id, currentLeaf, story.chapters])

  const go = useCallback(
    (direction: 'next' | 'prev') => {
      if (flip) return
      const target = direction === 'next' ? index + 1 : index - 1
      if (target < 0 || target >= leaves.length) return

      setFlip(direction)
      flipTimer.current = window.setTimeout(() => {
        setIndex(target)
        setFlip(null)
        flipTimer.current = null
      }, 620)
    },
    [flip, index, leaves.length],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (event.key === 'ArrowRight') go('next')
      if (event.key === 'ArrowLeft') go('prev')
      if (event.key === 'Escape') setShowGlossary(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  useEffect(
    () => () => {
      if (flipTimer.current) window.clearTimeout(flipTimer.current)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    },
    [],
  )

  const narrationText = useMemo(() => {
    if (!currentChapter) return ''
    const text = lang === 'ml' ? currentChapter.content.ml : currentChapter.content.en
    return toPlainText(text)
  }, [currentChapter, lang])

  const narrate = () => {
    if (!('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      return
    }
    if (!narrationText) return

    const utterance = new SpeechSynthesisUtterance(narrationText)
    utterance.lang = lang === 'ml' ? 'ml-IN' : 'en-IN'
    utterance.rate = 0.95
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    synth.cancel()
    synth.speak(utterance)
    setSpeaking(true)
  }

  const isBookmarked = currentChapter
    ? bookmarks.some(
        (bookmark) => bookmark.id === bookmarkId(story.id, currentChapter.id),
      )
    : false

  const chapterNumber = (chapterId: string) =>
    story.chapters.findIndex((chapter) => chapter.id === chapterId) + 1

  const renderLeaf = (leaf: Leaf | undefined, side: 'left' | 'right') => {
    if (!leaf) {
      return (
        <div className="flex h-full flex-col justify-between">
          <p className="text-[.58rem] uppercase tracking-[.24em] text-brown/35">
            KathaVerse
          </p>
          <div className="text-center">
            <p className="font-display text-3xl text-brown/30">ക</p>
            <p className="mt-3 font-display text-lg text-brown/40">
              Kerala's living stories
            </p>
          </div>
          <p className="text-center text-[.58rem] uppercase tracking-[.2em] text-brown/30">
            {story.title.en}
          </p>
        </div>
      )
    }

    if (!leaf.chapter) {
      return (
        <div className="flex h-full flex-col justify-between">
          <p className="text-[.58rem] uppercase tracking-[.24em] text-terra">
            {pick(story.title)}
          </p>
          <div>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              {pick(story.title)}
            </h2>
            <p className="mt-2 font-display text-base italic text-brown/55">
              {pick(story.subtitle)}
            </p>
            <div className="mt-5 h-px w-16 bg-gold" />
            <p className="mt-5 max-w-sm text-[.88rem] leading-relaxed text-brown/65">
              {pick(story.description)}
            </p>
            <button
              type="button"
              onClick={() => go('next')}
              className="mt-6 rounded-full bg-terra px-5 py-2.5 text-[.7rem] uppercase tracking-[.16em] text-paper transition-colors hover:bg-brown"
            >
              Open the book →
            </button>
          </div>
          <p className="text-[.6rem] uppercase tracking-[.2em] text-brown/35">
            {story.chapters.length} chapters · {story.readingTime} min
          </p>
        </div>
      )
    }

    const chapter = leaf.chapter
    const body = lang === 'ml' ? chapter.content.ml : chapter.content.en

    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between text-[.58rem] uppercase tracking-[.2em] text-brown/40">
          <span>{pick(story.title)}</span>
          <span>Chapter {chapterNumber(chapter.id)}</span>
        </div>

        <h2 className="mt-3 font-display text-2xl leading-snug sm:text-[1.7rem]">
          {pick(chapter.title)}
        </h2>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          {body.trim() ? (
            <RichText text={body} glossary={story.glossary} />
          ) : (
            <p className="text-sm italic text-brown/50">
              This chapter has not been translated yet.
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-brown/10 pt-2.5 text-[.6rem] text-brown/35">
          <span>KathaVerse · {story.category}</span>
          <span>{side === 'left' ? '←' : '→'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-brown/10 bg-paper/95 backdrop-blur">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((index + 1) / leaves.length) * 100}%` }}
          />
        </div>

        <div className="container-page flex flex-wrap items-center gap-3 py-2.5">
          <button
            type="button"
            onClick={() => navigate(`/stories/${story.id}`)}
            className="text-[.66rem] uppercase tracking-[.14em] text-brown/55 transition-colors hover:text-terra"
          >
            ← Story details
          </button>

          <p className="ml-2 hidden truncate font-display text-sm text-brown/70 sm:block">
            {pick(story.title)}
          </p>

          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <div className="flex items-center rounded-full border border-brown/15 p-0.5">
              {(['en', 'ml'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`rounded-full px-2 py-0.5 text-[.66rem] ${
                    lang === code ? 'bg-brown text-paper' : 'text-brown/60'
                  }`}
                >
                  {code === 'en' ? 'EN' : 'മല'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-full border border-brown/15 px-1 py-0.5">
              <button
                type="button"
                onClick={() => setZoom((value) => Math.max(0.85, Number((value - 0.08).toFixed(2))))}
                aria-label="Zoom out"
                className="h-6 w-6 rounded-full text-sm leading-none text-brown/60 hover:bg-paper-deep"
              >
                −
              </button>
              <span className="w-10 text-center text-[.62rem] tabular-nums text-brown/50">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.min(1.4, Number((value + 0.08).toFixed(2))))}
                aria-label="Zoom in"
                className="h-6 w-6 rounded-full text-sm leading-none text-brown/60 hover:bg-paper-deep"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => currentChapter && toggleBookmark(story.id, currentChapter.id)}
              disabled={!currentChapter}
              aria-pressed={isBookmarked}
              className={`rounded-full border px-3 py-1 text-[.66rem] uppercase tracking-[.1em] transition-colors disabled:opacity-40 ${
                isBookmarked
                  ? 'border-terra bg-terra/10 text-terra'
                  : 'border-brown/20 text-brown/60 hover:border-brown hover:text-brown'
              }`}
            >
              {isBookmarked ? 'Saved' : 'Bookmark'}
            </button>

            <button
              type="button"
              onClick={narrate}
              disabled={!narrationText}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[.66rem] uppercase tracking-[.1em] transition-colors disabled:opacity-40 ${
                speaking
                  ? 'border-green bg-green/10 text-green'
                  : 'border-brown/20 text-brown/60 hover:border-brown hover:text-brown'
              }`}
            >
              {speaking ? (
                <span className="flex h-3 items-end gap-0.5" aria-hidden>
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                </span>
              ) : null}
              {speaking ? 'Stop' : 'Narrate'}
            </button>

            <button
              type="button"
              onClick={() => setShowGlossary((open) => !open)}
              aria-expanded={showGlossary}
              className="rounded-full border border-brown/20 px-3 py-1 text-[.66rem] uppercase tracking-[.1em] text-brown/60 transition-colors hover:border-brown hover:text-brown"
            >
              Glossary
            </button>
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        <div
          className="book-stage mx-auto max-w-4xl"
          style={{ '--reader-scale': zoom } as CSSProperties}
          onTouchStart={(event) => {
            touchStart.current = event.changedTouches[0].clientX
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current
            if (start === null) return
            const delta = event.changedTouches[0].clientX - start
            if (Math.abs(delta) > 60) go(delta < 0 ? 'next' : 'prev')
            touchStart.current = null
          }}
        >
          <div className="book-spread">
            <section
              className="book-page book-page--left"
              aria-label="Previous page"
            >
              <div className="page-body h-full">{renderLeaf(leftLeaf, 'left')}</div>
            </section>

            <section className="book-page book-page--right" aria-label="Current page">
              {renderLeaf(currentLeaf, 'right')}
            </section>

            {flip && (
              <div className={`turn-sheet turn-sheet--${flip}`} aria-hidden>
                {renderLeaf(
                  flip === 'next' ? currentLeaf : leftLeaf ?? currentLeaf,
                  flip === 'next' ? 'right' : 'left',
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-5 flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={() => go('prev')}
            disabled={index === 0 || flip !== null}
            className="rounded-full border border-brown/20 px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-brown/70 transition-colors hover:border-brown hover:text-brown disabled:opacity-35"
          >
            ← Previous
          </button>

          <p className="text-[.64rem] uppercase tracking-[.18em] text-brown/45">
            Page {index + 1} of {leaves.length}
          </p>

          <button
            type="button"
            onClick={() => go('next')}
            disabled={index === leaves.length - 1 || flip !== null}
            className="rounded-full bg-brown px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-paper transition-colors hover:bg-terra disabled:opacity-35"
          >
            Next →
          </button>
        </div>

        <p className="mx-auto mt-4 max-w-4xl text-center text-[.64rem] leading-relaxed text-brown/40">
          Arrow keys or swipe to turn pages · dashed terms in the text carry
          glossary meanings · narration uses your browser's speech voices, so
          Malayalam depends on the voices installed on this device.
        </p>
      </div>

      {showGlossary && (
        <aside
          className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-y-auto border-l border-brown/15 bg-paper p-6 shadow-[-20px_0_50px_-30px_rgba(56,41,31,.5)]"
          aria-label="Glossary"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[.58rem] uppercase tracking-[.24em] text-terra">
                Glossary
              </p>
              <p className="mt-1 font-display text-xl">{pick(story.title)}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowGlossary(false)}
              className="rounded-full border border-brown/20 px-2.5 py-1 text-[.66rem] text-brown/60 hover:border-brown hover:text-brown"
            >
              Close
            </button>
          </div>

          <dl className="mt-5 space-y-4">
            {story.glossary.map((term) => (
              <div key={term.term}>
                <dt className="font-display text-base">
                  {term.term}
                  {term.pronunciation ? (
                    <span className="ml-2 text-[.62rem] uppercase tracking-[.1em] text-brown/40">
                      {term.pronunciation}
                    </span>
                  ) : null}
                </dt>
                <dd className="mt-1 text-[.8rem] leading-relaxed text-brown/65">
                  {term.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
import { CoverArt } from '../components/CoverArt'
import type { Story } from '../data/types'
import { useLanguage } from '../lib/language'
import { categoryIcon, categoryLabel, findStory, formatDate, storyLanguages } from '../lib/meta'
import { bookmarkId, toggleBookmark, useBookmarks } from '../lib/store'

function MissingStory() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-[.6rem] uppercase tracking-[.24em] text-terra">Not found</p>
      <h1 className="mt-3 text-4xl">That story isn't in the archive</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brown/60">
        The link may be old, or the story may not have been published yet.
      </p>
      <Link
        to="/explore"
        className="mt-6 inline-block rounded-full bg-brown px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-paper hover:bg-terra"
      >
        Browse stories
      </Link>
    </div>
  )
}

function StoryDetailView({ story }: { story: Story }) {
  const { lang, setLang, pick } = useLanguage()
  const [bookmarks] = useBookmarks()

  const firstChapter = story.chapters[0]
  const isSaved = bookmarks.some(
    (bookmark) => bookmark.id === bookmarkId(story.id, firstChapter.id),
  )
  const category = categoryLabel(story.category)

  return (
    <div className="container-page pb-8 pt-10">
      <Link
        to="/explore"
        className="text-[.68rem] uppercase tracking-[.16em] text-brown/50 transition-colors hover:text-terra"
      >
        ← All stories
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,400px)_1fr]">
        {/* Cover */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-brown/12 bg-paper-deep shadow-[0_30px_60px_-38px_rgba(56,41,31,.65)]">
            <CoverArt
              src={story.coverImage}
              alt={`${story.title.en} cover illustration`}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg border border-brown/12 bg-paper-deep/40 px-3 py-3">
              <dt className="text-[.56rem] uppercase tracking-[.18em] text-brown/45">
                Reading time
              </dt>
              <dd className="mt-1 font-display text-lg">{story.readingTime} min</dd>
            </div>
            <div className="rounded-lg border border-brown/12 bg-paper-deep/40 px-3 py-3">
              <dt className="text-[.56rem] uppercase tracking-[.18em] text-brown/45">
                Chapters
              </dt>
              <dd className="mt-1 font-display text-lg">{story.chapters.length}</dd>
            </div>
          </dl>
        </div>

        {/* Detail */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brown/15 px-3 py-1 text-[.62rem] uppercase tracking-[.18em] text-brown/65">
            <span aria-hidden>{categoryIcon(story.category)}</span>
            {pick(category)}
          </p>

          <h1 className="mt-4 text-4xl leading-[1.06] sm:text-5xl">
            {pick(story.title)}
          </h1>
          <p className="mt-2 font-display text-lg italic text-brown/60">
            {pick(story.subtitle)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[.68rem] text-brown/55">
            {storyLanguages(story).map((language) => (
              <span
                key={language}
                className="rounded-full border border-brown/15 px-2 py-0.5"
              >
                {language}
              </span>
            ))}
            <span>· First documented {formatDate(story.createdAt)}</span>
          </div>

          <section className="mt-7">
            <h2 className="text-[.6rem] uppercase tracking-[.24em] text-terra">
              Introduction
            </h2>
            <p className="mt-2 text-[.96rem] leading-[1.8] text-brown/80">
              {pick(story.description)}
            </p>
          </section>

          <section className="mt-7">
            <h2 className="text-[.6rem] uppercase tracking-[.24em] text-terra">
              Cultural background
            </h2>
            <p className="mt-2 text-[.92rem] leading-[1.8] text-brown/70">
              KathaVerse records these narratives as living tradition rather than
              fixed text. The telling below draws on the published sources listed
              on this page, and the glossary keeps the Malayalam terms in view
              while you read.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {story.tags.slice(0, 8).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-paper-deep/70 px-2.5 py-1 text-[.66rem] text-brown/60"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-7">
            <h2 className="text-[.6rem] uppercase tracking-[.24em] text-terra">
              Read in
            </h2>
            <div className="mt-2 inline-flex rounded-full border border-brown/15 p-0.5">
              {(['en', 'ml'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`rounded-full px-4 py-1.5 text-[.74rem] transition-colors ${
                    lang === code
                      ? 'bg-brown text-paper'
                      : 'text-brown/60 hover:text-brown'
                  }`}
                >
                  {code === 'en' ? 'English' : 'മലയാളം'}
                </button>
              ))}
            </div>
          </section>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to={`/stories/${story.id}/read`}
              className="rounded-full bg-terra px-6 py-3 text-[.74rem] uppercase tracking-[.16em] text-paper transition-colors hover:bg-brown"
            >
              Read story
            </Link>
            <button
              type="button"
              onClick={() => toggleBookmark(story.id, firstChapter.id)}
              className={`rounded-full border px-5 py-3 text-[.74rem] uppercase tracking-[.14em] transition-colors ${
                isSaved
                  ? 'border-terra bg-terra/10 text-terra'
                  : 'border-brown/25 text-brown/70 hover:border-brown hover:text-brown'
              }`}
            >
              {isSaved ? 'Saved to library' : 'Save to library'}
            </button>
          </div>

          <section className="mt-10">
            <h2 className="text-[.6rem] uppercase tracking-[.24em] text-terra">
              In this story
            </h2>
            <ol className="mt-3 divide-y divide-brown/10 border-y border-brown/10">
              {story.chapters.map((chapter, index) => (
                <li key={chapter.id} className="flex items-baseline gap-4 py-3">
                  <span className="font-display text-sm text-brown/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-snug">
                      {pick(chapter.title)}
                    </p>
                    <p className="mt-0.5 text-[.68rem] text-brown/45">
                      Chapter {index + 1} · available in English and മലയാളം
                    </p>
                  </div>
                  <Link
                    to={`/stories/${story.id}/read`}
                    className="ml-auto shrink-0 text-[.64rem] uppercase tracking-[.14em] text-terra hover:opacity-70"
                  >
                    Open
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-[.6rem] uppercase tracking-[.24em] text-terra">
                Glossary
              </h2>
              <dl className="mt-3 space-y-2.5">
                {story.glossary.slice(0, 5).map((term) => (
                  <div key={term.term}>
                    <dt className="font-display text-[1.02rem]">
                      {term.term}
                      {term.pronunciation ? (
                        <span className="ml-2 text-[.66rem] uppercase tracking-[.1em] text-brown/40">
                          {term.pronunciation}
                        </span>
                      ) : null}
                    </dt>
                    <dd className="text-[.8rem] leading-relaxed text-brown/60">
                      {term.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h2 className="text-[.6rem] uppercase tracking-[.24em] text-terra">
                Sources & attribution
              </h2>
              <ul className="mt-3 space-y-2 text-[.8rem] leading-relaxed text-brown/65">
                {story.sources.map((source) => (
                  <li key={source} className="border-l border-gold/60 pl-3">
                    {source}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[.7rem] leading-relaxed text-brown/45">
                Retold for KathaVerse. The attributions above are part of the
                story record, not historical proof of every narrative detail.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export function StoryDetail() {
  const { storyId } = useParams()
  const story = findStory(storyId)

  if (!story) return <MissingStory />
  return <StoryDetailView story={story} />
}

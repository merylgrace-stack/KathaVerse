import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CoverArt } from '../components/CoverArt'
import { Reveal } from '../components/Reveal'
import { StoryCard } from '../components/StoryCard'
import { CATEGORIES, STORIES } from '../data/stories'
import type { Category, ReadingProgress, Story } from '../data/types'
import { useAuth } from '../lib/auth'
import { useLanguage } from '../lib/language'
import { categoryLabel } from '../lib/meta'
import { useProgress } from '../lib/store'
import { useStrings } from '../i18n'

interface CollectionProps {
  id: string
  title: string
  blurb: string
  stories: Story[]
}

function Collection({ id, title, blurb, stories }: CollectionProps) {
  if (stories.length === 0) return null

  return (
    <section id={id} className="mt-16 scroll-mt-32">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl">{title}</h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-brown/60">
            {blurb}
          </p>
        </div>
        <Link
          to="/explore"
          className="text-[.68rem] uppercase tracking-[.18em] text-terra transition-opacity hover:opacity-70"
        >
          {useStrings().home.viewAll}
        </Link>
      </header>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stories.map((story, index) => (
          <Reveal key={story.id} delay={Math.min(index, 3) * 40}>
            <StoryCard story={story} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Home() {
  const { pick } = useLanguage()
  const t = useStrings()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [progress] = useProgress()

  const featured = STORIES.filter((story) => story.featured)
  const popular = [...STORIES]
    .sort(
      (a, b) => Number(b.trending) - Number(a.trending) || a.readingTime - b.readingTime,
    )
    .slice(0, 4)
  const recent = [...STORIES].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const filtered =
    filter === 'all'
      ? []
      : STORIES.filter((story) => story.category === filter)
  const usedCategories = CATEGORIES.filter((category) =>
    STORIES.some((story) => story.category === category.id),
  )

  const continueReading = progress
    .map((entry) => ({
      entry,
      story: STORIES.find((story) => story.id === entry.storyId),
    }))
    .filter(
      (item): item is { entry: ReadingProgress; story: Story } => Boolean(item.story),
    )
    .slice(0, 4)

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(query.trim() ? `/explore?q=${encodeURIComponent(query.trim())}` : '/explore')
  }

  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-[.76rem] transition-colors duration-200 ${
      active
        ? 'border-brown bg-brown text-paper'
        : 'border-brown/20 bg-paper-deep/40 text-brown/70 hover:border-terra/60 hover:text-terra'
    }`

  return (
    <div className="container-page pb-8 pt-12 sm:pt-16">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-[.62rem] uppercase tracking-[.28em] text-terra">
            {t.home.eyebrow}
          </p>
          <h1 className="mt-4 max-w-xl text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            {t.home.title}
          </h1>
          <p className="mt-5 max-w-lg text-[.95rem] leading-relaxed text-brown/70">
            {t.home.intro}
          </p>

          <form
            onSubmit={submitSearch}
            role="search"
            className="mt-7 flex max-w-lg items-center gap-2 rounded-full border border-brown/20 bg-paper-deep/40 p-1.5 focus-within:border-terra"
          >
            <label htmlFor="hero-search" className="sr-only">
              {t.home.searchPlaceholder}
            </label>
            <input
              id="hero-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.home.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-brown placeholder:text-brown/40 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brown px-4 py-2 text-[.72rem] uppercase tracking-[.14em] text-paper transition-colors hover:bg-terra"
            >
              {t.home.search}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/explore"
              className="rounded-full bg-terra px-5 py-2.5 text-[.74rem] uppercase tracking-[.16em] text-paper transition-colors hover:bg-brown"
            >
              {t.home.exploreCta}
            </Link>
            <Link
              to="/about"
              className="text-[.74rem] uppercase tracking-[.16em] text-brown/60 underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-brown"
            >
              {t.home.mission}
            </Link>
          </div>
        </div>

        <Link
          to="/stories/theyyam"
          className="group relative block"
          aria-label="Read the Theyyam story"
        >
          <div className="absolute -inset-2.5 rounded-[1.75rem] border border-gold/50 transition-colors group-hover:border-terra/60" />
          <div className="relative overflow-hidden rounded-[1.4rem] border border-brown/10 bg-paper-deep">
            <CoverArt
              src="/images/theyyam.png"
              alt="Theyyam ritual art from northern Kerala"
              className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-[420px]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown/95 via-brown/60 to-transparent p-4 pt-16">
              <p className="inline-flex items-center rounded-full bg-brown/90 px-2.5 py-1 text-[.56rem] uppercase tracking-[.22em] text-gold shadow-sm ring-1 ring-gold/40">
                {t.home.featuredWorld}
              </p>
              <p className="mt-2 font-display text-xl text-paper drop-shadow-[0_2px_8px_rgba(20,12,6,.6)]">
                {t.home.featuredCaption}
              </p>
              <p className="mt-1 text-[.68rem] uppercase tracking-[.14em] text-paper/80 group-hover:text-gold">
                Read story →
              </p>
            </div>
          </div>
        </Link>
      </section>

      {!loading && !user && (
        <section className="mt-10 rounded-2xl border border-terra/25 bg-terra/5 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-[.6rem] uppercase tracking-[.24em] text-terra">
              Start reading
            </p>
            <h2 className="mt-1 font-display text-xl sm:text-2xl">
              Sign in to read and save stories
            </h2>
            <p className="mt-1.5 text-[.86rem] leading-relaxed text-brown/65">
              Create a free account to open the book reader, keep your progress, and
              submit stories for review.
            </p>
          </div>
          <div className="mt-4 flex shrink-0 flex-wrap gap-2 sm:mt-0">
            <Link
              to="/login"
              className="rounded-full bg-brown px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-paper hover:bg-terra"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-brown/25 px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-brown/70 hover:border-brown hover:text-brown"
            >
              Create account
            </Link>
          </div>
        </section>
      )}

      {/* Sticky category chips */}
      <div className="sticky top-16 z-30 mt-14 border-y border-brown/12 bg-paper/92 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
          <span className="shrink-0 pr-1 text-[.6rem] uppercase tracking-[.22em] text-brown/40">
            {t.home.browse}
          </span>
          <button
            type="button"
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            className={chipClass(filter === 'all')}
          >
            {t.home.all}
          </button>
          {usedCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setFilter(category.id)}
              aria-pressed={filter === category.id}
              className={chipClass(filter === category.id)}
            >
              <span aria-hidden className="mr-1.5">
                {category.icon}
              </span>
              {pick(category.label)}
            </button>
          ))}
          <Link
            to="/explore"
            className="ml-auto hidden shrink-0 text-[.66rem] uppercase tracking-[.16em] text-terra hover:opacity-70 sm:block"
          >
            {t.home.viewAll}
          </Link>
        </div>
      </div>

      {filter === 'all' && continueReading.length > 0 && (
        <section className="mt-16">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl">{t.home.continueTitle}</h2>
              <p className="mt-1.5 text-sm text-brown/60">{t.home.continueBlurb}</p>
            </div>
            <Link
              to="/library"
              className="text-[.68rem] uppercase tracking-[.18em] text-terra transition-opacity hover:opacity-70"
            >
              {t.home.libraryCta}
            </Link>
          </header>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {continueReading.map(({ entry, story }) => (
              <Link
                key={story.id}
                to={`/stories/${story.id}/read`}
                className="flex gap-4 rounded-lg border border-brown/12 bg-paper-deep/40 p-3 transition-colors duration-200 hover:border-terra/40"
              >
                <CoverArt
                  src={story.coverImage}
                  alt=""
                  className="h-24 w-20 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[.58rem] uppercase tracking-[.2em] text-terra">
                    {pick(categoryLabel(story.category))}
                  </p>
                  <p className="mt-1 truncate font-display text-lg">{pick(story.title)}</p>
                  <div className="mt-3">
                    <div className="progress-track overflow-hidden rounded-full">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.max(6, entry.progress)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[.66rem] text-brown/50">
                      {entry.progress}
                      {t.home.progressThrough}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filter === 'all' ? (
        <>
          <Collection
            id="featured"
            title={t.home.featured}
            blurb={t.home.featuredBlurb}
            stories={featured}
          />

          <Collection
            id="popular"
            title={t.home.popular}
            blurb={t.home.popularBlurb}
            stories={popular}
          />

          <Collection
            id="recent"
            title={t.home.recent}
            blurb={t.home.recentBlurb}
            stories={recent}
          />

          <Collection
            id="explore-kerala"
            title={t.home.allStories}
            blurb={t.home.allStoriesBlurb}
            stories={STORIES}
          />
        </>
      ) : (
        <Collection
          id="filtered"
          title={pick(categoryLabel(filter))}
          blurb={t.home.filteredBlurb}
          stories={filtered}
        />
      )}

      {/* Contribution CTA */}
      <section className="mt-20 overflow-hidden rounded-2xl border border-brown/12 bg-paper-deep/50 p-8 sm:p-12">
        <div className="max-w-2xl">
          <p className="text-[.6rem] uppercase tracking-[.26em] text-terra">
            {t.home.communityEyebrow}
          </p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
            {t.home.communityTitle}
          </h2>
          <p className="mt-4 text-[.92rem] leading-relaxed text-brown/70">
            {t.home.communityBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/contribute"
              className="rounded-full bg-brown px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-paper transition-colors hover:bg-terra"
            >
              {t.home.contributeCta}
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-brown/25 px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-brown/70 transition-colors hover:border-brown hover:text-brown"
            >
              {t.home.howWeWork}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

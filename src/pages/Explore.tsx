import { useSearchParams } from 'react-router-dom'
import { StoryCard } from '../components/StoryCard'
import { CATEGORIES, STORIES } from '../data/stories'
import type { Story } from '../data/types'
import { useLanguage } from '../lib/language'
import { storyLanguages } from '../lib/meta'

const SORTS = [
  { id: 'featured', label: 'Featured first' },
  { id: 'newest', label: 'Newest' },
  { id: 'shortest', label: 'Quickest read' },
]

export function Explore() {
  const { pick } = useLanguage()
  const [params, setParams] = useSearchParams()

  const query = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const language = params.get('language') ?? 'all'
  const sort = params.get('sort') ?? 'featured'

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const matchesQuery = (story: Story) => {
    if (!query.trim()) return true
    const haystack = [
      story.title.en,
      story.title.ml,
      story.subtitle.en,
      story.subtitle.ml,
      story.description.en,
      story.description.ml,
      story.tags.join(' '),
      story.category,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  }

  const results = STORIES.filter((story) => {
    if (category !== 'all' && story.category !== category) return false
    if (language !== 'all') {
      const available = storyLanguages(story)
      if (language === 'en' && !available.includes('English')) return false
      if (language === 'ml' && !available.includes('മലയാളം')) return false
    }
    return matchesQuery(story)
  }).sort((a, b) => {
    if (sort === 'newest') return b.createdAt.localeCompare(a.createdAt)
    if (sort === 'shortest') return a.readingTime - b.readingTime
    return Number(b.featured) - Number(a.featured) || b.readingTime - a.readingTime
  })

  const activeCategory = CATEGORIES.find((entry) => entry.id === category)

  return (
    <div className="container-page pb-8 pt-12">
      <header className="max-w-2xl">
        <p className="text-[.6rem] uppercase tracking-[.26em] text-terra">
          The library
        </p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Explore stories</h1>
        <p className="mt-4 text-[.94rem] leading-relaxed text-brown/70">
          Search the archive by story, place or tradition, filter by category and
          reading language, then open any story as a page-turning book.
        </p>
      </header>

      <div className="mt-8 rounded-xl border border-brown/12 bg-paper-deep/40 p-4">
        <label htmlFor="explore-search" className="sr-only">
          Search stories
        </label>
        <input
          id="explore-search"
          value={query}
          onChange={(event) => update('q', event.target.value)}
          placeholder="Search “Yakshi”, “Onam”, “Malabar”…"
          className="w-full rounded-lg border border-brown/15 bg-paper px-4 py-2.5 text-sm text-brown placeholder:text-brown/40 focus:border-terra focus:outline-none"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => update('category', 'all')}
            className={`rounded-full border px-3 py-1 text-[.72rem] transition-colors ${
              category === 'all'
                ? 'border-brown bg-brown text-paper'
                : 'border-brown/20 text-brown/65 hover:border-terra/60'
            }`}
          >
            All categories
          </button>
          {CATEGORIES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => update('category', entry.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[.72rem] transition-colors ${
                category === entry.id
                  ? 'border-brown bg-brown text-paper'
                  : 'border-brown/20 text-brown/65 hover:border-terra/60'
              }`}
            >
              <span aria-hidden>{entry.icon}</span>
              {pick(entry.label)}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-brown/10 pt-3">
          <label className="flex items-center gap-2 text-[.7rem] uppercase tracking-[.14em] text-brown/50">
            Language
            <select
              value={language}
              onChange={(event) => update('language', event.target.value)}
              className="rounded-md border border-brown/20 bg-paper px-2 py-1 text-[.78rem] normal-case tracking-normal text-brown focus:border-terra focus:outline-none"
            >
              <option value="all">Any language</option>
              <option value="en">English</option>
              <option value="ml">മലയാളം</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-[.7rem] uppercase tracking-[.14em] text-brown/50">
            Sort
            <select
              value={sort}
              onChange={(event) => update('sort', event.target.value)}
              className="rounded-md border border-brown/20 bg-paper px-2 py-1 text-[.78rem] normal-case tracking-normal text-brown focus:border-terra focus:outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {(query || category !== 'all' || language !== 'all' || sort !== 'featured') && (
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="ml-auto text-[.7rem] uppercase tracking-[.14em] text-terra hover:opacity-70"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-[.72rem] uppercase tracking-[.16em] text-brown/45">
        {results.length} {results.length === 1 ? 'story' : 'stories'}
        {activeCategory ? ` · ${pick(activeCategory.label)}` : ''}
        {query ? ` · “${query}”` : ''}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-brown/25 bg-paper-deep/30 p-10 text-center">
          <p className="font-display text-2xl">No stories match yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brown/60">
            The archive currently holds four documented stories. Try a different
            search, or contribute a story you know.
          </p>
          <button
            type="button"
            onClick={() => setParams(new URLSearchParams(), { replace: true })}
            className="mt-5 rounded-full bg-brown px-5 py-2 text-[.72rem] uppercase tracking-[.14em] text-paper hover:bg-terra"
          >
            Reset search
          </button>
        </div>
      )}
    </div>
  )
}

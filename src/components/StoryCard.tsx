import { Link } from 'react-router-dom'
import type { Story } from '../data/types'
import { useLanguage } from '../lib/language'
import { categoryIcon, categoryLabel, storyLanguages } from '../lib/meta'
import { useStrings } from '../i18n'
import { CoverArt } from './CoverArt'

interface StoryCardProps {
  story: Story
  compact?: boolean
}

/**
 * Illustrated book-cover card used across the homepage, explore and library.
 * The title sits on a full-width gradient so bright artwork stays readable, and
 * every piece of metadata sits below the image.
 */
export function StoryCard({ story, compact = false }: StoryCardProps) {
  const { pick } = useLanguage()
  const t = useStrings()
  const category = categoryLabel(story.category)
  const languages = storyLanguages(story)

  return (
    <article className="story-card group relative flex flex-col overflow-hidden rounded-[10px] border border-brown/12 bg-paper-deep/60">
      <Link to={`/stories/${story.id}`} className="flex flex-1 flex-col">
        <div
          className={`relative overflow-hidden ${compact ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}
        >
          <CoverArt
            src={story.coverImage}
            alt={`${story.title.en} cover illustration`}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
          {/* Two stacked scrims: a soft wash for the pill, a solid foot for the title. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brown/25 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-brown via-brown/70 to-transparent" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-2.5 py-1 text-[.6rem] font-medium uppercase tracking-[.16em] text-brown/80 shadow-sm backdrop-blur">
            <span aria-hidden>{categoryIcon(story.category)}</span>
            {pick(category)}
          </span>
          <h3 className="absolute inset-x-3 bottom-3 font-display text-xl leading-tight text-paper drop-shadow-[0_2px_8px_rgba(24,14,8,.65)] sm:text-2xl">
            {pick(story.title)}
          </h3>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[.66rem] uppercase tracking-[.18em] text-terra/85">
            {pick(story.subtitle)}
          </p>
          <p className="mt-2 line-clamp-3 text-[.9rem] leading-relaxed text-brown/70">
            {pick(story.description)}
          </p>

          <dl className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[.68rem] text-brown/55">
            <div className="flex items-center gap-1">
              <dt className="sr-only">Reading time</dt>
              <dd>
                {story.readingTime} {t.card.minutes}
              </dd>
            </div>
            <span aria-hidden className="text-brown/25">
              ·
            </span>
            <div className="flex items-center gap-1">
              <dt className="sr-only">Chapters</dt>
              <dd>
                {story.chapters.length} {t.card.chapters}
              </dd>
            </div>
            <span aria-hidden className="text-brown/25">
              ·
            </span>
            <div className="flex items-center gap-1">
              <dt className="sr-only">Age group</dt>
              <dd>{story.ageGroup ? pick(story.ageGroup) : t.card.ages}</dd>
            </div>
          </dl>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {languages.map((language) => (
              <span
                key={language}
                className="rounded-full border border-brown/15 px-2 py-0.5 text-[.62rem] tracking-wide text-brown/60"
              >
                {language}
              </span>
            ))}
          </div>

          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[.78rem] font-medium uppercase tracking-[.14em] text-terra">
            {t.card.read}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  )
}

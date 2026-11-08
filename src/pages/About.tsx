import { Link } from 'react-router-dom'
import { STORIES } from '../data/stories'

const PRINCIPLES = [
  {
    title: 'Living tradition, not fixed text',
    body: 'Kerala’s stories exist in many regional tellings. KathaVerse keeps variations visible instead of collapsing them into one “correct” version.',
  },
  {
    title: 'Sources on the page',
    body: 'Every story carries its printed and oral references — Aithihyamala, ethnographic studies, temple records — alongside the narrative itself.',
  },
  {
    title: 'Ritual is not spectacle',
    body: 'Theyyam, Mudiyettu and other sacred practices are documented as religious traditions with community authorship, not as performances for tourists.',
  },
  {
    title: 'Language as heritage',
    body: 'Malayalam sits beside English everywhere: titles, glossary terms and full chapter texts, with Malayalam-compatible typography.',
  },
]

export function About() {
  return (
    <div className="container-page pb-8 pt-12">
      <header className="max-w-3xl">
        <p className="text-[.6rem] uppercase tracking-[.26em] text-terra">About</p>
        <h1 className="mt-3 text-4xl leading-[1.08] sm:text-5xl">
          A living archive of Kerala's cultural memory.
        </h1>
        <p className="mt-5 max-w-2xl text-[.98rem] leading-[1.85] text-brown/75">
          KathaVerse collects the folklore, mythology, legends, ritual traditions
          and sacred art of Kerala into illustrated books you can read slowly — in
          English or Malayalam, with sources, glossary and narration. The archive
          is a community effort: the first four books are documented narratives,
          and the shelf grows through contributions.
        </p>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((principle) => (
          <article
            key={principle.title}
            className="rounded-xl border border-brown/12 bg-paper-deep/40 p-6"
          >
            <h2 className="font-display text-xl leading-snug">{principle.title}</h2>
            <p className="mt-2.5 text-[.86rem] leading-[1.8] text-brown/65">
              {principle.body}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-2xl sm:text-3xl">In the archive</h2>
          <ul className="mt-5 divide-y divide-brown/10 border-y border-brown/10">
            {STORIES.map((story) => (
              <li key={story.id} className="py-3.5">
                <Link
                  to={`/stories/${story.id}`}
                  className="flex items-baseline justify-between gap-4"
                >
                  <span className="font-display text-lg">{story.title.en}</span>
                  <span className="text-[.66rem] uppercase tracking-[.14em] text-brown/45">
                    {story.chapters.length} chapters · {story.readingTime} min
                  </span>
                </Link>
                <p className="mt-1 text-[.78rem] text-brown/55">{story.subtitle.en}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[.74rem] leading-relaxed text-brown/45">
            Documentation in progress: Kerala Backwaters, Vadakkunnathan Temple,
            Kathakali, Vallam Kali and Onam Pookalam are next on the shelf.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl">Attribution & care</h2>
          <p className="mt-5 text-[.88rem] leading-[1.85] text-brown/70">
            The narratives are retellings drawn from published documentation of
            Kerala's oral tradition. Where a story is attributed to a community
            practice, the archive names it and links its sources. Nothing here is
            presented as a single authoritative version, and no sacred practice is
            reproduced as entertainment.
          </p>
          <ul className="mt-4 space-y-2 text-[.8rem] leading-relaxed text-brown/65">
            <li className="border-l border-gold/60 pl-3">
              Aithihyamala — Kottarathil Sankunni (1909)
            </li>
            <li className="border-l border-gold/60 pl-3">
              Theyyam: A Study of the Spirit Cult of Malabar — K.K.N. Kurup
            </li>
            <li className="border-l border-gold/60 pl-3">
              Traditional Architecture of Kerala — Thachu Shastra sources
            </li>
            <li className="border-l border-gold/60 pl-3">
              UNESCO Intangible Cultural Heritage documentation
            </li>
          </ul>

          <div className="mt-8 rounded-xl border border-brown/12 bg-paper-deep/50 p-6">
            <h3 className="font-display text-xl">Add a story</h3>
            <p className="mt-2 text-[.84rem] leading-relaxed text-brown/65">
              Know a version of these legends, or a tradition that belongs here?
              Submissions go through review before publication.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/contribute"
                className="rounded-full bg-terra px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-paper hover:bg-brown"
              >
                Contribute
              </Link>
              <Link
                to="/explore"
                className="rounded-full border border-brown/25 px-4 py-2 text-[.68rem] uppercase tracking-[.14em] text-brown/70 hover:border-brown hover:text-brown"
              >
                Browse the archive
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

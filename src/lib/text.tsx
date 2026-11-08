import type { ReactNode } from 'react'
import type { GlossaryTerm } from '../data/types'

const escapePattern = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function withGlossary(
  text: string,
  glossary: GlossaryTerm[],
  keyBase: string,
): ReactNode[] {
  if (!text) return []
  if (glossary.length === 0) return [text]

  const sorted = [...glossary].sort((a, b) => b.term.length - a.term.length)
  const pattern = new RegExp(
    `\\b(${sorted.map((entry) => escapePattern(entry.term)).join('|')})\\b`,
    'gi',
  )
  const parts = text.split(pattern)

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const match = sorted.find(
        (entry) => entry.term.toLowerCase() === part.toLowerCase(),
      )
      return (
        <span
          key={`${keyBase}-g${index}`}
          className="glossary-term"
          title={match ? `${match.term} — ${match.meaning}` : undefined}
          tabIndex={0}
        >
          {part}
        </span>
      )
    }
    return <span key={`${keyBase}-t${index}`}>{part}</span>
  })
}

function inline(
  text: string,
  glossary: GlossaryTerm[],
  keyBase: string,
): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let counter = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        ...withGlossary(
          text.slice(lastIndex, match.index),
          glossary,
          `${keyBase}-p${counter}`,
        ),
      )
    }
    if (match[1]) {
      nodes.push(
        <strong key={`${keyBase}-b${counter}`} className="font-semibold">
          {withGlossary(match[1], glossary, `${keyBase}-bb${counter}`)}
        </strong>,
      )
    } else if (match[2]) {
      nodes.push(
        <em key={`${keyBase}-i${counter}`}>
          {withGlossary(match[2], glossary, `${keyBase}-ii${counter}`)}
        </em>,
      )
    }
    lastIndex = match.index + match[0].length
    counter += 1
  }

  if (lastIndex < text.length) {
    nodes.push(
      ...withGlossary(text.slice(lastIndex), glossary, `${keyBase}-tail`),
    )
  }

  return nodes
}

interface RichTextProps {
  text: string
  glossary?: GlossaryTerm[]
}

/**
 * Renders the story content stored in src/data/stories.ts: blank-line separated
 * blocks, **bold** pseudo-headings, *italic* lines and "- " bullet lists.
 */
export function RichText({ text, glossary = [] }: RichTextProps) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div className="story-prose">
      {blocks.map((block, index) => {
        const img = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
        if (img) {
          return (
            <figure key={`block-${index}`} className="my-4">
              <img src={img[2].trim()} alt={img[1]} loading="lazy" className="w-full rounded-lg border border-brown/10 object-cover" />
              {img[1] ? <figcaption className="mt-1.5 text-center text-[.72rem] text-brown/45">{img[1]}</figcaption> : null}
            </figure>
          )
        }

        if (block.startsWith('- ')) {
          const items = block
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.startsWith('- '))
          return (
            <ul key={`block-${index}`}>
              {items.map((item, itemIndex) => (
                <li key={`item-${itemIndex}`}>
                  {inline(
                    item.replace(/^-\s+/, ''),
                    glossary,
                    `${index}-${itemIndex}`,
                  )}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={`block-${index}`}>
            {inline(block.replace(/\n/g, ' '), glossary, String(index))}
          </p>
        )
      })}
    </div>
  )
}

/** Plain text version (for narration / meta descriptions). */
export function toPlainText(text: string) {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^-\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

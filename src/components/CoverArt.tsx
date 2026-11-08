import { useState } from 'react'

interface CoverArtProps {
  src: string
  alt: string
  className?: string
}

/** Story illustration with a warm typographic fallback if the file is missing. */
export function CoverArt({ src, alt, className }: CoverArtProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`cover-fallback ${className ?? ''}`} role="img" aria-label={alt}>
        <span className="font-display text-3xl text-brown/40">ക</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

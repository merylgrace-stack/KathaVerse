import { useState, type FormEvent, type ReactNode, type ChangeEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../data/stories'
import type { Category, Language } from '../data/types'
import { ApiError, api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useLanguage } from '../lib/language'

const EMPTY_FORM = {
  title: '',
  description: '',
  language: 'en' as Language,
  category: 'folklore' as Category,
  content: '',
  sources: '',
  authorName: '',
  authorEmail: '',
  ownedContent: false,
}

export function Contribute() {
  const { pick } = useLanguage()
  const { user, serverReachable } = useAuth()
  const location = useLocation()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const update = <K extends keyof typeof EMPTY_FORM>(
    key: K,
    value: (typeof EMPTY_FORM)[K],
  ) => setForm((current) => ({ ...current, [key]: value }))

  if (!user) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-lg rounded-xl border border-brown/12 bg-paper-deep/40 p-8 text-center">
          <p className="text-[.6rem] uppercase tracking-[.24em] text-terra">Community archive</p>
          <h1 className="mt-2 font-display text-2xl">Sign in to contribute</h1>
          <p className="mt-3 text-[.88rem] leading-relaxed text-brown/65">
            Create an account or sign in to submit a story. Submissions go to the
            editorial dashboard for review before publication.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link
              to={`/login?next=${encodeURIComponent(location.pathname)}`}
              className="rounded-full bg-brown px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-paper hover:bg-terra"
            >
              Sign in
            </Link>
            <Link
              to={`/register?next=${encodeURIComponent(location.pathname)}`}
              className="rounded-full border border-brown/25 px-5 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-brown/70 hover:border-brown hover:text-brown"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const { url } = await api.upload.image(file)
      setUploadedImages((prev) => [...prev, url])
      // Auto-insert markdown image reference at end of story content
      update('content', form.content + (form.content ? '\n\n' : '') + `![illustration](${url})`)
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'Image upload failed.')
    } finally {
      setUploading(false)
      event.target.value = '' // reset file input
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!form.title.trim() || !form.description.trim() || !form.content.trim()) {
      setError('A title, a short description and the story text are required.')
      return
    }
    if (!form.ownedContent) {
      setError(
        'Please confirm the story is your own telling or documented, with sources listed.',
      )
      return
    }

    setBusy(true)
    try {
      await api.contributions.create({
        title: form.title.trim(),
        description: form.description.trim(),
        language: form.language,
        category: form.category,
        content: form.content.trim(),
        sources: form.sources.trim(),
        authorName: form.authorName.trim() || user.name,
        authorEmail: form.authorEmail.trim() || user.email,
        ownedContent: true,
      })
      setForm((current) => ({
        ...EMPTY_FORM,
        authorName: current.authorName || user.name,
        authorEmail: current.authorEmail || user.email,
      }))
      setSubmitted(true)
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not submit the story. Check that the API server is running.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-page pb-8 pt-12">
      <header className="max-w-2xl">
        <p className="text-[.6rem] uppercase tracking-[.26em] text-terra">
          Community archive
        </p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Contribute a story</h1>
        <p className="mt-4 text-[.94rem] leading-relaxed text-brown/70">
          Regional variations, family accounts, ritual detail — the archive grows
          through people who still tell these stories. Every submission is
          reviewed by an editor before it is published.
        </p>
      </header>

      {!serverReachable && (
        <p className="mt-4 max-w-2xl rounded-md border border-terra/40 bg-terra/10 px-3 py-2 text-[.8rem] text-terra">
          The account/story API is not reachable. Start it with <code>npm run server</code>{' '}
          (port 8787) so submissions can be saved for review.
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-brown/12 bg-paper-deep/40 p-5 sm:p-7"
        >
          {submitted && (
            <div className="mb-5 rounded-lg border border-green/40 bg-green/10 p-3.5 text-[.82rem] text-brown/75">
              <p className="font-display text-base">Sent for review</p>
              <p className="mt-1 leading-relaxed">
                Your submission is saved to the KathaVerse database. Reviewers and editors
                can read, edit, and review it in the editorial dashboard.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Story title" htmlFor="title" className="sm:col-span-2">
              <input
                id="title"
                value={form.title}
                onChange={(event) => update('title', event.target.value)}
                placeholder="e.g. The Serpent Shrines of Mannarsala"
                className={inputClass}
              />
            </Field>

            <Field label="Short description" htmlFor="description" className="sm:col-span-2">
              <textarea
                id="description"
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
                rows={2}
                placeholder="One or two sentences for the story card."
                className={inputClass}
              />
            </Field>

            <Field label="Language" htmlFor="language">
              <select
                id="language"
                value={form.language}
                onChange={(event) => update('language', event.target.value as Language)}
                className={inputClass}
              >
                <option value="en">English</option>
                <option value="ml">മലയാളം</option>
              </select>
            </Field>

            <Field label="Category" htmlFor="category">
              <select
                id="category"
                value={form.category}
                onChange={(event) => update('category', event.target.value as Category)}
                className={inputClass}
              >
                {CATEGORIES.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {pick(entry.label)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="The story" htmlFor="content" className="sm:col-span-2">
              <textarea
                id="content"
                value={form.content}
                onChange={(event) => update('content', event.target.value)}
                rows={11}
                placeholder={'Tell the story. Separate sections with a blank line; use **bold** for headings.\n\nAdd pictures with Markdown: ![caption](https://image-url)'}
                className={inputClass}
              />
            </Field>

            <Field
              label="Sources & references"
              htmlFor="sources"
              className="sm:col-span-2"
              hint='Books, elders, temple records, or “oral tradition, told by …”'
            >
              <textarea
                id="sources"
                value={form.sources}
                onChange={(event) => update('sources', event.target.value)}
                rows={3}
                className={inputClass}
              />
            </Field>

            {/* Image upload section */}
            <div className="sm:col-span-2">
              <p className="block text-[.62rem] uppercase tracking-[.16em] text-brown/55">
                Illustrations & images
              </p>
              <p className="mt-1 text-[.66rem] text-brown/40">
                Upload images to include in your story (JPEG, PNG, WebP — max 5 MB each)
              </p>
              <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-brown/30 bg-paper px-4 py-3 text-[.8rem] text-brown/60 hover:border-terra hover:text-terra transition-colors">
                <span>{uploading ? 'Uploading…' : '+ Upload an image'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {uploadError && (
                <p className="mt-1.5 text-[.76rem] text-terra">{uploadError}</p>
              )}
              {uploadedImages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {uploadedImages.map((url) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        alt="uploaded illustration"
                        className="h-20 w-20 rounded-md object-cover border border-brown/20"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Field label="Your name" htmlFor="authorName">
              <input
                id="authorName"
                value={form.authorName}
                onChange={(event) => update('authorName', event.target.value)}
                placeholder={user.name}
                className={inputClass}
              />
            </Field>

            <Field label="Email" htmlFor="authorEmail">
              <input
                id="authorEmail"
                type="email"
                value={form.authorEmail}
                onChange={(event) => update('authorEmail', event.target.value)}
                placeholder={user.email}
                className={inputClass}
              />
            </Field>
          </div>

          <label className="mt-5 flex items-start gap-3 text-[.82rem] leading-relaxed text-brown/70">
            <input
              type="checkbox"
              checked={form.ownedContent}
              onChange={(event) => update('ownedContent', event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#a6533c]"
            />
            <span>
              This is my own telling, or a documented tradition whose sources I
              have listed. I understand it will be reviewed before publishing.
            </span>
          </label>

          {error && (
            <p className="mt-4 rounded-md border border-terra/40 bg-terra/10 px-3 py-2 text-[.8rem] text-terra">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 rounded-full bg-terra px-6 py-2.5 text-[.72rem] uppercase tracking-[.16em] text-paper transition-colors hover:bg-brown disabled:opacity-50"
          >
            {busy ? 'Submitting…' : 'Submit for review'}
          </button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-xl border border-brown/12 bg-paper-deep/40 p-5">
            <h2 className="text-[.6rem] uppercase tracking-[.24em] text-terra">
              What makes a strong submission
            </h2>
            <ul className="mt-3 space-y-2.5 text-[.82rem] leading-relaxed text-brown/70">
              <li>Name the place and the community the story belongs to.</li>
              <li>Keep regional variation visible instead of smoothing it out.</li>
              <li>List sources — printed, oral, or archival.</li>
              <li>Avoid presenting living ritual as spectacle.</li>
              <li>Add images as URLs using <code>![caption](url)</code> in the story text.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-brown/12 bg-paper-deep/40 p-5">
            <h2 className="text-[.6rem] uppercase tracking-[.24em] text-terra">
              After you submit
            </h2>
            <p className="mt-2 text-[.82rem] leading-relaxed text-brown/60">
              Submissions are stored in the backend and appear in the editorial dashboard.
              Reviewers can read the text, make edits, add image links, and approve it for
              publication.
            </p>
            {user.role === 'reviewer' || user.role === 'admin' ? (
              <Link
                to="/admin"
                className="mt-3 inline-block text-[.68rem] uppercase tracking-[.14em] text-terra hover:opacity-70"
              >
                Open editorial dashboard →
              </Link>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  )
}

const inputClass =
  'mt-1.5 w-full rounded-md border border-brown/20 bg-paper px-3 py-2 text-sm text-brown placeholder:text-brown/35 focus:border-terra focus:outline-none'

function Field({
  label,
  htmlFor,
  children,
  className,
  hint,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  className?: string
  hint?: string
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-[.62rem] uppercase tracking-[.16em] text-brown/55"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-[.66rem] text-brown/40">{hint}</p> : null}
    </div>
  )
}

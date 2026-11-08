import { useCallback, useEffect, useRef, useState } from 'react'
import type { Bookmark, Language, ReadingProgress, Submission } from '../data/types'
import { STORAGE_KEYS } from '../data/storageKeys'

type Listener = () => void

const listeners = new Map<string, Set<Listener>>()

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener())
}

export function writeStored(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage may be unavailable (private mode / full quota). Keep the session usable.
  }
  notify(key)
}

/**
 * Subscribes to one localStorage key so several components stay in sync.
 * The fallback is held in a ref so passing a fresh literal each render cannot loop.
 */
export function useStored<T>(key: string, fallback: T) {
  const fallbackRef = useRef(fallback)
  const [value, setValue] = useState<T>(() => readStored(key, fallbackRef.current))

  useEffect(() => {
    const update = () => setValue(readStored(key, fallbackRef.current))
    let set = listeners.get(key)
    if (!set) {
      set = new Set<Listener>()
      listeners.set(key, set)
    }
    set.add(update)
    update()
    return () => {
      set?.delete(update)
    }
  }, [key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readStored(key, fallbackRef.current)
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(prev) : next
      writeStored(key, resolved)
      setValue(resolved)
    },
    [key],
  )

  return [value, set] as const
}

export function useLanguagePreference() {
  return useStored<Language>(STORAGE_KEYS.LANGUAGE, 'en')
}

export function useProgress() {
  return useStored<ReadingProgress[]>(STORAGE_KEYS.READING_PROGRESS, [])
}

export function saveReadingProgress(entry: ReadingProgress) {
  const all = readStored<ReadingProgress[]>(STORAGE_KEYS.READING_PROGRESS, [])
  const next = [entry, ...all.filter((item) => item.storyId !== entry.storyId)]
  writeStored(STORAGE_KEYS.READING_PROGRESS, next.slice(0, 40))
}

export function useBookmarks() {
  return useStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, [])
}

export function bookmarkId(storyId: string, chapterId: string) {
  return `${storyId}:${chapterId}`
}

export function toggleBookmark(storyId: string, chapterId: string, note?: string) {
  const all = readStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, [])
  const id = bookmarkId(storyId, chapterId)
  const exists = all.some((item) => item.id === id)
  const next = exists
    ? all.filter((item) => item.id !== id)
    : [
        {
          id,
          storyId,
          chapterId,
          note,
          createdAt: new Date().toISOString(),
        },
        ...all,
      ]
  writeStored(STORAGE_KEYS.BOOKMARKS, next)
  return !exists
}

export function useSubmissions() {
  return useStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, [])
}

export interface LocalProfile {
  name: string
}

export const PROFILE_KEY = 'kathaverse_profile'

export function useProfile() {
  return useStored<LocalProfile>(PROFILE_KEY, { name: '' })
}

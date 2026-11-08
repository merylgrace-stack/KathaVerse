import { CATEGORIES, STORIES } from '../data/stories'
import type { Category, Story } from '../data/types'

export function categoryLabel(id: Category) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? {
    en: id,
    ml: id,
  }
}

export function categoryIcon(id: Category) {
  return CATEGORIES.find((category) => category.id === id)?.icon ?? '•'
}

export function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function storyLanguages(story: Story): string[] {
  const languages: string[] = []
  if (story.chapters.some((chapter) => chapter.content.en.trim().length > 0)) {
    languages.push('English')
  }
  if (story.chapters.some((chapter) => chapter.content.ml.trim().length > 0)) {
    languages.push('മലയാളം')
  }
  return languages
}

export function findStory(storyId: string | undefined) {
  return STORIES.find((story) => story.id === storyId)
}

export function chapterTitle(story: Story, chapterId: string) {
  return (
    story.chapters.find((chapter) => chapter.id === chapterId)?.title ?? {
      en: 'Story',
      ml: 'കഥ',
    }
  )
}

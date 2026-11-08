export type Language = 'en' | 'ml';

export type Category =
  | 'folklore'
  | 'mythology'
  | 'legend'
  | 'ritual'
  | 'art'
  | 'festival'
  | 'tradition';

export interface GlossaryTerm {
  term: string;
  meaning: string;
  pronunciation?: string;
}

export interface Chapter {
  id: string;
  title: { en: string; ml: string };
  content: { en: string; ml: string };
  imageUrl?: string;
  audioUrl?: string;
}

export interface Story {
  id: string;
  title: { en: string; ml: string };
  subtitle: { en: string; ml: string };
  description: { en: string; ml: string };
  coverImage: string;
  category: Category;
  readingTime: number; // minutes
  chapters: Chapter[];
  glossary: GlossaryTerm[];
  sources: string[];
  tags: string[];
  featured: boolean;
  trending: boolean
  ageGroup?: { en: string; ml: string };
  createdAt: string;
}

export interface ReadingProgress {
  storyId: string;
  chapterId: string;
  progress: number; // 0–100
  lastReadAt: string;
}

export interface Bookmark {
  id: string;
  storyId: string;
  chapterId: string;
  note?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  language: Language;
  category: Category;
  content: string;
  sources: string;
  authorName: string;
  authorEmail: string;
  ownedContent: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewNote?: string;
}

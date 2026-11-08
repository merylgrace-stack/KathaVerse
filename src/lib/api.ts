export type Role = 'reader' | 'contributor' | 'reviewer' | 'admin'

export interface ApiUser {
  id: string
  email: string
  name: string
  role: Role
}

export interface ContributionRecord {
  id: string
  title: string
  description: string
  language: 'en' | 'ml'
  category: string
  content: string
  sources: string
  authorName: string
  authorEmail: string
  ownedContent: boolean
  status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'published' | 'rejected'
  reviewNote?: string | null
  submittedAt: string
  updatedAt: string
  user?: { id: string; name: string; email: string } | null
  reviews?: ReviewRecord[]
}

export interface ReviewRecord {
  id: string
  decision: string
  comment?: string | null
  createdAt: string
  reviewer?: { id: string; name: string; email: string; role: string } | null
}

export interface AuditRecord {
  id: string
  action: string
  target: string
  detail?: string | null
  createdAt: string
  actor?: { id: string; name: string; role: string } | null
}

export interface StoryRecord {
  slug: string
  titleEn: string
  titleMl: string
  status: string
  chapters?: unknown[]
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // Non-JSON error body; keep the status message.
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  me: () => request<{ user: ApiUser | null }>('/auth/me'),
  login: (email: string, password: string) =>
    request<{ user: ApiUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<{ user: ApiUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  logout: () => request<{ ok: true }>('/auth/logout', { method: 'POST' }),

  stories: {
    list: (params?: { q?: string; category?: string }) => {
      const search = new URLSearchParams()
      if (params?.q) search.set('q', params.q)
      if (params?.category) search.set('category', params.category)
      const suffix = search.toString()
      return request<{ stories: StoryRecord[] }>(`/stories${suffix ? `?${suffix}` : ''}`)
    },
    get: (slug: string) => request<{ story: StoryRecord }>(`/stories/${slug}`),
  },

  contributions: {
    mine: () => request<{ contributions: ContributionRecord[] }>('/me/contributions'),
    create: (payload: Record<string, unknown>) =>
      request<{ contribution: ContributionRecord }>('/contributions', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  upload: {
    image: async (file: File): Promise<{ url: string }> => {
      const form = new FormData()
      form.append('image', file)
      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: form,
        // Don't set Content-Type — browser sets it with boundary automatically
      })
      if (!response.ok) {
        let message = `Upload failed (${response.status})`
        try {
          const body = (await response.json()) as { error?: string }
          if (body.error) message = body.error
        } catch { /* ignore */ }
        throw new ApiError(response.status, message)
      }
      return response.json() as Promise<{ url: string }>
    },
  },

  admin: {
    queue: (status?: string) =>
      request<{ contributions: ContributionRecord[] }>(
        `/admin/contributions${status && status !== 'all' ? `?status=${status}` : ''}`,
      ),
    updateContribution: (id: string, payload: Record<string, unknown>) =>
      request<{ contribution: ContributionRecord }>(`/admin/contributions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    review: (id: string, decision: 'approved' | 'rejected', comment: string) =>
      request<{ contribution: ContributionRecord }>(
        `/admin/contributions/${id}/review`,
        {
          method: 'POST',
          body: JSON.stringify({ decision, comment }),
        },
      ),
    audit: () => request<{ entries: AuditRecord[] }>('/admin/audit'),
    users: () => request<{ users: ApiUser[] }>('/admin/users'),
    createUser: (payload: { name: string; email: string; password: string; role: Role }) =>
      request<{ user: ApiUser }>('/admin/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
}

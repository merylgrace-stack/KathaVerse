import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import cookieParser from 'cookie-parser'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { prisma } from './db.js'
import {
  attachUser,
  clearSession,
  hashPassword,
  issueSession,
  requireAuth,
  requireRole,
  sameOrigin,
  verifyPassword,
} from './auth.js'

const app = express()
const PORT = Number(process.env.PORT) || 8787
const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(here, '..', 'dist')

app.disable('x-powered-by')
app.use(express.json({ limit: '256kb' }))
app.use(cookieParser())
app.use('/api', attachUser)
app.use('/api', sameOrigin)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again in a few minutes.' },
})

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Upload limit reached. Try again in a few minutes.' },
})

const text = (value, max = 4000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''
const email = (value) => text(value, 200).toLowerCase()
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const publicUser = { id: true, email: true, name: true, role: true, createdAt: true }

async function audit(actorId, action, target, detail = null) {
  await prisma.auditLog.create({ data: { actorId, action, target, detail } })
}

/* ---------------------------------- health --------------------------------- */

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, database: 'up' })
  } catch {
    res.status(503).json({ ok: false, database: 'down' })
  }
})

/* ----------------------------------- auth ---------------------------------- */

app.post('/api/auth/register', authLimiter, async (req, res) => {
  const name = text(req.body?.name, 80)
  const address = email(req.body?.email)
  const password = text(req.body?.password, 200)

  if (!isEmail(address) || password.length < 8) {
    return res
      .status(400)
      .json({ error: 'A valid email and a password of at least 8 characters are required.' })
  }

  const existing = await prisma.user.findUnique({ where: { email: address } })
  if (existing) return res.status(409).json({ error: 'That email is already registered.' })

  // Public signup can only ever create a contributor. Roles are never taken
  // from the request body.
  const user = await prisma.user.create({
    data: {
      name: name || address.split('@')[0],
      email: address,
      passwordHash: await hashPassword(password),
      role: 'contributor',
    },
    select: publicUser,
  })

  issueSession(res, user)
  res.status(201).json({ user })
})

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const address = email(req.body?.email)
  const password = text(req.body?.password, 200)
  if (!address || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const account = await prisma.user.findUnique({ where: { email: address } })
  if (!account || !(await verifyPassword(password, account.passwordHash))) {
    return res.status(401).json({ error: 'Email or password is incorrect.' })
  }

  const user = { id: account.id, email: account.email, name: account.name, role: account.role }
  issueSession(res, user)
  await audit(account.id, 'auth.login', `user:${account.id}`)
  res.json({ user })
})

app.post('/api/auth/logout', (req, res) => {
  clearSession(res)
  res.json({ ok: true })
})

app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.user })
})

/* ---------------------------------- stories -------------------------------- */

const PUBLIC_STORY = {
  id: true,
  slug: true,
  titleEn: true,
  titleMl: true,
  subtitleEn: true,
  subtitleMl: true,
  descriptionEn: true,
  descriptionMl: true,
  coverImage: true,
  category: true,
  readingTime: true,
  featured: true,
  trending: true,
  status: true,
  createdAt: true,
  publishedAt: true,
}

app.get('/api/stories', async (req, res) => {
  const q = text(req.query.q, 120)
  const category = text(req.query.category, 40)
  const language = text(req.query.language, 8)

  const where = {
    // Readers only ever see published stories.
    status: 'published',
    ...(category && category !== 'all' ? { category } : {}),
    ...(q
      ? {
          OR: [
            { titleEn: { contains: q } },
            { titleMl: { contains: q } },
            { descriptionEn: { contains: q } },
            { subtitleEn: { contains: q } },
            { category: { contains: q } },
          ],
        }
      : {}),
    ...(language === 'en' || language === 'ml'
      ? { translations: { some: { language, status: { in: ['reviewed', 'approved'] } } } }
      : {}),
  }

  const stories = await prisma.story.findMany({
    where,
    select: { ...PUBLIC_STORY, _count: { select: { chapters: true } } },
    orderBy: [{ featured: 'desc' }, { readingTime: 'asc' }],
  })

  res.json({ stories })
})

app.get('/api/stories/:slug', async (req, res) => {
  const story = await prisma.story.findFirst({
    where: { slug: req.params.slug, status: 'published' },
    include: {
      chapters: { orderBy: { position: 'asc' } },
      translations: true,
    },
  })

  if (!story) return res.status(404).json({ error: 'Story not found.' })
  res.json({ story })
})

app.get('/api/search', async (req, res) => {
  const q = text(req.query.q, 120)
  if (!q) return res.json({ stories: [] })

  const stories = await prisma.story.findMany({
    where: {
      status: 'published',
      OR: [
        { titleEn: { contains: q } },
        { titleMl: { contains: q } },
        { descriptionEn: { contains: q } },
        { subtitleEn: { contains: q } },
        { category: { contains: q } },
      ],
    },
    select: PUBLIC_STORY,
    take: 20,
  })

  res.json({ stories })
})

/* ------------------------------- contributions ----------------------------- */

const CONTRIBUTION_SELECT = {
  id: true,
  title: true,
  description: true,
  language: true,
  category: true,
  content: true,
  sources: true,
  authorName: true,
  authorEmail: true,
  ownedContent: true,
  status: true,
  reviewNote: true,
  submittedAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true, email: true } },
}

app.post('/api/contributions', requireAuth, async (req, res) => {
  const body = req.body ?? {}
  const title = text(body.title, 200)
  const description = text(body.description, 2000)
  const content = text(body.content, 60000)
  const category = text(body.category, 40)
  const language = body.language === 'ml' ? 'ml' : 'en'
  const sources = text(body.sources, 4000)
  const authorName = text(body.authorName, 120) || req.user.name
  const authorEmail = email(body.authorEmail) || req.user.email

  if (!title || !description || !content) {
    return res
      .status(400)
      .json({ error: 'A title, a short description and the story text are required.' })
  }
  if (body.ownedContent !== true) {
    return res
      .status(400)
      .json({ error: 'Confirm the telling is your own or its sources are listed.' })
  }

  const contribution = await prisma.contribution.create({
    data: {
      title,
      description,
      language,
      category: category || 'folklore',
      content,
      sources,
      authorName,
      authorEmail,
      ownedContent: true,
      status: 'submitted',
      userId: req.user.id,
    },
    select: CONTRIBUTION_SELECT,
  })

  await audit(req.user.id, 'contribution.submitted', `contribution:${contribution.id}`)
  res.status(201).json({ contribution })
})

app.get('/api/me/contributions', requireAuth, async (req, res) => {
  const contributions = await prisma.contribution.findMany({
    where: { userId: req.user.id },
    select: { ...CONTRIBUTION_SELECT, reviews: true },
    orderBy: { submittedAt: 'desc' },
  })
  res.json({ contributions })
})

/* --------------------------------- editorial ------------------------------- */

app.get(
  '/api/admin/contributions',
  requireRole('reviewer', 'admin'),
  async (req, res) => {
    const status = text(req.query.status, 30)
    const contributions = await prisma.contribution.findMany({
      where: status && status !== 'all' ? { status } : {},
      select: {
        ...CONTRIBUTION_SELECT,
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: { reviewer: { select: { id: true, name: true, email: true, role: true } } },
        },
      },
      orderBy: { submittedAt: 'desc' },
    })
    res.json({ contributions })
  },
)

app.patch(
  '/api/admin/contributions/:id',
  requireRole('reviewer', 'admin'),
  async (req, res) => {
    const body = req.body ?? {}
    const existing = await prisma.contribution.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    })
    if (!existing) return res.status(404).json({ error: 'Submission not found.' })

    const data = {}
    if (body.title !== undefined) data.title = text(body.title, 200)
    if (body.description !== undefined) data.description = text(body.description, 2000)
    if (body.content !== undefined) data.content = text(body.content, 120000)
    if (body.sources !== undefined) data.sources = text(body.sources, 4000)
    if (body.category !== undefined) data.category = text(body.category, 40)
    if (body.language !== undefined) data.language = body.language === 'ml' ? 'ml' : 'en'

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No editable fields provided.' })
    }
    if (data.title === '' || data.content === '') {
      return res.status(400).json({ error: 'Title and story content cannot be empty.' })
    }

    const contribution = await prisma.contribution.update({
      where: { id: existing.id },
      data,
      select: {
        ...CONTRIBUTION_SELECT,
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: { reviewer: { select: { id: true, name: true, email: true, role: true } } },
        },
      },
    })

    await audit(req.user.id, 'contribution.edited', `contribution:${contribution.id}`)
    res.json({ contribution })
  },
)

app.post(
  '/api/admin/contributions/:id/review',
  requireRole('reviewer', 'admin'),
  async (req, res) => {
    const decision = req.body?.decision
    const comment = text(req.body?.comment, 2000)

    if (decision !== 'approved' && decision !== 'rejected') {
      return res.status(400).json({ error: 'Decision must be approved or rejected.' })
    }

    const existing = await prisma.contribution.findUnique({
      where: { id: req.params.id },
      select: { id: true, status: true, title: true },
    })
    if (!existing) return res.status(404).json({ error: 'Submission not found.' })
    if (existing.status === 'published') {
      return res.status(409).json({ error: 'Published stories cannot be re-reviewed.' })
    }

    const [contribution] = await prisma.$transaction([
      prisma.contribution.update({
        where: { id: existing.id },
        data: {
          status: decision,
          reviewNote: comment || null,
          reviews: {
            create: {
              reviewerId: req.user.id,
              decision,
              comment: comment || null,
            },
          },
        },
        select: {
          ...CONTRIBUTION_SELECT,
          reviews: { include: { reviewer: { select: { id: true, name: true, role: true } } } },
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          action: `contribution.${decision}`,
          target: `contribution:${existing.id}`,
          detail: comment || null,
        },
      }),
    ])

    res.json({ contribution })
  },
)

app.get('/api/admin/audit', requireRole('admin'), async (_req, res) => {
  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { actor: { select: { id: true, name: true, role: true } } },
  })
  res.json({ entries })
})

app.get('/api/admin/users', requireRole('admin'), async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { ...publicUser, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  res.json({ users })
})

app.post('/api/admin/users', requireRole('admin'), async (req, res) => {
  const name = text(req.body?.name, 80)
  const address = email(req.body?.email)
  const password = text(req.body?.password, 200)
  const role = req.body?.role

  if (!isEmail(address)) return res.status(400).json({ error: 'A valid email is required.' })
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  }
  if (role !== 'reviewer' && role !== 'admin') {
    return res.status(400).json({ error: 'Role must be reviewer or admin.' })
  }

  const existing = await prisma.user.findUnique({ where: { email: address } })
  if (existing) return res.status(409).json({ error: 'That email already has an account.' })

  const user = await prisma.user.create({
    data: {
      name: name || address.split('@')[0],
      email: address,
      passwordHash: await hashPassword(password),
      role,
    },
    select: publicUser,
  })

  await audit(req.user.id, 'user.created', `user:${user.id}`, role)
  res.status(201).json({ user })
})

app.get('/api/admin/translations', requireRole('reviewer', 'admin'), async (_req, res) => {
  const translations = await prisma.translation.findMany({
    include: { story: { select: { slug: true, titleEn: true, titleMl: true } } },
    orderBy: [{ storyId: 'asc' }, { language: 'asc' }],
  })
  res.json({ translations })
})

const TRANSLATION_STATUSES = ['machine_draft', 'reviewed', 'approved']

app.patch(
  '/api/admin/translations/:id',
  requireRole('reviewer', 'admin'),
  async (req, res) => {
    const status = req.body?.status
    if (!TRANSLATION_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Unknown translation status.' })
    }

    const existing = await prisma.translation.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Translation not found.' })

    const translation = await prisma.translation.update({
      where: { id: existing.id },
      data: { status },
    })
    await audit(
      req.user.id,
      'translation.status',
      `translation:${translation.id}`,
      `${existing.language}: ${existing.status} → ${status}`,
    )
    res.json({ translation })
  },
)

const STORY_FLOW = {
  draft: ['submitted'],
  submitted: ['in_review', 'rejected'],
  in_review: ['approved', 'rejected'],
  approved: ['published'],
  published: [],
  rejected: ['draft'],
}

app.patch('/api/admin/stories/:id/status', requireRole('reviewer', 'admin'), async (req, res) => {
  const status = req.body?.status
  const story = await prisma.story.findUnique({ where: { id: req.params.id } })
  if (!story) return res.status(404).json({ error: 'Story not found.' })

  const allowed = STORY_FLOW[story.status] ?? []
  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: `A ${story.status} story cannot move to ${status}.`,
    })
  }

  const updated = await prisma.story.update({
    where: { id: story.id },
    data: { status, publishedAt: status === 'published' ? new Date() : story.publishedAt },
  })
  await audit(req.user.id, 'story.status', `story:${story.id}`, `${story.status} → ${status}`)
  res.json({ story: updated })
})

/* ---------------------------------- upload --------------------------------- */

const uploadsDir = path.resolve(here, '..', 'public', 'uploads')
mkdirSync(uploadsDir, { recursive: true })

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const EXT_MAP = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB

app.post('/api/upload', requireAuth, uploadLimiter, (req, res) => {
  const contentType = req.headers['content-type'] || ''
  const boundaryMatch = contentType.match(/boundary=(.+)$/i)
  if (!contentType.startsWith('multipart/form-data') || !boundaryMatch) {
    return res.status(400).json({ error: 'Request must be multipart/form-data.' })
  }

  const boundary = boundaryMatch[1].trim()
  const chunks = []

  req.on('data', (chunk) => {
    chunks.push(chunk)
    const totalSoFar = chunks.reduce((s, c) => s + c.length, 0)
    if (totalSoFar > MAX_UPLOAD_BYTES + 8192) {
      // Destroy the stream so the 'end' handler won't fire
      req.destroy(new Error('FILE_TOO_LARGE'))
    }
  })

  req.on('error', (err) => {
    if (err.message === 'FILE_TOO_LARGE') {
      return res.status(413).json({ error: 'File exceeds the 5 MB limit.' })
    }
    console.error('[upload]', err)
    return res.status(500).json({ error: 'Upload failed.' })
  })

  req.on('end', () => {
    try {
      const body = Buffer.concat(chunks)
      if (body.length > MAX_UPLOAD_BYTES + 8192) {
        return res.status(413).json({ error: 'File exceeds the 5 MB limit.' })
      }

      const boundaryBuf = Buffer.from(`--${boundary}`)
      const CRLF = Buffer.from('\r\n')
      const CRLFCRLF = Buffer.from('\r\n\r\n')

      // Find the first part that has name="image"
      let searchStart = 0
      let mimeType = null
      let originalExt = ''
      let fileBytes = null

      while (searchStart < body.length) {
        const boundaryStart = body.indexOf(boundaryBuf, searchStart)
        if (boundaryStart === -1) break

        const headerStart = boundaryStart + boundaryBuf.length
        // Skip possible \r\n after boundary
        const headerDataStart = body[headerStart] === 0x0d && body[headerStart + 1] === 0x0a
          ? headerStart + 2
          : headerStart

        const headerEnd = body.indexOf(CRLFCRLF, headerDataStart)
        if (headerEnd === -1) break

        const headersRaw = body.slice(headerDataStart, headerEnd).toString('utf8')
        const dataStart = headerEnd + 4 // skip \r\n\r\n

        // Find where this part ends (next boundary)
        const nextBoundary = body.indexOf(boundaryBuf, dataStart)
        const dataEnd = nextBoundary === -1 ? body.length : nextBoundary - 2 // strip trailing \r\n

        const isImageField = /Content-Disposition:[^\r\n]*name="image"/i.test(headersRaw)
        if (isImageField) {
          const ctMatch = headersRaw.match(/Content-Type:\s*([^\r\n]+)/i)
          mimeType = ctMatch ? ctMatch[1].trim() : null

          // Try to get extension from filename= in Content-Disposition
          const fnMatch = headersRaw.match(/filename="([^"]+)"/i)
          if (fnMatch) {
            originalExt = path.extname(fnMatch[1]).toLowerCase()
          }

          fileBytes = body.slice(dataStart, dataEnd)
          break
        }

        searchStart = nextBoundary === -1 ? body.length : nextBoundary
      }

      if (!fileBytes || fileBytes.length === 0) {
        return res.status(400).json({ error: 'No image file found in request.' })
      }

      if (!mimeType || !ALLOWED_MIME.has(mimeType)) {
        return res.status(415).json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed.' })
      }

      if (fileBytes.length > MAX_UPLOAD_BYTES) {
        return res.status(413).json({ error: 'File exceeds the 5 MB limit.' })
      }

      const ext = EXT_MAP[mimeType] || originalExt || '.bin'
      const filename = crypto.randomBytes(12).toString('hex') + ext
      const dest = path.join(uploadsDir, filename)
      writeFileSync(dest, fileBytes)

      res.status(201).json({ url: `/uploads/${filename}` })
    } catch (err) {
      console.error('[upload]', err)
      res.status(500).json({ error: 'Upload failed.' })
    }
  })
})

/* ---------------------------------- static --------------------------------- */

if (existsSync(dist)) {
  app.use(express.static(path.resolve(here, '..', 'public')))
  app.use(express.static(dist))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }))

app.use((error, _req, res, _next) => {
  console.error('[api]', error)
  if (res.headersSent) return
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`KathaVerse API listening on http://127.0.0.1:${PORT}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => prisma.$disconnect().finally(() => process.exit(0)))
  })
}

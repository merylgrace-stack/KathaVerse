import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db.js'

const COOKIE_NAME = 'kv_session'
const SESSION_DAYS = 7

function secret() {
  const value = process.env.JWT_SECRET
  if (!value || value.length < 24) {
    throw new Error('JWT_SECRET must be set to at least 24 characters.')
  }
  return value
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function issueSession(res, user) {
  const token = jwt.sign({ sub: user.id, role: user.role }, secret(), {
    expiresIn: `${SESSION_DAYS}d`,
  })

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' })
}

const PUBLIC_USER = { id: true, email: true, name: true, role: true, createdAt: true }

/** Resolves the signed-in user from the cookie on every request. */
export async function attachUser(req, _res, next) {
  req.user = null
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return next()

  try {
    const payload = jwt.verify(token, secret())
    if (typeof payload === 'string' || !payload.sub) return next()
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: PUBLIC_USER,
    })
    req.user = user ?? null
  } catch {
    // Expired or tampered token: treat as signed out.
    req.user = null
  }

  next()
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Sign in required.' })
  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Sign in required.' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Your account does not have access to this.' })
    }
    next()
  }
}

const allowedOrigins = new Set(
  [
    process.env.APP_ORIGIN,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    `http://localhost:${process.env.PORT ?? 8787}`,
    `http://127.0.0.1:${process.env.PORT ?? 8787}`,
  ].filter(Boolean),
)

/** Blocks cross-site writes; cookies are SameSite=Lax, this is the second lock. */
export function sameOrigin(req, res, next) {
  const origin = req.get('origin')
  if (!origin) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Missing origin.' })
    }
    return next()
  }
  if (!allowedOrigins.has(origin)) {
    return res.status(403).json({ error: 'Cross-origin request rejected.' })
  }
  next()
}

export { PUBLIC_USER, COOKIE_NAME }

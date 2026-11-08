import crypto from 'node:crypto'
import { hashPassword } from '../server/auth.js'
import { prisma } from '../server/db.js'
import { STORIES } from '../src/data/stories.ts'

function credentials() {
  const address = process.env.ADMIN_EMAIL ?? 'admin@kathaverse.local'
  const provided = process.env.ADMIN_PASSWORD
  const password =
    provided && provided.length >= 12 ? provided : crypto.randomBytes(12).toString('base64url')

  return { address, password, generated: !provided }
}

async function main() {
  for (const story of STORIES) {
    const record = await prisma.story.upsert({
      where: { slug: story.id },
      update: {
        titleEn: story.title.en,
        titleMl: story.title.ml,
        subtitleEn: story.subtitle.en,
        subtitleMl: story.subtitle.ml,
        descriptionEn: story.description.en,
        descriptionMl: story.description.ml,
        coverImage: story.coverImage,
        category: story.category,
        readingTime: story.readingTime,
        featured: story.featured,
        trending: story.trending,
        status: 'published',
        publishedAt: new Date(story.createdAt),
      },
      create: {
        slug: story.id,
        titleEn: story.title.en,
        titleMl: story.title.ml,
        subtitleEn: story.subtitle.en,
        subtitleMl: story.subtitle.ml,
        descriptionEn: story.description.en,
        descriptionMl: story.description.ml,
        coverImage: story.coverImage,
        category: story.category,
        readingTime: story.readingTime,
        featured: story.featured,
        trending: story.trending,
        status: 'published',
        createdAt: new Date(story.createdAt),
        publishedAt: new Date(story.createdAt),
      },
    })

    for (const [position, chapter] of story.chapters.entries()) {
      await prisma.chapter.upsert({
        where: { storyId_position: { storyId: record.id, position } },
        update: {
          titleEn: chapter.title.en,
          titleMl: chapter.title.ml,
          contentEn: chapter.content.en,
          contentMl: chapter.content.ml,
        },
        create: {
          storyId: record.id,
          position,
          titleEn: chapter.title.en,
          titleMl: chapter.title.ml,
          contentEn: chapter.content.en,
          contentMl: chapter.content.ml,
        },
      })
    }

    // English is the source text; Malayalam chapters are community-written and
    // still carry the "reviewed" status until a native reviewer signs them off.
    const translations = [
      { language: 'en', status: 'approved' },
      { language: 'ml', status: 'reviewed' },
    ]

    for (const translation of translations) {
      await prisma.translation.upsert({
        where: { storyId_language: { storyId: record.id, language: translation.language } },
        update: { status: translation.status },
        create: { storyId: record.id, ...translation },
      })
    }
  }

  const { address, password, generated } = credentials()
  const existing = await prisma.user.findUnique({ where: { email: address } })

  if (existing) {
    await prisma.user.update({
      where: { email: address },
      data: { role: 'admin', passwordHash: await hashPassword(password) },
    })
    console.log(`Admin password reset for ${address}.`)
  } else {
    await prisma.user.create({
      data: {
        email: address,
        name: 'KathaVerse Admin',
        role: 'admin',
        passwordHash: await hashPassword(password),
      },
    })
    console.log(`Created admin account ${address}.`)
  }

  if (generated) {
    console.log('')
    console.log('  Generated admin password (save it now, it is not shown again):')
    console.log(`  ${password}`)
    console.log('')
    console.log('  Set ADMIN_PASSWORD in .env to choose your own, then re-run the seed.')
  }

  const reviewerEmail = process.env.SEED_REVIEWER_EMAIL
  const reviewerPassword = process.env.SEED_REVIEWER_PASSWORD
  if (reviewerEmail && reviewerPassword && reviewerPassword.length >= 12) {
    await prisma.user.upsert({
      where: { email: reviewerEmail },
      update: { role: 'reviewer', passwordHash: await hashPassword(reviewerPassword) },
      create: {
        email: reviewerEmail,
        name: 'KathaVerse Reviewer',
        role: 'reviewer',
        passwordHash: await hashPassword(reviewerPassword),
      },
    })
    console.log(`Seeded reviewer account ${reviewerEmail}.`)
  }

  console.log(`Seeded ${STORIES.length} published stories and their chapters.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

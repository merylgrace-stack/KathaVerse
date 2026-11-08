import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function shutdown() {
  await prisma.$disconnect()
}

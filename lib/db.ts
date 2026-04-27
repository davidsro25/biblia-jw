import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../app/generated/prisma"

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function getClient(): PrismaClient {
  if (!global.__prisma) {
    const adapter = new PrismaPg(process.env.DATABASE_URL!)
    global.__prisma = new PrismaClient({ adapter } as any)
  }
  return global.__prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

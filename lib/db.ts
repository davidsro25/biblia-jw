import { PrismaClient } from "../app/generated/prisma"

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function getClient(): PrismaClient {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  return global.__prisma
}

// Proxy que cria o cliente apenas na primeira chamada real (não em import)
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

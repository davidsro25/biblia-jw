export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const year = new Date().getFullYear()
  return NextResponse.json(await prisma.ministryGoal.findUnique({ where: { year } }) ?? { year, monthlyHours: 0, yearlyHours: 0 })
}

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json(await prisma.ministryGoal.upsert({
    where: { year: body.year ?? new Date().getFullYear() },
    create: body, update: body
  }))
}

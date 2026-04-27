export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const reports = await prisma.ministryReport.findMany({ orderBy: { month: 'desc' } })
  return NextResponse.json(reports)
}

export async function POST(req: Request) {
  const body = await req.json()
  const month = new Date(body.month + '-01T12:00:00Z')
  const report = await prisma.ministryReport.upsert({
    where: { month },
    update: { ...body, month },
    create: { ...body, month },
  })
  return NextResponse.json(report)
}

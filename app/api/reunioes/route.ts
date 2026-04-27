export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const month = url.searchParams.get('month') // YYYY-MM
  let where: any = {}
  if (month) {
    const [y, m] = month.split('-').map(Number)
    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 0)
    where = { date: { gte: start, lte: end } }
  }
  const meetings = await prisma.meeting.findMany({ where, orderBy: { date: 'asc' } })
  return NextResponse.json(meetings)
}

export async function POST(req: Request) {
  const body = await req.json()
  const meeting = await prisma.meeting.create({
    data: { ...body, date: new Date(body.date) }
  })
  return NextResponse.json(meeting)
}

export async function PATCH(req: Request) {
  const { id, ...data } = await req.json()
  const updated = await prisma.meeting.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.meeting.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

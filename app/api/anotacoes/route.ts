export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const type = url.searchParams.get('type')
  const notes = await prisma.note.findMany({
    where: type ? { type } : {},
    orderBy: { date: 'desc' }
  })
  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const body = await req.json()
  const note = await prisma.note.create({
    data: { ...body, date: new Date(body.date), tags: body.tags ?? [] }
  })
  return NextResponse.json(note)
}

export async function PATCH(req: Request) {
  const { id, ...data } = await req.json()
  if (data.date) data.date = new Date(data.date)
  const updated = await prisma.note.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.note.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

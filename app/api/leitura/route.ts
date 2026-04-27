export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const plans = await prisma.readingPlan.findMany({
    include: { progress: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(plans)
}

export async function POST(req: Request) {
  const body = await req.json()
  const plan = await prisma.readingPlan.create({
    data: {
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      books: body.books ?? [],
      alarmDays: body.alarmDays ?? [],
    }
  })
  return NextResponse.json(plan)
}

export async function PATCH(req: Request) {
  const { id, chapterId, completed, ...data } = await req.json()
  if (chapterId !== undefined) {
    // Marcar capítulo como lido
    const progress = await prisma.readingProgress.upsert({
      where: { planId_book_chapter: { planId: id, book: data.book, chapter: data.chapter } },
      update: { completed, completedAt: completed ? new Date() : null },
      create: { planId: id, book: data.book, chapter: data.chapter, completed }
    })
    return NextResponse.json(progress)
  }
  const updated = await prisma.readingPlan.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.readingPlan.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

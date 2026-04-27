export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const month = url.searchParams.get("month")
  const where = month ? {
    date: { gte: new Date(month), lt: new Date(new Date(month).setMonth(new Date(month).getMonth()+1)) }
  } : {}
  return NextResponse.json(await prisma.ministryActivity.findMany({ where, orderBy: { date: "asc" } }))
}

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json(await prisma.ministryActivity.create({
    data: { ...body, date: new Date(body.date) }
  }))
}

export async function PATCH(req: Request) {
  const { id, ...data } = await req.json()
  if (data.date) data.date = new Date(data.date)
  return NextResponse.json(await prisma.ministryActivity.update({ where: { id }, data }))
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.ministryActivity.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

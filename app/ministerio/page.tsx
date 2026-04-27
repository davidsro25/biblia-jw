export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"
import MinisterioClient from "./client"

export default async function MinisterioPage() {
  const hoje = new Date()
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const [relatorio, atividades, meta] = await Promise.all([
    prisma.ministryReport.findUnique({ where: { month: mesAtual } }),
    prisma.ministryActivity.findMany({
      where: { date: { gte: mesAtual, lt: new Date(hoje.getFullYear(), hoje.getMonth()+1, 1) } },
      orderBy: { date: "asc" }
    }),
    prisma.ministryGoal.findUnique({ where: { year: hoje.getFullYear() } })
  ])
  const mes = mesAtual.toLocaleDateString("pt-BR",{month:"long",year:"numeric"})
  return <MinisterioClient relatorio={relatorio} atividades={atividades} meta={meta} mes={mes} mesAtual={mesAtual.toISOString()} />
}

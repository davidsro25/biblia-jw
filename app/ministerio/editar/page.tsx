export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"
import MinisterioForm from "./form"

export default async function EditarMinisterioPage() {
  const hoje = new Date()
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const relatorio = await prisma.ministryReport.findUnique({ where: { month: mesAtual } })
  const mes = mesAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  return <MinisterioForm relatorio={relatorio} mes={mes} mesAtual={mesAtual.toISOString()} />
}

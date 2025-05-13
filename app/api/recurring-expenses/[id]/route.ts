import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

// Excluir uma despesa recorrente
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    // Verificar se a despesa pertence ao usuário
    const expense = await prisma.recurringExpense.findUnique({
      where: { id: params.id },
    })

    if (!expense) {
      return NextResponse.json({ message: "Despesa não encontrada" }, { status: 404 })
    }

    if (expense.userId !== user.id) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 403 })
    }

    // Excluir a despesa
    await prisma.recurringExpense.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Despesa excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir despesa recorrente:", error)
    return NextResponse.json({ message: "Erro ao excluir despesa recorrente" }, { status: 500 })
  }
}

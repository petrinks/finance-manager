import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

// Obter todas as despesas recorrentes do usuário
export async function GET() {
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

    const expenses = await prisma.recurringExpense.findMany({
      where: { userId: user.id },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Erro ao buscar despesas recorrentes:", error)
    return NextResponse.json({ message: "Erro ao buscar despesas recorrentes" }, { status: 500 })
  }
}

// Criar uma nova despesa recorrente
export async function POST(request: Request) {
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

    const { name, amount, dueDay } = await request.json()

    // Validação básica
    if (!name || typeof amount !== "number" || !dueDay) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 })
    }

    const expense = await prisma.recurringExpense.create({
      data: {
        name,
        amount,
        dueDay,
        userId: user.id,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar despesa recorrente:", error)
    return NextResponse.json({ message: "Erro ao criar despesa recorrente" }, { status: 500 })
  }
}

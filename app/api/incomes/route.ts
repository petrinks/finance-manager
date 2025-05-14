import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const prismaIncome = new PrismaClient();

// GET: retorna todas as receitas do usuário autenticado
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const user = await prismaIncome.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const incomes = await prismaIncome.income.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json(incomes);
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar receitas' },
      { status: 500 }
    );
  }
}

// POST: cria nova receita para o usuário autenticado
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const user = await prismaIncome.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const { name, amount, frequency, receiveDay } = await request.json();
    // Validações básicas
    if (
      !name ||
      typeof name !== 'string' ||
      typeof amount !== 'number' ||
      typeof frequency !== 'string' ||
      typeof receiveDay !== 'number'
    ) {
      return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
    }

    const income = await prismaIncome.income.create({
      data: { name, amount, frequency, receiveDay, userId: user.id },
    });
    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    return NextResponse.json(
      { message: 'Erro ao criar receita' },
      { status: 500 }
    );
  }
}

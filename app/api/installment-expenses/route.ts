import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const prismaInstallment = new PrismaClient();

type InstallmentInput = {
  name: string;
  totalAmount: number;
  installmentAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  dueDay: number;
};

// GET: retorna todas as despesas parceladas do usuário autenticado
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }
    const user = await prismaInstallment.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    const expenses = await prismaInstallment.installmentExpense.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Erro ao buscar despesas parceladas:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar despesas parceladas' },
      { status: 500 }
    );
  }
}

// POST: cria nova despesa parcelada para o usuário autenticado
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }
    const user = await prismaInstallment.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const {
      name,
      totalAmount,
      installmentAmount,
      totalInstallments,
      paidInstallments,
      dueDay,
    }: InstallmentInput = await request.json();
    // Validações básicas
    if (
      !name ||
      typeof name !== 'string' ||
      typeof totalAmount !== 'number' ||
      typeof installmentAmount !== 'number' ||
      typeof totalInstallments !== 'number' ||
      typeof paidInstallments !== 'number' ||
      typeof dueDay !== 'number'
    ) {
      return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
    }

    const expense = await prismaInstallment.installmentExpense.create({
      data: {
        name,
        totalAmount,
        installmentAmount,
        totalInstallments,
        paidInstallments,
        dueDay,
        userId: user.id,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar despesa parcelada:', error);
    return NextResponse.json(
      { message: 'Erro ao criar despesa parcelada' },
      { status: 500 }
    );
  }
}

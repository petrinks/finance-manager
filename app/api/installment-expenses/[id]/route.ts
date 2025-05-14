import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// DELETE: remove despesa parcelada existente por ID
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    await prisma.installmentExpense.deleteMany({
      where: { id: params.id, userId: user.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover despesa parcelada:', error);
    return NextResponse.json(
      { message: 'Erro ao remover despesa parcelada' },
      { status: 500 }
    );
  }
}

// nao é o melhor jeito, mas é o jeito mais simples.
// dessa forma eu puxo todo o banco e atualizo os que precisam ser atualizados
// por isso acaba sendo mais lento, mas é mais simples de entender
//

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const today = new Date();
  const day = today.getDate();

  // 1) Pega só as despesas cujo vencimento é hoje
  const vencendoHoje = await prisma.installmentExpense.findMany({
    where: { dueDay: day },
  });

  // 2) Filtra quem ainda não quitou todas as parcelas
  const pendentes = vencendoHoje.filter(
    (exp) => exp.paidInstallments < exp.totalInstallments
  );

  // 3) Incrementa +1 em paidInstallments para cada um
  const updates = await Promise.all(
    pendentes.map((exp) =>
      prisma.installmentExpense.update({
        where: { id: exp.id },
        data: {
          paidInstallments: exp.paidInstallments + 1,
          updatedAt: today,
        },
      })
    )
  );

  return NextResponse.json({ updated: updates.length });
}

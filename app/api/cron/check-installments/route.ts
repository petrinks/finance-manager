// nao é o melhor jeito, mas é o jeito mais simples.
// dessa forma eu puxo todo o banco e atualizo os que precisam ser atualizados
// por isso acaba sendo mais lento, mas é mais simples de entender
//
import { PrismaClient } from '@prisma/client';
import { differenceInCalendarMonths } from 'date-fns';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

function getExpectedPaid(
  createdAt: Date,
  dueDay: number,
  totalInstallments: number,
  today: Date
): number {
  const year = createdAt.getFullYear();
  const month = createdAt.getMonth();
  const day = createdAt.getDate();

  let firstDue = new Date(year, month, dueDay);
  if (day > dueDay) {
    firstDue = new Date(year, month + 1, dueDay);
  }
  if (today < firstDue) return 0;

  const monthsSinceFirst = differenceInCalendarMonths(today, firstDue);
  return Math.min(monthsSinceFirst + 1, totalInstallments);
}

export async function GET() {
  const today = new Date();

  // 1) busca TUDO (ou, se preferir, pode paginar)
  const all = await prisma.installmentExpense.findMany();

  // 2) filtra em memória só as que ainda não estão quitadas
  const pendentes = all.filter(
    (exp) => exp.paidInstallments < exp.totalInstallments
  );

  // 3) para cada uma calcula o `expected` e atualiza se necessário
  const updates = await Promise.all(
    pendentes.map(async (exp) => {
      const expected = getExpectedPaid(
        exp.createdAt,
        exp.dueDay,
        exp.totalInstallments,
        today
      );

      if (expected > exp.paidInstallments) {
        return prisma.installmentExpense.update({
          where: { id: exp.id },
          data: {
            paidInstallments: expected,
            updatedAt: today,
          },
        });
      }
      return null;
    })
  );

  const updatedCount = updates.filter((u) => u !== null).length;
  return NextResponse.json({ updatedCount });
}

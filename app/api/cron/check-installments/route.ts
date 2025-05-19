//
// nao é o melhor jeito, mas é o jeito mais simples.
// dessa forma eu puxo todo o banco e atualizo os que precisam ser atualizados
// por isso acaba sendo mais lento, mas é mais simples de entender
//
import { PrismaClient } from '@prisma/client';
import { differenceInCalendarMonths } from 'date-fns';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const today = new Date();
  const dayOfMonth = today.getDate();

  // 1) traz tudo
  const all = await prisma.installmentExpense.findMany();

  // 2) só quem ainda não terminou de pagar
  const pendentes = all.filter(
    (exp) => exp.paidInstallments < exp.totalInstallments
  );

  // 3) calcula e atualiza somente os que precisam avançar
  const updates = await Promise.all(
    pendentes.map(async (exp) => {
      const monthsElapsed = differenceInCalendarMonths(today, exp.createdAt);
      const expected = Math.min(
        monthsElapsed + (dayOfMonth >= exp.dueDay ? 1 : 0),
        exp.totalInstallments
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
  return NextResponse.json({ updated: updatedCount });
}

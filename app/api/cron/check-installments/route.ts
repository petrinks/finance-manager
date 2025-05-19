// nao é o melhor jeito, mas é o jeito mais simples.
// dessa forma eu puxo todo o banco e atualizo os que precisam ser atualizados
// por isso acaba sendo mais lento, mas é mais simples de entender
//
import { PrismaClient } from '@prisma/client';
import { startOfToday } from 'date-fns';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const now = new Date();
  const today = now.getDate();
  const dayStart = startOfToday(); // 00:00:00 de hoje

  // 1) Busca só quem vence hoje
  const vencendoHoje = await prisma.installmentExpense.findMany({
    where: { dueDay: today },
  });

  // 2) Filtra quem ainda não quitou todas as parcelas
  //    E que NÃO foi atualizado hoje (updatedAt < 00:00:00 de hoje)
  const pendentes = vencendoHoje.filter(
    (exp) =>
      exp.paidInstallments < exp.totalInstallments && exp.updatedAt < dayStart
  );

  // 3) Incrementa +1 em paidInstallments e atualiza updatedAt
  const updatedRecords = await Promise.all(
    pendentes.map((exp) =>
      prisma.installmentExpense.update({
        where: { id: exp.id },
        data: {
          paidInstallments: exp.paidInstallments + 1,
          updatedAt: now,
        },
      })
    )
  );

  return NextResponse.json({
    updatedCount: updatedRecords.length,
    updatedRecords,
  });
}

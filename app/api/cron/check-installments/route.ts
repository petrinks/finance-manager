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

  // 1) pega quem vence hoje
  const vencendoHoje = await prisma.installmentExpense.findMany({
    where: { dueDay: day },
  });

  // 2) filtra quem ainda não pagou tudo
  const pendentes = vencendoHoje.filter(
    (e) => e.paidInstallments < e.totalInstallments
  );

  // 3) atualiza E coleta o registro pós-update
  const updatedRecords = await Promise.all(
    pendentes.map((e) =>
      prisma.installmentExpense.update({
        where: { id: e.id },
        data: {
          paidInstallments: e.paidInstallments + 1,
          updatedAt: today,
        },
      })
    )
  );

  return NextResponse.json({
    updatedCount: updatedRecords.length,
    updatedRecords,
    pendentesBefore: pendentes,
  });
}

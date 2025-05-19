// app/api/cron/check-installments/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const now = new Date();
  const today = now.getDate();
  // início de hoje (00:00) no fuso do servidor (UTC)
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1) busca só quem vence hoje
  const todos = await prisma.installmentExpense.findMany({
    where: { dueDay: today },
  });

  // 2) filtra quem não pagou tudo ainda e não foi atualizado hoje
  const pendentes = todos.filter(
    (e) => e.paidInstallments < e.totalInstallments && e.updatedAt < dayStart
  );

  // 3) incrementa +1 em cada um
  const updated = await Promise.all(
    pendentes.map((e) =>
      prisma.installmentExpense.update({
        where: { id: e.id },
        data: {
          paidInstallments: e.paidInstallments + 1,
          updatedAt: now,
        },
      })
    )
  );

  return NextResponse.json({
    updatedCount: updated.length,
    updatedIds: updated.map((e) => e.id),
  });
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface FinancialOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  totalRecurringExpenses: number;
  totalInstallmentExpenses: number;
  balance: number;
}

export default function FinancialOverview({
  totalIncome,
  totalExpenses,
  totalRecurringExpenses,
  totalInstallmentExpenses,
  balance,
}: FinancialOverviewProps) {
  const dataIncomeExpense = [
    { name: 'Receitas', value: totalIncome },
    { name: 'Despesas', value: totalExpenses },
  ];
  const dataExpensesDist = [
    { name: 'Recorrentes', value: totalRecurringExpenses },
    { name: 'Parceladas', value: totalInstallmentExpenses },
  ];
  const COLORS_INCOME_EXP = ['#22c55e', '#ef4444'];
  const COLORS_EXP_DIST = ['#f97316', '#a855f7'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral Financeira</CardTitle>
        <CardDescription>
          Resumo da sua situação financeira atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Pie chart: Receitas vs Despesas */}
            <div>
              <h3 className='text-lg font-medium'>Receitas vs Despesas</h3>
              <div className='mt-2 h-[250px] w-full  bg-muted rounded-md'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={dataIncomeExpense}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={70}
                      label={({ name, percent }) =>
                        `${name}: ${(percent! * 100).toFixed(0)}%`
                      }
                    >
                      {dataIncomeExpense.map((_, index) => (
                        <Cell key={index} fill={COLORS_INCOME_EXP[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie chart: Distribuição de Despesas */}
            <div>
              <h3 className='text-lg font-medium'>Distribuição de Despesas</h3>
              <div className='mt-2 h-[250px] w-full bg-muted rounded-md'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={dataExpensesDist}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={70}
                      label={({ name, percent }) =>
                        `${name}: ${(percent! * 100).toFixed(0)}%`
                      }
                    >
                      {dataExpensesDist.map((_, index) => (
                        <Cell key={index} fill={COLORS_EXP_DIST[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Saldo Disponível */}
          <div>
            <h3 className='text-lg font-medium'>Saldo Disponível</h3>
            <div
              className={`mt-2 p-4 rounded-md ${
                balance >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <p className='text-2xl font-bold'>R$ {balance.toFixed(2)}</p>
              <p className='text-sm text-muted-foreground'>
                {balance >= 0
                  ? 'Você está com as finanças positivas!'
                  : 'Atenção! Suas despesas estão maiores que suas receitas.'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

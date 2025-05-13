'use client';

import { ExpensesList } from '@/components/expenses-list';
import { FinancialSummary } from '@/components/financial-summary';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  type Income,
  type InstallmentExpense,
  type RecurringExpense,
  calculateTotalIncome,
  calculateTotalInstallmentExpenses,
  calculateTotalRecurringExpenses,
} from '@/lib/finance';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RecurringExpenseForm } from './recurring-expense-form';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);
  const [installmentExpenses, setInstallmentExpenses] = useState<
    InstallmentExpense[]
  >([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Carregar dados do servidor quando o componente montar
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Buscar despesas recorrentes
          const recurringRes = await fetch('/api/recurring-expenses');
          if (recurringRes.ok) {
            const recurringData = await recurringRes.json();
            setRecurringExpenses(recurringData);
          }

          // Buscar despesas parceladas
          const installmentRes = await fetch('/api/installment-expenses');
          if (installmentRes.ok) {
            const installmentData = await installmentRes.json();
            setInstallmentExpenses(installmentData);
          }

          // Buscar receitas
          const incomesRes = await fetch('/api/incomes');
          if (incomesRes.ok) {
            const incomesData = await incomesRes.json();
            setIncomes(incomesData);
          }
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [status]);

  const addRecurringExpense = async (
    expense: Omit<RecurringExpense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await fetch('/api/recurring-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        const newExpense = await response.json();
        setRecurringExpenses([...recurringExpenses, newExpense]);
      }
    } catch (error) {
      console.error('Erro ao adicionar despesa recorrente:', error);
    }
  };

  const removeRecurringExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/recurring-expenses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecurringExpenses(
          recurringExpenses.filter((expense) => expense.id !== id)
        );
      }
    } catch (error) {
      console.error('Erro ao remover despesa recorrente:', error);
    }
  };

  // Implementar funções semelhantes para despesas parceladas e receitas

  const totalRecurringExpenses =
    calculateTotalRecurringExpenses(recurringExpenses);
  const totalInstallmentExpenses =
    calculateTotalInstallmentExpenses(installmentExpenses);
  const totalExpenses = totalRecurringExpenses + totalInstallmentExpenses;
  const totalIncome = calculateTotalIncome(incomes);
  const balance = totalIncome - totalExpenses;

  if (status === 'loading' || isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Carregando...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Gerenciador de Finanças Pessoais</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='text-sm text-gray-600 hover:text-gray-900'
        >
          Sair
        </button>
      </div>

      <FinancialSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        recurringExpenses={totalRecurringExpenses}
        installmentExpenses={totalInstallmentExpenses}
      />

      <Tabs defaultValue='add' className='w-full'>
        <TabsList className='grid grid-cols-2 md:grid-cols-4 mb-4'>
          <TabsTrigger value='add'>Adicionar</TabsTrigger>
          <TabsTrigger value='expenses'>Despesas</TabsTrigger>
          <TabsTrigger value='income'>Receitas</TabsTrigger>
          <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
        </TabsList>

        <TabsContent value='add' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <Card>
              <CardHeader>
                <CardTitle>Despesa Recorrente</CardTitle>
                <CardDescription>
                  Adicione assinaturas e outras despesas mensais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecurringExpenseForm onSubmit={addRecurringExpense} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Despesa Parcelada</CardTitle>
                <CardDescription>Adicione compras parceladas</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <InstallmentExpenseForm onSubmit={addInstallmentExpense} /> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonte de Renda</CardTitle>
                <CardDescription>
                  Adicione salário e outras receitas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <IncomeForm onSubmit={addIncome} /> */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='expenses'>
          <ExpensesList
            recurringExpenses={recurringExpenses}
            installmentExpenses={installmentExpenses}
            onRemoveRecurring={removeRecurringExpense}
            onRemoveInstallment={removeRecurringExpense}
          />
        </TabsContent>

        <TabsContent value='income'>
          {/* <IncomeList incomes={incomes} onRemove={removeIncome} /> */}
        </TabsContent>

        <TabsContent value='overview'>
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral Financeira</CardTitle>
              <CardDescription>
                Resumo da sua situação financeira atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <h3 className='text-lg font-medium'>
                      Receitas vs Despesas
                    </h3>
                    <div className='mt-2 h-[200px] w-full bg-muted rounded-md flex items-end'>
                      <div className='h-full w-1/2 flex flex-col justify-end items-center p-2'>
                        <div
                          className='w-16 bg-green-500 rounded-t-md'
                          style={{
                            height: `${Math.min(
                              100,
                              (totalIncome /
                                Math.max(totalIncome, totalExpenses)) *
                                100
                            )}%`,
                          }}
                        ></div>
                        <span className='mt-2 text-sm'>Receitas</span>
                        <span className='font-medium'>
                          R$ {totalIncome.toFixed(2)}
                        </span>
                      </div>
                      <div className='h-full w-1/2 flex flex-col justify-end items-center p-2'>
                        <div
                          className='w-16 bg-red-500 rounded-t-md'
                          style={{
                            height: `${Math.min(
                              100,
                              (totalExpenses /
                                Math.max(totalIncome, totalExpenses)) *
                                100
                            )}%`,
                          }}
                        ></div>
                        <span className='mt-2 text-sm'>Despesas</span>
                        <span className='font-medium'>
                          R$ {totalExpenses.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-lg font-medium'>
                      Distribuição de Despesas
                    </h3>
                    <div className='mt-2 h-[200px] w-full bg-muted rounded-md flex items-end'>
                      <div className='h-full w-1/2 flex flex-col justify-end items-center p-2'>
                        <div
                          className='w-16 bg-orange-400 rounded-t-md'
                          style={{
                            height: `${
                              totalExpenses
                                ? (totalRecurringExpenses / totalExpenses) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                        <span className='mt-2 text-sm'>Recorrentes</span>
                        <span className='font-medium'>
                          R$ {totalRecurringExpenses.toFixed(2)}
                        </span>
                      </div>
                      <div className='h-full w-1/2 flex flex-col justify-end items-center p-2'>
                        <div
                          className='w-16 bg-purple-400 rounded-t-md'
                          style={{
                            height: `${
                              totalExpenses
                                ? (totalInstallmentExpenses / totalExpenses) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                        <span className='mt-2 text-sm'>Parceladas</span>
                        <span className='font-medium'>
                          R$ {totalInstallmentExpenses.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-medium'>Saldo Disponível</h3>
                  <div
                    className={`mt-2 p-4 rounded-md ${
                      balance >= 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <p className='text-2xl font-bold'>
                      R$ {balance.toFixed(2)}
                    </p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

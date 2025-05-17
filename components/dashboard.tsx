'use client';

import { ExpensesList } from '@/components/expenses-list';
import { FinancialSummary } from '@/components/financial-summary';
import { IncomeForm } from '@/components/income-form';
import { IncomeList } from '@/components/income-list';
import { InstallmentExpenseForm } from '@/components/installment-expense-form';
import { RecurringExpenseForm } from '@/components/recurring-expense-form';
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
import FinancialOverview from './financial-overview';

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

  // ——— Parceladas ———
  const addInstallmentExpense = async (
    expense: Omit<
      InstallmentExpense,
      'id' | 'userId' | 'createdAt' | 'updatedAt'
    >
  ) => {
    const res = await fetch('/api/installment-expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });

    if (!res.ok) {
      console.error('Falha ao adicionar despesa parcelada');
      return;
    }

    const newExpense: InstallmentExpense = await res.json();
    setInstallmentExpenses((curr) => [...curr, newExpense]);
  };

  // ——— Receitas ———
  const addIncome = async (
    incomeData: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    const res = await fetch('/api/incomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incomeData),
    });

    if (!res.ok) {
      console.error('Falha ao adicionar receita');
      return;
    }

    // faz o await aqui, fora do setter
    const newIncome: Income = await res.json();

    // agora sim, sem await dentro do callback
    setIncomes((curr) => [...curr, newIncome]);
  };

  // Remove despesa parcelada
  const removeInstallmentExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/installment-expenses/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        console.log(res);
        console.error('Falha ao remover despesa parcelada');
        return;
      }
      // callback síncrono
      setInstallmentExpenses((curr) =>
        curr.filter((expense) => expense.id !== id)
      );
    } catch (error) {
      console.error('Erro ao remover despesa parcelada:', error);
    }
  };

  // Remove receita
  const removeIncome = async (id: string) => {
    try {
      const res = await fetch(`/api/incomes/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        console.error('Falha ao remover receita');
        return;
      }
      // callback síncrono
      setIncomes((curr) => curr.filter((income) => income.id !== id));
    } catch (error) {
      console.error('Erro ao remover receita:', error);
    }
  };

  // totais
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
                <InstallmentExpenseForm onSubmit={addInstallmentExpense} />
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
                <IncomeForm onSubmit={addIncome} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='expenses'>
          <ExpensesList
            recurringExpenses={recurringExpenses}
            installmentExpenses={installmentExpenses}
            onRemoveRecurring={removeRecurringExpense}
            onRemoveInstallment={removeInstallmentExpense}
          />
        </TabsContent>

        <TabsContent value='income'>
          <IncomeList incomes={incomes} onRemove={removeIncome} />
        </TabsContent>

        {/* visao financeira de forma macro */}

        <TabsContent value='overview'>
          <FinancialOverview
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            totalRecurringExpenses={totalRecurringExpenses}
            totalInstallmentExpenses={totalInstallmentExpenses}
            balance={balance}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

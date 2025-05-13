"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecurringExpenseForm } from "@/components/recurring-expense-form"
import { InstallmentExpenseForm } from "@/components/installment-expense-form"
import { IncomeForm } from "@/components/income-form"
import { FinancialSummary } from "@/components/financial-summary"
import { ExpensesList } from "@/components/expenses-list"
import { IncomeList } from "@/components/income-list"
import {
  type RecurringExpense,
  type InstallmentExpense,
  type Income,
  calculateTotalRecurringExpenses,
  calculateTotalInstallmentExpenses,
  calculateTotalIncome,
} from "@/lib/finance"

export default function Dashboard() {
  const [activeView, setActiveView] = useState<"add" | "expenses" | "income" | "overview">("add")
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([])
  const [installmentExpenses, setInstallmentExpenses] = useState<InstallmentExpense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])

  // Carregar dados do localStorage quando o componente montar
  useEffect(() => {
    const savedRecurringExpenses = localStorage.getItem("recurringExpenses")
    const savedInstallmentExpenses = localStorage.getItem("installmentExpenses")
    const savedIncomes = localStorage.getItem("incomes")

    if (savedRecurringExpenses) setRecurringExpenses(JSON.parse(savedRecurringExpenses))
    if (savedInstallmentExpenses) setInstallmentExpenses(JSON.parse(savedInstallmentExpenses))
    if (savedIncomes) setIncomes(JSON.parse(savedIncomes))
  }, [])

  // Salvar dados no localStorage quando eles mudarem
  useEffect(() => {
    localStorage.setItem("recurringExpenses", JSON.stringify(recurringExpenses))
    localStorage.setItem("installmentExpenses", JSON.stringify(installmentExpenses))
    localStorage.setItem("incomes", JSON.stringify(incomes))
  }, [recurringExpenses, installmentExpenses, incomes])

  const addRecurringExpense = (expense: RecurringExpense) => {
    setRecurringExpenses([...recurringExpenses, expense])
  }

  const addInstallmentExpense = (expense: InstallmentExpense) => {
    setInstallmentExpenses([...installmentExpenses, expense])
  }

  const addIncome = (income: Income) => {
    setIncomes([...incomes, income])
  }

  const removeRecurringExpense = (id: string) => {
    setRecurringExpenses(recurringExpenses.filter((expense) => expense.id !== id))
  }

  const removeInstallmentExpense = (id: string) => {
    setInstallmentExpenses(installmentExpenses.filter((expense) => expense.id !== id))
  }

  const removeIncome = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id))
  }

  const totalRecurringExpenses = calculateTotalRecurringExpenses(recurringExpenses)
  const totalInstallmentExpenses = calculateTotalInstallmentExpenses(installmentExpenses)
  const totalExpenses = totalRecurringExpenses + totalInstallmentExpenses
  const totalIncome = calculateTotalIncome(incomes)
  const balance = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciador de Finanças Pessoais</h1>

      <FinancialSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        recurringExpenses={totalRecurringExpenses}
        installmentExpenses={totalInstallmentExpenses}
      />

      <div className="flex space-x-2 border-b pb-2">
        <Button variant={activeView === "add" ? "default" : "outline"} onClick={() => setActiveView("add")}>
          Adicionar
        </Button>
        <Button variant={activeView === "expenses" ? "default" : "outline"} onClick={() => setActiveView("expenses")}>
          Despesas
        </Button>
        <Button variant={activeView === "income" ? "default" : "outline"} onClick={() => setActiveView("income")}>
          Receitas
        </Button>
        <Button variant={activeView === "overview" ? "default" : "outline"} onClick={() => setActiveView("overview")}>
          Visão Geral
        </Button>
      </div>

      {activeView === "add" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Despesa Recorrente</CardTitle>
              <CardDescription>Adicione assinaturas e outras despesas mensais</CardDescription>
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
              <CardDescription>Adicione salário e outras receitas</CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeForm onSubmit={addIncome} />
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === "expenses" && (
        <ExpensesList
          recurringExpenses={recurringExpenses}
          installmentExpenses={installmentExpenses}
          onRemoveRecurring={removeRecurringExpense}
          onRemoveInstallment={removeInstallmentExpense}
        />
      )}

      {activeView === "income" && <IncomeList incomes={incomes} onRemove={removeIncome} />}

      {activeView === "overview" && (
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral Financeira</CardTitle>
            <CardDescription>Resumo da sua situação financeira atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium">Receitas vs Despesas</h3>
                  <div className="mt-2 h-[200px] w-full bg-muted rounded-md flex items-end">
                    <div className="h-full w-1/2 flex flex-col justify-end items-center p-2">
                      <div
                        className="w-16 bg-green-500 rounded-t-md"
                        style={{
                          height: `${Math.min(100, (totalIncome / Math.max(totalIncome, totalExpenses)) * 100)}%`,
                        }}
                      ></div>
                      <span className="mt-2 text-sm">Receitas</span>
                      <span className="font-medium">R$ {totalIncome.toFixed(2)}</span>
                    </div>
                    <div className="h-full w-1/2 flex flex-col justify-end items-center p-2">
                      <div
                        className="w-16 bg-red-500 rounded-t-md"
                        style={{
                          height: `${Math.min(100, (totalExpenses / Math.max(totalIncome, totalExpenses)) * 100)}%`,
                        }}
                      ></div>
                      <span className="mt-2 text-sm">Despesas</span>
                      <span className="font-medium">R$ {totalExpenses.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Distribuição de Despesas</h3>
                  <div className="mt-2 h-[200px] w-full bg-muted rounded-md flex items-end">
                    <div className="h-full w-1/2 flex flex-col justify-end items-center p-2">
                      <div
                        className="w-16 bg-orange-400 rounded-t-md"
                        style={{ height: `${totalExpenses ? (totalRecurringExpenses / totalExpenses) * 100 : 0}%` }}
                      ></div>
                      <span className="mt-2 text-sm">Recorrentes</span>
                      <span className="font-medium">R$ {totalRecurringExpenses.toFixed(2)}</span>
                    </div>
                    <div className="h-full w-1/2 flex flex-col justify-end items-center p-2">
                      <div
                        className="w-16 bg-purple-400 rounded-t-md"
                        style={{ height: `${totalExpenses ? (totalInstallmentExpenses / totalExpenses) * 100 : 0}%` }}
                      ></div>
                      <span className="mt-2 text-sm">Parceladas</span>
                      <span className="font-medium">R$ {totalInstallmentExpenses.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Saldo Disponível</h3>
                <div className={`mt-2 p-4 rounded-md ${balance >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                  <p className="text-2xl font-bold">R$ {balance.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {balance >= 0
                      ? "Você está com as finanças positivas!"
                      : "Atenção! Suas despesas estão maiores que suas receitas."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

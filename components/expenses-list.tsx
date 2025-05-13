"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { RecurringExpense, InstallmentExpense } from "@/lib/finance"

interface ExpensesListProps {
  recurringExpenses: RecurringExpense[]
  installmentExpenses: InstallmentExpense[]
  onRemoveRecurring: (id: string) => void
  onRemoveInstallment: (id: string) => void
}

export function ExpensesList({
  recurringExpenses,
  installmentExpenses,
  onRemoveRecurring,
  onRemoveInstallment,
}: ExpensesListProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Despesas Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recurringExpenses.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma despesa recorrente cadastrada.</p>
          ) : (
            <div className="space-y-4">
              {recurringExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">{expense.name}</h3>
                    <p className="text-sm text-muted-foreground">Vencimento: dia {expense.dueDay}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">R$ {expense.amount.toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveRecurring(expense.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Despesas Parceladas</CardTitle>
        </CardHeader>
        <CardContent>
          {installmentExpenses.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma despesa parcelada cadastrada.</p>
          ) : (
            <div className="space-y-4">
              {installmentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">{expense.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {expense.paidInstallments} de {expense.totalInstallments} parcelas pagas
                    </p>
                    <p className="text-sm text-muted-foreground">Vencimento: dia {expense.dueDay}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">R$ {expense.installmentAmount.toFixed(2)}/mês</p>
                      <p className="text-xs text-muted-foreground">Total: R$ {expense.totalAmount.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveInstallment(expense.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

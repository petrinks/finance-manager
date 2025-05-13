export interface RecurringExpense {
  id: string
  name: string
  amount: number
  dueDay: number
  type: "recurring"
  createdAt: string
}

export interface InstallmentExpense {
  id: string
  name: string
  totalAmount: number
  installmentAmount: number
  totalInstallments: number
  paidInstallments: number
  dueDay: number
  type: "installment"
  createdAt: string
}

export interface Income {
  id: string
  name: string
  amount: number
  frequency: string
  receiveDay: number
  createdAt: string
}

export function calculateTotalRecurringExpenses(expenses: RecurringExpense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0)
}

export function calculateTotalInstallmentExpenses(expenses: InstallmentExpense[]): number {
  return expenses.reduce((total, expense) => {
    const remainingInstallments = expense.totalInstallments - expense.paidInstallments
    return total + expense.installmentAmount * (remainingInstallments > 0 ? 1 : 0)
  }, 0)
}

export function calculateTotalIncome(incomes: Income[]): number {
  return incomes.reduce((total, income) => {
    // Ajustar valor com base na frequência
    let adjustedAmount = income.amount
    if (income.frequency === "biweekly") {
      adjustedAmount = income.amount * 2
    } else if (income.frequency === "weekly") {
      adjustedAmount = income.amount * 4
    }
    return total + adjustedAmount
  }, 0)
}

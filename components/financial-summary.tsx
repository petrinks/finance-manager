import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpCircle, ArrowDownCircle, DollarSign, CreditCard, CalendarClock } from "lucide-react"

interface FinancialSummaryProps {
  totalIncome: number
  totalExpenses: number
  balance: number
  recurringExpenses: number
  installmentExpenses: number
}

export function FinancialSummary({
  totalIncome,
  totalExpenses,
  balance,
  recurringExpenses,
  installmentExpenses,
}: FinancialSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Receita Total</span>
              <span className="text-2xl font-bold">R$ {totalIncome.toFixed(2)}</span>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Despesa Total</span>
              <span className="text-2xl font-bold">R$ {totalExpenses.toFixed(2)}</span>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Saldo</span>
              <span className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {balance.toFixed(2)}
              </span>
            </div>
            <DollarSign className={`h-8 w-8 ${balance >= 0 ? "text-green-500" : "text-red-500"}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Despesas Recorrentes</span>
              <span className="text-2xl font-bold">R$ {recurringExpenses.toFixed(2)}</span>
            </div>
            <CalendarClock className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Despesas Parceladas</span>
              <span className="text-2xl font-bold">R$ {installmentExpenses.toFixed(2)}</span>
            </div>
            <CreditCard className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

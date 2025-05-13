"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Income } from "@/lib/finance"

interface IncomeListProps {
  incomes: Income[]
  onRemove: (id: string) => void
}

export function IncomeList({ incomes, onRemove }: IncomeListProps) {
  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "monthly":
        return "Mensal"
      case "biweekly":
        return "Quinzenal"
      case "weekly":
        return "Semanal"
      default:
        return frequency
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fontes de Renda</CardTitle>
      </CardHeader>
      <CardContent>
        {incomes.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma fonte de renda cadastrada.</p>
        ) : (
          <div className="space-y-4">
            {incomes.map((income) => (
              <div key={income.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">{income.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getFrequencyText(income.frequency)} - Recebimento: dia {income.receiveDay}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">R$ {income.amount.toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(income.id)}
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
  )
}

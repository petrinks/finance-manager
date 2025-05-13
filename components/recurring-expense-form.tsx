"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RecurringExpense } from "@/lib/finance"

interface RecurringExpenseFormProps {
  onSubmit: (expense: RecurringExpense) => void
}

export function RecurringExpenseForm({ onSubmit }: RecurringExpenseFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDay, setDueDay] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !amount || !dueDay) return

    const newExpense: RecurringExpense = {
      id: Date.now().toString(),
      name,
      amount: Number.parseFloat(amount),
      dueDay: Number.parseInt(dueDay),
      type: "recurring",
      createdAt: new Date().toISOString(),
    }

    onSubmit(newExpense)

    // Reset form
    setName("")
    setAmount("")
    setDueDay("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recurring-name">Nome</Label>
        <Input
          id="recurring-name"
          placeholder="Ex: Netflix, Spotify"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recurring-amount">Valor (R$)</Label>
        <Input
          id="recurring-amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="39.90"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recurring-due-day">Dia de vencimento</Label>
        <Input
          id="recurring-due-day"
          type="number"
          min="1"
          max="31"
          placeholder="15"
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Adicionar
      </Button>
    </form>
  )
}

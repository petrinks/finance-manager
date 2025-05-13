"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Income } from "@/lib/finance"

interface IncomeFormProps {
  onSubmit: (income: Income) => void
}

export function IncomeForm({ onSubmit }: IncomeFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [frequency, setFrequency] = useState("monthly")
  const [receiveDay, setReceiveDay] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !amount || !frequency || !receiveDay) return

    const newIncome: Income = {
      id: Date.now().toString(),
      name,
      amount: Number.parseFloat(amount),
      frequency,
      receiveDay: Number.parseInt(receiveDay),
      createdAt: new Date().toISOString(),
    }

    onSubmit(newIncome)

    // Reset form
    setName("")
    setAmount("")
    setFrequency("monthly")
    setReceiveDay("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="income-name">Nome</Label>
        <Input
          id="income-name"
          placeholder="Ex: Salário, Freelance"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="income-amount">Valor (R$)</Label>
        <Input
          id="income-amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="3500.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="income-frequency">Frequência</Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger id="income-frequency">
            <SelectValue placeholder="Selecione a frequência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="biweekly">Quinzenal</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="income-receive-day">Dia de recebimento</Label>
        <Input
          id="income-receive-day"
          type="number"
          min="1"
          max="31"
          placeholder="5"
          value={receiveDay}
          onChange={(e) => setReceiveDay(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Adicionar
      </Button>
    </form>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { InstallmentExpense } from "@/lib/finance"

interface InstallmentExpenseFormProps {
  onSubmit: (expense: InstallmentExpense) => void
}

export function InstallmentExpenseForm({ onSubmit }: InstallmentExpenseFormProps) {
  const [name, setName] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [installmentAmount, setInstallmentAmount] = useState("")
  const [totalInstallments, setTotalInstallments] = useState("")
  const [paidInstallments, setPaidInstallments] = useState("")
  const [dueDay, setDueDay] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !installmentAmount || !totalInstallments || !paidInstallments || !dueDay) return

    const newExpense: InstallmentExpense = {
      id: Date.now().toString(),
      name,
      totalAmount: Number.parseFloat(totalAmount),
      installmentAmount: Number.parseFloat(installmentAmount),
      totalInstallments: Number.parseInt(totalInstallments),
      paidInstallments: Number.parseInt(paidInstallments),
      dueDay: Number.parseInt(dueDay),
      type: "installment",
      createdAt: new Date().toISOString(),
    }

    onSubmit(newExpense)

    // Reset form
    setName("")
    setTotalAmount("")
    setInstallmentAmount("")
    setTotalInstallments("")
    setPaidInstallments("")
    setDueDay("")
  }

  // Calcular valor total quando o usuário preencher valor da parcela e número de parcelas
  const calculateTotal = () => {
    if (installmentAmount && totalInstallments) {
      const total = Number.parseFloat(installmentAmount) * Number.parseInt(totalInstallments)
      setTotalAmount(total.toFixed(2))
    }
  }

  // Calcular valor da parcela quando o usuário preencher valor total e número de parcelas
  const calculateInstallment = () => {
    if (totalAmount && totalInstallments) {
      const installment = Number.parseFloat(totalAmount) / Number.parseInt(totalInstallments)
      setInstallmentAmount(installment.toFixed(2))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="installment-name">Nome</Label>
        <Input
          id="installment-name"
          placeholder="Ex: Celular, Geladeira"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="installment-amount">Valor da Parcela (R$)</Label>
          <Input
            id="installment-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="199.90"
            value={installmentAmount}
            onChange={(e) => {
              setInstallmentAmount(e.target.value)
              if (totalInstallments) calculateTotal()
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total-amount">Valor Total (R$)</Label>
          <Input
            id="total-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="1999.00"
            value={totalAmount}
            onChange={(e) => {
              setTotalAmount(e.target.value)
              if (totalInstallments) calculateInstallment()
            }}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="total-installments">Total de Parcelas</Label>
          <Input
            id="total-installments"
            type="number"
            min="1"
            placeholder="10"
            value={totalInstallments}
            onChange={(e) => {
              setTotalInstallments(e.target.value)
              if (installmentAmount) calculateTotal()
              else if (totalAmount) calculateInstallment()
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paid-installments">Parcelas Pagas</Label>
          <Input
            id="paid-installments"
            type="number"
            min="0"
            max={totalInstallments || undefined}
            placeholder="2"
            value={paidInstallments}
            onChange={(e) => setPaidInstallments(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="installment-due-day">Dia de vencimento</Label>
        <Input
          id="installment-due-day"
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

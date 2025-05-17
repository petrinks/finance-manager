'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InstallmentExpense } from '@/lib/finance';
import React, { useEffect, useState } from 'react';

interface InstallmentExpenseFormProps {
  onSubmit: (expense: InstallmentExpense) => void;
}

export function InstallmentExpenseForm({
  onSubmit,
}: InstallmentExpenseFormProps) {
  const [name, setName] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('');
  const [paidInstallments, setPaidInstallments] = useState('');
  const [dueDay, setDueDay] = useState('');

  // 'installment' se o usuário editou o valor da parcela por último
  // 'total' se o usuário editou o valor total por último
  const [lastChanged, setLastChanged] = useState<
    'installment' | 'total' | null
  >(null);

  // CALCULA TOTAL quando a parcela for o último campo alterado
  useEffect(() => {
    if (
      lastChanged === 'installment' &&
      installmentAmount &&
      totalInstallments
    ) {
      const total =
        parseFloat(installmentAmount) * parseInt(totalInstallments, 10);
      setTotalAmount(total.toFixed(2));
    }
  }, [installmentAmount, totalInstallments, lastChanged]);

  // CALCULA PARCELA quando o total for o último campo alterado
  useEffect(() => {
    if (lastChanged === 'total' && totalAmount && totalInstallments) {
      const parc = parseFloat(totalAmount) / parseInt(totalInstallments, 10);
      setInstallmentAmount(parc.toFixed(2));
    }
  }, [totalAmount, totalInstallments, lastChanged]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name ||
      !installmentAmount ||
      !totalAmount ||
      !totalInstallments ||
      !paidInstallments ||
      !dueDay
    ) {
      return;
    }

    const newExpense: InstallmentExpense = {
      id: Date.now().toString(),
      name,
      totalAmount: parseFloat(totalAmount),
      installmentAmount: parseFloat(installmentAmount),
      totalInstallments: parseInt(totalInstallments, 10),
      paidInstallments: parseInt(paidInstallments, 10),
      dueDay: parseInt(dueDay, 10),
      type: 'installment',
      createdAt: new Date().toISOString(),
    };

    onSubmit(newExpense);
    // limpa formulário
    setName('');
    setInstallmentAmount('');
    setTotalAmount('');
    setTotalInstallments('');
    setPaidInstallments('');
    setDueDay('');
    setLastChanged(null);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='installment-name'>Nome</Label>
        <Input
          id='installment-name'
          placeholder='Ex: Celular, Geladeira'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div className='space-y-2'>
          <Label htmlFor='installment-amount'>Valor da Parcela (R$)</Label>
          <Input
            id='installment-amount'
            type='number'
            step='0.01'
            min='0.01'
            placeholder='199.90'
            value={installmentAmount}
            onChange={(e) => {
              setInstallmentAmount(e.target.value);
              setLastChanged('installment');
            }}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='total-amount'>Valor Total (R$)</Label>
          <Input
            id='total-amount'
            type='number'
            step='0.01'
            min='0.01'
            placeholder='1999.00'
            value={totalAmount}
            onChange={(e) => {
              setTotalAmount(e.target.value);
              setLastChanged('total');
            }}
            required
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div className='space-y-2'>
          <Label htmlFor='total-installments'>Total de Parcelas</Label>
          <Input
            id='total-installments'
            type='number'
            min='1'
            placeholder='10'
            value={totalInstallments}
            onChange={(e) => setTotalInstallments(e.target.value)}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='paid-installments'>Parcelas Pagas</Label>
          <Input
            id='paid-installments'
            type='number'
            min='0'
            max={totalInstallments || undefined}
            placeholder='2'
            value={paidInstallments}
            onChange={(e) => setPaidInstallments(e.target.value)}
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='installment-due-day'>Dia de vencimento</Label>
        <Input
          id='installment-due-day'
          type='number'
          min='1'
          max='31'
          placeholder='15'
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
          required
        />
      </div>

      <Button type='submit' className='w-full'>
        Adicionar
      </Button>
    </form>
  );
}

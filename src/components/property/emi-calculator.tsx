'use client';

import { useMemo, useState } from 'react';
import { formatINR } from '@/lib/format';

interface EmiCalculatorProps {
  price: number;
}

export function EmiCalculator({ price }: EmiCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(Math.round(price * 0.8));
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 12 / 100;

    if (loanAmount <= 0 || months <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    let emiValue: number;
    if (monthlyRate === 0) {
      emiValue = loanAmount / months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      emiValue = (loanAmount * monthlyRate * factor) / (factor - 1);
    }

    const total = emiValue * months;
    return {
      emi: Math.round(emiValue),
      totalInterest: Math.round(total - loanAmount),
      totalPayment: Math.round(total),
    };
  }, [loanAmount, rate, years]);

  return (
    <div className="rounded-2xl bg-cream p-6 sm:p-8">
      <div className="space-y-6">
        {/* Loan amount */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="emi-loan" className="text-sm font-medium text-ink">
              Loan amount
            </label>
            <span className="font-display text-lg font-semibold text-ink">
              {formatINR(loanAmount)}
            </span>
          </div>
          <input
            id="emi-loan"
            type="range"
            min={Math.round(price * 0.1)}
            max={price}
            step={50000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-ink"
          />
        </div>

        {/* Interest rate */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="emi-rate" className="text-sm font-medium text-ink">
              Interest rate
            </label>
            <span className="font-display text-lg font-semibold text-ink">
              {rate.toFixed(1)}%
            </span>
          </div>
          <input
            id="emi-rate"
            type="range"
            min={5}
            max={15}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-ink"
          />
        </div>

        {/* Tenure */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="emi-years" className="text-sm font-medium text-ink">
              Tenure
            </label>
            <span className="font-display text-lg font-semibold text-ink">
              {years} {years === 1 ? 'year' : 'years'}
            </span>
          </div>
          <input
            id="emi-years"
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-ink"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-black/5 sm:grid-cols-3">
        <div className="bg-white p-5 text-center">
          <p className="text-xs uppercase tracking-wider text-ink/50">Monthly EMI</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {formatINR(emi)}
          </p>
        </div>
        <div className="bg-white p-5 text-center">
          <p className="text-xs uppercase tracking-wider text-ink/50">Total interest</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {formatINR(totalInterest)}
          </p>
        </div>
        <div className="bg-white p-5 text-center">
          <p className="text-xs uppercase tracking-wider text-ink/50">Total payment</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {formatINR(totalPayment)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-ink/40">
        Indicative figures only. Actual EMI depends on lender terms and eligibility.
      </p>
    </div>
  );
}

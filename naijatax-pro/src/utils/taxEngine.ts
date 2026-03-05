import { PAYE_BRACKETS, VAT_RATE, MIN_TAX_RATE, PENSION_RATE } from '../constants';

export const calculateVAT = (sales: number, purchases: number) => {
  const outputVAT = sales * VAT_RATE;
  const inputVAT = purchases * VAT_RATE;
  const payable = outputVAT - inputVAT;
  return {
    outputVAT,
    inputVAT,
    payable,
    isRefundable: payable < 0,
  };
};

export const calculateCIT = (turnover: number, profit: number) => {
  let citRate = 0;
  if (turnover < 25000000) {
    citRate = 0;
  } else if (turnover <= 100000000) {
    citRate = 0.20;
  } else {
    citRate = 0.30;
  }

  const citAmount = profit * citRate;
  const minTax = turnover * MIN_TAX_RATE;
  const finalTax = Math.max(citAmount, minTax);

  return {
    citRate,
    citAmount,
    minTax,
    finalTax,
    isMinTaxApplied: minTax > citAmount,
  };
};

export const calculatePAYE = (grossMonthly: number) => {
  const annualGross = grossMonthly * 12;
  const pension = annualGross * PENSION_RATE;
  
  // Consolidated Relief Allowance (CRA)
  // Higher of ₦200,000 or 1% of Gross Income + 20% of Gross Income
  const craBase = Math.max(200000, 0.01 * annualGross);
  const craTotal = craBase + (0.20 * annualGross);
  
  const taxableIncome = Math.max(0, annualGross - pension - craTotal);
  
  let tax = 0;
  let remaining = taxableIncome;
  
  for (const bracket of PAYE_BRACKETS) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, bracket.threshold);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
  }
  
  // Minimum tax rule: 1% of gross income if tax is less than that
  const minTax = annualGross * 0.01;
  const finalAnnualTax = Math.max(tax, minTax);
  
  return {
    annualGross,
    pension,
    craTotal,
    taxableIncome,
    annualTax: finalAnnualTax,
    monthlyTax: finalAnnualTax / 12,
    netMonthly: grossMonthly - (pension / 12) - (finalAnnualTax / 12),
  };
};

export const calculateWHT = (amount: number, rate: number) => {
  return {
    deduction: amount * rate,
    netAmount: amount * (1 - rate),
  };
};

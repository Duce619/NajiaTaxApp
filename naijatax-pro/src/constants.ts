export const TAX_YEARS = [2024, 2025, 2026];

export const WHT_RATES = [
  { label: 'Dividend, Interest, Rent', rate: 0.10 },
  { label: 'Royalties', rate: 0.15 },
  { label: 'Consultancy, Professional Services (Individual)', rate: 0.05 },
  { label: 'Consultancy, Professional Services (Corporate)', rate: 0.10 },
  { label: 'Management Services', rate: 0.10 },
  { label: 'Commissions', rate: 0.10 },
  { label: 'Technical Services', rate: 0.10 },
  { label: 'Construction/Contract of Supply', rate: 0.05 },
];

export const PAYE_BRACKETS = [
  { threshold: 300000, rate: 0.07 },
  { threshold: 300000, rate: 0.11 },
  { threshold: 500000, rate: 0.15 },
  { threshold: 500000, rate: 0.19 },
  { threshold: 1600000, rate: 0.21 },
  { threshold: Infinity, rate: 0.24 },
];

export const VAT_RATE = 0.075;
export const MIN_TAX_RATE = 0.005;
export const PENSION_RATE = 0.08;

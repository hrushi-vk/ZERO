import { CURRENCIES } from '@/context/AppContext';

const currencyFormatter = (amount: number, currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  
  // Format the number with commas and two decimal places
  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${currency.symbol}${formattedAmount}`;
};

const dateFormatter = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const percentFormatter = (value: number): string => {
  return `${value.toFixed(0)}%`;
};

export const format = {
  currency: currencyFormatter,
  date: dateFormatter,
  percent: percentFormatter,
};
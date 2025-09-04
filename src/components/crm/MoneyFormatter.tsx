import React from 'react';

interface MoneyFormatterProps {
  amount: number;
  currency?: string;
  className?: string;
}

export const MoneyFormatter: React.FC<MoneyFormatterProps> = ({ 
  amount, 
  currency = 'USD', 
  className = '' 
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <span className={className}>
      {formatCurrency(amount)}
    </span>
  );
};

// Utility function for use outside components
export const formatMoney = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
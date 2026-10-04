export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Free';
  }
  if (amount === 0) {
    return 'Free';
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toLocaleString()}`;
  }
}

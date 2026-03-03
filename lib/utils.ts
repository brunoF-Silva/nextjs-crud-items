/**
 * Formats a number into Brazilian Real (BRL) currency.
 * e.g., 999.9 -> "R$ 999,90"
 */
export function formatBrlPrice(price: number): string {
  return Number(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formats a number into US Dollar (USD) currency.
 * e.g., 999.9 -> "$ 999,90"
 */
export function formatUsaPrice(price: number) {
  return Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
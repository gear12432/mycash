export function formatCoins(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function maskAadhaar(aadhaar: string): string {
  const clean = aadhaar.replace(/\s+/g, '');
  if (clean.length !== 12) return aadhaar;
  return `XXXX-XXXX-${clean.slice(8)}`;
}

export function maskPan(pan: string): string {
  if (pan.length !== 10) return pan;
  return `${pan.slice(0, 2)}XXXX${pan.slice(6)}`;
}

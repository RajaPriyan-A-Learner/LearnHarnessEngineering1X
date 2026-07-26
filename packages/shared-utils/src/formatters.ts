export const formatCurrency = (val: number | string, locale = 'en-US'): string => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD'
  }).format(num);
};

export const formatPercent = (val: number | string, locale = 'en-US'): string => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0.00%';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatDate = (val: string | Date | number, locale = 'en-US'): string => {
  const d = new Date(val);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d);
};

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(cents: number): string {
  const amount = (cents / 100).toFixed(0);
  return `${amount} credits`;
}

export function formatDate(dateStr: string): { day: string; month: string; weekday: string } {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    day: date.toLocaleDateString('en-GB', { day: 'numeric' }),
    month: date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    weekday: date.toLocaleDateString('en-GB', { weekday: 'long' }),
  };
}

export function eventTypeLabel(type: string | null): string {
  const labels: Record<string, string> = {
    sunset_session: 'Sunset Session',
    dj_night: 'DJ Night',
    '420_special': '420 Special',
    social: 'Social',
    full_moon: 'Full Moon',
    special: 'Special Event',
  };
  return type ? labels[type] ?? type : '';
}

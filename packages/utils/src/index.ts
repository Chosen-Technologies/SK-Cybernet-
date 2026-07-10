/**
 * Formats Naira and Kobo.
 * Naira = Kobo / 100
 */
export function formatKoboToNaira(kobo: number): string {
  const naira = kobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(naira);
}

export function convertNairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Converts Naira funding to Credits.
 * Currently, 1 Credit = 100 Naira (configurable conversion rate).
 */
export function convertNairaToCredits(naira: number, exchangeRateNairaPerCredit: number = 100): number {
  if (exchangeRateNairaPerCredit <= 0) return 0;
  return naira / exchangeRateNairaPerCredit;
}

export function convertCreditsToNaira(credits: number, exchangeRateNairaPerCredit: number = 100): number {
  return credits * exchangeRateNairaPerCredit;
}

export function formatCredits(credits: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(credits) + ' Credits';
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

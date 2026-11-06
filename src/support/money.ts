/**
 * Money helpers. Prices are compared in integer cents, so `$29.99 + $9.99` is exactly `$39.98`
 * rather than whatever floating point makes of it.
 */

/** Cents from any label that contains one dollar amount: "$29.99", "Item total: $39.98". */
export function toCents(label: string): number {
  const match = label.match(/\$(\d+)\.(\d{2})/);
  if (!match) throw new Error(`No dollar amount in "${label}"`);
  return Number(match[1]) * 100 + Number(match[2]);
}

export function sumCents(labels: readonly string[]): number {
  return labels.reduce((total, label) => total + toCents(label), 0);
}

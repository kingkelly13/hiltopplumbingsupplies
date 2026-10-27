const NBSP = ' '

// "R 1 240": rand with space-grouped thousands. Non-breaking, so a price never wraps.
export function formatRand(amount: number) {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
  return `R${NBSP}${grouped}`
}

// "per 5.5 m length", "each".
export function unitLabel(unit: string) {
  return unit === 'each' ? 'each' : `per ${unit}`
}

// "R 445 per 5.5 m length", "R 52 each".
export function priceLabel(price: number, unit: string) {
  return `${formatRand(price)} ${unitLabel(unit)}`
}

// "2 × 5.5 m length", "Qty 3".
export function qtyLabel(qty: number, unit: string) {
  return unit === 'each' ? `Qty ${qty}` : `${qty} × ${unit}`
}

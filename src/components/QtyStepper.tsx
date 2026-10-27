import { useEffect, useState } from 'react'
import type { Product } from '../data/catalog'
import { useQuote } from '../lib/quote'
import { MinusIcon, PlusIcon } from './Icons'

// "Add" until the line is on the slip, then a − n + stepper.
export function QtyStepper({ product }: { product: Product }) {
  const { qtyOf, setQty } = useQuote()
  const qty = qtyOf(product.sku)
  // Typed text, so clearing the box to type a new number does not drop the line.
  const [draft, setDraft] = useState(String(qty))
  useEffect(() => setDraft(String(qty)), [qty])

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => setQty(product.sku, 1)}
        className="btn btn-outline h-11 px-4"
        aria-label={`Add ${product.name} to slip`}
      >
        <PlusIcon className="text-base" />
        Add
      </button>
    )
  }

  return (
    <div
      className="flex h-11 items-stretch overflow-hidden rounded-md border border-ink/25 bg-card"
      role="group"
      aria-label={`${product.name} quantity`}
    >
      <button
        type="button"
        onClick={() => setQty(product.sku, qty - 1)}
        className="grid w-10 place-items-center text-ink hover:bg-ink/5 focus-visible:bg-ink/5"
        aria-label={qty === 1 ? `Remove ${product.name}` : `One fewer ${product.name}`}
      >
        <MinusIcon />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(e) => {
          const text = e.target.value.replace(/\D/g, '').slice(0, 3)
          setDraft(text)
          if (Number(text) > 0) setQty(product.sku, Number(text))
        }}
        onBlur={() => setDraft(String(qty))}
        className="w-12 border-x border-ink/15 bg-transparent text-center font-mono text-sm font-medium tabular-nums focus:bg-copper-soft/50 focus:outline-none"
        aria-label={`${product.name} quantity`}
      />
      <button
        type="button"
        onClick={() => setQty(product.sku, qty + 1)}
        className="grid w-10 place-items-center text-ink hover:bg-ink/5 focus-visible:bg-ink/5"
        aria-label={`One more ${product.name}`}
      >
        <PlusIcon />
      </button>
    </div>
  )
}

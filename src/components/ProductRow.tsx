import { stockLabel, type Product } from '../data/catalog'
import { formatRand, unitLabel } from '../lib/money'
import { QtyStepper } from './QtyStepper'

export function StockTag({ stock }: { stock: Product['stock'] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${stock === 'shelf' ? 'text-open' : 'text-later'}`}
    >
      <span className={`size-1.5 rounded-full ${stock === 'shelf' ? 'bg-open' : 'bg-later'}`} aria-hidden="true" />
      {stockLabel[stock]}
    </span>
  )
}

export function ProductRow({ product }: { product: Product }) {
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-4 sm:grid-cols-[1fr_11rem_8.25rem] sm:px-5">
      <div className="min-w-0">
        <p className="font-semibold leading-snug text-ink">{product.name}</p>
        <p className="text-sm text-muted">{product.spec}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[0.7rem] tracking-wide text-muted">{product.sku}</span>
          <StockTag stock={product.stock} />
        </p>
      </div>
      <p className="col-start-1 row-start-2 sm:col-start-2 sm:row-start-1 sm:text-right">
        <span className="text-[1.05rem] font-semibold tabular-nums text-ink">{formatRand(product.price)}</span>
        <span className="text-sm text-muted sm:block"> guide, {unitLabel(product.unit)}</span>
      </p>
      <div className="col-start-2 row-span-2 row-start-1 justify-self-end sm:col-start-3 sm:row-span-1">
        <QtyStepper product={product} />
      </div>
    </li>
  )
}

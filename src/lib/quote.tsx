import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products } from '../data/catalog'
import { slipTotal, type SlipDetails, type SlipLine } from './slip'

// The slip lives only in this browser. The shop never sees it unless the customer sends it.
export const STORAGE_KEY = 'hiltop-quote-v1'

const MAX_QTY = 999

interface Saved {
  lines: Record<string, number>
  details: SlipDetails
}

const emptyDetails: SlipDetails = { name: '', phone: '', site: '', notes: '' }
const empty: Saved = { lines: {}, details: emptyDetails }

function read(): Saved {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Saved>
    const lines: Record<string, number> = {}
    // Drop lines that have since left the counter list.
    for (const p of products) {
      const qty = parsed.lines?.[p.sku]
      if (typeof qty === 'number' && qty > 0) lines[p.sku] = Math.min(Math.floor(qty), MAX_QTY)
    }
    const details = { ...emptyDetails }
    for (const key of Object.keys(emptyDetails) as (keyof SlipDetails)[]) {
      const value = parsed.details?.[key]
      if (typeof value === 'string') details[key] = value
    }
    return { lines, details }
  } catch {
    return empty
  }
}

function write(saved: Saved) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    // Private mode or full storage: the slip still works until the tab closes.
  }
}

interface QuoteApi {
  ready: boolean
  lines: SlipLine[]
  count: number
  total: number
  details: SlipDetails
  qtyOf: (sku: string) => number
  setQty: (sku: string, qty: number) => void
  setDetail: (field: keyof SlipDetails, value: string) => void
  clearLines: () => void
}

const QuoteContext = createContext<QuoteApi | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(empty)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSaved(read())
    setReady(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSaved(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (ready) write(saved)
  }, [saved, ready])

  const setQty = useCallback((sku: string, qty: number) => {
    setSaved((prev) => {
      const lines = { ...prev.lines }
      const next = Math.min(Math.max(Math.floor(qty) || 0, 0), MAX_QTY)
      if (next === 0) delete lines[sku]
      else lines[sku] = next
      return { ...prev, lines }
    })
  }, [])

  const setDetail = useCallback((field: keyof SlipDetails, value: string) => {
    setSaved((prev) => ({ ...prev, details: { ...prev.details, [field]: value } }))
  }, [])

  const clearLines = useCallback(() => setSaved((prev) => ({ ...prev, lines: {} })), [])

  const api = useMemo<QuoteApi>(() => {
    // Keep slip lines in counter-list order.
    const lines = products.filter((p) => saved.lines[p.sku]).map((product) => ({ product, qty: saved.lines[product.sku]! }))
    return {
      ready,
      lines,
      count: lines.length,
      total: slipTotal(lines),
      details: saved.details,
      qtyOf: (sku) => saved.lines[sku] ?? 0,
      setQty,
      setDetail,
      clearLines,
    }
  }, [saved, ready, setQty, setDetail, clearLines])

  return <QuoteContext.Provider value={api}>{children}</QuoteContext.Provider>
}

export function useQuote() {
  const api = useContext(QuoteContext)
  if (!api) throw new Error('useQuote must be used inside QuoteProvider')
  return api
}

import { shop } from '../data/shop'
import type { Product } from '../data/catalog'
import { formatRand, qtyLabel } from './money'

export interface SlipLine {
  product: Product
  qty: number
}

export interface SlipDetails {
  name: string
  phone: string
  site: string
  notes: string
}

export function slipTotal(lines: SlipLine[]) {
  return lines.reduce((sum, line) => sum + line.product.price * line.qty, 0)
}

// The plain-text slip a customer sends on WhatsApp or copies.
export function slipText(lines: SlipLine[], details: SlipDetails) {
  const out = [`${shop.legalName}: quote request`, '']

  out.push(`Name: ${details.name.trim()}`)
  out.push(`Phone: ${details.phone.trim()}`)
  if (details.site.trim()) out.push(`Site: ${details.site.trim()}`)
  if (details.notes.trim()) out.push(`Notes: ${details.notes.trim()}`)

  if (lines.length > 0) {
    out.push('')
    lines.forEach(({ product, qty }, i) => {
      out.push(`${i + 1}. ${product.name}, ${product.spec}`)
      out.push(`   ${qtyLabel(qty, product.unit)}, guide ${formatRand(product.price * qty)}`)
    })
    out.push('')
    out.push(`Guide total: ${formatRand(slipTotal(lines))}`)
  }

  out.push('')
  out.push('Please confirm stock and price before I collect.')
  return out.join('\n')
}

export type SlipProblem = 'name' | 'phone' | 'empty'

export function slipProblems(lines: SlipLine[], details: SlipDetails): SlipProblem[] {
  const problems: SlipProblem[] = []
  if (!details.name.trim()) problems.push('name')
  if (details.phone.replace(/\D/g, '').length < 9) problems.push('phone')
  if (lines.length === 0 && !details.notes.trim()) problems.push('empty')
  return problems
}

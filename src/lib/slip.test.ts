import { describe, expect, it } from 'vitest'
import { findProduct, products } from '../data/catalog'
import { formatRand } from './money'
import { slipProblems, slipText, slipTotal, type SlipDetails } from './slip'

const line = (sku: string, qty: number) => ({ product: findProduct(sku)!, qty })

const details: SlipDetails = {
  name: 'Thandi Mkhize',
  phone: '082 555 0101',
  site: 'Hilton, new bathroom',
  notes: '',
}

describe('catalog', () => {
  it('has 34 lines with unique SKUs', () => {
    expect(products).toHaveLength(34)
    expect(new Set(products.map((p) => p.sku)).size).toBe(34)
  })

  it('marks exactly the three handover lines as confirm before you drive', () => {
    const confirm = products.filter((p) => p.stock === 'confirm').map((p) => p.sku)
    expect(confirm.sort()).toEqual(['HT-C28', 'HT-G150', 'HT-TH'])
  })
})

describe('formatRand', () => {
  it('groups thousands with a space that does not break', () => {
    expect(formatRand(1240)).toBe('R 1 240')
    expect(formatRand(52)).toBe('R 52')
    expect(formatRand(1234567)).toBe('R 1 234 567')
  })
})

describe('slipText', () => {
  it('lists the shop, the customer, each line and the guide total', () => {
    const lines = [line('HT-C15', 2), line('HT-CE15', 6)]
    expect(slipTotal(lines)).toBe(445 * 2 + 52 * 6)
    expect(slipText(lines, details).replaceAll(' ', ' ')).toBe(
      [
        'Hiltop Plumbing Supplies (Pty) Ltd: quote request',
        '',
        'Name: Thandi Mkhize',
        'Phone: 082 555 0101',
        'Site: Hilton, new bathroom',
        '',
        '1. 15 mm copper tube, Class 0, SANS 460, half-hard',
        '   2 × 5.5 m length, guide R 890',
        '2. 15 mm compression elbow, Brass, copper to copper',
        '   Qty 6, guide R 312',
        '',
        'Guide total: R 1 202',
        '',
        'Please confirm stock and price before I collect.',
      ].join('\n'),
    )
  })

  it('leaves out empty site and notes', () => {
    const text = slipText([line('HT-PTFE', 1)], { ...details, site: ' ' })
    expect(text).not.toContain('Site:')
    expect(text).not.toContain('Notes:')
  })
})

describe('slipProblems', () => {
  it('needs a name and a phone number', () => {
    const lines = [line('HT-PTFE', 1)]
    expect(slipProblems(lines, details)).toEqual([])
    expect(slipProblems(lines, { ...details, name: '  ' })).toEqual(['name'])
    expect(slipProblems(lines, { ...details, phone: '082 555' })).toEqual(['phone'])
  })

  it('needs at least one line or a note', () => {
    expect(slipProblems([], details)).toEqual(['empty'])
    expect(slipProblems([], { ...details, notes: 'Do you stock 32 mm HDPE?' })).toEqual([])
  })
})

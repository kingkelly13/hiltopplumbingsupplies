// The counter list. Prices are guides in rand, not shelf prices.
// stock: 'shelf' shows "Usually on the shelf", 'confirm' shows "Confirm before you drive".

export const categories = [
  {
    id: 'copper',
    name: 'Copper tube',
    blurb: 'Class 0 tube and brass compression fittings. Copper moves with the metal price, so these guides go stale fastest.',
    image: '/media/copper.jpg',
  },
  {
    id: 'poly',
    name: 'Poly & HDPE',
    blurb: 'Black HDPE rolls and compression fittings for yard lines and supply runs.',
    image: '/media/poly.jpg',
  },
  {
    id: 'pvc',
    name: 'PVC & waste',
    blurb: 'Soil, vent and waste pipe, bends, traps and solvent cement.',
    image: '/media/pvc.jpg',
  },
  {
    id: 'valves',
    name: 'Valves & brass',
    blurb: 'Gate, ball and stop valves, and pressure control for geyser work.',
    image: '/media/valves.jpg',
  },
  {
    id: 'taps',
    name: 'Taps & mixers',
    blurb: 'Basin, sink and shower mixers, and garden taps.',
    image: '/media/taps.jpg',
  },
  {
    id: 'hot-water',
    name: 'Hot water',
    blurb: 'Electric geysers and the spares that keep them running.',
    image: '/media/geyser.jpg',
  },
  {
    id: 'drainage',
    name: 'Drainage',
    blurb: 'Sewer pipe, gullies, rodding eyes and pan connectors.',
    image: '/media/drainage.jpg',
  },
  {
    id: 'tools',
    name: 'Tools & sundries',
    blurb: 'Cutters, wrenches, thread tape and sealant for the bakkie.',
    image: '/media/tools.jpg',
  },
] as const

export type Category = (typeof categories)[number]
export type CategoryId = Category['id']

export interface Product {
  sku: string
  name: string
  spec: string
  category: CategoryId
  // What one quantity buys: "each", "5.5 m length", "50 m roll".
  unit: string
  price: number
  stock: 'shelf' | 'confirm'
  // Shown under "Common lines" on the home page.
  common?: boolean
}

export const products: Product[] = [
  { sku: 'HT-C15', name: '15 mm copper tube', spec: 'Class 0, SANS 460, half-hard', category: 'copper', unit: '5.5 m length', price: 445, stock: 'shelf', common: true },
  { sku: 'HT-C22', name: '22 mm copper tube', spec: 'Class 0, SANS 460, half-hard', category: 'copper', unit: '5.5 m length', price: 790, stock: 'shelf' },
  { sku: 'HT-C28', name: '28 mm copper tube', spec: 'Class 0, SANS 460, half-hard', category: 'copper', unit: '5.5 m length', price: 1240, stock: 'confirm' },
  { sku: 'HT-CE15', name: '15 mm compression elbow', spec: 'Brass, copper to copper', category: 'copper', unit: 'each', price: 52, stock: 'shelf', common: true },
  { sku: 'HT-CT22', name: '22 mm compression tee', spec: 'Brass, equal tee', category: 'copper', unit: 'each', price: 118, stock: 'shelf' },

  { sku: 'HT-P20', name: '20 mm HDPE pipe', spec: 'Class 12, black', category: 'poly', unit: '50 m roll', price: 585, stock: 'shelf', common: true },
  { sku: 'HT-P25', name: '25 mm HDPE pipe', spec: 'Class 12, black', category: 'poly', unit: '50 m roll', price: 840, stock: 'shelf' },
  { sku: 'HT-PC20', name: '20 mm HDPE coupling', spec: 'Compression, straight', category: 'poly', unit: 'each', price: 42, stock: 'shelf' },
  { sku: 'HT-PF25', name: '25 mm × ¾″ female adaptor', spec: 'HDPE compression to BSP female', category: 'poly', unit: 'each', price: 48, stock: 'shelf' },

  { sku: 'HT-V110', name: '110 mm PVC soil pipe', spec: 'Soil and vent, plain end', category: 'pvc', unit: '6 m length', price: 520, stock: 'shelf' },
  { sku: 'HT-V50', name: '50 mm PVC waste pipe', spec: 'Grey, solvent weld', category: 'pvc', unit: '6 m length', price: 235, stock: 'shelf' },
  { sku: 'HT-VB110', name: '110 mm 87.5° bend', spec: 'PVC, solvent weld', category: 'pvc', unit: 'each', price: 78, stock: 'shelf' },
  { sku: 'HT-VT40', name: '40 mm P-trap', spec: 'Basin and sink, PVC', category: 'pvc', unit: 'each', price: 64, stock: 'shelf' },
  { sku: 'HT-VS', name: 'PVC solvent cement', spec: 'Tin with brush', category: 'pvc', unit: '500 ml tin', price: 118, stock: 'shelf' },

  { sku: 'HT-GV15', name: '15 mm gate valve', spec: 'Brass, compression ends', category: 'valves', unit: 'each', price: 148, stock: 'shelf' },
  { sku: 'HT-BV22', name: '22 mm ball valve', spec: 'Brass, lever handle, compression', category: 'valves', unit: 'each', price: 215, stock: 'shelf', common: true },
  { sku: 'HT-SC15', name: '15 mm stopcock', spec: 'Brass, compression ends', category: 'valves', unit: 'each', price: 165, stock: 'shelf' },
  { sku: 'HT-PCV', name: 'Pressure control valve', spec: '400 kPa, 22 mm', category: 'valves', unit: 'each', price: 895, stock: 'shelf' },

  { sku: 'HT-TB', name: 'Basin mixer', spec: 'Single lever, chrome', category: 'taps', unit: 'each', price: 540, stock: 'shelf' },
  { sku: 'HT-TK', name: 'Sink mixer', spec: 'Wall type, swivel spout, chrome', category: 'taps', unit: 'each', price: 720, stock: 'shelf' },
  { sku: 'HT-TH', name: 'Shower mixer', spec: 'Wall mounted, chrome', category: 'taps', unit: 'each', price: 610, stock: 'confirm' },
  { sku: 'HT-TG', name: '15 mm garden tap', spec: 'Brass bib tap', category: 'taps', unit: 'each', price: 95, stock: 'shelf' },

  { sku: 'HT-G150', name: '150 L electric geyser', spec: 'Horizontal, 3 kW, 600 kPa', category: 'hot-water', unit: 'each', price: 3650, stock: 'confirm' },
  { sku: 'HT-GE3', name: 'Geyser element', spec: '3 kW, 230 V, copper sheath', category: 'hot-water', unit: 'each', price: 215, stock: 'shelf', common: true },
  { sku: 'HT-GT', name: 'Geyser thermostat', spec: 'Rod type, 300 mm', category: 'hot-water', unit: 'each', price: 185, stock: 'shelf' },
  { sku: 'HT-GS', name: 'Pressure safety valve', spec: '600 kPa, 15 mm', category: 'hot-water', unit: 'each', price: 260, stock: 'shelf' },

  { sku: 'HT-D110', name: '110 mm sewer pipe', spec: 'Heavy duty, brown', category: 'drainage', unit: '6 m length', price: 610, stock: 'shelf' },
  { sku: 'HT-DG', name: '110 mm gully', spec: 'PVC, with grid', category: 'drainage', unit: 'each', price: 165, stock: 'shelf' },
  { sku: 'HT-DR', name: '110 mm rodding eye', spec: 'PVC, screw cap', category: 'drainage', unit: 'each', price: 138, stock: 'shelf' },
  { sku: 'HT-DP', name: 'Pan connector', spec: '110 mm, flexible', category: 'drainage', unit: 'each', price: 89, stock: 'shelf' },

  { sku: 'HT-PTFE', name: 'PTFE thread tape', spec: '12 mm × 10 m', category: 'tools', unit: 'roll', price: 12, stock: 'shelf', common: true },
  { sku: 'HT-PCT', name: 'Pipe cutter', spec: '3–30 mm, copper and poly', category: 'tools', unit: 'each', price: 245, stock: 'shelf' },
  { sku: 'HT-PW14', name: 'Pipe wrench', spec: '350 mm (14″)', category: 'tools', unit: 'each', price: 320, stock: 'shelf' },
  { sku: 'HT-SIL', name: 'Silicone sealant', spec: 'Clear, sanitary, 280 ml', category: 'tools', unit: 'cartridge', price: 89, stock: 'shelf' },
]

const bySku = new Map(products.map((p) => [p.sku, p]))

export function findProduct(sku: string) {
  return bySku.get(sku)
}

export function findCategory(id: string) {
  return categories.find((c) => c.id === id)
}

export const stockLabel: Record<Product['stock'], string> = {
  shelf: 'Usually on the shelf',
  confirm: 'Confirm before you drive',
}

// Business facts shown on the site. HANDOVER.md says how sure each one is.

export const shop = {
  tradingName: 'Hiltop Plumbing Supplies',
  legalName: 'Hiltop Plumbing Supplies (Pty) Ltd',
  street: '3B Saligna Road',
  suburb: 'Merrivale',
  town: 'Howick',
  province: 'KwaZulu-Natal',
  postalCode: '3291',
  phone: {
    display: '066 254 3454',
    tel: '+27662543454',
  },
  // International format without the plus, as wa.me expects.
  whatsapp: '27662543454',
  map: {
    lat: -29.5141,
    lng: 30.2332,
    note: 'The pin marks Saligna Road near Rangeview Road, not the exact stand.',
  },
  review: {
    text: 'Exceptional service and quality products at affordable prices.',
    source: 'Customer note',
  },
  dropAreas: ['Howick', 'Hilton', 'Pietermaritzburg'],
} as const

export const addressLines = [
  `${shop.street}, ${shop.suburb}`,
  `${shop.town}, ${shop.province} ${shop.postalCode}`,
]

export const telHref = `tel:${shop.phone.tel}`

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${shop.whatsapp}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${shop.map.lat}%2C${shop.map.lng}`
export const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${shop.map.lat}%2C${shop.map.lng}`

export interface HoursRow {
  label: string
  // 0 is Sunday, 6 is Saturday.
  days: number[]
  // 24-hour "HH:MM", or null for a closed day.
  open: string | null
  close: string | null
}

// Placeholder hours: the owner has not given them yet.
// The printed hours and the open/closed badge both read this list.
export const hours: HoursRow[] = [
  { label: 'Monday to Friday', days: [1, 2, 3, 4, 5], open: '07:30', close: '16:30' },
  { label: 'Saturday', days: [6], open: '08:00', close: '13:00' },
  { label: 'Sunday', days: [0], open: null, close: null },
]

export const holidayNote = 'Public holidays: closed, as on a Sunday.'

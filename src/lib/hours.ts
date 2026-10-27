import { hours, type HoursRow } from '../data/shop'

// South Africa runs on SAST, UTC+2, with no daylight saving.
const SAST_OFFSET_MS = 2 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export type HoursState = 'open' | 'later' | 'done' | 'closed'

export interface HoursStatus {
  state: HoursState
  label: string
  detail: string
}

export interface SastDay {
  year: number
  month: number
  day: number
  weekday: number
  minutes: number
}

export function toMinutes(hhmm: string) {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function sastDay(now: Date): SastDay {
  const t = new Date(now.getTime() + SAST_OFFSET_MS)
  return {
    year: t.getUTCFullYear(),
    month: t.getUTCMonth() + 1,
    day: t.getUTCDate(),
    weekday: t.getUTCDay(),
    minutes: t.getUTCHours() * 60 + t.getUTCMinutes(),
  }
}

export function rowFor(weekday: number): HoursRow | undefined {
  return hours.find((row) => row.days.includes(weekday))
}

// Easter Sunday, Gregorian calendar (anonymous algorithm).
function easter(year: number) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return Date.UTC(year, month - 1, day)
}

const fixedHolidays: [number, number, string][] = [
  [1, 1, "New Year's Day"],
  [3, 21, 'Human Rights Day'],
  [4, 27, 'Freedom Day'],
  [5, 1, "Workers' Day"],
  [6, 16, 'Youth Day'],
  [8, 9, "National Women's Day"],
  [9, 24, 'Heritage Day'],
  [12, 16, 'Day of Reconciliation'],
  [12, 25, 'Christmas Day'],
  [12, 26, 'Day of Goodwill'],
]

const holidayCache = new Map<number, Map<string, string>>()

const dayKey = (utc: number) => {
  const d = new Date(utc)
  return `${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

// Public Holidays Act: the fixed days, Good Friday and Family Day, and the
// Monday after any holiday that falls on a Sunday. One-off days the
// President declares (such as election days) are not known here.
function holidaysFor(year: number) {
  const cached = holidayCache.get(year)
  if (cached) return cached

  const list = new Map<string, string>()
  const sunday = easter(year)
  list.set(dayKey(sunday - 2 * DAY_MS), 'Good Friday')
  list.set(dayKey(sunday + DAY_MS), 'Family Day')
  for (const [month, day, name] of fixedHolidays) list.set(`${month}-${day}`, name)
  for (const [month, day, name] of fixedHolidays) {
    const utc = Date.UTC(year, month - 1, day)
    const monday = dayKey(utc + DAY_MS)
    if (new Date(utc).getUTCDay() === 0 && !list.has(monday)) {
      list.set(monday, `${name} (observed)`)
    }
  }
  holidayCache.set(year, list)
  return list
}

export function publicHoliday(year: number, month: number, day: number) {
  return holidaysFor(year).get(`${month}-${day}`) ?? null
}

function openRow(day: SastDay) {
  if (publicHoliday(day.year, day.month, day.day)) return null
  const row = rowFor(day.weekday)
  return row?.open && row.close ? { open: row.open, close: row.close } : null
}

function nextOpening(now: Date) {
  for (let i = 1; i <= 14; i++) {
    const day = sastDay(new Date(now.getTime() + i * DAY_MS))
    const row = openRow(day)
    if (row) return `opens ${i === 1 ? 'tomorrow' : weekdayShort[day.weekday]} ${row.open}`
  }
  return 'phone the counter'
}

export function hoursStatus(now: Date = new Date()): HoursStatus {
  const today = sastDay(now)
  const row = openRow(today)

  if (!row) {
    const holiday = publicHoliday(today.year, today.month, today.day)
    const next = nextOpening(now)
    return { state: 'closed', label: 'Closed today', detail: holiday ? `${holiday}, ${next}` : next }
  }
  if (today.minutes < toMinutes(row.open)) {
    return { state: 'later', label: 'Opens later today', detail: `at ${row.open}` }
  }
  if (today.minutes < toMinutes(row.close)) {
    return { state: 'open', label: 'Open now', detail: `until ${row.close}` }
  }
  return { state: 'done', label: 'Closed for the day', detail: nextOpening(now) }
}

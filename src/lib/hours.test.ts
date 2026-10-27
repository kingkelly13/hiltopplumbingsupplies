import { describe, expect, it } from 'vitest'
import { hours } from '../data/shop'
import { hoursStatus, publicHoliday, rowFor, sastDay } from './hours'

// SAST is UTC+2, so 07:30 in Merrivale is 05:30Z.
const sast = (iso: string) => new Date(`${iso}+02:00`)

describe('hours data', () => {
  it('covers every day of the week exactly once', () => {
    const days = hours.flatMap((row) => row.days).sort()
    expect(days).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('has an open and close time on open days, and neither on closed days', () => {
    for (const row of hours) expect(row.open === null).toBe(row.close === null)
  })
})

describe('sastDay', () => {
  it('reads the wall clock in South Africa, not the server', () => {
    // 23:30Z on a Tuesday is already Wednesday 01:30 in South Africa.
    const day = sastDay(new Date('2026-10-27T23:30:00Z'))
    expect(day).toMatchObject({ month: 10, day: 28, weekday: 3, minutes: 90 })
  })
})

describe('publicHoliday', () => {
  it('knows the fixed days', () => {
    expect(publicHoliday(2026, 9, 24)).toBe('Heritage Day')
    expect(publicHoliday(2026, 12, 16)).toBe('Day of Reconciliation')
    expect(publicHoliday(2026, 10, 27)).toBeNull()
  })

  it('works out Good Friday and Family Day from Easter', () => {
    expect(publicHoliday(2026, 4, 3)).toBe('Good Friday')
    expect(publicHoliday(2026, 4, 6)).toBe('Family Day')
    expect(publicHoliday(2027, 3, 26)).toBe('Good Friday')
    expect(publicHoliday(2027, 3, 29)).toBe('Family Day')
  })

  it('moves a Sunday holiday to the Monday', () => {
    // 9 August 2026 is a Sunday.
    expect(publicHoliday(2026, 8, 10)).toBe("National Women's Day (observed)")
    // 26 December 2027 is a Sunday.
    expect(publicHoliday(2027, 12, 27)).toBe('Day of Goodwill (observed)')
  })
})

describe('hoursStatus', () => {
  const weekday = rowFor(2)!
  const saturday = rowFor(6)!

  it('opens later today before opening time', () => {
    expect(hoursStatus(sast('2026-10-27T06:00:00'))).toEqual({
      state: 'later',
      label: 'Opens later today',
      detail: `at ${weekday.open}`,
    })
  })

  it('is open from opening time up to closing time', () => {
    expect(hoursStatus(sast(`2026-10-27T${weekday.open}:00`)).state).toBe('open')
    expect(hoursStatus(sast('2026-10-27T16:29:00'))).toEqual({
      state: 'open',
      label: 'Open now',
      detail: `until ${weekday.close}`,
    })
  })

  it('is closed for the day from closing time', () => {
    expect(hoursStatus(sast(`2026-10-27T${weekday.close}:00`))).toEqual({
      state: 'done',
      label: 'Closed for the day',
      detail: `opens tomorrow ${weekday.open}`,
    })
  })

  it('points Saturday afternoon to Monday', () => {
    expect(hoursStatus(sast('2026-10-31T14:00:00')).detail).toBe(`opens Mon ${weekday.open}`)
    expect(hoursStatus(sast('2026-10-31T09:00:00')).detail).toBe(`until ${saturday.close}`)
  })

  it('is closed all Sunday', () => {
    expect(hoursStatus(sast('2026-11-01T10:00:00'))).toEqual({
      state: 'closed',
      label: 'Closed today',
      detail: `opens tomorrow ${weekday.open}`,
    })
  })

  it('treats a public holiday as closed and names it', () => {
    // Heritage Day 2026 is a Thursday.
    expect(hoursStatus(sast('2026-09-24T10:00:00'))).toEqual({
      state: 'closed',
      label: 'Closed today',
      detail: `Heritage Day, opens tomorrow ${weekday.open}`,
    })
  })

  it('skips holidays when it works out the next opening', () => {
    // Christmas Day and the Day of Goodwill 2026 are Friday and Saturday.
    expect(hoursStatus(sast('2026-12-24T17:00:00')).detail).toBe(`opens Mon ${weekday.open}`)
  })
})

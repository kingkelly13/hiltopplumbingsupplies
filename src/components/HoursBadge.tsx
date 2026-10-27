import { useEffect, useState } from 'react'
import { hoursStatus, type HoursStatus } from '../lib/hours'

const dot: Record<HoursStatus['state'], string> = {
  open: 'bg-open',
  later: 'bg-later',
  done: 'bg-shut',
  closed: 'bg-shut',
}

// Worked out in the browser, so a cached page still shows the right state.
function useHoursStatus() {
  const [status, setStatus] = useState<HoursStatus | null>(null)
  useEffect(() => {
    const tick = () => setStatus(hoursStatus())
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])
  return status
}

export function HoursBadge({ className = '', detail = true }: { className?: string; detail?: boolean }) {
  const status = useHoursStatus()
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-live="polite">
      <span
        className={`size-2.5 shrink-0 rounded-full ring-2 ring-current/15 ${status ? dot[status.state] : 'bg-current/30'}`}
        aria-hidden="true"
      />
      {status ? (
        <span>
          <strong className="font-semibold">{status.label}</strong>
          {detail && <span className="opacity-80">, {status.detail}</span>}
        </span>
      ) : (
        <span className="opacity-80">Checking the hours</span>
      )}
    </span>
  )
}

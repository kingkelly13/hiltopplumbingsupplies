import { Link, useRouterState } from '@tanstack/react-router'
import { formatRand } from '../lib/money'
import { useQuote } from '../lib/quote'
import { ArrowIcon, SlipIcon } from './Icons'

// Follows the customer around once the slip has something on it.
export function SlipBar() {
  const { count, total } = useQuote()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (count === 0 || pathname === '/quote') return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] text-paper backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2.5 text-sm">
          <SlipIcon className="shrink-0 text-xl text-copper-bright" />
          <span className="truncate">
            <strong className="font-semibold">
              {count} {count === 1 ? 'line' : 'lines'}
            </strong>
            <span className="text-paper/70"> · guide {formatRand(total)}</span>
          </span>
        </p>
        <Link to="/quote" className="btn btn-primary h-11 shrink-0 px-4">
          View slip
          <ArrowIcon />
        </Link>
      </div>
    </div>
  )
}

export function useSlipBarSpace() {
  const { count } = useQuote()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return count > 0 && pathname !== '/quote'
}

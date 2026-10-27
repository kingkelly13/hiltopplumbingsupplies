import { Link } from '@tanstack/react-router'
import { shop, telHref } from '../data/shop'
import { useQuote } from '../lib/quote'
import { HoursBadge } from './HoursBadge'
import { PhoneIcon } from './Icons'

export function Mark({ className = '' }: { className?: string }) {
  // A pipe end seen head-on.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#c46f3c" />
      <circle cx="16" cy="16" r="15" fill="none" stroke="#7d3b19" strokeWidth="2" />
      <circle cx="16" cy="16" r="9.5" fill="#15181d" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="#e9b38a" strokeWidth="1.5" />
    </svg>
  )
}

const nav = [
  { to: '/', label: 'Home' },
  { to: '/counter', label: 'Counter' },
  { to: '/quote', label: 'Quote' },
  { to: '/find-us', label: 'Find us' },
] as const

export function SiteHeader() {
  const { count } = useQuote()
  return (
    <header className="bg-ink text-paper">
      <div className="border-b border-white/10 bg-ink-2 text-[0.8rem]">
        <div className="wrap flex h-9 items-center justify-between gap-4">
          <HoursBadge />
          <Link to="/find-us" className="hidden truncate text-paper/75 hover:text-paper sm:block">
            {shop.street}, {shop.suburb}, {shop.town}
          </Link>
        </div>
      </div>

      <div className="wrap flex items-center justify-between gap-4 pt-4 pb-3">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={`${shop.tradingName}, home`}>
          <Mark className="size-10 shrink-0" />
          <span className="min-w-0 leading-none">
            <span className="block font-display text-[1.65rem] font-bold uppercase tracking-[0.08em]">Hiltop</span>
            <span className="block truncate font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-copper-bright">
              Plumbing Supplies
            </span>
          </span>
        </Link>
        <a href={telHref} className="btn btn-primary h-11 shrink-0 px-4">
          <PhoneIcon />
          <span className="sm:hidden">Call</span>
          <span className="hidden sm:inline">{shop.phone.display}</span>
        </a>
      </div>

      <nav aria-label="Main" className="wrap">
        <ul className="grid grid-cols-4 sm:flex sm:gap-2">
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: true, includeSearch: false }}
                className="flex h-12 items-center justify-center gap-1.5 border-b-[3px] border-transparent px-1 font-display text-[1.05rem] font-semibold uppercase tracking-wide text-paper/70 hover:text-paper sm:px-4"
                activeProps={{ className: '!border-copper-bright !text-paper', 'aria-current': 'page' }}
              >
                {item.label}
                {item.to === '/quote' && count > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-copper px-1.5 font-mono text-[0.7rem] text-white">
                    {count}
                    <span className="sr-only"> lines on slip</span>
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

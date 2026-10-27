import { Link } from '@tanstack/react-router'
import { addressLines, holidayNote, hours, shop, telHref, whatsappHref } from '../data/shop'

export function HoursList({ className = '' }: { className?: string }) {
  return (
    <dl className={className}>
      {hours.map((row) => (
        <div key={row.label} className="flex justify-between gap-6 py-1">
          <dt>{row.label}</dt>
          <dd className="font-mono text-[0.9em] tabular-nums">{row.open ? `${row.open}–${row.close}` : 'Closed'}</dd>
        </div>
      ))}
    </dl>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper/80">
      <div className="wrap grid gap-10 py-12 text-sm sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-wide text-paper">{shop.tradingName}</p>
          <address className="mt-2 not-italic leading-relaxed">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <Link to="/find-us" className="mt-3 inline-block font-semibold text-copper-bright hover:underline">
            Map and directions
          </Link>
        </div>
        <div>
          <p className="font-display text-base font-semibold uppercase tracking-wider text-paper">Counter hours</p>
          <HoursList className="mt-2" />
          <p className="mt-1 text-paper/60">{holidayNote}</p>
        </div>
        <div>
          <p className="font-display text-base font-semibold uppercase tracking-wider text-paper">Talk to the counter</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              <a href={telHref} className="hover:text-paper">
                Call {shop.phone.display}
              </a>
            </li>
            <li>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                WhatsApp {shop.phone.display}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-5 text-xs leading-relaxed text-paper/55">
          {shop.legalName}. Prices on this site are guides in rand, not shelf prices. A quote is not an order: stock and
          price are confirmed at the counter.
        </p>
      </div>
    </footer>
  )
}

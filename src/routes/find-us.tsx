import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { addressLines, directionsHref, holidayNote, hours, mapsHref, shop, telHref, whatsappHref } from '../data/shop'
import { HoursBadge } from '../components/HoursBadge'
import { ArrowIcon, ChatIcon, PhoneIcon, PinIcon } from '../components/Icons'
import { sastDay } from '../lib/hours'

export const Route = createFileRoute('/find-us')({
  head: () => ({
    meta: [{ title: `Find us | ${shop.tradingName}` }],
  }),
  component: FindUs,
})

const { lat, lng } = shop.map
const bbox = [lng - 0.006, lat - 0.004, lng + 0.006, lat + 0.004].map((n) => n.toFixed(4)).join('%2C')
const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`

function FindUs() {
  // Today's row is worked out in the browser, on South African time.
  const [weekday, setWeekday] = useState<number | null>(null)
  useEffect(() => setWeekday(sastDay(new Date()).weekday), [])

  return (
    <section className="wrap pt-10">
      <p className="eyebrow">{shop.suburb}, {shop.town}</p>
      <h1 className="mt-1 text-4xl uppercase sm:text-5xl">Find us</h1>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted">
              <PinIcon /> Address
            </p>
            <address className="mt-2 text-lg not-italic leading-snug">
              <span className="block font-semibold">{shop.tradingName}</span>
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <div className="mt-4 grid gap-2">
              <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                Directions in Google Maps <ArrowIcon />
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a href={telHref} className="btn btn-dark h-11">
                  <PhoneIcon /> Call
                </a>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-outline h-11">
                  <ChatIcon /> WhatsApp
                </a>
              </div>
            </div>
            <p className="mt-3 font-display text-2xl font-bold tracking-wide">{shop.phone.display}</p>
          </div>

          <div className="card p-5">
            <h2 className="text-2xl uppercase">Counter hours</h2>
            <HoursBadge className="mt-1" />
            <table className="mt-4 w-full text-[0.95rem]">
              <caption className="sr-only">Counter hours, South African time</caption>
              <tbody>
                {hours.map((row) => {
                  const today = weekday !== null && row.days.includes(weekday)
                  return (
                    <tr key={row.label} className={`border-t border-line ${today ? 'font-semibold' : ''}`}>
                      <th scope="row" className="py-2 text-left font-[inherit]">
                        {row.label}
                        {today && <span className="ml-2 text-xs font-medium text-copper-deep uppercase">Today</span>}
                      </th>
                      <td className="py-2 text-right font-mono text-sm tabular-nums">
                        {row.open ? `${row.open}–${row.close}` : 'Closed'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="mt-3 border-t border-line pt-3 text-sm text-muted">{holidayNote}</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          <iframe
            title={`Street map of ${shop.street}, ${shop.suburb}`}
            src={osmEmbed}
            loading="lazy"
            className="block h-[24rem] w-full border-0 sm:h-[32rem]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm">
            <p className="text-muted">{shop.map.note}</p>
            <span className="flex gap-4">
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-copper-deep hover:underline">
                Google Maps
              </a>
              <a href={osmLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-copper-deep hover:underline">
                Larger map
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

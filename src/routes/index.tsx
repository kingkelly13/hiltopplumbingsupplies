import { Link, createFileRoute } from '@tanstack/react-router'
import { categories, products } from '../data/catalog'
import { addressLines, shop, telHref, whatsappHref } from '../data/shop'
import { HoursBadge } from '../components/HoursBadge'
import { ArrowIcon, ChatIcon, ClockIcon, PhoneIcon, PinIcon } from '../components/Icons'
import { ProductRow } from '../components/ProductRow'
import { HoursList } from '../components/SiteFooter'

export const Route = createFileRoute('/')({
  component: Home,
})

const steps = [
  {
    title: 'Pick your lines',
    body: 'Search the counter list and add quantities. A guide price in rand shows as you go.',
  },
  {
    title: 'Send the slip',
    body: 'Add your name and number, then send the slip on WhatsApp or copy it into a message.',
  },
  {
    title: 'We confirm, you collect',
    body: 'The counter checks stock and price and replies. A quote is not an order.',
  },
]

function Home() {
  const common = products.filter((p) => p.common)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <img
          src="/media/hero.jpg"
          alt=""
          width={1600}
          height={900}
          fetchPriority="high"
          className="absolute inset-0 -z-10 size-full object-cover object-[70%_50%] opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20" aria-hidden="true" />
        <div className="wrap pt-14 pb-24 sm:pt-20 sm:pb-32">
          <p className="eyebrow !text-copper-bright">Trade counter · Merrivale, Howick</p>
          <h1 className="mt-3 max-w-2xl text-[2.9rem] leading-[0.95] uppercase sm:text-7xl">
            Hiltop Plumbing Supplies
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/85">
            Copper, poly, PVC, valves, taps and geyser spares at the counter on Saligna Road. Build a quote slip here,
            send it on WhatsApp, and collect once we confirm.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/counter" className="btn btn-primary btn-lg">
              Open the counter list
              <ArrowIcon />
            </Link>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light btn-lg">
              <ChatIcon />
              WhatsApp the counter
            </a>
          </div>
        </div>
      </section>

      <section className="wrap relative z-10 -mt-12 grid gap-3 sm:grid-cols-3" aria-label="Hours, address and phone">
        <div className="card p-5 shadow-sm">
          <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted">
            <ClockIcon /> Counter hours
          </p>
          <HoursBadge className="mt-2 text-[0.95rem]" />
          <HoursList className="mt-3 border-t border-line pt-2 text-sm" />
        </div>
        <div className="card p-5 shadow-sm">
          <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted">
            <PinIcon /> The yard
          </p>
          <address className="mt-2 text-[0.95rem] not-italic leading-relaxed">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <Link to="/find-us" className="mt-3 inline-flex items-center gap-1.5 font-semibold text-copper-deep hover:underline">
            Map and directions <ArrowIcon />
          </Link>
        </div>
        <div className="card p-5 shadow-sm">
          <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted">
            <PhoneIcon /> Ask the counter
          </p>
          <p className="mt-1 font-display text-3xl font-bold tracking-wide">{shop.phone.display}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={telHref} className="btn btn-dark h-10 px-4 text-sm">
              <PhoneIcon /> Call
            </a>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-outline h-10 px-4 text-sm">
              <ChatIcon /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="wrap mt-16" aria-labelledby="how">
        <p className="eyebrow">No account, no payment</p>
        <h2 id="how" className="mt-1 text-3xl uppercase sm:text-4xl">
          How the quote slip works
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-ink pt-4">
              <span className="font-mono text-sm text-copper-deep">0{i + 1}</span>
              <h3 className="mt-1 text-xl uppercase">{step.title}</h3>
              <p className="mt-1 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap mt-16" aria-labelledby="cats">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">{products.length} lines in {categories.length} groups</p>
            <h2 id="cats" className="mt-1 text-3xl uppercase sm:text-4xl">
              On the counter
            </h2>
          </div>
          <Link to="/counter" className="inline-flex items-center gap-1.5 font-semibold text-copper-deep hover:underline">
            Full counter list <ArrowIcon />
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length
            return (
              <li key={cat.id}>
                <Link
                  to="/counter"
                  search={{ cat: cat.id }}
                  className="group card block h-full overflow-hidden hover:border-ink/40"
                >
                  <img
                    src={cat.image}
                    alt=""
                    width={800}
                    height={600}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="block p-3 sm:p-4">
                    <span className="block font-display text-lg font-bold uppercase leading-tight sm:text-xl">{cat.name}</span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {count} {count === 1 ? 'line' : 'lines'}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="wrap mt-16" aria-labelledby="common">
        <p className="eyebrow">Guide prices in rand</p>
        <h2 id="common" className="mt-1 text-3xl uppercase sm:text-4xl">
          Common lines
        </h2>
        <ul className="card mt-6 divide-y divide-line">
          {common.map((product) => (
            <ProductRow key={product.sku} product={product} />
          ))}
        </ul>
      </section>

      <section className="wrap mt-16 grid gap-3 sm:grid-cols-[3fr_2fr]">
        <figure className="rounded-lg bg-ink p-7 text-paper sm:p-9">
          <blockquote className="font-display text-2xl leading-snug font-semibold sm:text-3xl">
            <span className="text-copper-bright">“</span>
            {shop.review.text}
            <span className="text-copper-bright">”</span>
          </blockquote>
          <figcaption className="mt-4 text-sm text-paper/60">{shop.review.source}</figcaption>
        </figure>
        <div className="card flex flex-col justify-center p-7">
          <h2 className="text-2xl uppercase">Need it on site?</h2>
          <p className="mt-2 text-muted">
            Ask the counter about a drop through {shop.dropAreas.slice(0, -1).join(', ')} and {shop.dropAreas.at(-1)}.
          </p>
          <a href={telHref} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-copper-deep hover:underline">
            Call {shop.phone.display} <ArrowIcon />
          </a>
        </div>
      </section>
    </>
  )
}

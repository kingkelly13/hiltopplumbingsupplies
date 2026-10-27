import { useEffect, useMemo, useState } from 'react'
import { Link, createFileRoute, useHydrated } from '@tanstack/react-router'
import { categories, findCategory, products, type CategoryId, type Product } from '../data/catalog'
import { shop, telHref, whatsappHref } from '../data/shop'
import { CloseIcon, SearchIcon } from '../components/Icons'
import { ProductRow } from '../components/ProductRow'

interface CounterSearch {
  cat?: CategoryId
  q?: string
}

export const Route = createFileRoute('/counter')({
  validateSearch: (search: Record<string, unknown>): CounterSearch => ({
    cat: typeof search.cat === 'string' ? findCategory(search.cat)?.id : undefined,
    q: typeof search.q === 'string' && search.q.trim() ? search.q : undefined,
  }),
  head: () => ({
    meta: [{ title: `Counter list | ${shop.tradingName}` }],
  }),
  component: Counter,
})

// "15 mm" and "15mm" should find the same lines.
const squash = (text: string) => text.toLowerCase().replace(/(\d)\s+(mm|m|l|kw|kpa|ml|v)\b/g, '$1$2')

const haystacks = new Map(
  products.map((p) => [p.sku, squash(`${p.name} ${p.spec} ${p.sku} ${findCategory(p.category)?.name ?? ''} ${p.unit}`)]),
)

function matches(product: Product, query: string) {
  const words = squash(query).split(/\s+/).filter(Boolean)
  const hay = haystacks.get(product.sku) ?? ''
  return words.every((word) => hay.includes(word))
}

function Counter() {
  const search = Route.useSearch()
  // The page is prerendered unfiltered. Filters from the URL apply once the browser takes over,
  // so the first render matches the static HTML.
  const hydrated = useHydrated()
  const { cat, q = '' } = hydrated ? search : {}
  const navigate = Route.useNavigate()
  const [text, setText] = useState(q)
  useEffect(() => setText(q), [q])

  const groups = useMemo(() => {
    return categories
      .filter((c) => !cat || c.id === cat)
      .map((c) => ({ category: c, items: products.filter((p) => p.category === c.id && matches(p, q)) }))
      .filter((g) => g.items.length > 0)
  }, [cat, q])

  const shown = groups.reduce((n, g) => n + g.items.length, 0)

  const setQuery = (value: string) => {
    setText(value)
    navigate({ search: (prev) => ({ ...prev, q: value.trim() ? value : undefined }), replace: true })
  }

  return (
    <>
      <section className="wrap pt-10">
        <p className="eyebrow">Guide prices in rand · confirmed at the counter</p>
        <h1 className="mt-1 text-4xl uppercase sm:text-5xl">Counter list</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Add quantities to your slip, then send it from the Quote page. Lines marked <em>Confirm before you drive</em>{' '}
          are not always in the yard. The counter carries more than this list, so ask if you can’t find a part.
        </p>
      </section>

      <div className="sticky top-0 z-10 mt-6 border-y border-line bg-paper/95 backdrop-blur">
        <div className="wrap py-3">
          <label className="relative block">
            <span className="sr-only">Search the counter list</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lg text-muted" />
            <input
              type="search"
              value={text}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: 15 mm elbow, geyser, HDPE…"
              className="field h-12 pr-11 pl-10"
              enterKeyHint="search"
            />
            {text && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded text-muted hover:bg-ink/5 hover:text-ink"
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </label>
          <nav aria-label="Groups" className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
              <li>
                <Chip active={!cat} search={{ q: q || undefined }}>
                  All lines
                </Chip>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Chip active={cat === c.id} search={{ cat: c.id, q: q || undefined }}>
                    {c.name}
                  </Chip>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="wrap mt-6">
        <p className="text-sm text-muted" aria-live="polite">
          {shown === products.length ? `All ${shown} lines` : `${shown} of ${products.length} lines`}
          {cat && ` in ${findCategory(cat)?.name}`}
          {q && ` matching “${q}”`}
        </p>

        {groups.length === 0 ? (
          <div className="card mt-4 p-8 text-center">
            <p className="font-display text-2xl font-bold uppercase">Not on this list</p>
            <p className="mx-auto mt-2 max-w-md text-muted">
              Nothing here matches{q ? ` “${q}”` : ''}. The yard carries more than the website shows, so ask the
              counter.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={telHref} className="btn btn-dark btn-lg">
                Call {shop.phone.display}
              </a>
              <a
                href={whatsappHref(`Hi, do you have ${q || 'this part'} in stock?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-10">
            {groups.map(({ category, items }) => (
              <section key={category.id} aria-labelledby={`g-${category.id}`}>
                <header className="flex items-center gap-4">
                  <img
                    src={category.image}
                    alt=""
                    width={800}
                    height={600}
                    loading="lazy"
                    className="size-16 shrink-0 rounded-md object-cover sm:size-20"
                  />
                  <div className="min-w-0">
                    <h2 id={`g-${category.id}`} className="text-2xl uppercase sm:text-3xl">
                      {category.name}
                    </h2>
                    <p className="text-sm text-muted">{category.blurb}</p>
                  </div>
                </header>
                <ul className="card mt-4 divide-y divide-line">
                  {items.map((product) => (
                    <ProductRow key={product.sku} product={product} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function Chip({ active, search, children }: { active: boolean; search: CounterSearch; children: string }) {
  return (
    <Link
      to="/counter"
      search={search}
      replace
      resetScroll={false}
      aria-current={active ? 'true' : undefined}
      className={`inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
        active ? 'border-ink bg-ink text-paper' : 'border-ink/20 bg-card text-ink hover:border-ink/50'
      }`}
    >
      {children}
    </Link>
  )
}

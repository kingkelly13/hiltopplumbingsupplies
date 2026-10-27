import { useEffect, useRef, useState, type ReactElement } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { shop, whatsappHref } from '../data/shop'
import { ArrowIcon, ChatIcon, CheckIcon, CloseIcon, CopyIcon } from '../components/Icons'
import { QtyStepper } from '../components/QtyStepper'
import { StockTag } from '../components/ProductRow'
import { formatRand, priceLabel } from '../lib/money'
import { useQuote } from '../lib/quote'
import { slipProblems, slipText, type SlipDetails, type SlipProblem } from '../lib/slip'

export const Route = createFileRoute('/quote')({
  head: () => ({
    meta: [{ title: `Quote slip | ${shop.tradingName}` }],
  }),
  component: Quote,
})

const problemText: Record<SlipProblem, string> = {
  name: 'Add your name so the counter knows who to reply to.',
  phone: 'Add a phone number the counter can reach you on.',
  empty: 'Add a line from the counter list, or write what you need in the notes.',
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers, or the page is not focused.
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

function Quote() {
  const { ready, lines, total, details, setDetail, setQty, clearLines } = useQuote()
  const [tried, setTried] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const fields = useRef<Partial<Record<keyof SlipDetails, HTMLInputElement | HTMLTextAreaElement | null>>>({})

  const problems = slipProblems(lines, details)
  const text = slipText(lines, details)
  const invalid = (field: SlipProblem) => tried && problems.includes(field)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(id)
  }, [copied])

  const check = () => {
    setTried(true)
    const first = problems[0]
    if (first === 'name' || first === 'phone') fields.current[first]?.focus()
    if (first === 'empty') fields.current.notes?.focus()
    return problems.length === 0
  }

  return (
    <section className="wrap pt-10">
      <p className="eyebrow">Not an order · the counter confirms</p>
      <h1 className="mt-1 text-4xl uppercase sm:text-5xl">Quote slip</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Send this slip on WhatsApp or copy it into a message. The counter checks stock and price and replies before you
        drive out. The slip is kept on this phone only. The shop sees it once you send it.
      </p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-dashed border-ink/25 bg-copper-soft/40 px-4 py-3 sm:px-5">
            <p className="font-display text-lg font-bold uppercase tracking-wide">
              {lines.length} {lines.length === 1 ? 'line' : 'lines'}
            </p>
            {lines.length > 0 &&
              (confirmClear ? (
                <span className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      clearLines()
                      setConfirmClear(false)
                    }}
                    className="font-semibold text-shut hover:underline"
                  >
                    Yes, clear the slip
                  </button>
                  <button type="button" onClick={() => setConfirmClear(false)} className="text-muted hover:underline">
                    Keep it
                  </button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmClear(true)} className="text-sm font-semibold text-muted hover:text-ink hover:underline">
                  Clear slip
                </button>
              ))}
          </div>

          {!ready ? (
            <p className="px-5 py-10 text-center text-muted">Opening your slip…</p>
          ) : lines.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-display text-2xl font-bold uppercase">The slip is empty</p>
              <p className="mx-auto mt-2 max-w-sm text-muted">
                Add lines from the counter list. Can’t find a part? Write it in the notes and send that instead.
              </p>
              <Link to="/counter" className="btn btn-primary btn-lg mt-5">
                Open the counter list <ArrowIcon />
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {lines.map(({ product, qty }) => (
                  <li key={product.sku} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-3 px-4 py-4 sm:px-5">
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug">{product.name}</p>
                      <p className="text-sm text-muted">{product.spec}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="font-mono tracking-wide text-muted">{product.sku}</span>
                        <StockTag stock={product.stock} />
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQty(product.sku, 0)}
                      className="grid size-9 place-items-center self-start rounded text-muted hover:bg-ink/5 hover:text-ink"
                      aria-label={`Remove ${product.name}`}
                    >
                      <CloseIcon />
                    </button>
                    <div className="col-span-2 flex flex-wrap items-center justify-between gap-3">
                      <QtyStepper product={product} />
                      <p className="text-right">
                        <span className="block text-[1.05rem] font-semibold tabular-nums">
                          {formatRand(product.price * qty)}
                        </span>
                        <span className="block text-xs text-muted">{priceLabel(product.price, product.unit)}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-between gap-4 border-t-2 border-ink px-4 py-4 sm:px-5">
                <p className="font-display text-lg font-bold uppercase tracking-wide">Guide total</p>
                <p className="text-2xl font-semibold tabular-nums">{formatRand(total)}</p>
              </div>
              <p className="px-4 pb-5 text-sm text-muted sm:px-5">
                Guide prices, not shelf prices. Copper moves with the metal price. The counter confirms the real total.
              </p>
            </>
          )}
        </div>

        <form
          className="card space-y-4 p-5 lg:sticky lg:top-4"
          onSubmit={(e) => e.preventDefault()}
          noValidate
          aria-labelledby="details-heading"
        >
          <h2 id="details-heading" className="text-2xl uppercase">
            Your details
          </h2>
          <Field
            label="Name"
            required
            error={invalid('name') ? problemText.name : undefined}
            input={
              <input
                ref={(el) => {
                  fields.current.name = el
                }}
                className="field"
                autoComplete="name"
                value={details.name}
                onChange={(e) => setDetail('name', e.target.value)}
                aria-invalid={invalid('name')}
              />
            }
          />
          <Field
            label="Phone"
            required
            error={invalid('phone') ? problemText.phone : undefined}
            input={
              <input
                ref={(el) => {
                  fields.current.phone = el
                }}
                className="field"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="082 123 4567"
                value={details.phone}
                onChange={(e) => setDetail('phone', e.target.value)}
                aria-invalid={invalid('phone')}
              />
            }
          />
          <Field
            label="Site"
            hint="Job address or name, if it helps"
            input={
              <input
                className="field"
                autoComplete="street-address"
                value={details.site}
                onChange={(e) => setDetail('site', e.target.value)}
              />
            }
          />
          <Field
            label="Notes"
            hint="Collection time, a part that isn’t listed, sizes"
            error={invalid('empty') ? problemText.empty : undefined}
            input={
              <textarea
                ref={(el) => {
                  fields.current.notes = el
                }}
                className="field min-h-24"
                rows={3}
                value={details.notes}
                onChange={(e) => setDetail('notes', e.target.value)}
                aria-invalid={invalid('empty')}
              />
            }
          />

          <div className="space-y-2 pt-1">
            <a
              href={whatsappHref(text)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!check()) e.preventDefault()
              }}
              className="btn btn-primary btn-lg w-full"
            >
              <ChatIcon />
              Send on WhatsApp
            </a>
            <button
              type="button"
              onClick={async () => {
                if (check()) setCopied(await copyText(text))
              }}
              className="btn btn-outline btn-lg w-full"
            >
              {copied ? <CheckIcon className="text-open" /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy slip'}
            </button>
            <p className="sr-only" aria-live="polite">
              {copied ? 'Slip copied' : ''}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            WhatsApp opens with the slip written out, ready to send to {shop.phone.display}. Nothing is sent until you
            tap send in WhatsApp.
          </p>

          <details className="group rounded-md border border-line bg-paper/60 text-sm">
            <summary className="cursor-pointer px-3 py-2 font-semibold select-none">See the message</summary>
            <pre className="overflow-x-auto border-t border-line px-3 py-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {text}
            </pre>
          </details>
        </form>
      </div>
    </section>
  )
}

function Field({
  label,
  hint,
  required,
  error,
  input,
}: {
  label: string
  hint?: string
  required?: boolean
  error?: string
  input: ReactElement
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{label}</span>
        <span className="text-xs text-muted">{required ? 'Needed' : 'Optional'}</span>
      </span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      <span className="mt-1.5 block">{input}</span>
      {error && (
        <span className="mt-1 block text-sm font-medium text-shut" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

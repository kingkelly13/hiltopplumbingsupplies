import type { ReactNode } from 'react'
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { shop } from '../data/shop'
import { QuoteProvider } from '../lib/quote'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { SlipBar, useSlipBarSpace } from '../components/SlipBar'

// Share (og:) tags are injected at publish time from public/og.jpg,
// public/x-banner.jpg and src/lib/og/site.json. Do not add them here.
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: `${shop.tradingName} | Trade counter, Merrivale, Howick` },
      {
        name: 'description',
        content: `Plumbing supplies counter at ${shop.street}, ${shop.suburb}, ${shop.town}. Browse the counter list, build a quote slip and send it on WhatsApp.`,
      },
      { name: 'theme-color', content: '#15181d' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <QuoteProvider>
        <Layout />
      </QuoteProvider>
    </RootDocument>
  )
}

function Layout() {
  const barSpace = useSlipBarSpace()
  return (
    // The ink background shows under the footer when the slip bar needs room.
    <div className={`flex min-h-dvh flex-col bg-ink ${barSpace ? 'pb-[calc(4rem+env(safe-area-inset-bottom))]' : ''}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1 bg-paper pb-20">
        <Outlet />
      </main>
      <SiteFooter />
      <SlipBar />
    </div>
  )
}

function NotFound() {
  return (
    <section className="wrap py-20">
      <p className="eyebrow">Not on the shelf</p>
      <h1 className="mt-2 text-4xl uppercase">That page isn’t here</h1>
      <p className="mt-3 max-w-prose text-muted">The link may be old. The counter list and the map are still a tap away.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/counter" className="btn btn-primary btn-lg">
          Open the counter list
        </Link>
        <Link to="/find-us" className="btn btn-outline btn-lg">
          Find us
        </Link>
      </div>
    </section>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-ZA">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

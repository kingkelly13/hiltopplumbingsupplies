# Hiltop Plumbing Supplies — site handover

Date: 27 October 2026
Site: trade-counter website for **Hiltop Plumbing Supplies (Pty) Ltd**
Address on the site: **3B Saligna Road, Merrivale, Howick, KwaZulu-Natal 3291**

This note is for the owner or the next person who looks after the site. It says what is live, what was guessed, and where each fact lives.

## Rebuild note

The code for the first version of this site was never in this repository. On 27 October 2026 the site was rebuilt here from the earlier handover. The pages, business facts, slip format and storage key match that handover. Where the rebuild is different, this note says so:

- The open/closed badge and the printed hours now read from one list, so they can no longer disagree.
- The badge also knows South African public holidays.
- The counter list was written again. Only the three “Confirm before you drive” lines and their guide prices came from the earlier handover.
- There are nine pictures, one for each group plus the home page banner. All are drawn illustrations.

## What the site does

Customers can browse a counter list, build a quote slip on their own phone, and send that slip on WhatsApp or copy it. They can also call the shop or open a map.

There is no login, no online payment, and no order database. A quote is not an order. Stock and price are confirmed at the counter.

The slip is saved only in that browser (`localStorage`, key `hiltop-quote-v1`). The customer’s name, phone, site and notes are saved with it. Clearing the browser, or opening the site on another phone, starts an empty slip. The shop does not receive a copy unless the customer sends WhatsApp or reads it out.

## Pages

| Page | Address | What it is |
|---|---|---|
| Home | `/` | Name, address, hours, categories, a few common lines, customer line |
| Counter | `/counter` | Search and filter the full list. Add quantities to the slip. `/counter?cat=copper` opens one group |
| Quote | `/quote` | Slip, name, phone, site, notes. WhatsApp or copy |
| Find us | `/find-us` | Hours, call, WhatsApp, Google Maps, street map |

## Business details on the site

| Fact | Value now | How sure |
|---|---|---|
| Trading name | Hiltop Plumbing Supplies | From the owner. An older draft in this repository (May 2025) spelt it “Hilltop”. Confirm the spelling |
| Legal name | Hiltop Plumbing Supplies (Pty) Ltd | From the owner (“pty Ltd”) |
| Street | 3B Saligna Road, Merrivale | From the owner |
| Town | Howick, KwaZulu-Natal | Public listing for this address |
| Postal code | 3291 | Common Merrivale code. The road geocoder also shows 3290. Confirm |
| Phone | 066 254 3454 | Public listing for this shop. Owner has not confirmed it in chat |
| WhatsApp | Same number, `27662543454` | Assumed. WhatsApp must be on that SIM |
| Hours | Mon–Fri 07:30–16:30, Sat 08:00–13:00, Sun closed | **Placeholder.** Not given by the owner |
| Public holidays | Treated as Sunday (closed) | Placeholder, written on Find us and in the footer |
| Review line | “Exceptional service and quality products at affordable prices.” | A published customer note. No customer name |

Call links use `tel:+27662543454`. WhatsApp links use `https://wa.me/27662543454`.

Map pin is Saligna Road, Merrivale (about -29.5141, 30.2332), near Rangeview Road. It is the road, not a surveyed stand number. The page says so under the map. The street map is an OpenStreetMap embed. The buttons open Google Maps.

## Hours badge

“Open now”, “Opens later today”, “Closed for the day”, and “Closed today” follow South African time (UTC+2, no daylight saving). A second line says when the counter closes or next opens, for example “until 16:30” or “opens Mon 07:30”.

The badge reads the same `hours` list that is printed on the page. Change the hours once, in `src/data/shop.ts`, and both follow.

On a public holiday the badge says “Closed today” and names the day. It knows the fixed holidays, Good Friday, Family Day, and the Monday after a holiday that falls on a Sunday. It does **not** know one-off days the President declares, such as election days. On those days it shows the normal hours.

The badge is worked out in the visitor’s browser, so a cached page still shows the right state.

## Counter list

34 lines in 8 groups. Every price is a **guide in rand**, not the shelf price. Copper is called out as moving with the metal price.

Groups: Copper tube, Poly & HDPE, PVC & waste, Valves & brass, Taps & mixers, Hot water, Drainage, Tools & sundries.

Three lines are marked **Confirm before you drive** (not “Usually on the shelf”):

- HT-C28 — 28 mm copper tube, class 0, guide R 1 240
- HT-TH — shower mixer, guide R 610
- HT-G150 — 150 L electric geyser, guide R 3 650

Those three came from the earlier handover. **All other lines are stand-ins** written for the rebuild: names, specs, units and guide prices. Replace them with the real stock list and prices.

SKUs (`HT-C15` and the rest) are internal codes for this site. They are not the shop’s bin numbers unless the owner adopts them.

Six lines are flagged `common: true` and show on the home page.

Pictures for the banner and the eight groups are drawn illustrations made for the page. They are not photographs of the Merrivale yard.

## What a customer sends

WhatsApp and Copy build a plain-text slip:

```
Hiltop Plumbing Supplies (Pty) Ltd: quote request

Name: Thandi Mkhize
Phone: 082 555 0101
Site: Hilton, new bathroom

1. 15 mm copper tube, Class 0, SANS 460, half-hard
   2 × 5.5 m length, guide R 890
2. Shower mixer, Wall mounted, chrome
   Qty 3, guide R 1 830

Guide total: R 2 720

Please confirm stock and price before I collect.
```

Site and notes are left out when empty. Name and phone are required before send or copy. The phone needs at least nine digits. The slip needs at least one line, or a note, for a customer asking about a part that is not listed. The customer can open “See the message” to read the slip before sending. The shop must still confirm stock and price.

## Where to change things

| Change | File |
|---|---|
| Name, phone, WhatsApp, address, map, review, drop towns | `src/data/shop.ts` |
| Hours: printed on the page **and** the open/closed badge | `hours` in `src/data/shop.ts` (24-hour `"HH:MM"`, `null` for a closed day) |
| Public holiday rules | `src/lib/hours.ts` |
| Products, guide prices, “confirm” vs “shelf”, common lines | `src/data/catalog.ts` |
| Category names, blurbs and pictures | `categories` at the top of `src/data/catalog.ts` |
| Yard and product pictures | `public/media/` (`hero.jpg`, `copper.jpg`, `poly.jpg`, `pvc.jpg`, `valves.jpg`, `taps.jpg`, `geyser.jpg`, `drainage.jpg`, `tools.jpg`) |
| Share preview (link card) | `public/og.jpg` (1200 × 630) |
| Wide X banner | `public/x-banner.jpg` (1500 × 500) |
| Tab icon | `public/favicon.svg` |
| Share title | `src/lib/og/site.json` (`title`: Hiltop Plumbing Supplies, `card`: custom) |

Replacement pictures can be any size, but keep the same file names. Group pictures show at 4:3 and are cropped to fit.

After a change to prices, hours, or phone, publish again. A card or banner added after a publish does not replace the live link image until the next publish.

## What this site is not

- Not a till, invoice system, or stock system.
- Not a trade-account login.
- Not email. There is no inbox behind the form.
- Not a promise of delivery. The home page only says to ask about a drop through Howick, Hilton, and Pietermaritzburg.
- Not registered here as a plumbing contractor. It is written as a supplies counter.

## Still to confirm with the owner

1. Phone and whether WhatsApp is on that number.
2. Real counter hours, Saturday, and public holidays.
3. Postal code: 3291 or 3290.
4. Spelling: Hiltop or Hilltop.
5. Real prices, or remove prices and keep “phone the counter”.
6. Real stock list. Add, rename, or delete lines in `src/data/catalog.ts`.
7. A real yard photo and logo, if they have them.
8. Whether the customer review should stay.

## Stack, short

React site (TanStack Start, Tailwind CSS 4). No customer database and no server code.

```
npm install
npm run dev        # local preview at http://localhost:5173
npm test           # hours, holidays, slip text, catalog checks
npm run typecheck
npm run build      # writes the finished site to dist/client
```

The build pre-renders every page to plain HTML (`dist/client/index.html`, `dist/client/counter/index.html`, and so on). Publish the `dist/client` folder to any static host. A missing page shows the host’s own “not found” page.

Share tags are injected at publish time from `public/og.jpg`, `public/x-banner.jpg`, and `src/lib/og/site.json`. Do not put `og:` tags in `src/routes/__root.tsx`. If the site moves to a host that does not inject them, link previews will have no picture until `og:` tags are added. This is not a game, so `site.json` has no `"type": "x:game"`. The X banner file is there because it was asked for.

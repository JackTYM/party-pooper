# PartyPooper Ticket Configurator — Design

Date: 2026-08-23

## Purpose

PartyPooper is a Nuxt PWA that lets a user pick between two ticket app visual
styles — **Posh** and **Plots** — and configure four fields (image, price,
event title, ticket title) that render live into a pixel-matched recreation
of that style's reference screenshot.

Reference screenshots (as answered during brainstorming):

- **Image 1 = Plots**: a "My Tickets" list screen (date badge, thumbnail,
  event title) stacked above a ticket detail sheet (event title header,
  white notched ticket card with a ticket-title label and a plain QR code).
- **Image 2 = Posh**: an "Order #" screen — a white card with uppercase
  event title, mock date/time, a QR code with a small circular "(P)" badge
  centered on it, the order number, a dark "Breakdown" section (ticket
  title × 1, price, Total), and rows for View event / View order
  confirmation / Add to calendar / Add to Apple Wallet.

## Scope decisions (from brainstorming Q&A)

- **No backend, no accounts.** Config is pure client-side state, persisted
  to `localStorage` only. No database, no shareable links.
- **Full installable PWA** via `@vite-pwa/nuxt` — manifest + service worker,
  not just mobile-styled pages.
- **Field mapping is per-style, not universal:**
  - Plots: `ticketTitle` replaces "Open RSVP" as the label text on the
    ticket card. `price` is **not displayed** anywhere on the Plots screen.
    `image` is used as the list-row thumbnail.
  - Posh: `ticketTitle` is the Breakdown line-item label (in place of
    "RSVP"), `price` is the Breakdown line amount and Total. `image` is
    **not displayed** anywhere on the Posh screen (screenshot has none).
  - Posh and Plots hold **independent** config state — they are not the
    same ticket, just two different visual styles to preview.
- **Static/mock chrome that is not one of the 4 configurable fields**
  (back chevrons, "My Tickets"/"Order #" headers, mock date/time, mock
  order number, "x1" quantity, row icons/labels like "Add to calendar")
  is hardcoded to match the screenshots, not user-configurable.
- **Plots screen renders both stacked pieces** shown in the screenshot —
  the "My Tickets" list row AND the ticket detail sheet below it — not
  just the ticket card alone.
- **QR codes are real, client-generated** (via `qrcode.vue`), encoding a
  mock ticket URL, so they work fully offline with no network dependency.
  Posh overlays a small circular "(P)" badge on top; Plots does not.

## Architecture

Nuxt 4 app, Tailwind CSS v4 (official Nuxt module) for styling,
`@vite-pwa/nuxt` for installability. No SSR-specific data requirements —
everything is client state.

### Pages

- `pages/index.vue` — Home. "PartyPooper" heading, two large tappable
  cards, "Posh" and "Plots", linking to `/posh` and `/plots`.
- `pages/posh.vue` — `TicketConfigForm` + `PoshTicket` live preview.
- `pages/plots.vue` — `TicketConfigForm` + `PlotsTicket` live preview.

### Components

- `components/TicketConfigForm.vue` — shared form: image file picker
  (converted to a data URL), price (number input), event title, ticket
  title. Used by both `/posh` and `/plots`, bound to that page's config
  state.
- `components/PoshTicket.vue` — renders the Order # card per Image 2:
  mock order number header, uppercase event title + mock date/time,
  `TicketQr` with the "(P)" badge, order number below QR, dark Breakdown
  section (`{ticketTitle} × 1` — `{price}`, Total = `{price}`), then the
  View event / View order confirmation / Add to calendar / Add to Apple
  Wallet rows (static, non-functional — visual only).
- `components/PlotsTicket.vue` — renders per Image 1: "My Tickets" header
  with back chevron, list row (mock date badge, `image` as thumbnail,
  `eventTitle`), and below it the detail sheet (`eventTitle` header, white
  notched ticket card containing `ticketTitle` text and a plain `TicketQr`,
  no badge).
- `components/TicketQr.vue` — wraps `qrcode.vue`; props: `value` (string to
  encode), optional `logo` slot for the centered "(P)" badge.

### State

`composables/useTicketConfig.ts` exports `usePoshConfig()` and
`usePlotsConfig()`. Each returns a `useState`-backed reactive object:

```ts
{ imageDataUrl: string, price: number, eventTitle: string, ticketTitle: string }
```

Seeded with that screenshot's example values (so the first render matches
the reference image before any edits). A `watch` syncs each to
`localStorage` under `partypooper:posh` / `partypooper:plots`; on init, a
stored value (if present) overrides the seed default.

### PWA

`@vite-pwa/nuxt` in `nuxt.config.ts`:

- `registerType: 'autoUpdate'`
- Manifest: `name: "PartyPooper"`, `display: "standalone"`,
  `start_url: "/"`, black `background_color`/`theme_color`, icons at
  192×192 and 512×512 (simple placeholder "PP" monogram, generated from
  one source SVG via macOS `sips` — no extra image-processing dependency).

## Verification

This is a visual configurator with no business logic to unit test, so
verification is manual:

1. `npm run dev`, view `/posh` and `/plots` at an iPhone-width viewport,
   compare side-by-side against the two reference screenshots.
2. Edit each form field and confirm the preview (including the QR code)
   updates live.
3. Reload the page and confirm config values persisted via `localStorage`.
4. Chrome DevTools → Application tab: confirm a valid manifest and a
   registered service worker (installability).

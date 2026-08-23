# PartyPooper Ticket Configurator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Nuxt 4 PWA where a home page picks between "Posh" and "Plots" ticket styles, each with a form (image, price, event title, ticket title) that live-previews a pixel-matched recreation of the corresponding reference screenshot.

**Architecture:** Client-only Nuxt 4 app (`ssr: false` — there is no server data, everything is local config state, and this sidesteps any hydration mismatch between server-rendered defaults and `localStorage`-restored values). Tailwind CSS v4 (via `@tailwindcss/vite`) for styling, `@vite-pwa/nuxt` for the installable manifest + service worker, `qrcode.vue` for real client-rendered QR codes. Nuxt 4's default `app/` srcDir holds `pages/`, `components/`, `composables/`, and `app.vue`; `nuxt.config.ts` and `public/` stay at the repo root.

**Tech Stack:** Nuxt 4.5, Vue 3.5, Tailwind CSS v4 (`@tailwindcss/vite`), `@vite-pwa/nuxt` 1.1, `qrcode.vue` 3.10.

**User decisions (already made):**
- Image 1 = Plots, Image 2 = Posh.
- Pure client-side configurator — no backend, no accounts, no shareable links.
- Full installable PWA (manifest + service worker), not just mobile-styled pages.
- Plots: `ticketTitle` is the label text on the ticket card (replacing "Open RSVP"); `price` is not displayed anywhere on the Plots screen; `image` is the list-row thumbnail.
- Posh: `ticketTitle` is the Breakdown line-item label (replacing "RSVP"); `price` is the Breakdown line amount and Total; `image` is not displayed anywhere on the Posh screen.
- Posh and Plots hold independent config state (not the same ticket).
- Non-configurable chrome (headers, mock date/time, mock order number, "x1" quantity, action-row labels) is hardcoded to match the screenshots.
- Plots renders both the "My Tickets" list row and the ticket detail sheet stacked, as shown in the screenshot.
- QR codes are real and client-generated (offline-capable); Posh overlays a small "(P)" badge, Plots does not.
- Verification is manual (visual comparison against the screenshots + DevTools PWA checks) — there is no business logic here to unit test.

---

## File Structure

```
nuxt.config.ts                        # modify — Tailwind v4 + PWA module config, ssr: false
public/icon.svg                       # create — placeholder app icon (PWA manifest)
app/app.vue                           # modify — render <NuxtPage /> instead of <NuxtWelcome />
app/assets/css/main.css               # create — Tailwind v4 entry point
app/composables/useTicketConfig.ts    # create — usePoshConfig() / usePlotsConfig(), localStorage-backed
app/components/TicketQr.vue           # create — QR code wrapper with optional centered logo slot
app/components/TicketConfigForm.vue   # create — shared 4-field config form (v-model)
app/components/PoshTicket.vue         # create — Order # / Breakdown / Apple Wallet screen (Image 2)
app/components/PlotsTicket.vue        # create — My Tickets row + ticket detail sheet (Image 1)
app/pages/posh.vue                    # create — form + PoshTicket
app/pages/plots.vue                   # create — form + PlotsTicket
app/pages/index.vue                   # create — home page, Posh/Plots picker
```

---

### Task 1: Tailwind, PWA module, and app shell

**Goal:** Get Tailwind CSS v4 compiling, the PWA module producing a manifest + service worker, and the app shell rendering pages instead of the Nuxt welcome screen.

**Files:**
- Modify: `nuxt.config.ts`
- Create: `app/assets/css/main.css`
- Create: `public/icon.svg`
- Modify: `app/app.vue`

**Acceptance Criteria:**
- [ ] `npm run build` succeeds with no Tailwind/PWA config errors.
- [ ] `.output/public/manifest.webmanifest` (or equivalent PWA output) is generated and references `icon.svg`.
- [ ] `app/app.vue` renders `<NuxtPage />` so route pages display.

**Verify:** `npm run build` → ends with `✨ Build complete!`

**Steps:**

- [ ] **Step 1: Install dependencies**

```bash
npm install @vite-pwa/nuxt qrcode.vue
npm install -D @tailwindcss/vite tailwindcss
```

- [ ] **Step 2: Create the Tailwind entry point**

Create `app/assets/css/main.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 3: Create the placeholder app icon**

Create `public/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="96" fill="#000000" />
  <text x="256" y="312" font-family="Helvetica, Arial, sans-serif" font-size="180" font-weight="700" fill="#ffffff" text-anchor="middle">PP</text>
</svg>
```

- [ ] **Step 4: Configure Nuxt — Tailwind, PWA, ssr off**

Replace `nuxt.config.ts` with:

```ts
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'PartyPooper',
      short_name: 'PartyPooper',
      description: 'Preview Posh and Plots style event tickets',
      display: 'standalone',
      start_url: '/',
      background_color: '#000000',
      theme_color: '#000000',
      icons: [
        { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
      ],
    },
    devOptions: {
      enabled: true,
    },
  },
})
```

- [ ] **Step 5: Render pages instead of the welcome screen**

Replace `app/app.vue` with:

```vue
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
```

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: ends with `✨ Build complete!`, with a `manifest.webmanifest` (or `manifest.[hash].webmanifest`) and a service worker file listed among the generated `.output/public` assets.

- [ ] **Step 7: Commit**

```bash
git add nuxt.config.ts app/assets/css/main.css public/icon.svg app/app.vue package.json package-lock.json
git commit -m "feat: add Tailwind v4, PWA module, and client-only app shell"
```

---

### Task 2: Ticket config composable

**Goal:** Independent, `localStorage`-backed reactive config for Posh and Plots, seeded with each screenshot's example content.

**Files:**
- Create: `app/composables/useTicketConfig.ts`

**Acceptance Criteria:**
- [ ] `usePoshConfig()` and `usePlotsConfig()` each return a distinct reactive object seeded with the values below.
- [ ] Edits to one does not affect the other.
- [ ] Values persist across a page reload via `localStorage`.

**Verify:** `npm run build` → ends with `✨ Build complete!`

**Steps:**

- [ ] **Step 1: Write the composable**

Create `app/composables/useTicketConfig.ts`:

```ts
export interface TicketConfig {
  imageDataUrl: string
  price: number
  eventTitle: string
  ticketTitle: string
}

function usePersistedConfig(key: string, defaults: TicketConfig) {
  const config = useState<TicketConfig>(key, () => ({ ...defaults }))

  if (import.meta.client) {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        Object.assign(config.value, JSON.parse(stored))
      } catch {
        // ignore malformed stored config, keep defaults
      }
    }

    watch(config, (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    }, { deep: true })
  }

  return config
}

export function usePoshConfig() {
  return usePersistedConfig('partypooper:posh', {
    imageDataUrl: '',
    price: 0,
    eventTitle: 'WAVY WEDNESDAYS',
    ticketTitle: 'RSVP',
  })
}

export function usePlotsConfig() {
  return usePersistedConfig('partypooper:plots', {
    imageDataUrl: '',
    price: 0,
    eventTitle: 'Heaven or Los Angeles with Special Guest DJ Simon Raymonde of Cocteau Twins',
    ticketTitle: 'Open RSVP',
  })
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: ends with `✨ Build complete!` (composable is unused by any page yet, so this only checks it compiles).

- [ ] **Step 3: Commit**

```bash
git add app/composables/useTicketConfig.ts
git commit -m "feat: add persisted per-style ticket config composable"
```

---

### Task 3: TicketQr component

**Goal:** A reusable QR code renderer with an optional centered logo overlay (used by Posh's "(P)" badge, not by Plots).

**Files:**
- Create: `app/components/TicketQr.vue`

**Acceptance Criteria:**
- [ ] Renders a scannable QR code for a given `value` prop with no network request (client-side generation).
- [ ] An optional `#logo` slot renders centered on top of the QR code when provided; nothing overlays it when omitted.

**Verify:** `npm run build` → ends with `✨ Build complete!`

**Steps:**

- [ ] **Step 1: Write the component**

Create `app/components/TicketQr.vue`:

```vue
<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

const props = withDefaults(defineProps<{
  value: string
  size?: number
}>(), {
  size: 220,
})
</script>

<template>
  <div class="relative inline-block" :style="{ width: `${props.size}px`, height: `${props.size}px` }">
    <QrcodeVue :value="props.value" :size="props.size" level="M" render-as="svg" />
    <div v-if="$slots.logo" class="absolute inset-0 flex items-center justify-center">
      <slot name="logo" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: ends with `✨ Build complete!`

- [ ] **Step 3: Commit**

```bash
git add app/components/TicketQr.vue
git commit -m "feat: add TicketQr component with optional logo overlay"
```

---

### Task 4: TicketConfigForm component

**Goal:** One shared form (image upload, price, event title, ticket title) bound to whichever config object the page passes in.

**Files:**
- Create: `app/components/TicketConfigForm.vue`

**Acceptance Criteria:**
- [ ] Selecting an image file updates `imageDataUrl` to a base64 data URL.
- [ ] Editing price/event title/ticket title updates the bound config object live (no submit button — every input is live).

**Verify:** `npm run build` → ends with `✨ Build complete!`

**Steps:**

- [ ] **Step 1: Write the component**

Create `app/components/TicketConfigForm.vue`:

```vue
<script setup lang="ts">
import type { TicketConfig } from '~/composables/useTicketConfig'

const config = defineModel<TicketConfig>({ required: true })

function onImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    config.value.imageDataUrl = reader.result as string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="space-y-4 rounded-xl bg-neutral-900 p-4 text-white">
    <div>
      <label class="mb-1 block text-sm text-neutral-400" for="config-image">Image</label>
      <input id="config-image" type="file" accept="image/*" class="block w-full text-sm" @change="onImageChange" />
    </div>
    <div>
      <label class="mb-1 block text-sm text-neutral-400" for="config-price">Price</label>
      <input id="config-price" v-model.number="config.price" type="number" min="0" step="0.01" class="w-full rounded-md bg-neutral-800 px-3 py-2" />
    </div>
    <div>
      <label class="mb-1 block text-sm text-neutral-400" for="config-event-title">Event title</label>
      <input id="config-event-title" v-model="config.eventTitle" type="text" class="w-full rounded-md bg-neutral-800 px-3 py-2" />
    </div>
    <div>
      <label class="mb-1 block text-sm text-neutral-400" for="config-ticket-title">Ticket title</label>
      <input id="config-ticket-title" v-model="config.ticketTitle" type="text" class="w-full rounded-md bg-neutral-800 px-3 py-2" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: ends with `✨ Build complete!`

- [ ] **Step 3: Commit**

```bash
git add app/components/TicketConfigForm.vue
git commit -m "feat: add shared ticket config form"
```

---

### Task 5: Posh screen (Image 2)

**Goal:** The Order # / Breakdown / Apple Wallet screen, matching Image 2, wired to `usePoshConfig()`.

**Files:**
- Create: `app/components/PoshTicket.vue`
- Create: `app/pages/posh.vue`

**Acceptance Criteria:**
- [ ] Event title renders uppercase in the white card; ticket title and price appear in the Breakdown row; price also appears as the Total.
- [ ] QR code has the centered "(P)" badge.
- [ ] No image is rendered anywhere on this screen.
- [ ] `/posh` shows the config form above the live preview, and edits update the preview immediately.

**Verify:** `npm run build` → ends with `✨ Build complete!`; then `npm run dev` and visually compare `http://localhost:3000/posh` against Image 2 at an iPhone-width viewport (chrome bar text, card layout, Breakdown rows, action rows).

**Steps:**

- [ ] **Step 1: Write the Posh ticket component**

Create `app/components/PoshTicket.vue`:

```vue
<script setup lang="ts">
import { usePoshConfig } from '~/composables/useTicketConfig'

const config = usePoshConfig()
const price = computed(() => `$${config.value.price.toFixed(2)}`)
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div class="relative flex items-center justify-center px-4 py-4">
      <button class="absolute left-4 text-2xl" aria-label="Back">&lsaquo;</button>
      <h1 class="text-lg font-semibold">Order #33883562</h1>
    </div>

    <div class="mx-4 rounded-2xl bg-white p-6 text-center text-black">
      <h2 class="text-xl font-bold uppercase">{{ config.eventTitle }}</h2>
      <p class="mt-1 text-sm text-neutral-500">Aug 26th at 6PM</p>

      <div class="mt-6 flex justify-center">
        <TicketQr value="https://partypooper.app/t/posh-33883562" :size="220">
          <template #logo>
            <div class="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-black bg-white text-sm font-bold">
              (P)
            </div>
          </template>
        </TicketQr>
      </div>

      <p class="mt-4 text-sm font-medium">#33883562</p>
    </div>

    <div class="mx-4 mt-6 rounded-2xl bg-neutral-900 p-4">
      <h3 class="text-xl font-bold">Breakdown</h3>
      <div class="mt-3 flex items-center justify-between text-sm">
        <span>{{ config.ticketTitle }}</span>
        <span class="text-neutral-400">x1</span>
        <span>{{ price }}</span>
      </div>
      <div class="my-3 border-t border-neutral-700" />
      <div class="flex items-center justify-between font-bold">
        <span>Total</span>
        <span>{{ price }}</span>
      </div>
    </div>

    <div class="mx-4 mt-4 divide-y divide-neutral-800 rounded-2xl bg-neutral-900">
      <div class="flex items-center justify-between px-4 py-4">
        <span>View event</span>
        <span>&rsaquo;</span>
      </div>
      <div class="flex items-center justify-between px-4 py-4">
        <span>View order confirmation</span>
        <span>&rsaquo;</span>
      </div>
    </div>

    <div class="mx-4 mb-8 mt-4 divide-y divide-neutral-800 rounded-2xl bg-neutral-900">
      <div class="px-4 py-4">Add to calendar</div>
      <div class="px-4 py-4">Add to Apple Wallet</div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Write the Posh page**

Create `app/pages/posh.vue`:

```vue
<script setup lang="ts">
import { usePoshConfig } from '~/composables/useTicketConfig'

const config = usePoshConfig()
</script>

<template>
  <div class="bg-black">
    <div class="mx-auto max-w-md p-4">
      <TicketConfigForm v-model="config" />
    </div>
    <PoshTicket />
  </div>
</template>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: ends with `✨ Build complete!`

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000/posh` at an iPhone-width viewport, compare against Image 2: white order card, QR with "(P)" badge, Breakdown section, and the four action rows below it.

- [ ] **Step 5: Commit**

```bash
git add app/components/PoshTicket.vue app/pages/posh.vue
git commit -m "feat: add Posh ticket screen"
```

---

### Task 6: Plots screen (Image 1)

**Goal:** The My Tickets list row + ticket detail sheet, matching Image 1, wired to `usePlotsConfig()`.

**Files:**
- Create: `app/components/PlotsTicket.vue`
- Create: `app/pages/plots.vue`

**Acceptance Criteria:**
- [ ] The list row shows the configured image as its thumbnail and the event title as its label; no price is rendered anywhere on this screen.
- [ ] The ticket detail sheet below it shows the ticket title text and a plain QR code (no logo badge) inside a notched white card.
- [ ] `/plots` shows the config form above the live preview, and edits update the preview immediately.

**Verify:** `npm run build` → ends with `✨ Build complete!`; then `npm run dev` and visually compare `http://localhost:3000/plots` against Image 1 at an iPhone-width viewport (list row, detail header, notched ticket card).

**Steps:**

- [ ] **Step 1: Write the Plots ticket component**

Create `app/components/PlotsTicket.vue`:

```vue
<script setup lang="ts">
import { usePlotsConfig } from '~/composables/useTicketConfig'

const config = usePlotsConfig()
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div class="relative flex items-center justify-center px-4 py-4">
      <button class="absolute left-4 text-2xl" aria-label="Back">&lsaquo;</button>
      <h1 class="text-lg font-semibold text-neutral-300">My Tickets</h1>
    </div>

    <div class="flex items-center gap-3 px-4">
      <div class="flex w-14 flex-col overflow-hidden rounded-lg border border-blue-500 text-center text-xs">
        <div class="py-1 text-blue-400">Aug</div>
        <div class="bg-blue-600 py-1 font-semibold">23</div>
      </div>
      <img v-if="config.imageDataUrl" :src="config.imageDataUrl" alt="" class="h-14 w-14 rounded-md object-cover" />
      <div v-else class="h-14 w-14 rounded-md bg-neutral-800" />
      <p class="flex-1 text-sm text-neutral-400">{{ config.eventTitle }}</p>
    </div>

    <p class="mt-8 px-4 text-lg font-bold">{{ config.eventTitle }}</p>

    <div class="relative mx-4 mb-8 mt-4">
      <div class="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-black" />
      <div class="rounded-2xl bg-white p-8 text-center text-black">
        <p class="text-base font-semibold">{{ config.ticketTitle }}</p>
        <div class="mt-6 flex justify-center">
          <TicketQr value="https://partypooper.app/t/plots-demo" :size="220" />
        </div>
      </div>
      <div class="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-black" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Write the Plots page**

Create `app/pages/plots.vue`:

```vue
<script setup lang="ts">
import { usePlotsConfig } from '~/composables/useTicketConfig'

const config = usePlotsConfig()
</script>

<template>
  <div class="bg-black">
    <div class="mx-auto max-w-md p-4">
      <TicketConfigForm v-model="config" />
    </div>
    <PlotsTicket />
  </div>
</template>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: ends with `✨ Build complete!`

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000/plots` at an iPhone-width viewport, compare against Image 1: list row with date badge/thumbnail/title, and the notched ticket card with title + QR below it.

- [ ] **Step 5: Commit**

```bash
git add app/components/PlotsTicket.vue app/pages/plots.vue
git commit -m "feat: add Plots ticket screen"
```

---

### Task 7: Home page and end-to-end verification

**Goal:** Home page picker linking to `/posh` and `/plots`, plus a full pass confirming the PWA is installable and both screens work end-to-end.

**Files:**
- Create: `app/pages/index.vue`

**Acceptance Criteria:**
- [ ] `/` shows a "PartyPooper" heading with two large tappable options, "Posh" and "Plots", navigating to `/posh` and `/plots` respectively.
- [ ] Editing a field on `/posh`, reloading, and revisiting `/posh` shows the edited value (localStorage persistence).
- [ ] Editing a field on `/plots` does not change anything shown on `/posh`, and vice versa (independent config).
- [ ] Chrome DevTools → Application tab shows a valid manifest (name "PartyPooper", standalone display) and a registered, activated service worker.

**Verify:** `npm run build` → ends with `✨ Build complete!`; then the manual checks below.

**Steps:**

- [ ] **Step 1: Write the home page**

Create `app/pages/index.vue`:

```vue
<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-white">
    <h1 class="text-3xl font-bold">PartyPooper</h1>
    <div class="flex w-full max-w-xs flex-col gap-4">
      <NuxtLink to="/posh" class="rounded-2xl bg-neutral-900 px-6 py-8 text-center text-xl font-semibold">
        Posh
      </NuxtLink>
      <NuxtLink to="/plots" class="rounded-2xl bg-neutral-900 px-6 py-8 text-center text-xl font-semibold">
        Plots
      </NuxtLink>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: ends with `✨ Build complete!`

- [ ] **Step 3: End-to-end manual verification**

Run: `npm run dev`, then in a browser at an iPhone-width viewport:

1. Open `http://localhost:3000/`, confirm the Posh/Plots picker renders and both links navigate correctly.
2. On `/posh`, change the event title, ticket title, and price, and confirm the preview (including the Breakdown Total) updates live; upload an image and confirm it does **not** appear anywhere on the Posh screen.
3. Reload `/posh` and confirm the edited values are still there.
4. On `/plots`, change the event title, ticket title, and upload an image; confirm the list-row thumbnail updates and confirm price is **not** shown anywhere on the Plots screen.
5. Reload `/plots` and confirm the edited values are still there, and confirm they are independent from the `/posh` values set in step 2.
6. Open Chrome DevTools → Application → Manifest: confirm name "PartyPooper", `display: standalone`, and the icon loads. Application → Service Workers: confirm one is registered and activated.

- [ ] **Step 4: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat: add PartyPooper home page picker"
```

---

## Post-plan cleanup

Remove the placeholder Nuxt starter `README.md` content and replace it with a short project description once the app is verified end-to-end (not a separate task — fold into Task 7's commit if desired, otherwise leave as-is; not required for functionality).

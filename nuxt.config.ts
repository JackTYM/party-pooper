import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },
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

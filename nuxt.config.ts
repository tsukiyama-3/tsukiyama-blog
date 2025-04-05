import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxthub/core', '@nuxt/icon', '@nuxt/eslint'],
  components: [
    { path: '~/components/links', pathPrefix: false },
    '~/components',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-dark-high-contrast',
            dark: 'github-dark',
          },
        },
      },
    },
  },
  experimental: {
    viewTransition: true,
  },
  compatibilityDate: '2024-11-01',
  nitro: {
    preset: 'cloudflare_pages',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: false,
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})

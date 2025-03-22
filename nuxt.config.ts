import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/content', '@nuxt/icon'],
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
  compatibilityDate: '2024-11-01',
  nitro: {
    preset: 'cloudflare-pages',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})

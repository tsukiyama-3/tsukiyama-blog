import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/content'],
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  content: {
    build: {
      markdown: {
        // rehypePlugins: {
        //   'rehype-figure': {},
        // },
        highlight: {
          theme: {
            default: 'github-dark-high-contrast',
            dark: 'github-dark',
            // sepia: 'monokai',
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

import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxthub/core', '@nuxt/icon', '@nuxt/eslint'],
  components: [
    { path: '~/components/links', pathPrefix: false },
    '~/components',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
      title: 'tsukiyama.blog',
      meta: [
        {
          name: 'thumbnail',
          content: 'https://res.cloudinary.com/dyoyv8djx/image/upload/v1744039369/tsukiyama-blog/tsukiyama.blog_uaoqwg.png',
        },
        { name: 'twitter:card', content: 'summary' },
        { property: 'og:site_name', content: 'tsukiyama.blog' },
        { property: 'og:title', content: 'tsukiyama.blog' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://tsukiyama.blog/' },
        { property: 'og:image', content: 'https://res.cloudinary.com/dyoyv8djx/image/upload/v1744039369/tsukiyama-blog/tsukiyama.blog_uaoqwg.png' },
      ],
    },
  },
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

// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    'nuxt-schema-org',
  ],
  components: [
    { path: '~/components/links', pathPrefix: false },
    { path: '~/components/sample', pathPrefix: false },
    { path: '~/components/articles', pathPrefix: false },
    { path: '~/components/map', pathPrefix: false },
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
          content:
            'https://res.cloudinary.com/dyoyv8djx/image/upload/v1744039369/tsukiyama-blog/tsukiyama.blog_uaoqwg.png',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { property: 'og:site_name', content: 'tsukiyama.blog' },
        { property: 'og:title', content: 'tsukiyama.blog' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://tsukiyama.blog/' },
        {
          property: 'og:image',
          content:
            'https://res.cloudinary.com/dyoyv8djx/image/upload/v1744039369/tsukiyama-blog/tsukiyama.blog_uaoqwg.png',
        },
      ],
    },
  },
  css: ['~/assets/css/tailwind.css'],
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          preload: ['diff', 'json', 'ts', 'js', 'bash', 'md'],
          theme: {
            default: 'github-dark-high-contrast',
            dark: 'github-dark',
          },
        },
      },
    },
  },
  mdc: {
    components: {
      prose: false,
    },
  },
  runtimeConfig: {
    basicAuth: {
      username: 'admin',
      password: 'admin',
      allowedRoutes: [],
    },
    public: {
      googleMaps: {
        mapId: {
          raster: '4dd6c17f0750a29a89cda4c8',
          vector: '4dd6c17f0750a29aa8d88c90',
        },
      },
      scripts: {
        googleMaps: {
          apiKey: '',
        },
      },
    },
  },
  routeRules: {
    '/api/**': { prerender: false },
    '/': { isr: 60 },
    '/tech/**': { isr: 60 },
    '/tech': { redirect: '/' },
    '/basic-auth': { ssr: true, prerender: false },
  },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viewTransition: true,
    payloadExtraction: true,
  },
  compatibilityDate: '2024-11-01',
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
  vite: {
    build: {
      minify: 'esbuild',
      cssMinify: true,
    },
  },
  hooks: {
    'nitro:config'(nitroConfig) {
      if (nitroConfig.dev) return
      const techDir = join(process.cwd(), 'content', 'tech')
      try {
        const files = readdirSync(techDir, { withFileTypes: true })
        const routes = files
          .filter(f => f.isFile() && f.name.endsWith('.md'))
          .map(f => `/tech/${f.name.replace(/\.md$/, '')}`)
        nitroConfig.prerender!.routes!.push(...routes)
      }
      catch {
        // content/tech が無い場合はスキップ
      }
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  image: {
    cloudinary: {
      baseURL:
        'https://res.cloudinary.com/dyoyv8djx/image/upload/v1745236671/tsukiyama-blog',
    },
  },
})

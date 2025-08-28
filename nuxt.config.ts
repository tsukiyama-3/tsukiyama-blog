import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui-pro',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxthub/core',
    '@nuxt/scripts',
    '@nuxt/image',
    ...(import.meta.dev ? ['@nuxt/eslint', '@nuxt/test-utils/module'] : []),
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
    '/**': { prerender: true },
    '/basic-auth': { ssr: true },
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
    preset: 'cloudflare_pages',
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      ignore: [
        '/basic-auth',
        '/tech/google-maps-api',
        '/tech/geolocation-api',
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'esbuild',
      cssMinify: true,
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dyoyv8djx/image/upload/v1745236671/tsukiyama-blog',
    },
  },
  uiPro: {
    content: true,
    license: process.env.NUXT_UI_PRO_LICENSE,
    mdc: true,
  },
})

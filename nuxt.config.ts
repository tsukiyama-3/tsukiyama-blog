// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/content"],
  content: {
    database: {
      type: "d1",
      bindingName: "DB",
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: "github-dark-high-contrast",
            dark: "github-dark",
          },
        },
      },
    },
  },
  nitro: {
    preset: "cloudflare_pages",
  },
});

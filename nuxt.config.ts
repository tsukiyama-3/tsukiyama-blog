import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxthub/core", "@nuxt/icon"],
  css: ["~/assets/css/tailwind.css"],
  content: {
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
  components: [
    { path: "~/components/links", pathPrefix: false },
    "~/components",
  ],
  experimental: {
    viewTransition: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: false,
    },
  },
  nitro: {
    preset: "cloudflare_pages",
  },
});

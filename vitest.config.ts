import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    includeSource: ['**/*.{js,ts}'],
    environment: 'nuxt',
  },
})

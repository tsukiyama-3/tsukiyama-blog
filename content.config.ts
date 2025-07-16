import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    tech: defineCollection({
      type: 'page',
      source: 'tech/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        ogImage: z.string().optional(),
        published: z.boolean(),
        date: z.date(),
        tags: z.string().array().optional(),
        updatedAt: z.date().optional(),
      }),
    }),
    diary: defineCollection({
      type: 'page',
      source: 'journey/diary/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        ogImage: z.string(),
        date: z.date(),
        day: z.number(),
        // 位置情報
        position: z.object({
          // 開始位置
          start: z.object({
            lat: z.number(),
            lng: z.number(),
            label: z.string(),
            // 標高
            elevation: z.number().optional(),
          }),
          // 終了位置
          end: z.object({
            lat: z.number(),
            lng: z.number(),
            label: z.string(),
            // 標高
            elevation: z.number().optional(),
          }).optional(),
          // 中継地点（Google Maps API で使用する）
          via: z.array(z.object({
            lat: z.number(),
            lng: z.number(),
          })).optional(),
        }),
        // 移動距離
        distance: z.number(),
        // タイムゾーン
        timezone: z.string(),
        // 所持金
        cash: z.object({
          JPY: z.number().optional(),
          USD: z.number().optional(),
          // 通貨が増えたらここに追加していく
        }),
        // 所持金を各通貨に変換した合計
        equivalent: z.object({
          JPY: z.number(),
          USD: z.number(),
          EUR: z.number(),
        }),
        // 出費
        expenses: z.array(z.object({
          category: z.enum(['food', 'lodging', 'transport', 'sightseeing', 'other']),
          amount: z.number(),
          currency: z.string(),
          method: z.enum(['cash', 'card', 'received']),
          note: z.string().optional(),
        })),
        // 収入（所持金が増えるイベント）
        income: z.array(z.object({
          type: z.enum(['withdrawal', 'exchange', 'received']),
          amount: z.number(), // 両替「元」の金額
          currency: z.string(), // 両替「元」の通貨（例: jpy）
          toCurrency: z.string().optional(), // 両替「先」の通貨（例: USD）
          rate: z.number().optional(), // 両替レート（例: 1 JPY = 0.0065 USD）
          note: z.string().optional(),
        })),
        // 天気
        weather: z.array(z.enum(['sunny', 'cloudy', 'rainy', 'snow', 'lightning_rain'])),
        // 気温
        temperature: z.object({
          high: z.number(),
          low: z.number(),
        }),
      }),
    }),
    content: defineCollection(
      // adds the robots frontmatter key to the collection
      asSitemapCollection({
        type: 'page',
        source: '**/*.md',
      }),
    ),
  },
})

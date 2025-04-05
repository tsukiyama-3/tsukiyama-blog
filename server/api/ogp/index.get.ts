import type { H3Event } from 'h3'
import { getQuery, sendError } from 'h3'
import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'

export default defineEventHandler(async (event: H3Event) => {
  const { url } = getQuery(event)

  console.log(url, 'url')
  if (!url || typeof url !== 'string') {
    return sendError(
      event,
      createError({ statusCode: 400, message: 'Missing or invalid URL' }),
    )
  }

  try {
    const res = await fetch(url)
    const html = await res.text()
    const $: CheerioAPI = load(html)

    const ogTitle
      = $('meta[property="og:title"]').attr('content') || $('title').text()
    const ogImage = $('meta[property="og:image"]').attr('content') || ''
    const ogDescription
      = $('meta[property="og:description"]').attr('content') || ''

    return {
      title: ogTitle,
      image: ogImage,
      description: ogDescription,
    }
  }
  catch {
    return sendError(
      event,
      createError({ statusCode: 500, message: 'Failed to fetch or parse OGP' }),
    )
  }
})

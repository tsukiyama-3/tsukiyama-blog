const tagToLogoMap: Record<string, string> = {
  'JavaScript': 'logos:javascript',
  'TypeScript': 'logos:typescript-icon',
  'UnJs': 'logos:unjs',
  'Nuxt.js': 'logos:nuxt-icon',
  'Vue.js': 'logos:vue',
  'Cloudflare': 'logos:cloudflare-icon',
  'Tailwind CSS': 'logos:tailwindcss-icon',
  'GCP': 'logos:google-cloud-platform',
  'Google Maps': 'logos:google-maps',
  // 必要に応じてどんどん追加
}

export const useTag = () => {
  // タグからSVG Logosへ変換する
  // @see https://icones.js.org/collection/logos
  const convertSvgLogo = (tag: string): string => {
    return tagToLogoMap[tag] ?? ''
  }

  return { convertSvgLogo }
}

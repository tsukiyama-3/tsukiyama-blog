import type { DiaryCollectionItem } from '@nuxt/content'

const weatherIconMap: Record<string, string> = {
  sunny: 'fluent-emoji:sun',
  cloudy: 'fluent-emoji:cloud',
  rainy: 'fluent-emoji:cloud-with-rain',
  snow: 'fluent-emoji:cloud-with-snow',
  lightning_rain: 'fluent-emoji:cloud-with-lightning-and-rain',
  // 必要に応じてどんどん追加
}

const weatherTextMap: Record<string, string> = {
  sunny: '晴れ',
  cloudy: 'くもり',
  rainy: '雨',
  snow: '雪',
  lightning_rain: '雷雨',
  // 必要に応じてどんどん追加
}

export const useWeatherIcon = () => {
  // 天気からアイコンへ変換する
  // https://icones.js.org/collection/fluent-emoji
  const convertIcon = (weather: DiaryCollectionItem['weather'][0]) => {
    return weatherIconMap[weather]
  }

  const convertText = (weather: DiaryCollectionItem['weather'][0]) => {
    return weatherTextMap[weather]
  }

  return { convertIcon, convertText }
}

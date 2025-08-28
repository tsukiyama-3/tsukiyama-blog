export const useGeoLocation = () => {
  const position = ref<GeolocationPosition | null>(null)
  const getPosition = () => {
    // クライアントサイドでのみ実行
    if (!import.meta.client) return

    navigator.geolocation.getCurrentPosition((pos) => {
      position.value = pos
    })
  }
  return { position, getPosition }
}

export const useGeoLocation = () => {
  const position = ref<GeolocationPosition | null>(null)
  const getPosition = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      position.value = pos
    })
  }
  return { position, getPosition }
}

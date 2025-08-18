export const useProfile = async () => {
  const { data: profile } = await useAsyncData('profile', () => queryCollection('profile').first(), {
    default: () => null,
  })

  const displayName = computed(() => {
    if (profile.value === null) {
      return ''
    }

    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

    return [profile.value.givenName, profile.value.familyName]
      .filter(Boolean)
      .map(capitalize)
      .join(' ')
  })

  const displayBirthDate = computed(() => {
    if (profile.value === null) {
      return ''
    }

    const dateTime = new Date(profile.value.birthDate)

    const year = dateTime.getUTCFullYear()
    const month = String(dateTime.getUTCMonth() + 1).padStart(2, '0')
    const date = String(dateTime.getUTCDate()).padStart(2, '0')

    return `${year}.${month}.${date}`
  })

  const displayPrefecture = computed(() => {
    if (profile.value === null) {
      return ''
    }
    return `${profile.value.birthPlace.prefecture.charAt(0).toUpperCase()}${profile.value.birthPlace.prefecture.slice(1).toLowerCase()}`
  })

  return { profile, displayName, displayBirthDate, displayPrefecture }
}

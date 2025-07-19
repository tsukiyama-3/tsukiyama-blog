export const useProfile = async () => {
  const { data } = await useAsyncData('profile', () => {
    return queryCollection('profile').first()
  }, {
    default: () => null,
  })

  const age = computed(() => {
    if (!data.value) {
      return ''
    }
    const today = new Date()
    const birthday = new Date(data.value.birthday)
    const hasHadBirthdayThisYear = today.getMonth() > birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() >= data.value.birthday.getDate())

    if (!hasHadBirthdayThisYear) {
      return (today.getFullYear() - birthday.getFullYear()) - 1
    }

    return today.getFullYear() - birthday.getFullYear()
  })

  const origin = computed(() => {
    if (!data.value) {
      return ''
    }

    return `${data.value.origin}, ${data.value.nationality}`
  })

  console.log(data.value, 'data')
  return { profile: {
    ...data.value,
    origin,
    age,
  } }
}

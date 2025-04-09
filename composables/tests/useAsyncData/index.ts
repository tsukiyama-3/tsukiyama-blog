type User = {
  familyName: string
  firstName: string
}

export const useUser = async () => {
  const { data: user } = await useAsyncData<User>(async () => {
    return {
      firstName: 'kohei',
      familyName: 'tsukiyama',
    }
  })

  const toDisplayName = createDisplayNameFormatter(user.value)

  return { user, toDisplayName }
}

const createDisplayNameFormatter = (user: User | null) => {
  if (user === null) {
    throw new Error('User is Missing')
  }
  const firstName = user.firstName
  const familyName = user.familyName
  const fullName = [firstName, familyName].filter(Boolean).join(' ')

  const toDisplayName = () => {
    return fullName.toUpperCase()
  }

  return toDisplayName
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('useUser', () => {
    it('正常系 ユーザーデータが取得できる場合', () => {
      const mockUser = {
        firstName: 'test',
        familyName: 'user',
      }
      const toDisplayName = createDisplayNameFormatter(mockUser)
      expect(toDisplayName()).toBe('TEST USER')
    })
    it('異常系 ユーザーデータが取得できなかった場合', () => {
      expect(() => createDisplayNameFormatter(null)).toThrow('User is Missing')
    })
  })
}

---
title: Nuxt インポート関数をモックする mockNuxtImport 関数の紹介
description: useAsyncData や useFetch のような Nuxt インポート関数をモックするのに便利な mockNuxtImport の紹介と凝集度を低くしテスタビリティを高める方法を紹介します。
icon: /avatar_green_oab8qx.webp
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1744641614/tsukiyama-blog/mock-nuxt-import/mock-nuxt-import-thumbnail_zqckp3.png
published: true
date: 2025-04-15
tags: ["Nuxt.js", "Vue.js", "Nuxt Test Utils"]
---

## mockNuxtImport とは？

`mockNuxtImport` とは、Nuxt のインポート関数たちをモックする `@nuxt/test-utils` が提供するユーティリティ関数です。

::ExternalLinkCardWrapper{url="https://nuxt.com/docs/getting-started/testing#mocknuxtimport"}
::

`useAsyncData` や `useFetch` のようなインポート関数は Nuxt の内部で `#imports` から自動的にインポートされているので通常の `vi.mock()` ではうまくモックできません。<br>
そのため、これらの関数をテスト中に差し替えたい場合は、`@nuxt/test-utils` が提供する `mockNuxtImport` を使うと便利です。

## 実際に使ってみる

例えばこのような `composables` があるとします。<br>
（実際には `useAsyncDate` で ユーザー API を Fetch している）

```ts [user.ts]
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

  const toDisplayName = () => {
    if (user.value === null) {
      throw new Error('User is Missing')
    }
    const firstName = user.value.firstName
    const familyName = user.value.familyName
    const fullName = [firstName, familyName].filter(Boolean).join(' ')
    return fullName.toUpperCase()
  }

  return { user, toDisplayName }
}
```

テンプレートはこんな感じです。

```vue [index.vue]
<script setup lang="ts">
const user = await useUser()
</script>

<template>
  <div>
    <p>{{ user.toDisplayName() }}</p>
  </div>
</template>
```

ちゃんと大文字になり名と姓の間に半角スペースが入るか、`toDisplayName` のテストをしたいとします。

```ts [user.spec.ts]
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { it, expect, describe, vi } from 'vitest'
import { useUser } from '../useAsyncData'

// useAsyncData のモック関数を定義
const { useAsyncData } = vi.hoisted(() => {
  return {
    useAsyncData: vi.fn().mockImplementation(() => {
      return { data: {} }
    }),
  }
})

// Nuxt の useAsyncData を上で作成したモックに置き換える
mockNuxtImport('useAsyncData', () => {
  return useAsyncData
})

describe('useUser', () => {
  it('正常系 ユーザーデータが取得できる場合', async () => {
    const mockUser = ref({
      firstName: 'test',
      familyName: 'user',
    })
    // モックの戻り値を定義
    useAsyncData.mockResolvedValue({
      data: mockUser,
    })
    const { toDisplayName } = await useUser()
    expect(toDisplayName()).toBe('TEST USER')
  })
  it('異常系 ユーザーデータが取得できなかった場合', async () => {
    useAsyncData.mockResolvedValue({
      data: ref(null),
    })
    const { toDisplayName } = await useUser()
    expect(() => toDisplayName()).toThrow('User is Missing')
  })
})

```

`mockNuxtImport` を用いて `useAsyncData` をモックしテストできました。

## テスタビリティを高めるアプローチ

Nuxt のインポート関数をモックする方法を解説しましたが、すこし踏み込んで、<br>
そもそもインポート関数をモックしなくても**関数を切り出せばテストはもっとシンプルになります**。

テスタビリティを高めるために、先ほどのメソッドを高階関数として切り出してみます。

```ts [user.ts]
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

// 高階関数として切り出す
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

// テスト
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('useUser', () => {
    it('正常系 ユーザーデータが取得できる場合', () => {
      const mockUser = {
        firstName: 'test',
        familyName: 'user',
      }
      // 関数を切り出したので useAsyncData の影響を受けない
      const toDisplayName = createDisplayNameFormatter(mockUser)
      expect(toDisplayName()).toBe('TEST USER')
    })
    it('異常系 ユーザーデータが取得できなかった場合', () => {
      expect(() => createDisplayNameFormatter(null)).toThrow('User is Missing')
    })
  })
}

```

関数を切り出し**凝集度を低く**することにより `useAsyncData` の影響を受けないようになり、モックを作成せずテストが書けるようになりました。

## まとめ

- **Nuxt のインポート関数をモックするには `mockNuxtImport` を使う**
- **関数を切り出すと凝集度が低くなりテスタビリティが高まる**

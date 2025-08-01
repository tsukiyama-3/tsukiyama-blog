---
title: マークダウンサンプル
description: 本ブログのマークダウンサンプルです。
icon: https://res.cloudinary.com/dyoyv8djx/image/upload/v1742465747/tsukiyama_cqdytg.png
published: true
date: 2025-04-07
---

## Headers

```md
## H2

### h3

#### h4
```

## H2

### h3

#### h4

## Paragraph

```md
これはパラグラフです。
```

これはパラグラフです。

## Lists

```md
- 箇条書き
- 箇条書き
  - ネストも掘れるよ
  - ネストも掘れるよ
  - ネストも掘れるよ
- 箇条書き

1. 箇条書き
2. 箇条書き
   1. ネストも掘れるよ
   2. ネストも掘れるよ
   3. ネストも掘れるよ
3. 箇条書き
```

- 箇条書き
- 箇条書き
  - ネストも掘れるよ
  - ネストも掘れるよ
  - ネストも掘れるよ
- 箇条書き

1. 箇条書き
2. 箇条書き
   1. ネストも掘れるよ
   2. ネストも掘れるよ
   3. ネストも掘れるよ
3. 箇条書き

## Links

```md
[リンクです](https://tsukiyama.blog)
```

[リンクです](https://tsukiyama.blog)

## Blockquotes

```md
> 引用はこんな感じです。
```

> 引用はこんな感じです。

**協調協調**

## Tables

```md
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

## Inline Code

```md
`console.log("インラインコード")`

`error`{color="error"}

`nuxt.config.ts`{lang="ts-type"}
```

`console.log("インラインコード")`

`error`{color="error"}

`nuxt.config.ts`{lang="ts-type"}

## Code Blocks

````md
```js [file.js]{2}
export default () => {
  console.log("コードブロックはこんな感じです")
};
```
````

```js [file.js]{2}
export default () => {
  console.log("コードブロックはこんな感じです")
};
```

## Image

```
![サンプル画像](sample.jpg)
```

![サンプル画像](https://res.cloudinary.com/dyoyv8djx/image/upload/v1678911095/sample.jpg)

## MDX

```md
:div[MDX はこんな感じです]{class="font-bold text-blue-100 bg-linear-45 from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-xl"}
```

:div[MDX はこんな感じです]{class="font-bold text-blue-100 bg-linear-45 from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-xl"}

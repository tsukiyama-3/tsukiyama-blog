---
title: Webページの画像最適化について学びなおす
description: フロントエンドでできる画像最適化の基本から Nuxt での実装方法までまとめました。
icon: /avatar_orange_t1b2ky.webp
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1755351894/tsukiyama-blog/image-optimization/image-optimization_efkg8g.png
published: true
date: 2025-08-17
tags: ["HTML5", "Core Web Vitals", "Nuxt Image"]
---

## はじめに

あなたのWebサイトは **画像最適化** について意識できていますか？

僕自身、曖昧な知識でできた気になっていたので、フロントエンド側でできる画像最適化を体系的にまとめてみようと本記事を書き始めました。

::warning
本記事は **フロントエンド視点の最適化**に焦点を当てています。サーバー側の圧縮や CDN 配信戦略などは扱いません。
::

## 画像最適化しないと起こること

最適化について理解するために、まずは最適化されていない場合に起こり得る問題を挙げて恐怖を植え付けていきたいと思います。

### ページ表示スピードが遅くなる

**人生が有限である以上スピードは命**です。<br>
ユーザーは日々コンテンツの摂取に忙しいです、0.1秒でも表示が遅ければ他のコンテンツを探し始めます。一度離脱したユーザーを呼び戻すのは難しいので機嫌を損ねないようにしなければなりません。

### 検索エンジンも機嫌を損ねる

Google が Core Web vitals という指標を発表し、フロントエンドエンジニア界で一般的になり久しいですが、その指標の一つである **`LCP` (Largest Contentful Paint) の 約70% が画像が原因**となっています。<br>
Core Web vitals がSEOに影響を与えることは Google が公言していることから検索エンジンも機嫌を損ねます。<br>
検索エンジンが機嫌を損ねると検索順位が下がるのでユーザーがきてくれなくなります。

::ExternalLinkCardWrapper{url="https://developers.google.com/search/docs/appearance/core-web-vitals?hl=ja"}
::

### コストがかかる

最適化されていない画像はファイルサイズが大きくなりがちです。<br>
CDN やホスティング、トラフィックに応じた従量課金制のインフラを利用している場合、転送量に比例してコストが膨らみます。<br>
また、ユーザー側にも無駄なデータ通信を強いることになるので双方にとってメリットがありません。

---

また、現代の Web ページでは中央値でも15〜20枚、リッチなページでは数十枚以上 の画像が使われています。<br>
最適化しないことにより、これらの問題が複数枚の画像で発生し、雪だるま式に悪化していきます。

::ExternalLinkCardWrapper{url="https://almanac.httparchive.org/en/2021/media"}
::

ユーザーと検索エンジンに匙を投げられ、お金も尽き、誰にもみられないWebページを前に、ひとり画像の表示を待ちながら今際の際を迎えることになります。<br>
恐ろしいですね。

## 画像を”何”に対して最適化するのか？

**ユーザーが使うデバイス**に対してです。

- 画面の大きさ
- 解像度
- 通信環境
- 処理性能

などユーザーの閲覧環境は千差万別です。<br>
にもかかわらず、画像リソースをひとつしか用意していないのはユニバーサルでもアクセシブルでもサスティナブルでもないのです。

## “解像度”ごとに最適な画像を表示する

`DPR` (`Device Pixel Ratio`) という概念があり、詳しくは以下の記事を読んでください。

::ExternalLinkCardWrapper{url="https://developer.mozilla.org/ja/docs/Web/API/Window/devicePixelRatio"}
::

ピクセルには**物理ピクセル**と**CSSピクセル**の2つあります。<br>
`DPR` (`Device Pixel Ratio`) はCSSピクセルに対する物理ピクセルの比率です。

かつては`DPR = 1`のデバイスしかありませんでした。<br>
なので、物理ピクセルとCSSピクセルは等価でした。

時代は流れディスプレイの画素が上がっていきます。すると、`DPR = 1`（1 CSSピクセル = 1 物理ピクセル）の前提では対応しきれなくなりました。
（CSSピクセルと物理ピクセルが等価だと高解像度画面で小さく見えてしまう）

物理ピクセルとCSSピクセルのズレを表す仕組みとして`DPR`(`Device Pixel Ratio`)が導入されたのです。

- 物理ピクセル
  - ディスプレイが実際に持っている最小のドット（ディスプレイの画素）
  - デバイスごとに差がある
- CSS ピクセル
  - ブラウザ上の論理単位（物理ピクセルと必ずしも一致しない）
  - デバイスごとに何個の物理ピクセルに割り当てるかが変わる

---

CSSピクセルで 100px の幅の画像を表示させる場合、DPR = 2 (Retina相当)のデバイスでは 200 物理ピクセル を使って描画をしています。

::warning
100px の画像しか用意していないと、DPR = 2 のデバイスでは 200物理px 表示領域があるのに対して 100px の画像を引き延ばして使うので画像がぼやけてしまいます。<br>
逆もまた然りで、100 物理px の領域で 200px の画像ソースだと縮小表示されるため画質は保たれますが、余分に転送量とデコード負荷がかかります。
::

::div{class="text-center mx-auto flex flex-col items-center"}
  :img{src="https://res.cloudinary.com/dyoyv8djx/image/upload/v1754885264/tsukiyama-blog/image-optimization/tsukiyama-64x64_jczd1i.png" width="128" height="128" alt="`64x64` の画像を `128x128` (DPR = 2 ならさら)に引き伸ばされてぼやけている僕" style="width: 128px"}
  :p[`64x64` の画像を `128x128` (DPR = 2 ならさら)に引き伸ばされてぼやけている僕]{class="mt-0 opacity-60 text-sm"}
::

この、`DPR` ごとに画像を用意します。<br>
（どの画像を描画するかはブラウザが決定してくれます。）

| デバイス | 用意する画像 |
| ----------------- | ------------ |
| `DPR` が 2 のデバイス | 200 x 200 px |
| `DPR` が 3 のデバイス | 300 x 300 px |

```html
<img
  src="/img/avatar-100.png"
  srcset="
    /img/avatar-100.png 1x, // DPR = 1 で使われる画像ソース
    /img/avatar-200.png 2x, // DPR = 2 で使われる画像ソース
    /img/avatar-300.png 3x  // DPR = 3 で使われる画像ソース
  "
  width="100"
  height="100"
  alt="アバター"
>
```

::div{class="text-center flex flex-col items-center"}
  :img{src="https://res.cloudinary.com/dyoyv8djx/image/upload/v1754893394/tsukiyama-blog/image-optimization/tsukiyama-128x128_dxb19q.png" srcset="https://res.cloudinary.com/dyoyv8djx/image/upload/v1754893394/tsukiyama-blog/image-optimization/tsukiyama-128x128_dxb19q.png 1x, https://res.cloudinary.com/dyoyv8djx/image/upload/v1754893395/tsukiyama-blog/image-optimization/tsukiyama-256x256_omoir8.png 2x, https://res.cloudinary.com/dyoyv8djx/image/upload/v1754893398/tsukiyama-blog/image-optimization/tsukiyama-384x384_hgygfe.png 3x" width="128" height="128" alt="解像度ごとに最適な画像ソースが設定され、くっきりしている僕" style="width: 128px"}
  :p[解像度ごとに最適な画像ソースが設定され、くっきりしている僕]{class="mt-0 opacity-60 text-sm"}
::

### Q. どのDPRまで考慮すれば良いの？

A. `DPR = 1 ~ 3` を用意すれば十分です。

最新の iPhone 16 の `DPR = 3` です。<br>
現行のモバイル端末で `DPR = 2` 以下のものはありませんが、古いモニターではまだ `DPR = 1` のものも残っているので `1 ~ 3` の画像を配置するのが良さそう。<br>
（Android の一部ハイエンド端末には `DPR = 4` のものもあります。）

## "画面幅"ごとに最適な画像を表示する

DPR (`1x/2x/3x`) で画像を出し分ける方法は **CSS 上の表示幅が固定のとき**には向いています。<br>
一方、`width: 100%` のように表示幅が画面幅に応じて変わる画像には向いていません。<br>
この場合は `w`記述子 + `sizes` を使って最適化します。

この記事に画像を配置した時を例に解説していきます。

![OGP](https://res.cloudinary.com/dyoyv8djx/image/upload/v1744039369/tsukiyama-blog/tsukiyama.blog_uaoqwg.png)

本ブログの記事レイアウトはざっくり以下のようになっています。

```html
<main class="max-w-[1200px] p-4">
  <section class="grid gap-8 grid-cols-1 md:grid-cols-[1fr_300px]">
    <main class="w-full max-w-[836px]">
      <img> // 画像が表示される場所
    </main>
  </section>
</main>
```

ブレークポイントごとに画像サイズをまとめると

- **768px 未満**
  - `100vw(画面全体) - 2rem(左右の余白)`
- **768px 以上 1200px 未満**
  - `100vw(画面全体) - 300px(右カラム分) - 2rem(左右の余白)` または `836px(max-width)` の小さい方
- **1200px 以上**
  - `836px(max-width)` 固定

この情報を sizes 属性に持たせます。

```html
sizes="(min-width: 1200px) 836px,
       (min-width: 768px) min(836px, calc(100vw - 300px - 2rem)),
       calc(100vw - 2rem)"
```

また、サイズごとにバリエーションを持たせた画像を `srcset` に配置します。

```html
srcset="/img/480w.png 480w,
        /img/720w.png 720w,
        /img/960w.png 960w,
        /img/1280w.png 1280w,
        /img/1600w.png 1600w"
```

これらの情報をもとにブラウザは必要最小限の画像を1つだけダウンロードします。

### 例1) 画面幅 390px / DPR = 2

1. sizes = 768px 未満 = `calc(390px - 2rem(32px))` = `358px`
2. 必要ピクセル数 = `358(CSSピクセル) * 2(DPR) = 716px`
3. 候補から一番近い画像 = `/img/720w.png`

`/img/720w.png` の画像が選択されます。

### 例2) 画面幅 1200px / DPR = 2

1. sizes = 1200px 以上 = `836px`
2. 必要ピクセル数 = `836(CSSピクセル) * 2(DPR) = 1672px`
3. 候補から一番近い画像 = `/img/1600w.png`

`/img/1600w.png` の画像が選択されます。

### 例3) 画面幅 1024px / DPR = 1

1. sizes = 768px 以上 1200px 未満 = `min(836px, calc(1024px - 300px - 2rem(32px)))` = `692px`
2. 必要ピクセル数 = `692(CSSピクセル) × 1(DPR) = 692px`
3. 候補から一番近い画像 = `/img/720w.png`

`/img/720w.png` の画像が選択されます。

### コードとプレビュー

::tabs

:::tabs-item{label="Code" icon="i-lucide-code"}

```html
<img
  src="/img/960w.png"
  srcset="/img/480w.png 480w,
        /img/720w.png 720w,
        /img/960w.png 960w,
        /img/1280w.png 1280w,
        /img/1600w.png 1600w"
  sizes="(min-width: 1200px) 836px,
         (min-width: 768px) min(836px, calc(100vw - 300px - 2rem)),
         calc(100vw - 2rem)"
  width="720"
  height="405"
  alt=""
>
```

:::

:::tabs-item{label="Preview" icon="i-lucide-eye"}

`DevTools` の `Responsice` で 画面幅を変えて確認してください

:img{src="https://res.cloudinary.com/dyoyv8djx/image/upload/v1754897806/tsukiyama-blog/image-optimization/w960_blksmf.png"
    srcset="https://res.cloudinary.com/dyoyv8djx/image/upload/v1754897805/tsukiyama-blog/image-optimization/w480_t88n2r.png 480w,
          https://res.cloudinary.com/dyoyv8djx/image/upload/v1754897807/tsukiyama-blog/image-optimization/w720_vlgvo5.png 720w,
          https://res.cloudinary.com/dyoyv8djx/image/upload/v1754897806/tsukiyama-blog/image-optimization/w960_blksmf.png 960w,
          https://res.cloudinary.com/dyoyv8djx/image/upload/v1754897805/tsukiyama-blog/image-optimization/w1280_saydvq.png 1280w,
          https://res.cloudinary.com/dyoyv8djx/image/upload/v1754897805/tsukiyama-blog/image-optimization/w1600_ar2ubh.png 1600w"
    sizes="(min-width: 1200px) 836px,
         (min-width: 768px) min(836px, calc(100vw - 300px - 2rem)),
         calc(100vw - 2rem)"
    width="720"
    height="405"
    alt="参考画像"}

:::

::

## 次世代フォーマットの活用

詳しい説明は以下記事に譲ります。

::ExternalLinkCardWrapper{url="https://zenn.dev/xx_suzuki/articles/sharp-verification"}
::

::ExternalLinkCardWrapper{url="https://ics.media/entry/201001/"}
::

これらのフォーマットは一般的になりつつありますが、まだ対応していないブラウザも見受けられます。<br>
未対応ブラウザ用にフォールバック画像を設定するのが親切です。

```html
<picture>
  <!-- AVIF -->
  <source
    type="image/avif"
    srcset="/img/hero-480.avif 480w,
            /img/hero-720.avif 720w,
            /img/hero-960.avif 960w,
            /img/hero-1280.avif 1280w,
            /img/hero-1600.avif 1600w"
    sizes="(min-width: 768px) 720px, calc(100vw - 2rem)"
  >
  <!-- WebP -->
  <source
    type="image/webp"
    srcset="/img/hero-480.webp 480w,
            /img/hero-720.webp 720w,
            /img/hero-960.webp 960w,
            /img/hero-1280.webp 1280w,
            /img/hero-1600.webp 1600w"
    sizes="(min-width: 768px) 720px, calc(100vw - 2rem)"
  >
  <!-- フォールバック（PNG） -->
  <img
    src="/img/hero-960.png"
    srcset="/img/hero-480.png 480w,
            /img/hero-720.png 720w,
            /img/hero-960.png 960w,
            /img/hero-1280.png 1280w,
            /img/hero-1600.png 1600w"
    sizes="(min-width: 768px) 720px, calc(100vw - 2rem)"
    width="720"
    height="405"
    alt="ヒーロー画像"
  >
</picture>

```

ブラウザは `source` に指定された `type` を確認し、対応しているフォーマットであればそのソースに HTTP リクエストを送ります。<br>
対応していない場合はリクエストを送らないため、不要な通信を防げます。

::ExternalLinkCardWrapper{url="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture"}
::

## 読み込みタイミングの最適化

### `loading="lazy"` ＆ `decoding="async"`

初期描画する必要のない（ビューポート外の）画像は初期転送量を減らすために<br>
`loading="lazy" decoding="async"`が有効です。

```html
<img
  src="/img/hoge.png"
  alt="初期描画されない画像"
  loading="lazy"
  decoding="async"
>
```

これにより、デコードと描画タイミングをスクロール直前まで後ろ倒しにできます。

::ExternalLinkCardWrapper{url="https://developer.mozilla.org/ja/docs/Web/Performance/Guides/Lazy_loading"}
::

::ExternalLinkCardWrapper{url="https://developer.mozilla.org/ja/docs/Web/API/HTMLImageElement/decoding"}
::

### LCP画像を優先的に先読み

初期表示で一番大きく表示する画像(LCP候補)は、ネットワーク優先度を上げると描画が速くなります。

- `fetchpriority="high"`

ブラウザに画像取得をどのように優先させるべきかヒントを表します。

`high` を渡すと他の画像と比較して高い優先度で画像を取得します。

::ExternalLinkCardWrapper{url="https://developer.mozilla.org/ja/docs/Web/API/HTMLImageElement/fetchPriority"}
::

- `preload`

ブラウザのレンダリング前に読み込みを始めることができます。<br>
これにより、そのリソースが早く利用でき、レンダリングブロックされるのを防げます。

（`rel="preload"`も`<source>`同様にMIMEタイプを含めることができます。）

::ExternalLinkCardWrapper{url="https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Attributes/rel/preload"}
::

```html
<head>
  <!-- AVIF -->
  <link
    rel="preload"
    as="image"
    href="/img/hero-1920w.avif"
    imagesrcset="/img/hero-720w.avif 720w,
                 /img/hero-1280w.avif 1280w,
                 /img/hero-1920w.avif 1920w"
    imagesizes="100vw"
    type="image/avif"
    fetchpriority="high"
  />
  <!-- WebP -->
  <link
    rel="preload"
    as="image"
    href="/img/hero-1920w.webp"
    imagesrcset="/img/hero-720w.webp 720w,
                 /img/hero-1280w.webp 1280w,
                 /img/hero-1920w.webp 1920w"
    imagesizes="100vw"
    type="image/webp"
    fetchpriority="high"
  />
  <!-- PNG（フォールバック） -->
  <link
    rel="preload"
    as="image"
    href="/img/hero-1920w.png"
    imagesrcset="/img/hero-720w.png 720w,
                 /img/hero-1280w.png 1280w,
                 /img/hero-1920w.png 1920w"
    imagesizes="100vw"
    type="image/png"
    fetchpriority="high"
  />
</head>

<body>
  <picture>
    <!-- AVIF -->
    <source
      type="image/avif"
      srcset="/img/hero-720w.avif 720w,
              /img/hero-1280w.avif 1280w,
              /img/hero-1920w.avif 1920w"
      sizes="100vw"
    />
    <!-- WebP -->
    <source
      type="image/webp"
      srcset="/img/hero-720w.webp 720w,
              /img/hero-1280w.webp 1280w,
              /img/hero-1920w.webp 1920w"
      sizes="100vw"
    />
    <!-- PNG（フォールバック） -->
    <img
      src="/img/hero-1920w.png"
      srcset="/img/hero-720w.png 720w,
              /img/hero-1280w.png 1280w,
              /img/hero-1920w.png 1920w"
      sizes="100vw"
      width="1920"
      height="1080"
      alt="メインビジュアル"
      fetchpriority="high"
    />
  </picture>
</body>

```

## Nuxt ではどうする？

Nuxt には画像最適化モジュールとして `@nuxt/image` があります。

::ExternalLinkCardWrapper{url="https://image.nuxt.com/"}
::

画像最適化モジュールがどんなことをしてくれるかわかりやすいようにコードで比較してみます。

### HTML と Nuxt Image を比較する

- HTML

```html
<img
  src="/img/960w.png"
  srcset="/img/480w.png 480w,
        /img/720w.png 720w,
        /img/960w.png 960w,
        /img/1280w.png 1280w,
        /img/1600w.png 1600w"
  sizes="(min-width: 1200px) 836px,
         (min-width: 768px) min(836px, calc(100vw - 300px - 2rem)),
         calc(100vw - 2rem)"
  width="720"
  height="405"
  alt=""
>
```

- Nuxt Image

```vue
<NuxtImg
  src="/img/1600w.png"
  sizes="(min-width: 1200px) 836px,
         (min-width: 768px) min(836px, calc(100vw - 300px - 2rem)),
         calc(100vw - 2rem)"
  width="720"
  height="405"
  alt=""
/>
```

高解像度の原本を渡して `sizes` を指定すると Nuxt Image が `srcset` を生成してくれます。<br>
これにより、複数サイズの画像を手動で作成・配置する必要がなくなり記述もスッキリします。


### `<NuxtPicture>` を使って複数フォーマット配信

::ExternalLinkCardWrapper{url="https://image.nuxt.com/usage/nuxt-picture"}
::

また、`<NuxtPicture>` を使用すれば複数フォーマットの配信とフォールバックの指定もできます。

```vue
<NuxtPicture
  provider="cloudinary"
  :src="_src" // Cloudinaryに置いてある画像パス
  format="avif,webp"
/>
```

生成されるDOM<br>
（画像パスは抽象化しています）

```html
<picture>
  // avif
  <source type="image/avif" sizes="(max-width: 640px) 320px, (max-width: 768px) 640px, (max-width: 1024px) 768px, (max-width: 1280px) 1024px, (max-width: 1536px) 1280px, 1536px" srcset="/img/320w.png 320w, /img/640w.png 640w, /img/768w.png 768w, /img/1024w.png 1024w, /img/1280w.png 1280w, /img/1536w.png 1536w, /img/2048w.png 2048w, /img/2560w.png 2560w, /img/3072w.png 3072w">
  // webp
  <source type="image/webp" sizes="(max-width: 640px) 320px, (max-width: 768px) 640px, (max-width: 1024px) 768px, (max-width: 1280px) 1024px, (max-width: 1536px) 1280px, 1536px" ssrcset="/img/320w.png 320w, /img/640w.png 640w, /img/768w.png 768w, /img/1024w.png 1024w, /img/1280w.png 1280w, /img/1536w.png 1536w, /img/2048w.png 2048w, /img/2560w.png 2560w, /img/3072w.png 3072w">
  // img (fallback)
  <img data-nuxt-pic="" src="https://res.cloudinary.com/dyoyv8djx/image/upload/f_png,q_auto,w_3072/v1745236671/tsukiyama-blog/image-optimization/w1600_ar2ubh.png" sizes="(max-width: 640px) 320px, (max-width: 768px) 640px, (max-width: 1024px) 768px, (max-width: 1280px) 1024px, (max-width: 1536px) 1280px, 1536px" srcset="/img/320w.png 320w, /img/640w.png 640w, /img/768w.png 768w, /img/1024w.png 1024w, /img/1280w.png 1280w, /img/1536w.png 1536w, /img/2048w.png 2048w, /img/2560w.png 2560w, /img/3072w.png 3072w">
</picture>
```

`Nuxt Image` を使うと特に気にせずに一つの画像ソースから複数のサイズ、フォーマットで配信できるのでとても便利です。

## まとめ

- 最適化の対象は**ユーザーのデバイス**
- 固定幅の画像は **DPR ごとに画像サイズを変える**
- 可変幅の画像は **`w` + `sizes` を活用し、画像サイズを変える**
- **次世代フォーマット**を使いつつ、フォールバックで互換性を確保する
- LCP 画像は **`fetchpriority="high"`,`preload` で読み込みタイミングを制御**
- 重要ではない画像は **`loading="lazy"`**
- Nuxt なら `@nuxt/image` に任せると自動で `srcset` ,フォーマット変換してくれて便利

今回はフロントエンド側でできることを整理しました。
サーバー側での最適化や CDN 配信戦略など、よりインフラ寄りの話はまた別の機会に書いてみたいと思います。

## 参考文献

::ExternalLinkCardWrapper{url="https://developer.mozilla.org/ja/docs/Web/HTML/Guides/Responsive_images"}
::

::ExternalLinkCardWrapper{url="https://stackoverflow.blog/2022/12/27/picture-perfect-images-with-the-modern-element/"}
::

::ExternalLinkCardWrapper{url="https://web.dev/articles/fetch-priority?hl=ja"}
::

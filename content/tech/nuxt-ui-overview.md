---
title: Nuxt UI が無料になったから全力で勧める記事
description: Nuxt UI v4 がリリースされ...
icon: /avatar_green_oab8qx.webp
ogImage: https://res.cloudinary.com/dyoyv8djx/image/upload/v1753114202/tsukiyama-blog/google-maps-api/google-maps-api_camiip.png
published: true
date: 2025-10-06
tags: ["Nuxt.js", "Tailwind CSS", "Nuxt UI"]
---

*バタバタしていて公開が遅れました*

## はじめに

2025年7月8日に Vercel と NuxtLabs からこんな発表がありました。

https://vercel.com/blog/nuxtlabs-joins-vercel

https://nuxtlabs.com/

公開されてすぐ、軽く目を通して 「*Vercel との連携が楽になるのかな〜*」くらいに思って読んでいたら最後の章にこんなことが書いてありました。

> Over the next few months Nuxt Studio MDC, Nuxt UI Pro, and NuxtHub Admin will all become free and open source.

！？

この発表の2日前、7月6日に Nuxt UI Pro のライセンスを購入したばかりだったのでかなり驚きましたが、「まあ `Over the next few months` と言っても1年くらいかかるんだろうな、Nuxt 3 の正式リリースも結構時間かかってたし、、」と、こころを落ち着けていると Issue でリリースのアナウンスがありました。

https://github.com/nuxt/ui/issues/4488

> In September, we'll release Nuxt UI v4: a free, open-source library that unifies Nuxt UI and Nuxt UI Pro

9月！？ 2ヶ月後！？

記事でも書いて元をとらなければ、、

と思い、この記事が誕生しました。（本当は v4 のリリース前に公開したかった）

## これまでの Nuxt UI について

Nuxt UI が 無料になった書いていますが、Nuxt UI は元から無料で使えていました。

何が有料だったと言うと、Nuxt UI Pro と言う有料版のパッケージ

## 他の UI フレームワークで感じていた使いづらさ

あまり他の技術を下げて、ある技術を讃えるのは好きではないですが、（*自分がその技術について知らないだけかもしれないからね*）僕が従来の UI フレームワークに対して感じていたツラさについてです。

::warning
Tailwind CSS を使い始めて（3~4年前）から UI フレームワークを進んで使っていないので、今は改善しているかもしれません。
::

### 保守・拡張のしづらさ

良いCSSの定義として Google のエンジニアの Philip Walton さんがブログであげているのがこの4つです。

- **予測しやすい**
- **再利用しやすい**
- **保守しやすい**
- **拡張しやすい**

https://philipwalton.com/articles/css-architecture/

このうち、従来の UI フレームは `予測しやすい`、`再利用しやすい` に関して解決するものが多い印象でした。<br>
残りの `保守しやすい`、`拡張しやすい` についても努力しているのは伺えましたが、痒いところに手が届かなかったりで「だったら自分で実装するよ！」みたいな経験を何度もしました。

無邪気に `!important` を使って 詳細度バトルを仕掛けてきたり、

### UI フレームワーク臭が漂う

保守・拡張がしづらいことにつながりますが、UI フレームワークをそのまま使うと特有の臭いを放ちます。

なんとかスタイルを変えてみたとしても、ボタン押下時のアニメーションから漂う微かな臭い

ユーザーの体験を損なうことはないけれど、フロントエンドエンジニアとしては気になります。

### 剥がすのが大変（そう）

僕自身、UI フレームワークを剥がす経験はないのですが、実装途中にふと、「これ剥がすの大変だろうな」と思う時がありました。

デザインを無理やり変えて何をしているのかわからない CSS ファイルや、消して良いのかわからないクラスなど、、
考えるだけでゾッとするような

*`クリーンアーキテクチャ 達人に学ぶソフトウェアの構造と設計`* では「フレームワークと結婚するな！」と素晴らしいメタファーで表現していましたが、UI フレームワークたちも例外ではなく、すぐに結婚を迫ってきます。

---

あらかじめスタイリングされているので、実装期間が限られているプロジェクトや CSS が苦手なエンジニアが多い開発組織では選択肢として

## Nuxt UI のここがすごい！

そんなこんなでしばらく Tailwind CSS を使ってきた僕が「Nuxt UI 良いじゃん」と感じたところを挙げていきたいと思います。

https://ui.nuxt.com/

### Tailwind ベースのスタイリング

Nuxt UI は、Tailwind CSS ベースで実装されています。

そのため、スタイルの上書き・拡張がしやすい（CSS 詳細度について考えなくて良い）です。

ドキュメントにもこのような記述があります。

> Tailwind Variants uses tailwind-merge under the hood to merge classes so you don't have to worry about conflicting classes.
>
> Tailwind Variantsは内部でtailwind-mergeを使用しクラスをマージするため、クラス名の衝突を心配する必要がありません。

内部でデフォルトのスタイルにユーザが定義したスタイルをマージしてくれているようです。

https://ui.nuxt.com/docs/getting-started/theme/components

使ってみるとわかるのですが、結構大胆にスタイルを変えられ UI フレームワークを使っている感覚がないです。

### DOM を変更できる

### Nuxt チームが作っている

### MCP が公開されている

https://ui4.nuxt.com/docs/getting-started/ai/mcp

## まとめ

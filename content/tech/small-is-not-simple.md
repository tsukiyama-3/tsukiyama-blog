---
title: 小さいこととシンプルは違う
description: "シンプルとは、小さいことではなく、分けて考えられること。"
icon: /avatar_gray_xlafck.webp
tags: ["ソフトウェア設計", "リファクタリング"]
published: true
date: 2026-10-26
publishedAt: 2026-10-26 08:00
---

O'Reilly の『シンプリシティ』を読みました。

::ExternalLinkCardWrapper{url="https://www.oreilly.co.jp/books/9784814401710/"}
::

この本は、仕事論・組織論・人生論など、概念的なプラクティスを中心に扱っています。

これはこれで勉強になるのですが、ソフトウェア設計について書かれていることを期待していた身としては、そこにあまりページが割かれていなかったのは物足りなく感じました。（この本でもたびたび唱えているように、何がシンプルかは文脈によって異なるため、あえて扱っていないのだと思います。）<br >
そこで本記事では、ソフトウェア設計を、**シンプルさとコードの小ささという観点**で深掘りしてみようと思います。

## TL;DR（最初に結論）

- シンプルとは、小さいことではなく、分けて考えられること
- 小さくても、複数の責務が絡み合ったコードはシンプルではない
- シンプルさのものさしは、同時に考えなければならないことの数
- コードは改修を重ねるうちに絡み合っていく。だから、改修のたびに境界を意識し続ける
- AI時代でも、品質に責任を持つのは人間。信頼できるコードのために、シンプルさは今も欠かせない

## 「シンプル＝小さい」という誤解

*「ここのコード、もう少しシンプルにできない？」*

コードレビューで、このように言われたり、言ったりしたことはありませんか？（あるいは、AIにこのような指示を出したり）
シンプルとは便利な言葉で、具体的に何が悪いのかを言わなくても「今のままでは良くない」ことだけは伝えられます。

**シンプル**とは何なのでしょうか？

こういう語義を考えるときは、その対義語から考えると意味をつかみやすいです。
simple の対義語は complex です。complex は語源をたどると「編み合わされた」という意味です。つまり、絡み合っていない状態がシンプルであると言えます。

ところが、シンプルはよく「小さいこと」と混同されます。コードが短い、ロジックが少ない、1つのファイルにまとまっている。こうした小ささは見通しの良さには繋がりますが、それだけで設計がシンプルとまでは言えません。小さいコードの中にも、複数の責務が絡み合っていることは往々にしてあります。

では、**ソフトウェア設計におけるシンプル**とは何なのでしょうか？

**シンプルとは、分けて考えられること** であると本記事では定義します。<br>
分けて考えられることは、対象を理解・変更・検証するときに強力です。

## コードで見る、小ささとシンプルさ

分けて考えられると何が嬉しいのか、CSVファイルからユーザーを取り込む処理を例に、具体的に見ていきます。

各行を検証し、エラーがあれば保存せずに行番号と理由を返し、問題がなければユーザーを保存して取り込み件数を返す、という関数です。

### 小さくても複雑な設計

読み込み・検証・保存を、1つの関数にまとめます。

```ts
/**
 * CSVファイルからユーザーを取り込む。
 * 1行でもエラーがあれば、何も保存せずにエラーの一覧を返す。
 */
const importUsers = async (file: File): Promise<ImportResult> => {
  const lines = (await file.text()).split("\n").slice(1)
  const seen = new Set<string>()
  const errors: ImportError[] = []
  const users: NewUser[] = []

  for (const [i, line] of lines.entries()) {
    const [name, email] = line.split(",")
    const row = i + 2

    if (!name || !email) errors.push({ row, reason: "必須項目がありません" })
    else if (!EMAIL_RE.test(email)) errors.push({ row, reason: "形式が不正です" })
    else if (seen.has(email)) errors.push({ row, reason: "CSV内で重複しています" })
    else if (await db.user.exists({ email })) errors.push({ row, reason: "登録済みです" })
    else users.push({ name, email })

    seen.add(email)
  }

  if (errors.length > 0) return { ok: false, errors }

  await db.transaction((tx) => tx.user.createMany(users))
  return { ok: true, importedCount: users.length }
}
```

コードは20行ほどで、処理の流れも追えます。しかし、このコードを正しく読むには、次のことを同時に考える必要があります。

- `row = i + 2` の `2` が何を足しているのか、離れた `.slice(1)` まで読まないと分からない
- `seen.add(email)` がループの最後にあるため、形式が不正なメールアドレスや `undefined` も「出現済み」になる。これが意図どおりかは、ループ全体を読まないと判断できない
- 検証の途中でDBに問い合わせている。行ごとにクエリが走り、検証ルールをテストするだけでもDBが必要になる
- `else if` が連なっているため、1行につき最初のエラーしか返らない。これが意図どおりかは、コードから読み取れない
- `errors` と `users` を同じループで積み上げているため、片方の条件を変えるともう片方にも影響する

検証ルールを1つ確認したいだけでも、CSVの形式、ループ内の状態、DBへの問い合わせまで頭に置かなければなりません。

### 大きくてもシンプルな設計

読み込み・検証・保存を、それぞれ別の関数に分けます。

```ts
/**
 * CSVファイルからユーザーを取り込む。
 * 1行でもエラーがあれば、何も保存せずにエラーの一覧を返す。
 */
const importUsers = async (file: File): Promise<ImportResult> => {
  const rows = await readUserCsv(file)
  const registeredEmails = await findRegisteredEmails(rows)
  const validation = validateUsers(rows, registeredEmails)

  if (!validation.ok) {
    return { ok: false, errors: validation.errors }
  }

  await saveUsers(validation.users)

  return { ok: true, importedCount: validation.users.length }
}

/**
 * CSVファイルを読み込み、行番号付きのデータに変換する。
 * 行番号はヘッダーを1行目として数える。
 */
const readUserCsv = async (file: File): Promise<CsvRow[]> => {
  const [, ...lines] = (await file.text()).split("\n")

  return lines.map((line, i) => {
    const [name, email] = line.split(",")
    return { row: i + 2, name, email }
  })
}

/**
 * CSVに含まれるメールアドレスのうち、登録済みのものを返す。
 */
const findRegisteredEmails = async (rows: CsvRow[]): Promise<Set<string>> => {
  const emails = rows.map(({ email }) => email).filter(Boolean)
  const users = await db.user.findMany({ email: { in: emails } })

  return new Set(users.map(({ email }) => email))
}

/**
 * 各行を検証し、エラーがなければ保存するユーザーデータを返す。
 * 1行につき、最初に見つかったエラーのみを返す。
 */
const validateUsers = (
  rows: CsvRow[],
  registeredEmails: Set<string>,
): ValidationResult => {
  const errors: ImportError[] = []
  const seen = new Set<string>()

  for (const { row, name, email } of rows) {
    if (!name || !email) {
      errors.push({ row, reason: "必須項目がありません" })
      continue
    }
    if (!EMAIL_RE.test(email)) {
      errors.push({ row, reason: "形式が不正です" })
      continue
    }
    if (seen.has(email)) {
      errors.push({ row, reason: "CSV内で重複しています" })
      continue
    }
    seen.add(email)

    if (registeredEmails.has(email)) {
      errors.push({ row, reason: "登録済みです" })
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return { ok: true, users: rows.map(({ name, email }) => ({ name, email })) }
}

/**
 * トランザクション内でユーザーをまとめて保存する。
 */
const saveUsers = async (users: NewUser[]): Promise<void> => {
  await db.transaction((tx) => tx.user.createMany(users))
}
```

コードの量は増えました。分割前に挙げたわかりにくさが、それぞれどう変わったかを見ていきましょう。

- 行番号の計算は、`readUserCsv` の中だけで完結する
- 形式チェックを通過したメールアドレスだけを重複チェックの対象にしている、と `validateUsers` を読めば分かる
- DBへの問い合わせは `findRegisteredEmails` で1回だけ行う。`validateUsers` はDBに触れないので、配列と `Set` を渡すだけで検証ルールをテストできる
- ループの中で積み上げるのは `errors` だけになった。ユーザーデータを作らなくなったので、`continue` が「1行につき最初のエラーのみを返す」という意図として読める

共通して言えることは、それぞれを確かめるために読む場所が1か所に絞られたということです。

## シンプルさは「同時に考えることの数」で捉える

2つの `importUsers` は振る舞いこそ同じですが、読むときに一度に考えなければならないことの量は違います。

分割前の `importUsers` は20行ほどの小さな関数でしたが、読み込み・検証・DBへの問い合わせ・保存という別々の責務が混ざっていました。異なる関心事が絡み合った関数は、どんなに小さくてもシンプルとは言えません。

分割後の `importUsers` を読むと、「読み込む → 登録済みを調べる → 検証する → 保存する」という流れだけが分かり、それぞれの中身は一段下の関数に任されています。ユーザーを登録したいだけの人は `importUsers` だけを読めばよく、検証のルールの詳細について関心のある人は `validateUsers` だけを読めば済みます。どちらも、関心のない段階のことは考えなくて済みます。

シンプルさを測るものさしは、コードの大きさではなく、同時に考えなければならないことの数です。

## 「まとめる・削る」ではなく、「分ける・名前を付ける・境界を作る」

大抵のコードは、最初から複雑なわけではありません。目まぐるしく変化する業務要件に、手っ取り早く応えようとして既存のコードに足し続けた結果、やがて複雑さが生まれます。分割前の `importUsers` も、最初は読み込みと保存だけの関数だったかもしれません。

境界は最初に一度決めて終わりではなく、改修のたびに意識し続けなければいけません。条件を1つ足すときに、それが今の関数の責務なのか、別に分けるべきものなのかを考える必要があります。まとめたり削ったりするより、分けて、名前を付けて、境界を作る方が、シンプルさを保てます。**これは関数に限らず、API設計やDB設計、UI設計においても同様です。**

## AI 時代にシンプルさは必要なのか？

AI は複雑なコードをすぐに理解してくれます。そして、理解した内容を人間にわかりやすく説明してくれます。そんな現代にシンプルなコードを書く理由などあるのでしょうか？

確かに、コードの読み書きで AI に任せられる場面は増えました。しかし、AI が読み書きできることと、人間がそのコードに責任を持てることは別の話です。最終的にそのコードの品質に責任を持つのは実装者であり、開発チームです。さらに画面の向こうには、そのソフトウェアの品質を信頼している無数のユーザーがいます。

AI がどれだけコードを書き、レビューできるようになっても、そのコードに責任を持ち、信頼するのは（今のところは）人間なのです。

そして、

> Simplicity is a prerequisite for reliability.<br>
> 信頼性には、シンプルさが不可欠である。<br>
> :p[― Edsger W. Dijkstra]{class="text-right text-xs italic opacity-80"}

## 参考文献

::ExternalLinkCardWrapper{url="https://jyn.dev/simple-is-not-the-same-as-small/"}
::

::ExternalLinkCardWrapper{url="https://www.infoq.com/presentations/Simple-Made-Easy/"}
::

::ExternalLinkCardWrapper{url="https://news.ycombinator.com/item?id=49558685"}
::

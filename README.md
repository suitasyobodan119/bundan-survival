# 分団サバイバル（吹田市消防団のゲーム）

公開ページ：https://suitasyobodan119.github.io/bundan-survival/

## ファイルの場所
| 場所 | 中身 |
|---|---|
| `index.html` | 公開されるゲーム本体（**直接さわらない**。`src/` から自動で作る） |
| `src/head.html` | GA・OGP・アイコンなど `<head>` の中身 |
| `src/style.css` | 見た目 |
| `src/body.html` | 画面の部品 |
| `src/js/*.js` | プログラム。機能ごとに分けてある。`ORDER.txt` の順につながる |
| `img/` | Canvaで作ったイラスト（団長・さくら先輩・新人・タイトル・エンディング） |
| `icons/` | ホーム画面用アイコン |
| `manifest.webmanifest`・`sw.js` | ホーム画面に追加（PWA）・オフライン用 |
| `tests/smoke.js` | 自動テスト |

## 直したあとの手順
```
python3 tools/build.py      # src/ から index.html を作る（構文エラーもチェック）
node tests/smoke.js         # 自動テスト（playwright が必要）。?dezome などを付けて期間イベントも確認できる
```
OKならコミットしてプッシュ。数分でGitHub Pagesに反映されます。

## 期間イベントの確認用URL
- `?halloween` … ハロウィン（10/24〜10/31）
- `?dezome` … 出初式（1/1〜1/18）
- `?mini=dezome` … 出初式ミニゲームを直接ひらく
- `?dan` … この端末を「団員」としてGAで分ける

## 新しく `src/js/` にファイルを足すとき
`src/js/ORDER.txt` の「44-update.js」より前に名前を書き足す。
- 絵やアイコンを同じファイル名で差し替えたときは、`sw.js` の `bs-v1` を `bs-v2` のように変える

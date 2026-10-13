# ママリッチ MCP

[ママリッチ](https://mama-rich.net/)の公開記事を検索するMCPサーバーです。
記事のタイトル・説明・出典URLを返します。

## 提供ツール

### search_mamakatsu_articles

- query：検索語。2〜100文字、空白区切りで最大5語
- limit：取得件数。1〜10件、初期値5件

複数の検索語はすべてに一致する記事を対象にします。
タイトル・説明・本文を検索し、サイトでの表示回数順に返します。

## 動作環境

Node.js 20以上。通信方式はstdioです。
APIキーは不要です。

## インストール

```bash
git clone https://github.com/hide99/mama-rich-mcp.git
cd mama-rich-mcp
npm ci
```

## MCPクライアントへの設定

以下のパスを、ダウンロードしたindex.jsの絶対パスに変更してください。

```json
{
  "mcpServers": {
    "mama-rich": {
      "command": "node",
      "args": [
        "C:/path/to/mama-rich-mcp/index.js"
      ]
    }
  }
}
```

設定方法はMCPクライアントによって異なります。

## 動作確認

```bash
npx @modelcontextprotocol/inspector node index.js
```

接続後、search_mamakatsu_articlesを選び、
queryに「東京」、limitに5を指定して実行してください。

## データについて

公開記事の情報を返します。利用者の個人情報は提供しません。
記事の記載内容は、検索結果の出典URLで確認してください。

## ライセンス

MCP用コードはMIT Licenseです。
リンク先の記事本文の利用条件は、このライセンスの対象外です。

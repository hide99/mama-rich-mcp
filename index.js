#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

const api_url = 'https://mama-rich.net/api/mcp/articles';

const article_schema = z.object({
    title: z.string(),
    url: z.string().url(),
    description: z.string()
});

const response_schema = z.object({
    articles: z.array(article_schema).max(10)
});

async function searchArticles({ query, limit }) {
    let res;

    try {
        const request_url = new URL(api_url);

        request_url.searchParams.set('query', query);
        request_url.searchParams.set('limit', String(limit));

        const response = await fetch(request_url, {
            headers: {
                Accept: 'application/json'
            },
            signal: AbortSignal.timeout(15000)
        });

        if (!response.ok) {
            throw new Error(
                `記事検索APIがHTTP ${response.status}を返しました。`
            );
        }

        const data = response_schema.parse(await response.json());

        res = {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(data)
                }
            ]
        };
    } catch (error) {
        let message = '記事検索に失敗しました。';

        if (error instanceof Error) {
            message = error.message;
        }

        res = {
            isError: true,
            content: [
                {
                    type: 'text',
                    text: message
                }
            ]
        };
    }

    return res;
}

function createServer() {
    const server = new McpServer({
        name: 'mama-rich-mcp',
        version: '1.0.0'
    });

    server.registerTool(
        'search_mamakatsu_articles',
        {
            description:
                'ママリッチの公開解説記事を検索します。' +
                'タイトル・説明・出典URLを返します。' +
                '複数の検索語はすべてに一致する記事を対象にし、' +
                'サイトでの表示回数順に返します。',
            inputSchema: z.object({
                query: z.string()
                    .trim()
                    .min(2)
                    .max(100)
                    .refine(
                        (query) => {
                            const words = query
                                .split(/[\s　]+/u)
                                .filter(Boolean);

                            return words.length >= 1 &&
                                words.length <= 5;
                        },
                        {
                            message:
                                '検索語は空白区切りで1〜5個指定してください。'
                        }
                    )
                    .describe('検索語。例：東京 安全'),
                limit: z.number()
                    .int()
                    .min(1)
                    .max(10)
                    .default(5)
                    .describe('取得件数。省略時は5件')
            }),
            annotations: {
                readOnlyHint: true,
                destructiveHint: false,
                openWorldHint: true
            }
        },
        searchArticles
    );

    return server;
}

await serveStdio(createServer);
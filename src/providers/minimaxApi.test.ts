import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { executeMiniMaxApi } from './minimaxApi.ts';

const structured = {
    summary: 'ok',
    ocr: { full_text: '', lines: [] },
    layout: { regions: [] },
    semantics: { scene: '', intent: '', entities: [], relations: [] },
    visual: { dominant_colors: [], style: '', notes: [] },
    uncertainty: [],
};
let imagePath: string;

beforeAll(() => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'modlens-minimax-'));
    imagePath = path.join(dir, 'x.png');
    fs.writeFileSync(imagePath, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
});

afterEach(() => vi.unstubAllGlobals());

describe('executeMiniMaxApi', () => {
    it('uses the global endpoint and MiniMax-M3 defaults', async () => {
        const calls: Array<{ url: string; init: RequestInit }> = [];
        vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
            calls.push({ url, init });
            return new Response(
                JSON.stringify({ choices: [{ message: { content: JSON.stringify(structured) } }] }),
                { status: 200 },
            );
        });

        await executeMiniMaxApi({
            imageSource: imagePath,
            imageKind: 'local',
            timeoutMs: 5000,
            settings: { apiKey: 'key' },
        });

        expect(calls[0].url).toBe('https://api.minimax.io/v1/chat/completions');
        expect(JSON.parse(String(calls[0].init.body)).model).toBe('MiniMax-M3');
    });

    it('honors the China endpoint and configured model', async () => {
        const calls: Array<{ url: string; init: RequestInit }> = [];
        vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
            calls.push({ url, init });
            return new Response(
                JSON.stringify({ choices: [{ message: { content: JSON.stringify(structured) } }] }),
                { status: 200 },
            );
        });

        await executeMiniMaxApi({
            imageSource: imagePath,
            imageKind: 'local',
            timeoutMs: 5000,
            settings: {
                apiKey: 'key',
                baseUrl: 'https://api.minimaxi.com/v1',
                model: 'MiniMax-M3',
            },
        });

        expect(calls[0].url).toBe('https://api.minimaxi.com/v1/chat/completions');
    });
});

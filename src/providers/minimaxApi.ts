// MiniMax's OpenAI-compatible vision endpoint.
// The global endpoint is the default; China users can set minimax.baseUrl to
// https://api.minimaxi.com/v1 without changing the request shape.

import type {
    BuildProviderInvocationOptions,
    ProviderParsedOutput,
    VisionProvider,
} from './index.ts';
import { executeOpenaiCompat } from './openaiCompat.ts';

export const MINIMAX_API_DEFAULT_MODEL = 'MiniMax-M3';
export const MINIMAX_API_DEFAULT_BASE_URL = 'https://api.minimax.io/v1';

export function executeMiniMaxApi(
    options: BuildProviderInvocationOptions,
): Promise<ProviderParsedOutput> {
    return executeOpenaiCompat({
        ...options,
        settings: {
            ...options.settings,
            baseUrl: options.settings?.baseUrl || MINIMAX_API_DEFAULT_BASE_URL,
            model: options.model || options.settings?.model || MINIMAX_API_DEFAULT_MODEL,
        },
        providerName: 'minimax',
    });
}

export const minimaxApiProvider: VisionProvider = {
    name: 'minimax',
    defaultModel: MINIMAX_API_DEFAULT_MODEL,
    execute: executeMiniMaxApi,
};

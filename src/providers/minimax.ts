import type { BuildProviderInvocationOptions, ProviderParsedOutput, VisionProvider } from './index.ts';
import { executeOpenaiCompat } from './openaiCompat.ts';

export const MINIMAX_DEFAULT_MODEL = 'MiniMax-M3';
export const MINIMAX_GLOBAL_BASE_URL = 'https://api.minimax.io/v1';

/** MiniMax's vision API follows the OpenAI-compatible multimodal contract. */
export async function executeMinimax(
    options: BuildProviderInvocationOptions,
): Promise<ProviderParsedOutput> {
    const settings = {
        ...options.settings,
        baseUrl: options.settings?.baseUrl || MINIMAX_GLOBAL_BASE_URL,
        model: options.model || options.settings?.model || MINIMAX_DEFAULT_MODEL,
    };
    return executeOpenaiCompat({ ...options, settings });
}

export const minimaxProvider: VisionProvider = {
    name: 'minimax',
    defaultModel: MINIMAX_DEFAULT_MODEL,
    execute: executeMinimax,
};

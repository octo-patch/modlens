import type {
    BuildProviderInvocationOptions,
    ProviderParsedOutput,
    VisionProvider,
} from './index.ts';
import { executeOpenaiCompat } from './openaiCompat.ts';

const DEFAULT_BASE_URL = 'https://api.minimax.io/v1';
const DEFAULT_MODEL = 'MiniMax-M3';

/** MiniMax's vision endpoint follows the OpenAI chat-completions contract. */
export async function executeMinimax(
    options: BuildProviderInvocationOptions,
): Promise<ProviderParsedOutput> {
    const settings = options.settings ?? {};
    return executeOpenaiCompat({
        ...options,
        model: options.model || settings.model || DEFAULT_MODEL,
        settings: {
            ...settings,
            baseUrl: settings.baseUrl || DEFAULT_BASE_URL,
        },
    });
}

export const minimaxProvider: VisionProvider = {
    name: 'minimax',
    defaultModel: DEFAULT_MODEL,
    execute: executeMinimax,
};

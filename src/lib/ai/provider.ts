import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// Whether real AI is available. When false, callers fall back to rule-based logic.
export const aiEnabled = !!process.env.OPENROUTER_API_KEY;

// Cheap, capable, tool/JSON-friendly model that exists on OpenRouter.
const MODEL_ID = 'openai/gpt-4o-mini';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

export const aiModel = openrouter(MODEL_ID);
export const aiModelId = MODEL_ID;

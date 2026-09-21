export type AiProviderKind = "copilot" | "vllm";
export type UiLanguage = "en" | "zh-TW";
export type AiOutputLanguage = "en" | "zh-TW";

export interface AiSettings {
  provider: AiProviderKind;
  /** OpenAI-compatible base URL, e.g. http://127.0.0.1:8000/v1. */
  vllmBaseUrl: string;
  /** Optional API key for secured OpenAI-compatible endpoints. */
  vllmApiKey: string;
  /** Model id returned by GET /v1/models. */
  vllmModel: string;
  /** Application UI language. */
  uiLanguage: UiLanguage;
  /** Language requested for AI-generated analysis / skill text. */
  outputLanguage: AiOutputLanguage;
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  provider: "copilot",
  vllmBaseUrl: "http://127.0.0.1:8000/v1",
  vllmApiKey: "",
  vllmModel: "",
  uiLanguage: "zh-TW",
  outputLanguage: "zh-TW",
};

export interface AiSettingsResult {
  ok: boolean;
  settings?: AiSettings;
  error?: string;
}

export interface AiModelListInput {
  baseUrl: string;
  apiKey?: string;
}

export interface AiModelListResult {
  ok: boolean;
  models: string[];
  normalizedBaseUrl?: string;
  error?: string;
}

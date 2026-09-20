import { app } from "electron";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  DEFAULT_AI_SETTINGS,
  type AiModelListInput,
  type AiModelListResult,
  type AiSettings,
} from "../common/ai-settings";

let cached: AiSettings | null = null;

function settingsPath(): string {
  return path.join(app.getPath("userData"), "ai-settings.json");
}

function sanitize(raw: Partial<AiSettings> | null | undefined): AiSettings {
  const provider = raw?.provider === "vllm" ? "vllm" : "copilot";
  const uiLanguage = raw?.uiLanguage === "zh-TW" ? "zh-TW" : "en";
  const outputLanguage = raw?.outputLanguage === "zh-TW" ? "zh-TW" : "en";
  return {
    provider,
    vllmBaseUrl:
      typeof raw?.vllmBaseUrl === "string" && raw.vllmBaseUrl.trim()
        ? raw.vllmBaseUrl.trim()
        : DEFAULT_AI_SETTINGS.vllmBaseUrl,
    vllmApiKey: typeof raw?.vllmApiKey === "string" ? raw.vllmApiKey.trim() : "",
    vllmModel: typeof raw?.vllmModel === "string" ? raw.vllmModel.trim() : "",
    uiLanguage,
    outputLanguage,
  };
}

export function loadAiSettings(): AiSettings {
  if (cached) return cached;
  try {
    const file = settingsPath();
    if (existsSync(file)) {
      cached = sanitize(JSON.parse(readFileSync(file, "utf8")) as Partial<AiSettings>);
      return cached;
    }
  } catch {
    // Invalid/corrupt settings fall back to safe defaults.
  }
  cached = { ...DEFAULT_AI_SETTINGS };
  return cached;
}

export function saveAiSettings(input: Partial<AiSettings>): AiSettings {
  const next = sanitize(input);
  if (next.provider === "vllm") {
    normalizeVllmBaseUrl(next.vllmBaseUrl);
    if (!next.vllmModel) throw new Error("Select a vLLM model before saving.");
  }
  writeFileSync(settingsPath(), JSON.stringify(next, null, 2) + "\n", "utf8");
  cached = next;
  return next;
}

export function normalizeVllmBaseUrl(raw: string): string {
  const value = raw.trim();
  if (!value) throw new Error("Enter the vLLM server URL.");
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("The vLLM URL is not valid.");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("The vLLM URL must use http:// or https://.");
  }
  url.search = "";
  url.hash = "";
  let pathname = url.pathname.replace(/\/+$/, "");
  if (!pathname || pathname === "/") pathname = "/v1";
  url.pathname = pathname;
  return url.toString().replace(/\/$/, "");
}

export async function listVllmModels(input: AiModelListInput): Promise<AiModelListResult> {
  let baseUrl: string;
  try {
    baseUrl = normalizeVllmBaseUrl(input.baseUrl);
  } catch (err) {
    return {
      ok: false,
      models: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const key = input.apiKey?.trim();
    if (key) headers.Authorization = `Bearer ${key}`;
    const response = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      return {
        ok: false,
        models: [],
        normalizedBaseUrl: baseUrl,
        error: `vLLM returned HTTP ${response.status} ${response.statusText}`.trim(),
      };
    }
    const payload = (await response.json()) as {
      data?: Array<{ id?: unknown }>;
      models?: Array<{ id?: unknown } | string>;
    };
    const raw = Array.isArray(payload.data) ? payload.data : payload.models ?? [];
    const models = raw
      .map((item) => (typeof item === "string" ? item : typeof item?.id === "string" ? item.id : ""))
      .filter((id): id is string => Boolean(id))
      .sort((a, b) => a.localeCompare(b));
    if (!models.length) {
      return {
        ok: false,
        models: [],
        normalizedBaseUrl: baseUrl,
        error: "The server responded, but no model ids were returned.",
      };
    }
    return { ok: true, models, normalizedBaseUrl: baseUrl };
  } catch (err) {
    const message =
      err instanceof Error && err.name === "TimeoutError"
        ? "Timed out while connecting to the vLLM server."
        : err instanceof Error
          ? err.message
          : String(err);
    return { ok: false, models: [], normalizedBaseUrl: baseUrl, error: message };
  }
}

export function aiSettingsSignature(settings = loadAiSettings()): string {
  return [
    settings.provider,
    settings.vllmBaseUrl,
    settings.vllmModel,
    settings.vllmApiKey ? "key" : "no-key",
    settings.outputLanguage,
  ].join("|");
}

export function aiProviderSessionOptions(settings = loadAiSettings()) {
  if (settings.provider !== "vllm") return {};
  const baseUrl = normalizeVllmBaseUrl(settings.vllmBaseUrl);
  if (!settings.vllmModel) throw new Error("No vLLM model is selected. Open Settings and select a model.");
  return {
    provider: {
      type: "openai" as const,
      baseUrl,
      ...(settings.vllmApiKey ? { apiKey: settings.vllmApiKey } : {}),
      wireApi: "completions" as const,
    },
  };
}

export function aiOutputLanguageInstruction(settings = loadAiSettings()): string {
  if (settings.outputLanguage === "zh-TW") {
    return [
      "# Output language",
      "Write all user-facing natural-language output in Traditional Chinese for Taiwan (zh-TW).",
      "Keep URLs, file paths, commands, code, tool names, schema keys, identifiers, enum values,",
      "model ids, and literal captured evidence unchanged when translation would alter their meaning.",
      "For analysis, translate the title, intent, rationale, and step titles/details into zh-TW.",
      "For generated skills and automation plans, use zh-TW for human-facing descriptions and instructions",
      "while preserving machine-readable names and required syntax.",
    ].join("\n");
  }
  return [
    "# Output language",
    "Write user-facing natural-language output in English.",
    "Keep URLs, file paths, commands, code, tool names, schema keys, identifiers, and enum values unchanged.",
  ].join("\n");
}

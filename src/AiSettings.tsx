import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_AI_SETTINGS,
  type AiModelListResult,
  type AiSettings,
} from "../common/ai-settings";
import { setUiLanguage, t } from "./i18n";

export function AiSettingsPanel({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<AiSettings>({ ...DEFAULT_AI_SETTINGS });
  const [loaded, setLoaded] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    void window.skillRecorder.getAiSettings().then((next) => {
      if (canceled) return;
      setSettings(next);
      setLoaded(true);
    });
    return () => {
      canceled = true;
    };
  }, []);

  const loadModels = useCallback(
    async (quiet = false): Promise<AiModelListResult | null> => {
      if (settings.provider !== "vllm" || !settings.vllmBaseUrl.trim()) return null;
      if (!quiet) setModelError(null);
      setLoadingModels(true);
      const result = await window.skillRecorder.listAiModels({
        baseUrl: settings.vllmBaseUrl,
        apiKey: settings.vllmApiKey,
      });
      setLoadingModels(false);
      if (!result.ok) {
        setModels([]);
        setModelError(result.error ?? t("Connection failed"));
        return result;
      }

      const nextModels = result.models;
      setModels(nextModels);
      setModelError(null);
      setSettings((current) => {
        const normalized = result.normalizedBaseUrl ?? current.vllmBaseUrl;
        const selected =
          current.vllmModel && nextModels.includes(current.vllmModel)
            ? current.vllmModel
            : nextModels[0] ?? "";
        return { ...current, vllmBaseUrl: normalized, vllmModel: selected };
      });
      return result;
    },
    [settings.provider, settings.vllmBaseUrl, settings.vllmApiKey],
  );

  // When a vLLM URL/key changes, discover /v1/models automatically after a short pause.
  useEffect(() => {
    if (!loaded || settings.provider !== "vllm" || !settings.vllmBaseUrl.trim()) return;
    const timer = window.setTimeout(() => {
      void loadModels(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [
    loaded,
    settings.provider,
    settings.vllmBaseUrl,
    settings.vllmApiKey,
    loadModels,
  ]);

  const modelOptions = useMemo(() => {
    if (settings.vllmModel && !models.includes(settings.vllmModel)) {
      return [settings.vllmModel, ...models];
    }
    return models;
  }, [models, settings.vllmModel]);

  const save = useCallback(async () => {
    setSaveError(null);
    setSaveState("saving");
    const result = await window.skillRecorder.saveAiSettings(settings);
    if (!result.ok || !result.settings) {
      setSaveState("idle");
      setSaveError(result.error ?? "Could not save settings.");
      return;
    }
    setSettings(result.settings);
    setUiLanguage(result.settings.uiLanguage);
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 1800);
  }, [settings]);

  return (
    <section className="ai-settings-panel" aria-label={t("AI Settings")}>
      <header className="ai-settings-head">
        <div>
          <span className="eyebrow">{t("Settings")}</span>
          <h2>{t("AI Settings")}</h2>
          <p>
            {settings.uiLanguage === "zh-TW"
              ? "選擇 GitHub Copilot 或自己的 vLLM / OpenAI 相容伺服器。"
              : "Choose GitHub Copilot or your own vLLM / OpenAI-compatible server."}
          </p>
        </div>
        <button className="ai-settings-close" onClick={onClose}>
          {t("Close")}
        </button>
      </header>

      <div className="ai-settings-grid">
        <label className="ai-settings-field">
          <span>{t("Provider")}</span>
          <select
            value={settings.provider}
            onChange={(event) => {
              const provider = event.target.value === "vllm" ? "vllm" : "copilot";
              setSettings((current) => ({ ...current, provider }));
              setModelError(null);
              setSaveError(null);
            }}
          >
            <option value="copilot">{t("Use GitHub Copilot")}</option>
            <option value="vllm">{t("Use vLLM / OpenAI-compatible server")}</option>
          </select>
        </label>

        <label className="ai-settings-field">
          <span>{t("UI language")}</span>
          <select
            value={settings.uiLanguage}
            onChange={(event) => {
              const uiLanguage = event.target.value === "zh-TW" ? "zh-TW" : "en";
              setSettings((current) => ({ ...current, uiLanguage }));
              setUiLanguage(uiLanguage);
            }}
          >
            <option value="en">{t("English")}</option>
            <option value="zh-TW">{t("Traditional Chinese (Taiwan)")}</option>
          </select>
        </label>

        <label className="ai-settings-field">
          <span>{t("Output language")}</span>
          <select
            value={settings.outputLanguage}
            onChange={(event) => {
              const outputLanguage = event.target.value === "zh-TW" ? "zh-TW" : "en";
              setSettings((current) => ({ ...current, outputLanguage }));
            }}
          >
            <option value="en">{t("English")}</option>
            <option value="zh-TW">{t("Traditional Chinese (Taiwan)")}</option>
          </select>
        </label>
      </div>

      {settings.provider === "vllm" && (
        <div className="ai-settings-vllm">
          <label className="ai-settings-field ai-settings-wide">
            <span>{t("vLLM server URL")}</span>
            <input
              type="url"
              value={settings.vllmBaseUrl}
              placeholder="http://127.0.0.1:8000/v1"
              spellCheck={false}
              onChange={(event) => {
                setSettings((current) => ({ ...current, vllmBaseUrl: event.target.value }));
                setModelError(null);
              }}
            />
            <small>
              {settings.uiLanguage === "zh-TW"
                ? "可輸入 http://主機:8000 或 http://主機:8000/v1；程式會自動查詢 /v1/models。"
                : "Enter http://host:8000 or http://host:8000/v1. Models are discovered from /v1/models automatically."}
            </small>
          </label>

          <label className="ai-settings-field ai-settings-wide">
            <span>{t("Optional API key")}</span>
            <input
              type="password"
              value={settings.vllmApiKey}
              autoComplete="off"
              placeholder={settings.uiLanguage === "zh-TW" ? "本機 vLLM 通常可留空" : "Usually blank for local vLLM"}
              onChange={(event) =>
                setSettings((current) => ({ ...current, vllmApiKey: event.target.value }))
              }
            />
          </label>

          <div className="ai-settings-model-row">
            <label className="ai-settings-field ai-settings-model">
              <span>{t("Model")}</span>
              <select
                value={settings.vllmModel}
                disabled={loadingModels || modelOptions.length === 0}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, vllmModel: event.target.value }))
                }
              >
                {modelOptions.length === 0 ? (
                  <option value="">
                    {loadingModels ? t("Loading models…") : t("No models loaded")}
                  </option>
                ) : (
                  modelOptions.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))
                )}
              </select>
            </label>
            <button
              className="ai-settings-refresh"
              disabled={loadingModels || !settings.vllmBaseUrl.trim()}
              onClick={() => void loadModels(false)}
            >
              {loadingModels ? t("Loading models…") : t("Refresh models")}
            </button>
          </div>

          {modelError && <p className="ai-settings-error">{modelError}</p>}
          {!modelError && modelOptions.length > 0 && (
            <p className="ai-settings-ok">
              {settings.uiLanguage === "zh-TW"
                ? `已連線，找到 ${modelOptions.length} 個模型。`
                : `Connected. Found ${modelOptions.length} model${modelOptions.length === 1 ? "" : "s"}.`}
            </p>
          )}

          <div className="ai-settings-note">
            {settings.uiLanguage === "zh-TW"
              ? "vLLM 模型必須支援 Streaming 與 Tool/Function Calling。若要讓錄影畫面也能參與分析，建議使用支援 Vision 的模型。"
              : "The vLLM model must support streaming and tool/function calling. Use a vision-capable model if you want captured frames to participate in analysis."}
          </div>
        </div>
      )}

      <footer className="ai-settings-actions">
        {saveError && <span className="ai-settings-error">{saveError}</span>}
        {saveState === "saved" && <span className="ai-settings-ok">{t("Settings saved.")}</span>}
        <button className="primary" disabled={saveState === "saving"} onClick={() => void save()}>
          {saveState === "saving"
            ? settings.uiLanguage === "zh-TW"
              ? "儲存中…"
              : "Saving…"
            : t("Save")}
        </button>
      </footer>
    </section>
  );
}

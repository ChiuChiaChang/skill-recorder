# Corin fork: vLLM + zh-TW

This fork keeps the original Microsoft Skill Recorder workflow and adds a selectable AI backend and Traditional Chinese support.

## Added in this fork

- **GitHub Copilot** remains available.
- **vLLM / OpenAI-compatible** can be selected in **Review sessions → Settings**.
- Enter a server URL such as `http://127.0.0.1:8000` or `http://127.0.0.1:8000/v1`.
- The app automatically queries `GET /v1/models` and fills the model dropdown.
- Optional Bearer API key support.
- **UI language:** English or **繁體中文（台灣）**.
- **AI output language:** English or **zh-TW**.
- Analysis, Skill Builder, and Automation Builder use the selected provider.
- Privacy disclosures distinguish GitHub Copilot from a configured vLLM server.

## vLLM requirements

The selected model needs to work with the OpenAI-compatible Chat Completions API and support:

1. streaming responses;
2. tool/function calling;
3. preferably vision/image input if you want Skill Recorder to inspect captured screen frames.

A text-only tool-capable model can still analyze timeline, URLs, clipboard previews, narration, and terminal evidence, but it may not be able to interpret captured screen images.

## Run this branch on Windows

Use Node.js 24.19 or newer in the Node 24 line.

```cmd
git clone -b feature/vllm-zh-tw-1.0.0 https://github.com/ChiuChiaChang/skill-recorder.git skill-recorder-vllm
cd skill-recorder-vllm
npm ci
npm run electron:install-reviewed
npm run compliance:licenses
npm run build
npm run dev
```

## Configure vLLM

1. Open **Review sessions**.
2. Click **Settings / 設定**.
3. Select **vLLM / OpenAI-compatible**.
4. Enter the server URL.
5. Wait for model discovery, or click **Refresh models / 重新載入模型**.
6. Select the model.
7. Set **UI language** and **AI output language** to **Traditional Chinese (Taiwan)** if desired.
8. Save.

Settings are stored in the Electron per-user application data directory. The optional API key is never written to logs by this fork.

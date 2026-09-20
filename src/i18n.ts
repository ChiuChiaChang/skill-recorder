import type { UiLanguage } from "../common/ai-settings";

let activeLanguage: UiLanguage = "en";
let observer: MutationObserver | null = null;
const originalText = new WeakMap<Text, string>();

const ZH_TW: Record<string, string> = {
  "Narrate": "語音旁白",
  "Explain out loud (optional)": "用語音說明操作（選用）",
  "Records your screen and activity": "錄製螢幕與操作活動",
  "See exactly what's captured": "查看實際會擷取的內容",
  "Review sessions": "檢視錄製工作階段",
  "No recordings yet": "尚無錄製內容",
  "No recordings yet.": "尚無錄製內容。",
  "GitHub Copilot": "GitHub Copilot",
  "AI engine": "AI 引擎",
  "advanced protection": "進階保護",
  "on-device": "本機執行",
  "found": "已找到",
  "missing": "缺少",
  "download": "下載",
  "retry": "重試",
  "download failed": "下載失敗",
  "not downloaded": "尚未下載",
  "preparing": "準備中",
  "downloading": "下載中",
  "voice transcription": "語音轉文字",
  "multilingual": "多語言",
  "Protection off": "保護已關閉",
  "Recording settings": "錄製設定",
  "Language": "語言",
  "Microphone": "麥克風",
  "Screen": "螢幕",
  "Loading microphones...": "正在載入麥克風…",
  "Loading screens...": "正在載入螢幕…",
  "No screens available": "沒有可用螢幕",
  "Voice off for this recording": "本次錄製未啟用語音",
  "Microphone needs attention": "麥克風需要處理",
  "Screen capture needs attention": "螢幕錄製需要處理",
  "Capture saved. Open Sessions to analyze": "錄製已儲存。請開啟工作階段進行分析",
  "Recording discarded": "錄製已捨棄",
  "Sessions": "工作階段",
  "Settings": "設定",
  "AI Settings": "AI 設定",
  "No session selected": "尚未選擇工作階段",
  "Pick a recording on the left to review its reconstructed intent and steps.": "請從左側選擇錄製內容，以檢視 AI 重建的意圖與步驟。",
  "Loading…": "載入中…",
  "Dismiss": "關閉",
  "Confirm delete": "確認刪除",
  "Delete this recording?": "要刪除這筆錄製嗎？",
  "This cannot be undone.": "此操作無法復原。",
  "Cancel": "取消",
  "Delete": "刪除",
  "skill": "技能",
  "automation": "自動化",
  "analyzed": "已分析",
  "processing": "處理中",
  "recorded": "已錄製",
  "Not analyzed yet": "尚未分析",
  "video": "影片",
  "voice pending": "語音待處理",
  "voice": "語音",
  "Analyze": "分析",
  "Analyze again": "重新分析",
  "Cancel analysis": "取消分析",
  "Thinking…": "思考中…",
  "Finalizing analysis…": "正在完成分析…",
  "Plan ready for your review.": "規劃已完成，請檢視。",
  "Create skill": "建立技能",
  "Create automation": "建立自動化",
  "Download details": "下載詳細資料",
  "Intent": "意圖",
  "Steps": "步驟",
  "Edit": "編輯",
  "Save": "儲存",
  "Close": "關閉",
  "Back": "返回",
  "Refresh": "重新整理",
  "Refresh models": "重新載入模型",
  "Test connection": "測試連線",
  "Connected": "連線成功",
  "Connection failed": "連線失敗",
  "Provider": "AI 提供者",
  "Model": "模型",
  "Output language": "AI 輸出語言",
  "UI language": "介面語言",
  "Traditional Chinese (Taiwan)": "繁體中文（台灣）",
  "English": "英文",
  "Optional API key": "API Key（選用）",
  "vLLM server URL": "vLLM 伺服器 URL",
  "Use GitHub Copilot": "使用 GitHub Copilot",
  "Use vLLM / OpenAI-compatible server": "使用 vLLM / OpenAI 相容伺服器",
  "Loading models…": "正在載入模型…",
  "No models loaded": "尚未載入模型",
  "Settings saved.": "設定已儲存。",
  "Select a model": "請選擇模型",
  "Open Settings and select a model.": "請開啟設定並選擇模型。",
};

function translateExact(value: string): string {
  if (activeLanguage !== "zh-TW") return value;
  const direct = ZH_TW[value];
  if (direct) return direct;

  let match = value.match(/^(\d+) ready to analyze$/);
  if (match) return `${match[1]} 筆可進行分析`;
  match = value.match(/^(\d+) recordings?$/);
  if (match) return `${match[1]} 筆錄製`;
  match = value.match(/^(\d+) steps$/);
  if (match) return `${match[1]} 個步驟`;
  match = value.match(/^(\d+) events captured$/);
  if (match) return `已擷取 ${match[1]} 個事件`;
  match = value.match(/^Analysis ready \(revision (\d+)\)\.$/);
  if (match) return `分析完成（修訂版 ${match[1]}）`;
  return value;
}

export function t(value: string): string {
  return translateExact(value);
}

export function getUiLanguage(): UiLanguage {
  return activeLanguage;
}

function shouldSkip(text: Text): boolean {
  const parent = text.parentElement;
  if (!parent) return false;
  if (parent.closest(".xterm")) return true;
  return Boolean(parent.closest("code, pre, kbd, samp, textarea, input, select, option"));
}

function translateTextNode(node: Text): void {
  if (shouldSkip(node)) return;
  const current = node.data;
  const known = originalText.get(node);
  let source = known;
  if (!source || (current !== source && current !== translateExact(source))) {
    source = current;
    originalText.set(node, source);
  }
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  const core = source.slice(leading.length, source.length - trailing.length);
  const translated = translateExact(core);
  const next = leading + translated + trailing;
  if (node.data !== next) node.data = next;
}

function translateAttributes(el: Element): void {
  for (const attr of ["title", "aria-label", "placeholder"]) {
    const value = el.getAttribute(attr);
    if (!value) continue;
    const key = `data-sr-original-${attr.replace("aria-", "aria")}`;
    let source = el.getAttribute(key);
    if (!source || (value !== source && value !== translateExact(source))) {
      source = value;
      el.setAttribute(key, source);
    }
    const translated = translateExact(source);
    if (value !== translated) el.setAttribute(attr, translated);
  }
}

function translateSubtree(root: Node): void {
  if (root instanceof Text) {
    translateTextNode(root);
    return;
  }
  if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) return;
  if (root instanceof Element) translateAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();
  while (node) {
    if (node instanceof Text) translateTextNode(node);
    else if (node instanceof Element) translateAttributes(node);
    node = walker.nextNode();
  }
}

export function setUiLanguage(language: UiLanguage): void {
  activeLanguage = language;
  document.documentElement.lang = language;
  if (document.body) translateSubtree(document.body);
}

export function installDomTranslator(): void {
  if (observer || !document.body) return;
  translateSubtree(document.body);
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData" && mutation.target instanceof Text) {
        translateTextNode(mutation.target);
      }
      for (const node of mutation.addedNodes) translateSubtree(node);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

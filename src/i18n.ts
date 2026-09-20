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
  "Analysis": "分析",
  "Analysis failed": "分析失敗",
  "Analyze recording": "分析錄製內容",
  "Back to the analysis": "返回分析",
  "Before you record": "開始錄製前",
  "Start recording": "開始錄製",
  "Stop recording": "停止錄製",
  "Discard recording": "捨棄錄製",
  "Discard this recording?": "要捨棄這筆錄製嗎？",
  "Delete recording": "刪除錄製",
  "Goal": "目標",
  "What you did": "您的操作",
  "See what you did in this recording, step by step.": "逐步查看這次錄製中您所執行的操作。",
  "What do you want to build?": "您想建立什麼？",
  "What do you want to build from this recording?": "您想從這次錄製建立什麼？",
  "Turn this recording into a skill or an automation": "將這次錄製轉換成技能或自動化",
  "Create": "建立",
  "Skill title": "技能標題",
  "Skill description": "技能說明",
  "Automation title": "自動化標題",
  "Automation description": "自動化說明",
  "Skill created": "技能已建立",
  "Skill exported": "技能已匯出",
  "Automation created": "自動化已建立",
  "Automation ready": "自動化已就緒",
  "Skill & automation created": "技能與自動化皆已建立",
  "Planning the skill…": "正在規劃技能…",
  "Planning the automation…": "正在規劃自動化…",
  "Writing the skill…": "正在建立技能…",
  "Writing the automation…": "正在建立自動化…",
  "Exporting the skill…": "正在匯出技能…",
  "Opening the skill…": "正在開啟技能…",
  "Opening the automation…": "正在開啟自動化…",
  "Create and export the automation bundle": "建立並匯出自動化套件",
  "Open the skill built from this recording": "開啟由此錄製建立的技能",
  "Open the automation built from this recording": "開啟由此錄製建立的自動化",
  "Create another →": "再建立一個 →",
  "When it runs": "執行時間",
  "Once a day": "每天一次",
  "A few times a day": "每天數次",
  "Every day": "每天",
  "Every…": "每隔…",
  "Add step": "新增步驟",
  "Step title": "步驟標題",
  "Step detail": "步驟詳細內容",
  "Step description": "步驟說明",
  "Step instruction": "步驟指令",
  "Step label": "步驟名稱",
  "What happens in this step?": "這個步驟要做什麼？",
  "The instruction the agent runs for this step": "AI Agent 在此步驟執行的指令",
  "Move up": "上移",
  "Move down": "下移",
  "Click to edit": "點選以編輯",
  "Click any step to edit · reorder, add or remove — saved automatically": "點選任一步驟即可編輯、重新排序、新增或刪除，變更會自動儲存",
  "Esc to cancel · ⏎ to save": "Esc 取消 · ⏎ 儲存",
  "A little more detail": "補充更多細節",
  "One sentence: what were you trying to do?": "用一句話描述您想完成的目標",
  "One-line description of what this skill does": "用一句話描述此技能的用途",
  "One-line description of what this automation does": "用一句話描述此自動化的用途",
  "Short name, e.g. Research habit articles": "簡短名稱，例如：研究習慣養成文章",
  "What the skill will do": "技能將執行的內容",
  "What the automation will do": "自動化將執行的內容",
  "Name": "名稱",
  "On": "開啟",
  "Audio input": "音訊輸入",
  "Choose microphone": "選擇麥克風",
  "System default": "系統預設",
  "Recorded terminal": "錄製終端機",
  "Open recorded terminal": "開啟錄製終端機",
  "Open a terminal captured only with this recording": "開啟只屬於本次錄製的終端機",
  "Output is saved only with this recording": "輸出只會儲存在本次錄製中",
  "Shell": "Shell",
  "Command running": "指令執行中",
  "A terminal command is still running": "仍有終端機指令正在執行",
  "Close terminal and save": "關閉終端機並儲存",
  "Close terminal and discard": "關閉終端機並捨棄",
  "Shell exited": "Shell 已結束",
  "Switching shell": "正在切換 Shell",
  "Capture error": "錄製錯誤",
  "Action failed": "操作失敗",
  "Still processing this recording… try again in a moment.": "仍在處理這筆錄製，請稍後再試。",
  "Download details for debugging": "下載除錯詳細資料",
  "Preparing debug bundle…": "正在準備除錯套件…",
  "Debug bundle saved": "除錯套件已儲存",
  "Includes private information": "包含私人資訊",
  "Sign in to Copilot": "登入 Copilot",
  "Waiting for browser sign-in…": "正在等待瀏覽器登入…",
  "Cancel sign-in": "取消登入",
  "Follow the app prompts and finish signing in in your browser.": "請依照應用程式提示，在瀏覽器完成登入。",
  "Sign-in canceled.": "已取消登入。",
  "Sign-in canceled. Analysis will not retry automatically.": "已取消登入。分析不會自動重試。",
  "Sign-in timed out. Try again.": "登入逾時，請再試一次。",
  "Signed in to Copilot. Try your action again when ready.": "已登入 Copilot。準備好後請再次執行原操作。",
  "What gets sent to your AI provider": "會傳送給 AI 提供者的內容",
  "What's recorded": "錄製哪些內容",
  "While you're recording": "錄製期間",
  "Only between Start and Stop.": "只會在開始與停止錄製之間擷取。",
  "Recorded terminal (only if you open it)": "錄製終端機（僅在您開啟時）",
  "Voice narration (only if you turn it on)": "語音旁白（僅在您啟用時）",
  "Where it's stored": "儲存位置",
  "What's sent for analysis": "分析時會傳送的內容",
  "What it never does": "永遠不會執行的項目",
  "Nothing leaves your computer while you record.": "錄製期間不會有任何資料離開您的電腦。",
  "Everything is saved on this computer, in the app's own session folder.": "所有錄製資料都儲存在此電腦的應用程式工作階段資料夾中。",
  "Recordings stay until you delete them. You can delete any recording from Sessions.": "錄製內容會保留到您主動刪除為止，可從「工作階段」中刪除任何錄製。",
  "Which apps you switch to, and their window and document titles.": "您切換過的應用程式，以及其視窗與文件標題。",
  "Web addresses of the pages you open.": "您開啟頁面的網址。",
  "A short preview of text you copy, up to 120 characters.": "您複製文字的短預覽，最多 120 個字元。",
  "A silent video of the screen you select, at a low frame rate.": "以低幀率錄製您選定螢幕的無聲影片。",
  "Only the terminal opened from the floating recording bar is captured.": "只會擷取從浮動錄製工具列開啟的終端機。",
  "Your microphone audio is saved only while it is on and a recording is running.": "只有在麥克風開啟且正在錄製時才會儲存麥克風音訊。",
  "Leave Narrate and the recording-bar microphone off and no microphone is opened.": "若保持語音旁白與錄製工具列麥克風關閉，程式不會開啟麥克風。",
  "It all runs on this computer.": "所有保護處理都在此電腦本機執行。",
  "It does not log your keystrokes.": "不會記錄您的按鍵內容。",
  "It does not capture commands from Terminal, PowerShell, or other terminal apps.": "不會擷取既有 Terminal、PowerShell 或其他終端機應用程式中的指令。",
  "It only captures while a recording is running. Nothing runs in the background.": "只會在錄製期間擷取資料，不會在背景持續錄製。",
  "Advanced protection": "進階保護",
  "On-device model ready": "本機模型已就緒",
  "On-device model not set up yet": "本機模型尚未設定",
  "Setting up the on-device model…": "正在設定本機模型…",
  "Set up now": "立即設定",
  "High risk": "高風險",
  "Possibly sensitive": "可能為敏感資訊",
  "Low confidence": "低信心",
  "Checked for sensitive details before sending": "傳送前已檢查敏感資訊",
  "Blurred on-screen details": "已模糊處理畫面中的敏感資訊",
  "Screen images": "螢幕影像",
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
  match = value.match(/^Ready to capture · (.+)$/);
  if (match) return `準備錄製 · ${match[1]}`;
  match = value.match(/^(Ctrl\+Shift\+R|⌘⇧R) toggles from anywhere$/);
  if (match) return `${match[1]} 可在任何視窗切換錄製`;
  match = value.match(/^Review sessions, (\d+) ready to analyze$/);
  if (match) return `檢視工作階段，${match[1]} 筆可進行分析`;
  match = value.match(/^Review sessions, (\d+) recorded$/);
  if (match) return `檢視工作階段，共 ${match[1]} 筆錄製`;
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
  if (!current.trim()) return;
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

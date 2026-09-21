import type { UiLanguage } from "../common/ai-settings";

let activeLanguage: UiLanguage = "zh-TW";
let observer: MutationObserver | null = null;
const originalText = new WeakMap<Text, string>();
const renderedText = new WeakMap<Text, string>();

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
  "Copilot · found": "Copilot · 已找到",
  "Copilot · missing": "Copilot · 缺少",
  "vLLM · select model": "vLLM · 請選擇模型",
  "on-device · multilingual": "本機執行 · 多語言",
  "Requesting microphone access...": "正在請求麥克風權限…",
  "The transcript stays in this language": "逐字稿會保留所選語言",
  "Preparing voice model…": "正在準備語音模型…",
  "Downloading voice model…": "正在下載語音模型…",
  "Transcribing voice…": "正在轉錄語音…",
  "Voice transcript added after this analysis": "語音逐字稿是在本次分析完成後加入",
  "Re-analyze to include it. This replaces the current summary and any edits.": "若要納入逐字稿，請重新分析；這會取代目前摘要與所有編輯。",
  "Could not create the skill": "無法建立技能",
  "Could not create the automation": "無法建立自動化",
  "Could not save your changes": "無法儲存變更",
  "Could not delete this recording.": "無法刪除此錄製。",
  "Could not start recording.": "無法開始錄製。",
  "Could not stop the recording.": "無法停止錄製。",
  "Could not discard the recording.": "無法捨棄錄製。",
  "Could not change the microphone.": "無法變更麥克風。",
  "Could not select that microphone.": "無法選擇該麥克風。",
  "Could not select that screen.": "無法選擇該螢幕。",
  "Could not switch microphones.": "無法切換麥克風。",
  "Could not update the narration preference.": "無法更新語音旁白設定。",
  "Could not update advanced protection.": "無法更新進階保護。",
  "Could not download the protection models.": "無法下載保護模型。",
  "Could not download the voice transcription model.": "無法下載語音轉錄模型。",
  "Unsupported narration language.": "不支援此語音旁白語言。",
  "Planning failed": "規劃失敗",
  "No value is defined for this token": "此 Token 尚未定義值",
  "Remove time": "移除時間",
  "Coming soon": "即將推出",
  "For complete transparency, review exactly what's captured and what may later be sent to the AI provider you selected for analysis.": "為了完整透明，請先確認會擷取哪些內容，以及之後可能傳送給您所選 AI 提供者進行分析的資料。",
  "This tool records your screen and activity so it can turn what you did into a reusable skill. Here is exactly what it captures and what leaves your computer.": "此工具會錄製您的螢幕與操作活動，將您完成的工作轉換成可重複使用的技能。以下說明實際擷取內容以及哪些資料可能離開您的電腦。",
  "When you choose Analyze, the event timeline (window and document titles, URLs, and clipboard previews and recorded-terminal commands), plus screen images, narration text, and only the bounded terminal-output excerpts needed for analysis, are sent to the AI provider configured in Settings. GitHub Copilot uses GitHub's service; vLLM sends requests only to the OpenAI-compatible server URL you configured.": "當您選擇「分析」時，事件時間軸（視窗與文件標題、網址、剪貼簿預覽與錄製終端機指令）、螢幕影像、語音旁白文字，以及分析所需的有限終端機輸出片段，會傳送至「設定」中指定的 AI 提供者。GitHub Copilot 會使用 GitHub 服務；vLLM 則只會將請求送到您設定的 OpenAI 相容伺服器 URL。",
  "By default, before anything is sent, this computer hides sensitive details like passwords, keys, emails, and card or ID numbers from that text and from your screen images. You can turn this off below.": "預設在傳送任何資料前，此電腦會先遮蔽文字與螢幕影像中的密碼、金鑰、Email、卡號或身分證號等敏感資訊。您可以在下方關閉此功能。",
  "Do not type, paste, display, copy, or narrate passwords, access tokens, API keys, credentials, secrets, or other sensitive or confidential information. Anything visible on screen can appear in the recording, and copied text previews and narration are captured too.": "請勿輸入、貼上、顯示、複製或口述密碼、Access Token、API Key、登入憑證、密鑰或其他敏感／機密資訊。螢幕上可見的內容都可能出現在錄製中，複製文字的預覽與語音旁白也會被擷取。",
  "This ran on your computer and hid these before anything was sent to your selected AI provider. It covers secrets and personal details in the text that is sent (window titles, URLs, clipboard, terminal commands, notes, and voice) and in your screen images. It is on by default; you can turn it off in What's recorded.": "此保護機制在您的電腦本機執行，並在資料送往所選 AI 提供者前先遮蔽敏感內容。它會處理要傳送的文字（視窗標題、網址、剪貼簿、終端機指令、註記與語音）以及螢幕影像。此功能預設開啟，可在「錄製哪些內容」中關閉。",
  "toggles from anywhere": "可在任何視窗開始／停止錄製",
  "Starting": "啟動中",
  "Starting…": "啟動中…",
  "Starting...": "啟動中…",
  "Stopping": "停止中",
  "Stopping…": "停止中…",
  "Saving": "儲存中",
  "Saving…": "儲存中…",
  "Saving...": "儲存中…",
  "Discarding": "捨棄中",
  "Discarding…": "捨棄中…",
  "Discarding...": "捨棄中…",
  "Capturing": "錄製中",
  "Ready": "就緒",
  "Off": "關閉",
  "Retry": "重試",
  "Opening": "開啟中",
  "Terminal": "終端機",
  "Discard": "捨棄",
  "Done": "完成",
  "Keep recording": "繼續錄製",
  "Selected": "已選擇",
  "Hide": "隱藏",
  "Review": "檢視",
  "Got it": "我知道了",
  "Checking…": "檢查中…",
  "Couldn't set up the model": "無法設定本機模型",
  "Screen video, activity, recorded-terminal output, and voice segments will be permanently deleted.": "螢幕影片、操作活動、錄製終端機輸出與語音片段都將永久刪除。",
  "Closing the recording will stop the command and save its output as interrupted.": "結束錄製會停止目前指令，並將其輸出以「已中斷」狀態儲存。",
  "Keep passwords, access tokens, API keys, and other sensitive or confidential information off screen and out of narration.": "請勿讓密碼、Access Token、API Key 或其他敏感／機密資訊出現在螢幕或語音旁白中。",
  "If you open the recorded terminal from the floating bar: its commands, working folders, exit status, timing, and complete terminal output.": "如果從浮動工具列開啟錄製終端機，會記錄其指令、工作資料夾、結束狀態、時間資訊與完整終端機輸出。",
  "Its full output stays with this recording and has no app-imposed size limit, so long-running or noisy commands can make the saved recording much larger.": "完整終端機輸出會保留在本次錄製中，程式本身不限制大小，因此長時間或大量輸出的指令可能讓錄製檔明顯變大。",
  "Skill Recorder does not edit shell profiles, install global hooks, watch existing terminals, or keep recording commands after this recording ends.": "Skill Recorder 不會修改 Shell Profile、不會安裝全域 Hook、不會監看既有終端機，也不會在本次錄製結束後繼續記錄指令。",
  "Off by default. Choose the initial state and microphone with Narrate, then use the floating recording bar.": "預設關閉。可先在「語音旁白」選擇初始狀態與麥克風，錄製中再使用浮動工具列控制。",
  "Enabling Narrate briefly opens and releases the microphone so the app can request permission and show the available inputs. No audio is saved during this check.": "啟用語音旁白時，程式會短暫開啟再釋放麥克風，以取得權限並顯示可用輸入裝置；此檢查過程不會儲存音訊。",
  "Turning the microphone off ends that voice segment and releases the device. Turning it on again, or switching inputs, starts a new segment linked to the same recording timeline.": "關閉麥克風會結束目前語音片段並釋放裝置；再次開啟或切換輸入來源時，會建立新的語音片段並連結到同一錄製時間軸。",
  "The recording can be turned into text on this computer using an on-device model. The transcript stays in the language you select from Whisper's 99 supported choices. The first transcription needs a one-time ~252 MB download that you choose when to start.": "錄製語音可使用本機模型轉成文字。逐字稿會保留您所選的語言，支援 Whisper 的 99 種語言。第一次轉錄需要一次性下載約 252 MB 的模型，下載時機由您決定。",
  "On by default. Before your recording is analyzed, it checks the text and your screen images on this computer and hides sensitive details. Turn it off to send everything as recorded.": "預設開啟。進行分析前，程式會在本機檢查文字與螢幕影像並遮蔽敏感資訊；若關閉此功能，資料將依原始錄製內容送出。",
  "It hides sensitive details like passwords, keys, emails, and card or ID numbers, both in the text that is sent (including narration and terminal output) and in your screen images.": "它會遮蔽密碼、金鑰、Email、卡號或身分證號等敏感資訊，涵蓋送出的文字（包括語音旁白與終端機輸出）以及螢幕影像。",
  "Turning it off sends your recording as recorded. That can make the analysis more accurate, but nothing is hidden, so only do it when the recording has nothing sensitive.": "關閉後會依原始內容送出錄製資料，可能提高分析準確度，但不再遮蔽任何敏感資訊，因此請只在錄製內容不含敏感資料時使用。",
  "No method is 100% effective. It can miss details or mask the wrong ones. Treat it as a safety net, not a guarantee, and still avoid capturing anything secret.": "任何方法都無法保證 100% 正確，可能漏掉資訊或誤遮蔽內容。請把它視為額外保護，而非絕對保證，仍應避免錄製任何機密資料。",
  "Payment card number": "付款卡號",
  "US Social Security number": "美國社會安全號碼",
  "Phone number": "電話號碼",
  "Email address": "Email 地址",
  "Window title": "視窗標題",
  "Terminal command": "終端機指令",
  "Terminal output": "終端機輸出",
  "Clipboard": "剪貼簿",
  "Note": "註記",
  "Voice narration": "語音旁白",
  "On-screen text": "螢幕文字",
  "Other captured text": "其他擷取文字",
  "Couldn't create the debug bundle.": "無法建立除錯套件。",
  "Couldn't sign in to Copilot.": "無法登入 GitHub Copilot。",
  "Could not cancel Copilot sign-in during panel cleanup.": "清理面板時無法取消 GitHub Copilot 登入。",
  "Or run this command yourself:": "或自行執行此指令：",
  "Appears in your sessions list": "顯示在工作階段列表中",
  "View this recording's analysis": "查看此錄製的分析",
  "Create…": "建立…",
  "Working…": "處理中…",
  "Afrikaans": "南非語",
  "Albanian": "阿爾巴尼亞語",
  "Amharic": "阿姆哈拉語",
  "Arabic": "阿拉伯語",
  "Armenian": "亞美尼亞語",
  "Assamese": "阿薩姆語",
  "Azerbaijani": "亞塞拜然語",
  "Bashkir": "巴什基爾語",
  "Basque": "巴斯克語",
  "Belarusian": "白俄羅斯語",
  "Bengali": "孟加拉語",
  "Bosnian": "波士尼亞語",
  "Breton": "布列塔尼語",
  "Bulgarian": "保加利亞語",
  "Catalan": "加泰隆尼亞語",
  "Chinese": "中文",
  "Croatian": "克羅埃西亞語",
  "Czech": "捷克語",
  "Danish": "丹麥語",
  "Dutch": "荷蘭語",
  "Estonian": "愛沙尼亞語",
  "Faroese": "法羅語",
  "Finnish": "芬蘭語",
  "French": "法語",
  "Galician": "加利西亞語",
  "Georgian": "喬治亞語",
  "German": "德語",
  "Greek": "希臘語",
  "Gujarati": "古吉拉特語",
  "Haitian Creole": "海地克里奧語",
  "Hausa": "豪薩語",
  "Hawaiian": "夏威夷語",
  "Hebrew": "希伯來語",
  "Hindi": "印地語",
  "Hungarian": "匈牙利語",
  "Icelandic": "冰島語",
  "Indonesian": "印尼語",
  "Italian": "義大利語",
  "Japanese": "日語",
  "Javanese": "爪哇語",
  "Kannada": "卡納達語",
  "Kazakh": "哈薩克語",
  "Khmer": "高棉語",
  "Korean": "韓語",
  "Lao": "寮語",
  "Latin": "拉丁語",
  "Latvian": "拉脫維亞語",
  "Lingala": "林加拉語",
  "Lithuanian": "立陶宛語",
  "Luxembourgish": "盧森堡語",
  "Macedonian": "馬其頓語",
  "Malagasy": "馬達加斯加語",
  "Malay": "馬來語",
  "Malayalam": "馬拉雅拉姆語",
  "Maltese": "馬爾他語",
  "Maori": "毛利語",
  "Marathi": "馬拉地語",
  "Mongolian": "蒙古語",
  "Myanmar": "緬甸語",
  "Nepali": "尼泊爾語",
  "Norwegian": "挪威語",
  "Nynorsk": "新挪威語",
  "Occitan": "奧克語",
  "Pashto": "普什圖語",
  "Persian": "波斯語",
  "Polish": "波蘭語",
  "Portuguese": "葡萄牙語",
  "Punjabi": "旁遮普語",
  "Romanian": "羅馬尼亞語",
  "Russian": "俄語",
  "Sanskrit": "梵語",
  "Serbian": "塞爾維亞語",
  "Shona": "紹納語",
  "Sindhi": "信德語",
  "Sinhala": "僧伽羅語",
  "Slovak": "斯洛伐克語",
  "Slovenian": "斯洛維尼亞語",
  "Somali": "索馬利語",
  "Spanish": "西班牙語",
  "Sundanese": "巽他語",
  "Swahili": "史瓦希里語",
  "Swedish": "瑞典語",
  "Tagalog": "塔加洛語",
  "Tajik": "塔吉克語",
  "Tamil": "坦米爾語",
  "Tatar": "韃靼語",
  "Telugu": "泰盧固語",
  "Thai": "泰語",
  "Tibetan": "藏語",
  "Turkish": "土耳其語",
  "Turkmen": "土庫曼語",
  "Ukrainian": "烏克蘭語",
  "Urdu": "烏爾都語",
  "Uzbek": "烏茲別克語",
  "Vietnamese": "越南語",
  "Welsh": "威爾斯語",
  "Yiddish": "意第緒語",
  "Yoruba": "約魯巴語",
  "A recording has no schedule of its own — set when this automation should run.": "錄製本身沒有排程，請設定此自動化要在何時執行。",
  "Click any step to edit, or a highlighted value to change it. Reorder, add or remove as needed.": "點選任一步驟即可編輯，或點選醒目顯示的值進行修改；您也可以依需要重新排序、新增或移除。",
  "Couldn't save": "無法儲存",
  "Create & export automation": "建立並匯出自動化",
  "Do not analyze a recording that may contain passwords, access tokens, API keys, credentials, secrets, or other sensitive or confidential information.": "若錄製內容可能包含密碼、Access Token、API Key、登入憑證、密鑰或其他敏感／機密資訊，請勿進行分析。",
  "Download .zip": "下載 .zip",
  "First analysis downloads the ~250 MB voice model once — later runs skip this.": "第一次分析會下載約 250 MB 的語音模型一次，之後不需要重複下載。",
  "Open automation →": "開啟自動化 →",
  "Open skill →": "開啟技能 →",
  "Plan the automation →": "規劃自動化 →",
  "Plan the skill →": "規劃技能 →",
  "Re-analyze with voice": "加入語音重新分析",
  "Replace analysis": "取代目前分析",
  "Reveal bundle": "顯示套件位置",
  "Reveal file": "顯示檔案位置",
  "This bundle is everything captured in this recording — screen video, screenshots, visited URLs, clipboard contents, and any voice narration and transcript. Share it only with people you trust.": "此套件包含本次錄製擷取的所有內容，包括螢幕影片、截圖、瀏覽過的 URL、剪貼簿內容，以及任何語音旁白與逐字稿。請只分享給您信任的人。",
  "View this recording": "查看此錄製",
  "+ Add time": "+ 新增時間",
  "1 area": "1 個區域",
  "1 image": "1 張影像",
  "covered across": "分布於",
  "The on-screen text is not kept, so it can't be listed here.": "螢幕文字不會被保留，因此無法在此列出。",
  "Review sessions, nothing recorded yet": "檢視工作階段，目前尚無錄製內容",
  "Could not change the narration language.": "無法變更語音旁白語言。",
  "download a debug bundle": "下載除錯套件",
  "every day": "每天",
  "from": "從",
};

function translateExact(value: string): string {
  if (activeLanguage !== "zh-TW") return value;
  const normalized = value.replace(/\s+/g, " ").trim();
  const direct = ZH_TW[normalized];
  if (direct) return direct;

  let match = normalized.match(/^(\d+) ready to analyze$/);
  if (match) return `${match[1]} 筆可進行分析`;
  match = normalized.match(/^(\d+) recordings?$/);
  if (match) return `${match[1]} 筆錄製`;
  match = normalized.match(/^(\d+) steps$/);
  if (match) return `${match[1]} 個步驟`;
  match = normalized.match(/^(\d+) events captured$/);
  if (match) return `已擷取 ${match[1]} 個事件`;
  match = normalized.match(/^Ready to capture · (.+)$/);
  if (match) return `準備錄製 · ${match[1]}`;
  match = normalized.match(/^(Ctrl\+Shift\+R|⌘⇧R) toggles from anywhere$/);
  if (match) return `${match[1]} 可在任何視窗切換錄製`;
  match = normalized.match(/^Review sessions, (\d+) ready to analyze$/);
  if (match) return `檢視工作階段，${match[1]} 筆可進行分析`;
  match = normalized.match(/^Review sessions, (\d+) recorded$/);
  if (match) return `檢視工作階段，共 ${match[1]} 筆錄製`;
  match = normalized.match(/^Analysis ready \(revision (\d+)\)\.$/);
  if (match) return `分析完成（修訂版 ${match[1]}）`;

  match = normalized.match(/^(?:Screen|Display) (\d+)$/i);
  if (match) return `螢幕 ${match[1]}`;

  match = normalized.match(/^Using (.+)$/);
  if (match) return `使用中：${match[1]}`;

  match = normalized.match(/^Next: (.+)$/);
  if (match) return `下次使用：${match[1]}`;

  match = normalized.match(/^Setting up the on-device model…\s*(\d+)%$/);
  if (match) return `正在設定本機模型… ${match[1]}%`;

  match = normalized.match(/^(\d+) sensitive details?$/);
  if (match) return `${match[1]} 筆敏感資訊`;

  match = normalized.match(/^(\d+) on-screen areas?$/);
  if (match) return `${match[1]} 個螢幕區域`;

  match = normalized.match(/^Hid (\d+) sensitive details? before sending$/);
  if (match) return `傳送前已遮蔽 ${match[1]} 筆敏感資訊`;

  match = normalized.match(/^Blurred (\d+) on-screen areas? in screen images before sending$/);
  if (match) return `傳送前已在螢幕影像中模糊 ${match[1]} 個區域`;

  match = normalized.match(/^Hid (\d+) sensitive details? and blurred (\d+) on-screen areas? before sending$/);
  if (match) return `傳送前已遮蔽 ${match[1]} 筆敏感資訊，並模糊 ${match[2]} 個螢幕區域`;

  match = normalized.match(/^(\d+) areas? covered across (\d+) images?\. The on-screen text is not kept, so it can't be listed here\.$/);
  if (match) return `已在 ${match[2]} 張影像中遮蔽 ${match[1]} 個區域。螢幕文字不會被保留，因此無法在此列出。`;

  match = normalized.match(/^Focus recorded terminal\. (.+)$/);
  if (match) return `切換至錄製終端機。${match[1]}`;

  match = normalized.match(/^Mute (.+) · (.+) transcript$/);
  if (match) return `靜音 ${match[1]} · ${match[2]}逐字稿`;

  match = normalized.match(/^Unmute (.+) · (.+) transcript$/);
  if (match) return `取消靜音 ${match[1]} · ${match[2]}逐字稿`;

  match = normalized.match(/^(\d+) areas?$/);
  if (match) return `${match[1]} 個區域`;

  match = normalized.match(/^(\d+) images?$/);
  if (match) return `${match[1]} 張影像`;

  match = normalized.match(/^Mute (.+)\. Narration is transcribed in (.+)\.$/);
  if (match) return `將 ${match[1]} 靜音。語音旁白會以 ${match[2]} 轉錄。`;

  match = normalized.match(/^Retry microphone\. (.*)$/);
  if (match) return `重試麥克風。${match[1]}`;

  match = normalized.match(/^Unmute (.+) for (.+) narration$/);
  if (match) return `取消靜音 ${match[1]}，並使用 ${match[2]} 進行語音旁白`;

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
  return Boolean(parent.closest("code, pre, kbd, samp, textarea, input"));
}

function translateTextNode(node: Text): void {
  if (shouldSkip(node)) return;
  const current = node.data;
  if (!current.trim()) return;

  const known = originalText.get(node);
  const lastRendered = renderedText.get(node);
  let source = known;

  // React can reuse the same Text node and replace its English source content.
  // Treat a value different from our last rendered value as new application text.
  // During a language switch current === lastRendered, so the original English
  // source is preserved and switching zh-TW -> English works correctly.
  if (!source || (lastRendered !== undefined && current !== lastRendered)) {
    source = current;
    originalText.set(node, source);
  }

  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  const core = source.slice(leading.length, source.length - trailing.length);
  const translated = translateExact(core);
  const next = leading + translated + trailing;
  if (node.data !== next) node.data = next;
  renderedText.set(node, next);
}

function translateAttributes(el: Element): void {
  for (const attr of ["title", "aria-label", "placeholder"]) {
    const value = el.getAttribute(attr);
    if (!value) continue;
    const suffix = attr.replace("aria-", "aria");
    const sourceKey = `data-sr-original-${suffix}`;
    const renderedKey = `data-sr-rendered-${suffix}`;
    let source = el.getAttribute(sourceKey);
    const lastRendered = el.getAttribute(renderedKey);

    if (!source || (lastRendered !== null && value !== lastRendered)) {
      source = value;
      el.setAttribute(sourceKey, source);
    }

    const translated = translateExact(source);
    if (value !== translated) el.setAttribute(attr, translated);
    el.setAttribute(renderedKey, translated);
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
      } else if (mutation.type === "attributes" && mutation.target instanceof Element) {
        translateAttributes(mutation.target);
      }
      for (const node of mutation.addedNodes) translateSubtree(node);
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["title", "aria-label", "placeholder"],
  });
}

# 領域判斷待補清單 — 與領域專家討論用

> 目的：列出 gstack-game 每個 skill 需要的「領域判斷」設計，供與遊戲設計、營運、工程領域專家討論。
> 這些是 AI 無法自行決定的，需要人類專家的遊戲產業經驗來定義。
>
> 背景：gstack-game 的工程骨架（template engine、preamble、install）已完成。
> 缺的是每個 skill 內部的**審查框架、評分標準、逼問問題**——也就是「領域知識」。

---

## 方法論基礎：每個 Skill 需要定義的 6 件事

來自 gstack 審查方法論（見 `gstack-review-methodology.md`），每個 skill 都需要：

| # | 設計項目 | 說明 | gstack 範例 |
|---|---------|------|------------|
| 1 | **分類體系** | 這個 skill 審查的維度有哪些？ | /qa 分 8 類：Console, Links, Visual, Functional, UX, Performance, Content, Accessibility |
| 2 | **評分公式** | 每個維度的權重和扣分標準 | /qa Health Score = Σ(category_score × weight)，Console 15%, Functional 20%... |
| 3 | **行動分級** | AUTO（直接處理）/ ASK（問人）/ ESCALATE（停下來）的邊界 | /review: import 排序=AUTO, 邏輯判斷=ASK, 安全相關=ESCALATE |
| 4 | **逼問問題** | 防止 AI 空洞讚美的具體問題清單 | /office-hours 6 forcing questions: "誰在付錢？waitlist 不算" |
| 5 | **多維度 Pass** | Critical pass（必修）vs Informational pass（參考） | /review: Pass 1=SQL/Race/Security, Pass 2=Dead code/Performance |
| 6 | **完成狀態** | 什麼算 DONE？什麼算 BLOCKED？ | DONE=全部完成+證據, BLOCKED=3 次假設失敗 |

---

## Wave 1：核心工作流（最優先）

### 1. `/game-review` — GDD 設計審查

**現況：** 骨架完成，有 5 個 section 和部分審查要點。需要專家校準。

#### 待補：分類體系

目前有 5 section（Core Loop / Progression / Economy / Motivation / Risk），但缺少：
- [ ] **維度權重**：5 個 section 對整體設計品質的權重各是多少？不同類型遊戲（PvP、PvE、敘事、休閒）的權重是否不同？
- [ ] **嚴重度定義**：什麼是 Critical 級設計問題 vs Medium vs Low？需要具體範例
  - 例：「核心循環描述不出來」是 Critical 嗎？「缺少 D7 留存鉤子」是 High 還是 Medium？

#### 待補：評分公式

- [ ] **GDD Health Score 要不要做？** gstack 的 /qa 有 Health Score，但設計審查更主觀。需要決定：
  - 方案 A：像 /qa 一樣量化（每維度打分 + 加權）
  - 方案 B：像 /plan-ceo-review 一樣質性（無分數，純 scope 判斷）
  - 方案 C：混合（維度打分用於參考，但不做加權總分）
- [ ] 如果量化，每個維度的扣分規則是什麼？

#### 待補：行動分級

- [ ] 什麼設計問題 AI 可以直接標記修正建議（AUTO）？
- [ ] 什麼問題必須問設計師（ASK）？
- [ ] 什麼問題應該停下來升級（ESCALATE）？
- [ ] 建議的邊界：
  - AUTO：命名不一致、缺少明確 fail state 描述、數值缺漏
  - ASK：核心循環改動、新機制引入、留存策略選擇
  - ESCALATE：核心循環定義不清、目標受眾矛盾、商業模式與設計衝突

#### 待補：逼問問題（Anti-Sycophancy）

需要遊戲設計版的「不准說的話」和「必須問的問題」：

- [ ] **禁止清單**（AI 不准說的空洞讚美）：
  - 已有草案：❌ "This mechanic is really fun!" / ❌ "Players will love this" / ❌ "The art style is unique"
  - 需要補更多遊戲設計領域常見的空洞讚美
- [ ] **Forcing Questions**（強制逼問）：
  - 已有草案：「這個機制的樂趣在哪一秒出現？」「玩家第 100 次做這個動作時還有趣嗎？」
  - 需要對齊：這些問題是否足夠？順序對嗎？有沒有遺漏的關鍵角度？
  - 需要補：對不同遊戲類型（PvP/PvE/Social/Narrative）是否需要不同的逼問問題？

#### 待補：多維度 Pass 結構

- [ ] **Critical Pass**（必須處理）包含哪些？建議：
  - Core loop 完整性
  - Session fit（循環長度 vs 目標時長）
  - 留存鉤子是否存在
  - 付費模式 vs 設計是否衝突
- [ ] **Informational Pass**（值得知道）包含哪些？建議：
  - 玩家類型覆蓋度
  - 社交機制深度
  - 內容量 runway
  - 無障礙考量

#### 待補：跨遊戲類型適配

- [ ] 同一套審查框架能不能適用所有遊戲類型？還是需要 Mode Selection（像 gstack 的 /plan-ceo-review）？
  - Mode A：手遊/休閒 → 重 retention + economy
  - Mode B：主機/PC → 重 core loop depth + narrative
  - Mode C：多人競技 → 重 balance + matchmaking + anti-cheat
  - Mode D：敘事遊戲 → 重 pacing + branching + emotional arc
  - Mode E：桌遊/實體 → 重 rules clarity + component budget + session length

---

### 2. `/game-ideation` — 遊戲概念發想（從 /office-hours 遷移）

**現況：** 尚未開始。需要從 gstack 的 `/office-hours` 遷移，但核心的 forcing questions 必須完全重寫。

#### 待補：遊戲版 Forcing Questions

gstack `/office-hours` 有 6 個 Startup Mode 逼問（需求真實性、現狀替代、具體用戶...）。
遊戲領域需要全套重寫：

- [ ] **Fun Reality** — 你描述的樂趣，是你想像的還是你驗證過的？Prototype？Paper test？
- [ ] **Comp Analysis** — 最像的 3 個已上市遊戲是什麼？它們各缺什麼你能補？
- [ ] **Session Test** — 一局/一個 session 的體驗，你能在 30 秒內讓人理解嗎？
- [ ] **Repeatability** — 第 1 次玩和第 100 次玩，體驗差異在哪？如果沒差異，留存靠什麼？
- [ ] **Scope Honesty** — 你描述的完整版需要多少人月？最小可玩版本（vertical slice）需要多少？
- [ ] **Market Fit** — 你的目標玩家現在在玩什麼？他們為什麼會改玩你的？

以上 6 個是初步草案，需要專家校準：
- [ ] 問題數量對不對？太多/太少？
- [ ] 順序對嗎？應該先問什麼？
- [ ] 有沒有遊戲產業特有的「致命盲點」是這些問題沒覆蓋到的？
- [ ] 對不同階段的概念（白紙一張 vs 已有 prototype）需不需要不同的問題集？

#### 待補：Operating Posture（互動姿態）

gstack `/office-hours` 的姿態是 "Direct to point of discomfort, push once then push again"。
遊戲版需要定義：

- [ ] AI 在概念發想階段應該有多 aggressive？
  - 選項 A：像 YC partner 一樣直接拆解（適合有經驗的開發者）
  - 選項 B：像資深遊戲設計 mentor（適合獨立開發者/學生）
  - 選項 C：根據使用者回答的深度自動調整
- [ ] 概念「太大」的判斷標準是什麼？什麼時候該說「這是 ocean 不是 lake」？

#### 待補：概念發想的分類框架

gstack 的 `/office-hours` 在產品階段分類（idea / prototype / launched）。
遊戲版需要：

- [ ] **概念成熟度分級：**
  - Level 0：一句話 pitch（"像 X 但是 Y"）
  - Level 1：有書面概念（幾頁的 concept doc）
  - Level 2：有 paper prototype 或 greybox
  - Level 3：有 playable prototype
  - Level 4：有外部 playtester 回饋
- [ ] 每個 level 的審查深度和問題集是否不同？

---

### 3. `/game-direction` — 遊戲方向審查（從 /plan-ceo-review 遷移）

**現況：** 尚未開始。對標 gstack 的 `/plan-ceo-review`，但認知模式需要遊戲化。

#### 待補：遊戲版 Cognitive Patterns

gstack 有 15 個 CEO 認知模式（Classification instinct, Paranoid scanning...）。
遊戲製作人/創意總監的思維模式不同，需要重新設計：

- [ ] **Player-First Thinking** — 每個決策都問「這對玩家體驗有什麼影響？」
- [ ] **Scope Instinct** — 這個 feature 是 one-way door 還是 two-way door？加了容易，拿掉很難的要特別小心
- [ ] **Platform Awareness** — 這個設計在目標平台上操作起來如何？（觸控？手把？鍵鼠？）
- [ ] **Session Respect** — 玩家的時間有限，這個設計尊重他們的時間嗎？
- [ ] **Monetization Alignment** — 付費設計和遊戲樂趣是否方向一致？還是互相矛盾？
- [ ] **Live Ops Readiness** — 如果這是 live service game，這個設計支持長期營運嗎？
- [ ] **Community Impact** — 這會讓社群產生正面還是負面討論？
- [ ] **Content Velocity** — 維持這個設計需要多快的內容產出？團隊撐得住嗎？
- [ ] **Retention Architecture** — D1/D7/D30 各靠什麼機制？每一層都有覆蓋嗎？
- [ ] **Competitive Moat** — 抄襲成本高嗎？如果大廠三個月就能複製，你的防線是什麼？

以上 10 個是初步草案，需要專家校準：
- [ ] 數量對嗎？gstack 用 15 個，遊戲需要更多還是更少？
- [ ] 哪些適用所有遊戲，哪些只適用 live service / F2P？
- [ ] 有沒有遺漏關鍵的製作人思維？（例：IP 策略？跨平台？本地化？年齡分級？）

#### 待補：Nuclear Scope Challenge（前提挑戰）

gstack 的 /plan-ceo-review 第一步是「挑戰前提」。遊戲版需要：

- [ ] **前提挑戰問題：**
  - 這個遊戲解決什麼「玩家需求」？（社交？競爭？放鬆？成就感？逃避？）
  - 這個需求現在被滿足得多好？現有遊戲差在哪？
  - 如果不做這個遊戲，你的團隊/公司最應該做什麼？
- [ ] **Dream State Mapping 的遊戲版：**
  - CURRENT：現在市場上最接近的體驗
  - THIS GAME：你計劃提供的體驗
  - 12-MONTH IDEAL：一年後完整版的體驗
  - 差異在哪一步最大？那一步的風險是什麼？

#### 待補：Mode Selection

- [ ] 方向審查的模式選擇（對應 gstack 的 EXPANSION / HOLD / REDUCTION）：
  - AMBITIOUS：加大投入，擴大 scope
  - FOCUSED：鎖定 scope，打磨品質
  - PIVOT：方向不對，需要轉向
  - SHELVE：時機不對，先暫停

---

### 4. `/player-experience` — 玩家體驗走查

**現況：** 骨架完成，有基本 persona 和 journey map 格式。需要專家校準走查方法。

#### 待補：Persona 定義的深度

目前有 4 個 persona（casual newcomer / interested returner / dedicated / hardcore），但缺少：

- [ ] **每個 persona 的具體行為模式：**
  - 注意力持續時間（秒/分鐘）
  - 容忍挫折次數（失敗幾次就放棄）
  - 閱讀意願（會不會看教學文字）
  - 探索傾向（主動探索 vs 等指引）
  - 付費意願門檻
- [ ] **需不需要更多 persona？** 例如：
  - 直播主/內容創作者（找有趣畫面）
  - 親子玩家（跟小孩一起玩）
  - 回鍋玩家（半年沒玩回來）
  - 身心障礙玩家（需要無障礙支援）
- [ ] **persona 選擇是否影響走查路線？** 例如 hardcore 玩家會嘗試破壞系統，casual 只走主線

#### 待補：走查檢查點

- [ ] **關鍵時刻清單**（每個遊戲通用的檢查點）：
  - 0-10 秒：第一印象（loading / splash / title screen）
  - 10-30 秒：第一個互動（教學開始 or 直接操作？）
  - 30 秒 - 2 分鐘：第一個 aha moment
  - 2-5 分鐘：第一次失敗
  - 5-10 分鐘：第一個選擇/分歧
  - 10-15 分鐘：第一個 session 結束的自然點
  - 首次付費 prompt
  - 第二次開啟遊戲
  - 7 天後
- [ ] 以上哪些是 Critical 必查，哪些是 Informational？
- [ ] 不同遊戲類型是否有不同的關鍵時刻？

#### 待補：情緒標記系統

目前 journey map 有簡單的 Emotion 欄（Curious, Neutral, Engaged, Frustrated, Satisfied, Bored）。

- [ ] **情緒詞彙表是否足夠？** 是否需要更豐富的情緒分類？
  - 正面：Curious / Engaged / Delighted / Empowered / Proud / Connected
  - 中性：Neutral / Contemplative / Focused
  - 負面：Confused / Frustrated / Bored / Overwhelmed / Cheated / Lonely
- [ ] **情緒轉換是否有「健康模式」？** 例如：
  - 好的：Curious → Confused → Aha! → Empowered（學習曲線）
  - 壞的：Curious → Confused → Frustrated → Quit（挫折死亡螺旋）
  - 好的：Focused → Tense → Relief → Proud（挑戰解決）
  - 壞的：Focused → Tense → Tense → Tense → Exhausted（壓力過載）

#### 待補：走查輸出格式

- [ ] Player Journey Map 的格式是否需要調整？
- [ ] 是否需要產出「設計修改建議」還是只產出「觀察報告」？
- [ ] 是否需要和 `/game-review` 的輸出格式對齊，讓兩者可以交叉引用？

---

## Wave 2：工程工作流

### 5. `/game-eng-review` — 遊戲技術架構審查（從 /plan-eng-review 遷移）

#### 待補：遊戲技術維度

gstack 的 /plan-eng-review 有 9 個 prime directives。遊戲技術需要不同的維度：

- [ ] **維度清單草案：**
  - 引擎選型合理性
  - 渲染管線 / frame budget
  - 網路架構（如果多人）
  - 物理引擎 / 碰撞系統
  - 存檔 / 資料持久化
  - 資產管線（asset pipeline / build size）
  - 記憶體管理 / loading 策略
  - 平台適配（input / resolution / performance tier）
  - 測試策略（unit / integration / playtest automation）
- [ ] 以上維度的權重？哪些是 Critical？
- [ ] 不同平台（手遊 / PC / 主機 / Web）的維度差異？

### 6. `/game-code-review` — PR Code Review（從 /review 遷移）

#### 待補：遊戲程式碼的特殊審查點

- [ ] **Critical Pass（遊戲特有）：**
  - Frame budget violation（allocations in hot path?）
  - 狀態同步 / race condition（多人遊戲）
  - 序列化安全（存檔 / 網路封包）
  - 記憶體洩漏（asset loading/unloading cycle）
  - 輸入延遲（input → response 的 frame count）
- [ ] **Informational Pass：**
  - Magic numbers（未命名常數）
  - 組件耦合度
  - 測試覆蓋
- [ ] 不同引擎（Unity / Godot / Unreal / custom）的審查點差異？

### 7. `/game-ship` — 遊戲發布流程（從 /ship 遷移）

#### 待補：平台特定發布步驟

- [ ] **Steam 發布 checklist**
- [ ] **App Store 發布 checklist**（review guidelines 注意事項）
- [ ] **Google Play 發布 checklist**
- [ ] **Web 遊戲（itch.io / Newgrounds / 自建站）發布 checklist**
- [ ] **主機（Nintendo / PlayStation / Xbox）** — 是否在 scope 內？
- [ ] 各平台的 build → test → submit → approve 流程差異
- [ ] Changelog / Patch Notes 的格式（玩家看的 vs 內部的）

---

## Wave 3：品質與打磨

### 8. `/balance-review` — 數值平衡審查

**現況：** 骨架完成，有 4 個 section。需要專家定義具體的數值框架。

#### 待補：數值模型框架

- [ ] **難度曲線的「健康」定義：**
  - Flow state 的量化指標是什麼？（challenge/skill ratio?）
  - 「難度跳躍」(spike) 的可接受幅度？
  - 不同遊戲類型的難度曲線 reference（Soulslike vs 休閒 vs 策略）
- [ ] **經濟系統的健康指標：**
  - Sink/Faucet 比率的健康範圍？
  - 通膨速度的警戒線？
  - 免費玩家 vs 付費玩家的體驗差距可接受範圍？
- [ ] **進度節奏的 benchmark：**
  - 不同類型遊戲「每小時有意義解鎖數」的參考值？
  - Content runway 的計算方式？
- [ ] **是否需要數學模型 / 試算表模板？** 還是純質性審查？

### 9. `/game-qa` — QA 測試（從 /qa 遷移）

#### 待補：遊戲 QA 的分類體系

gstack 的 /qa 分 8 類。遊戲 QA 分類不同：

- [ ] **分類草案：**
  - Functional（功能正確性）
  - Visual（畫面、動畫、特效）
  - Performance（FPS、loading time、memory）
  - Audio（音效觸發、音量平衡、音樂切換）
  - Input（控制器支援、按鍵回應、觸控手感）
  - Compatibility（裝置相容、解析度、OS 版本）
  - Localization（翻譯、文字溢出、文化適配）
  - Progression（存檔、進度、成就）
- [ ] 每個分類的權重？
- [ ] 這個分類是否涵蓋所有遊戲類型？

### 10. `/game-ux-review` — UI/UX 審查（從 /plan-design-review 遷移）

#### 待補：遊戲 UI 的特殊維度

- [ ] HUD 可讀性（戰鬥中能不能快速讀取資訊）
- [ ] 選單層級深度（幾層選單就太深？）
- [ ] 商店介面的心理壓力（付費誘導是否過度）
- [ ] 新手引導 UI（tooltip / 箭頭 / 強制教學的取捨）
- [ ] 控制器 / 觸控 / 鍵鼠 三套操作的 UI 適配
- [ ] 字體大小 / 色對比 / 色盲支援

### 11. `/pitch-review` — 企劃提案審查

**現況：** 骨架完成，有 4 個 section。

#### 待補：商業判斷標準

- [ ] **市場規模**：不同類型遊戲的 TAM/SAM/SOM 參考值？
- [ ] **LTV/CPI benchmark**：各平台各類型的可接受範圍？
- [ ] **團隊評估維度**：什麼樣的團隊配置對什麼樣的遊戲是必要的？
- [ ] **Forcing Questions 的商業版**（對應 /office-hours 的 6 問）

---

## Wave 4：專業化

### 12-19. 其他 Skills

以下 skill 的領域判斷設計暫時留空，等 Wave 1-3 完成後再展開。
列在這裡是為了完整性和優先級追蹤。

| Skill | 主要缺的領域判斷 | 需要什麼專家 |
|-------|-----------------|-------------|
| `/asset-review` | 美術風格一致性標準、效能預算、素材規格 | 美術總監 / TA |
| `/playtest` | 測試協議設計、觀察指標、招募標準 | UX 研究員 / QA lead |
| `/game-visual-qa` | 視覺品質標準、動畫流暢度標準 | 美術 / QA |
| `/game-debug` | 遊戲常見 bug 模式、效能瓶頸模式 | 遊戲程式 senior |
| `/game-retro` | milestone tracking 指標、feature completion 標準 | 製作人 / PM |
| `/game-docs` | patch notes 格式、玩家溝通語氣 | 社群管理 / PM |
| `/game-codex` | 遊戲特有的對抗性審查角度 | senior 全棧 |
| `/careful` + `/guard` | 直接沿用 gstack，不需遊戲領域判斷 | — |

---

## 橫切主題：所有 Skill 共用的待定項目

### A. 共用詞彙表

preamble 已有一份遊戲詞彙（core loop, FTUE, sink/faucet...），需要確認：
- [ ] 是否完整？有沒有遺漏的常用遊戲設計術語？
- [ ] 中英對照是否統一？（例：核心循環/Core Loop 是否在所有 skill 一致使用？）
- [ ] 不同子領域（程式/美術/企劃/營運）的術語有沒有衝突？

### B. 反諂媚共用禁止清單

需要一份所有 skill 共用的「遊戲設計空洞讚美」禁止清單：
- [ ] 草案：
  - ❌ "This mechanic is really fun!"
  - ❌ "Players will love this"
  - ❌ "The art style is unique"
  - ❌ "This will go viral"
  - ❌ "The game feel is great"
  - ❌ "This is very innovative"
- [ ] 對應的「校準讚美」範例（可以這樣說）：
  - ✅ "The 0.1s input-to-feedback loop in the jump mechanic creates a responsive feel — comparable to Celeste's design."
  - ✅ "The resource scarcity in early game creates meaningful choices — players must commit to a build path by level 3."
- [ ] 需要更多範例，特別是美術、音效、敘事方面的

### C. 遊戲類型適配策略

多個 skill 都面臨「不同遊戲類型需要不同審查重點」的問題：
- [ ] 需不需要一個共用的「遊戲類型分類器」？
  - 在 skill 開始時先問遊戲類型，然後調整後續審查重點
  - 或者在 Step 0 / preamble 層級處理
- [ ] 遊戲類型分類建議：
  - 按玩法：Action / Strategy / RPG / Puzzle / Simulation / Narrative / Social
  - 按營運：Premium / F2P / Ad-supported / Subscription / Live Service
  - 按平台：Mobile / PC / Console / Web / Tabletop / VR
- [ ] 這個分類如何影響每個 skill 的審查深度和重點？

### D. Skill 之間的串接（Chaining）

- [ ] `/game-ideation` 產出什麼文件？什麼格式？
- [ ] `/game-review` 讀取什麼文件？格式期待是什麼？
- [ ] `/player-experience` 的 journey map 怎麼被 `/balance-review` 消費？
- [ ] 各 skill 的 Completion Protocol 輸出格式要統一嗎？

---

## 討論建議

### 找誰討論哪些部分

| 專家角色 | 討論哪些 Skill | 核心問題 |
|----------|---------------|---------|
| **遊戲設計師** | game-review, game-ideation, player-experience | 分類體系、逼問問題、情緒模型 |
| **遊戲製作人** | game-direction, pitch-review, game-retro | 認知模式、商業判斷、方向評估 |
| **數值策劃** | balance-review | 難度曲線、經濟模型、公式設計 |
| **遊戲程式** | game-eng-review, game-code-review, game-debug | 技術維度、frame budget、審查重點 |
| **QA Lead** | game-qa, playtest | 測試分類、嚴重度定義、測試協議 |
| **美術總監 / TA** | asset-review, game-visual-qa, game-ux-review | 視覺標準、效能預算、UI 維度 |
| **社群管理 / PM** | game-ship, game-docs | 發布流程、patch notes、玩家溝通 |

### 討論時的優先問題

每個 skill 最重要的一個問題：

1. `/game-review`：**GDD 審查應該量化打分還是質性判斷？**
2. `/game-ideation`：**6 個 forcing questions 對不對？有沒有遺漏的致命盲點？**
3. `/game-direction`：**遊戲製作人的核心思維模式有哪些？我列的 10 個夠嗎？**
4. `/player-experience`：**4 個 persona 夠嗎？走查的關鍵時刻清單完整嗎？**
5. `/balance-review`：**需要數學模型還是純質性審查？**
6. `/pitch-review`：**LTV/CPI 的 benchmark 數字哪裡找？**

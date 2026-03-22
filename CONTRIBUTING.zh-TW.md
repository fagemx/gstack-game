# 貢獻指南

[English](CONTRIBUTING.md)

gstack-game 需要的是**領域專家**，不只是程式設計師。

工程骨架（template engine、preamble injection、評分框架）已經穩固。缺的是**遊戲產業經驗**——那些只有真正做過遊戲的人才知道的評分權重、benchmark 數字、逼問問題和審查標準。

如果你做過遊戲、設計過經濟系統、帶過 QA 團隊、或做過美術管理——你的知識正是這個專案需要的。

---

## 怎麼貢獻

### 1. 找到符合你專長的 skill

| 你的背景 | 可以改善的 Skill | 需要什麼 |
|----------|-----------------|---------|
| **遊戲設計師**（5 年以上） | `/game-review`, `/game-ideation`, `/player-experience` | 評分權重、逼問問題、審查標準 |
| **遊戲製作人 / 創意總監** | `/game-direction`, `/game-retro` | 認知模式、scope 決策、milestone 標準 |
| **數值 / 系統策劃** | `/balance-review` | 難度曲線 benchmark、Sink/Faucet 比率、保底門檻 |
| **遊戲程式**（Unity/Godot/Unreal） | `/game-code-review`, `/game-eng-review`, `/game-debug` | 引擎特定審查點、frame budget 模式、常見陷阱 |
| **UX 研究員 / UI 設計師** | `/game-ux-review`, `/player-experience`, `/playtest` | Persona 參數、可用性 benchmark、測試協議 |
| **QA 主管** | `/game-qa`, `/game-visual-qa` | Bug 嚴重度定義、分類權重、平台特定 checklist |
| **技術美術** | `/asset-review`, `/game-visual-qa` | 效能預算、命名規範、風格一致性標準 |
| **專案管理 / PM** | `/game-ship`, `/game-docs` | 平台 submission checklist、patch notes 寫法 |
| **行銷 / 發行** | `/pitch-review` | LTV/CPI benchmark、市場數據、UA 策略 |

### 2. 讀現有的 skill

每個 skill 在 `skills/<name>/SKILL.md.tmpl`。先讀懂現有結構。

### 3. 改善領域內容

編輯 `.tmpl` 檔案（不要直接改 `SKILL.md`——它是自動生成的）。

**「改善」的意思：**

| 改善類型 | 範例 |
|---------|------|
| **校準評分權重** | 「手遊 F2P 的 Core Loop 應該是 30% 不是 25%——loop 就是整個遊戲」 |
| **加逼問問題** | 「缺少：『兩個玩家同時 exploit 這個機制會發生什麼？』」 |
| **修正錯誤 benchmark** | 「D1 留存 40% 是 premium 的好成績，F2P hyper-casual 應該 50%+」 |
| **加遊戲類型變體** | 「這個 section 假設 F2P 手遊，要加 premium PC 的模式」 |
| **加引擎特定檢查** | 「Unity：檢查 Update 裡的 FindObjectOfType——每幀 O(n) 掃描」 |
| **改善反諂媚** | 「加入禁止清單：『操控感很好』——沒指出輸入延遲毫秒數就是空話」 |

### 4. Build 和測試

```bash
bun run build    # 從你改的 .tmpl 重新生成 SKILL.md
bun test         # 確認沒壞（11 個驗證測試）
```

### 5. 提 PR

- 標題：`improve(skill-name): 改了什麼`
- 內文：解釋**為什麼**——引用你的經驗、做過的遊戲、產業數據
- 標注專業：`[遊戲設計師, 8 年, 出過 3 款 F2P 手遊]`

---

## 現在最需要專家協助的地方

### 關鍵（skill 能用但評分可能不對）

**`/game-review` — GDD Health Score 權重**
- 現在：Core Loop 25% | Progression 20% | Economy 20% | Motivation 15% | Risk 10% | Cross-check 10%
- 問題：不同遊戲類型要不要不同權重？手遊 F2P vs 主機買斷 vs 競技 PvP？
- 需要：審過 10+ 份 GDD 的遊戲設計師

**`/balance-review` — 經濟健康度門檻**
- 現在：Faucet/Sink 比率 0.9-1.1 = 健康，Gini < 0.3（合作），< 0.5（競技）
- 問題：放置類遊戲的通膨是設計不是 bug，這些數字怎麼調？
- 需要：調過 live 遊戲經濟的數值策劃

**`/game-code-review` — Frame budget 門檻**
- 現在：60 FPS = 16.6ms，通用的記憶體分配警告
- 問題：每個引擎的 hot path 模式不同。Unity GC 陷阱？Godot GDScript 瓶頸？Unreal 的坑？
- 需要：有 profiling 經驗的資深遊戲程式

### 重要（結構好，內容需要加深）

**`/player-experience` — Persona 行為參數**
- 「Casual 玩家失敗 2 次就離開」——這是真的嗎？有 playtest 數據佐證嗎？
- 需要：有觀察數據的 UX 研究員

**`/game-ideation` — 逼問問題**
- 現在有 6 個問題。有沒有致命盲點是這 6 題沒抓到的？
- 需要：greenlight 過/砍過專案的遊戲總監

**`/game-direction` — 製作人認知模式**
- 現在有 10 個。缺 IP 策略？本地化？年齡分級？Live ops 經濟？
- 需要：出過 3+ 款遊戲的製作人

**`/pitch-review` — 市場 benchmark**
- LTV/CPI 數字幾個月就過時。需要的是找到當前數據的框架，不是數字本身。
- 需要：有 Sensor Tower / AppMagic 使用經驗的發行或行銷

### Skeleton skill（需要大量內容）

| Skill | 品質 | 缺什麼 |
|-------|------|--------|
| `/asset-review`（35%） | 只有命名和預算結構 | 風格一致性標準、引擎 import 設定、texture/mesh 品質 benchmark |
| `/game-visual-qa`（35%） | 基本 checklist | 視覺品質量化門檻、動畫 timing 標準 |
| `/playtest`（40%） | 協議結構 | 驗證過的觀察指標、訪談題庫、統計顯著性指引 |
| `/game-debug`（40%） | 3-strike 結構 | 遊戲特定 bug 模式庫（物理穿透、desync、存檔損壞） |
| `/game-retro`（40%） | 指標結構 | 健康 velocity 範圍、bug 密度 benchmark |
| `/game-codex`（40%） | 對抗性框架 | 遊戲 exploit 分類、作弊向量目錄、經濟濫用模式 |
| `/game-docs`（40%） | Patch notes 格式 | 玩家溝通最佳實踐、平衡調整說明模板 |

---

## 跨 Skill 改善（影響多個 skill）

### 遊戲類型適配

大多數 skill 假設一體適用。現實不是：

| 遊戲類型 | 哪些不同 |
|---------|---------|
| **F2P 手遊** | 經濟 + 付費壓力最關鍵，session = 3 分鐘 |
| **買斷 PC/主機** | 經濟 section 可選，核心循環深度 + 敘事更重要 |
| **競技 PvP** | 平衡 section 是一切，需要配對 + 反作弊 |
| **敘事遊戲** | 節奏 + 分支 + 情感弧線，進度 = 故事進度 |
| **桌遊** | 實體元件預算、規則清晰度、場次時長、不需要 code review |
| **VR** | 舒適度評級、暈眩防止、互動範式 |

**如果你深入了解某一類型，幫我們加上正確的模式選擇。**

### 反諂媚擴充

每個 skill 都有「禁止用語」清單。我們需要更多領域特定的例子。

**如果你注意到 AI 在你的領域會給出什麼空洞讚美，加到禁止清單裡。**

---

## 開發設定

```bash
git clone https://github.com/fagemx/gstack-game.git
cd gstack-game
bun run build
bun test
```

改 `.tmpl` 檔案，不改 `.md` 檔案。改完跑 `bun run build`。

## 有問題？

開 issue。標注 skill 名稱和你的專業領域。

# 來源品質評估 — 以 gstack 為基準

> 目的：評估三個可用來源的品質，決定 gstack-game 從哪裡取用什麼。
> 基準線：gstack（garrytan/gstack）的工程品質和審查方法論。
> 評估日期：2026-03-22

---

## 基準線：gstack（10/10）

gstack 是 meta-skill system，品質體現在：

1. **可編譯 Prompt** — SKILL.md.tmpl → gen-skill-docs.ts → SKILL.md，文件不 drift
2. **量化評分公式** — QA Health Score 8 維加權、Design Score A-F，公式寫死 AI 只辨識事實
3. **行動三級制** — AUTO/ASK/ESCALATE 邊界明確寫在 prompt 裡
4. **四段式提問** — Re-ground / Simplify / Recommend / Options，每個 AskUserQuestion 一致
5. **反諂媚工程化** — 禁止清單 + 逼問結構 + 推回節奏
6. **Completion Protocol** — DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
7. **Preamble Injection** — 一處修改，25 個 skill 同步
8. **Diff-Aware Behavior** — 審查深度 ∝ 變更範圍

**gstack 缺什麼：** 零遊戲領域知識。純 web/SaaS 語境。

---

## 來源 A：Claude-Code-Game-Studios（總評 7/10）

> 路徑：C:\game-dev\Claude-Code-Game-Studios
> 版本：v0.3.0（2026-03-09）
> 規模：48 agents / 37 skills / 8 hooks / 11 path-scoped rules / 29 templates

### 強項（可挖寶藏）

#### 遊戲設計理論框架（品質高，可直接引用）

| 框架 | 內容 | 品質 | 用於哪個 skill |
|------|------|------|---------------|
| **MDA Framework** | Aesthetics → Dynamics → Mechanics，8 種 aesthetic | ⭐⭐⭐⭐⭐ | /game-review, /game-ideation |
| **SDT（自我決定理論）** | Autonomy / Competence / Relatedness 三軸檢查 | ⭐⭐⭐⭐⭐ | /game-review, /player-experience |
| **Flow State Design** | Challenge-skill 通道、鋸齒難度曲線、0.5s 微回饋 | ⭐⭐⭐⭐ | /balance-review, /player-experience |
| **Nested Loop Model** | 30s micro / 5min meso / session macro / long-term progression | ⭐⭐⭐⭐⭐ | /game-review (Core Loop section) |
| **Pillar Methodology** | 3-5 pillars, falsifiable, 有 design test, 有 AAA 範例 | ⭐⭐⭐⭐⭐ | /game-direction, /game-ideation |
| **Bartle + Quantic Foundry** | 4 type + 6 motivation，每系統服務多類型 | ⭐⭐⭐⭐ | /game-review (Motivation section) |

#### 經濟系統設計（品質高）

| 內容 | 細節 | 用於 |
|------|------|------|
| Sink/Faucet 建模 | 資源流入/流出映射，長期穩定性 | /balance-review |
| Gini 係數目標 | 財富分配健康度量化 | /balance-review |
| Loot table 設計 | 掉落率、稀有度分佈、pity timer、保底機制 | /balance-review |
| 獎勵心理學 | Variable ratio / fixed interval 等排程理論 | /balance-review |
| 經濟健康指標 | 每小時金幣產出、物品獲取率、資源囤積分佈 | /balance-review |

#### Design Doc Standard（可直接採用）

8 section 必備：
1. Overview（一段摘要）
2. Player Fantasy（目標感受）
3. Detailed Rules（明確機制）
4. Formulas（數學公式+變數定義+範圍+範例）
5. Edge Cases（異常情況）
6. Dependencies（系統依賴）
7. Tuning Knobs（可調參數）
8. Acceptance Criteria（可測試的成功條件）

#### 其他可用素材

| 素材 | 品質 | 用途 |
|------|------|------|
| Path-scoped rules（11 個） | ⭐⭐⭐⭐ | /gameplay-implementation-review 的審查維度參考 |
| Team orchestration skills | ⭐⭐⭐⭐ | 多 agent 並行模式參考 |
| Scope Cut Prioritization | ⭐⭐⭐⭐ | /game-direction 的 scope 決策框架 |
| Creative Director Decision Framework | ⭐⭐⭐⭐ | /game-direction 的認知模式參考 |
| Collaborative Design Principle | ⭐⭐⭐⭐⭐ | 互動模式文件化範例（23KB） |
| Session state recovery | ⭐⭐⭐⭐ | 長 session 的上下文管理 |

### 弱項（不該照搬的）

| 缺陷 | 與 gstack 的差距 | 影響 |
|------|-----------------|------|
| **無量化評分** | gstack 用公式打分；GS 只有 checklist | 審查結果無法跨次比較 |
| **無 AUTO/ASK/ESCALATE** | 所有互動都問使用者 | 機械性修正佔用使用者時間 |
| **無 template engine** | 48 agent prompt 手寫維護 | 共用行為改動要改 48 個檔案 |
| **無反諂媚機制** | 說 "defer to user" 但沒禁止清單 | AI 可能空洞讚美 |
| **無 Completion Protocol** | skill 結束沒有狀態碼 | 下游 skill 不知道上游結果 |
| **無 Diff-Aware** | 不根據變更範圍調整深度 | 小改動也做全套審查 |
| **無 preamble injection** | 共用行為 copy-paste | 維護成本隨 skill 數增長 |

### 結論

> **Game Studios 是遊戲設計理論的寶庫，但不是工程架構的參考。**
> 取其理論框架和領域知識，套進 gstack 的工程骨架裡。

---

## 來源 B：Guardian 遊戲 Pipeline（總評 6/10）

> 路徑：C:\ai_project\guardian
> 性質：TypeScript agent pipeline + 遊戲設計方法論文件
> 範圍：概念驗證階段（idea → validation → pitch）

### 強項（可挖寶藏）

#### PlayerSimulatorAgent（品質高，可直接遷移 prompt）

| 特點 | 細節 | 品質 |
|------|------|------|
| Player type taxonomy | casual_mobile / dedicated_gamer / hardcore × 4 context | ⭐⭐⭐⭐ |
| Timeline format | 分鐘級走查 + 情緒標注 + hook 判定 | ⭐⭐⭐⭐ |
| Repeat play simulation | 第 1 次 vs 第 3 次 vs 第 10 次 | ⭐⭐⭐⭐⭐ |
| 「不打分只描述」原則 | 分離觀察和評價 | ⭐⭐⭐⭐ |

→ 直接參考用於 `/player-experience` 的 persona 和走查格式

#### 遊戲開發點子冰山架構（品質極高）

| 層級 | 內容 | 品質 |
|------|------|------|
| 5-layer validation | Context → Skill → Market → External → Intuition | ⭐⭐⭐⭐⭐ |
| Work-back exercise | 從銷售數據反推到 pitch test 的確定性遞減 | ⭐⭐⭐⭐⭐ |
| "The Gap" 測量 | 如何偵測真正興趣 vs 禮貌性正面回饋 | ⭐⭐⭐⭐⭐ |
| Developer's Toolbox | 每個階段對應什麼驗證工具 | ⭐⭐⭐⭐ |
| 行為觀察原則 | 「不要聽他們說什麼，看他們玩多久」 | ⭐⭐⭐⭐⭐ |

→ 直接參考用於 `/game-ideation` 的驗證框架和逼問問題

#### Pitch Deck 驗證結構

| 元素 | 細節 | 品質 |
|------|------|------|
| 9-slide 結構 | Hook → Problem → Action → Reveal → Connection → Diff → Vision → Social → Ask | ⭐⭐⭐⭐ |
| 投票閾值 | >20% "Day 1 Purchase" = 值得做 | ⭐⭐⭐⭐ |
| 樣本要求 | 50+ respondents minimum | ⭐⭐⭐⭐ |
| 7 audience segments | 每群有獨立 hook 和定位 | ⭐⭐⭐⭐ |

→ 直接參考用於 `/pitch-review` 的市場驗證框架

#### 案例價值：神靈小屋（Guardian's Hut）

| 文件 | 用途 | 品質 |
|------|------|------|
| game-design-core.md | 完整 GDD 範例（4 能力 + 感官設計 + 情感機制） | ⭐⭐⭐⭐⭐ |
| validation-pitch-deck.md | Pitch deck 範例 | ⭐⭐⭐⭐ |
| marketing-pitch.md | 7 群受眾定位範例 | ⭐⭐⭐⭐ |
| project-evaluation-2025-12-23.md | 技術風險評估範例（B+ rating） | ⭐⭐⭐⭐ |

→ 可作為 skill 內的「好範例」參考，但不直接搬入 prompt

#### Fantasy/Loop/Twist 框架

概念結構化三要素：
- **Fantasy**：玩家想成為什麼、感受什麼（情感目標）
- **Loop**：重複做什麼動作（動詞，不是名詞）
- **Twist**：和競品的機制差異在哪

→ 可用於 `/game-ideation` 的概念結構化步驟

### 弱項（不該照搬的）

| 缺陷 | 與 gstack 的差距 | 影響 |
|------|-----------------|------|
| **只覆蓋概念到驗證** | 沒有 code review / QA / ship / retro | 不是完整 pipeline |
| **TypeScript agent，不是 Claude Code skill** | 不能 `/slash-command` 呼叫 | 需要重寫成 SKILL.md.tmpl |
| **無結構化提問** | agent 自由對話 | 提問品質不穩定 |
| **無量化評分** | PlayerSim 刻意「不打分」 | 觀察和判斷混在一起 |
| **無工程基礎設施** | 無 preamble / template / config | 每個 agent 獨立維護 |
| **無 Completion Protocol** | 無狀態碼 | 無法串接下游 |

### 結論

> **Guardian 是概念驗證階段的深度參考，但範圍太窄。**
> 取其 PlayerSimulator prompt、冰山驗證框架、案例文件，
> 套進 gstack 的結構和方法論裡。

---

## 綜合比較矩陣

| 維度 | gstack | Game Studios | Guardian | gstack-game 策略 |
|------|--------|-------------|---------|-----------------|
| **工程架構** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | 用 gstack |
| **審查方法論** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | 用 gstack |
| **遊戲設計理論** | — | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 用 Game Studios |
| **經濟/數值框架** | — | ⭐⭐⭐⭐⭐ | ⭐⭐ | 用 Game Studios |
| **玩家模擬** | — | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 用 Guardian |
| **概念驗證方法** | — | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 用 Guardian |
| **Pipeline 完整度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | gstack 結構 + GS 補充 |
| **案例/範例** | — | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 用 Guardian |
| **Prompt 可維護性** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | 用 gstack |

---

## 取用策略：每個 Skill 從哪裡取什麼

### Wave 1

| Skill | gstack 取 | Game Studios 取 | Guardian 取 |
|-------|----------|----------------|-------------|
| `/game-review` | 審查結構（6原理）、Completion Protocol | MDA/SDT/Flow 理論框架、8-section Doc Standard、Nested Loop Model | — |
| `/game-ideation` | /office-hours 的互動結構、逼問機制 | Brainstorm 的 Verb-First/Mashup/Experience-First 技法、Pillar methodology | 冰山驗證框架、Fantasy/Loop/Twist、Pitch Deck 結構 |
| `/game-direction` | /plan-ceo-review 的 Nuclear Scope Challenge、Mode Selection | Creative Director Decision Framework、Scope Cut Prioritization | — |
| `/player-experience` | 四段式提問、Completion Protocol | SDT 三軸檢查 | PlayerSimulatorAgent prompt、player type taxonomy、timeline 格式、repeat play |

### Wave 2

| Skill | gstack 取 | Game Studios 取 | Guardian 取 |
|-------|----------|----------------|-------------|
| `/game-eng-review` | /plan-eng-review 結構 | Path-scoped rules（gameplay/engine/ai/network） | — |
| `/gameplay-implementation-review` | /review 的 Two-Pass + AUTO/ASK/ESCALATE | Frame budget / allocation / serialization 審查點 | — |
| `/game-ship` | /ship 的完整流程 | Release checklist template | — |

### Wave 3

| Skill | gstack 取 | Game Studios 取 | Guardian 取 |
|-------|----------|----------------|-------------|
| `/balance-review` | 量化公式結構 | Economy Designer 全套（Sink/Faucet、Gini、pity、reward psychology） | — |
| `/game-qa` | /qa 的 Health Score 公式結構 | — | — |
| `/game-ux-review` | /plan-design-review 結構 | UX Designer agent 的維度 | — |
| `/pitch-review` | 逼問機制 | Business Case 維度 | Pitch Deck 驗證結構、投票閾值、7 audience segments |

---

## 關鍵檔案索引（需要讀取的參考來源）

### Game Studios — 理論參考

```
C:\game-dev\Claude-Code-Game-Studios\
├── .claude\agents\game-designer.md         ← MDA/SDT/Flow/Bartle 理論 + Design Doc Standard
├── .claude\agents\creative-director.md     ← Decision Framework + Pillar methodology
├── .claude\agents\economy-designer.md      ← Sink/Faucet + Gini + pity + reward psychology
├── .claude\agents\systems-designer.md      ← Systems dynamics + feedback loops
├── .claude\skills\brainstorm.md            ← Concept generation techniques
├── .claude\skills\design-review.md         ← 8-point review checklist
├── .claude\skills\balance-check.md         ← Balance review methodology
├── .claude\rules\gameplay-code.md          ← Gameplay code standards
├── .claude\rules\engine-code.md            ← Engine code standards
├── .claude\docs\templates\                 ← 29 document templates
└── docs\COLLABORATIVE-DESIGN-PRINCIPLE.md  ← 互動模式文件化（23KB）
```

### Guardian — 案例與 Prompt 參考

```
C:\ai_project\guardian\
├── src\prompts\player-simulator.ts         ← Player type taxonomy + timeline format
├── src\agents\player-simulator.ts          ← Full agent implementation
├── src\agents\modifier.ts                  ← Multi-version ideation workflow
├── src\prompts\sage.ts                     ← Synthesis prompt + JSON format
├── docs\遊戲開發點子冰山架構.md              ← 5-layer validation（產業級）
├── docs\idea\game-design-core.md           ← 完整 GDD 範例（神靈小屋）
├── docs\idea\validation-pitch-deck.md      ← Pitch deck 驗證結構
├── docs\idea\marketing-pitch.md            ← 7 audience segments
└── docs\tech\project-evaluation-2025-12-23.md ← 技術風險評估範例
```

### gstack — 工程與方法論參考

```
C:\ai_project\gstack\                      ← 原始 gstack repo
C:\ai_project\guardian\docs\tech\
├── gstack-skill-design-patterns.md         ← 7 個結構層模式
├── gstack-review-methodology.md            ← 6 個審查方法論原理
└── gstack-advanced-patterns.md             ← 10 個系統運作層模式
```

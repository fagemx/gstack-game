# gstack 系統級優勢 — 不在單個 Skill，在 Skills 之間

> Analysis date: 2026-03-22
> 問題：兩份 skill writing 分析（patterns.md + doctrine-nox.md）都聚焦「怎麼寫好一個 skill」，
> 但 gstack 真正好用的原因是系統層的東西——individual skill quality 只是其中一部分。
> 本文件補上那些分析沒抓到的部分。

---

## 為什麼 gstack 比 guardian pipeline 好用？

用戶的原話（feedback memory）：
> gstack 的互動式審查流程（AskUserQuestion 一個個問、推薦選項、completeness 評分、decision log）
> 比 guardian 的自動化 8-agent pipeline 好用得多。

根本差異不在 skill 內容，在**交互模型**：

| | Guardian Pipeline | gstack |
|---|---|---|
| 執行模式 | 自動跑完全部 agent → 一次吐結果 | 每個 issue 問你 → 等你決定 → 再往下 |
| 用戶角色 | 旁觀者（看結果） | 決策者（每步都參與） |
| 方向修正 | 跑完才能改 | 每步都能改 |
| 決策紀錄 | 沒有 | Decision log + dashboard |
| 結果信任度 | 低（不知道過程） | 高（每步都看到推理） |

---

## 7 個系統級優勢

### 1. 結構化的工作流鏈

```
/office-hours → /plan-ceo-review → /plan-eng-review → 實作 → /review → /ship
  問題定義         產品策略審查          工程架構審查      寫 code    PR review    上線
```

這不是各自獨立的 skills，而是一條**有順序、有交接、有門檻的 pipeline**。

關鍵特性：
- 每一步產出的 artifact 是下一步的 input
- 下游 skill 開頭自動搜尋上游 artifact（不靠用戶手動傳遞）
- 有些步驟是 required（eng review），有些是 optional（CEO review, design review）
- /ship 整合所有 review 結果做 ship-readiness 判斷

**gstack-game 需要遷移的：** 建立遊戲版的工作流鏈：
```
/game-ideation → /game-direction → /game-review → /game-eng-review → 實作 → /game-code-review → /game-ship
```
每個 skill 的開頭要有「找上游 artifact」的邏輯。

---

### 2. 一個問題一個問題的互動模式

gstack 所有 review skills 共用一個硬規則：
> **一個 issue = 一個 AskUserQuestion。絕不批量。**

這不是 skill 寫法的偏好，是整套交互哲學：
- 用戶永遠只需要做一個決定
- 每個決定都有推薦和理由
- 決定完了才問下一個
- 如果用戶不回答，記錄為「unresolved」，不 silently default

**為什麼這很重要：** 批量問題會讓用戶「大概掃一下就全部 approve」。一個個問才會真的思考每個決定。

**gstack-game 現況：** 已經有這個模式（STOP. One issue per AskUserQuestion.），繼續保持。

---

### 3. 統一的 AskUserQuestion 四段式

所有 gstack skill 共用同一套問答格式：

```
1. Re-ground   — 你在哪個專案、哪個 branch、做什麼（假設用戶離開 20 分鐘回來）
2. Simplify    — 用 16 歲聽得懂的語言解釋問題
3. Recommend   — 「RECOMMENDATION: 選 X 因為 Y」+ Completeness: X/10
4. Options     — A) ... B) ... C) ... 每個帶 (human: ~X / CC: ~Y)
```

不管跑哪個 skill，互動體驗都一致。用戶不需要重新適應每個 skill 的問答方式。

**gstack-game 現況：** preamble.md 裡有定義遊戲版的 AskUserQuestion 格式（用 Player Impact: X/10 取代 Completeness: X/10）。保持並確保所有 skill 遵守。

---

### 4. Review Readiness Dashboard

```
+====================================================================+
|                    REVIEW READINESS DASHBOARD                       |
+====================================================================+
| Review          | Runs | Last Run            | Status    | Required |
|-----------------|------|---------------------|-----------|----------|
| Eng Review      |  1   | 2026-03-22 08:02    | CLEAR     | YES      |
| CEO Review      |  1   | 2026-03-21          | CLEAR     | no       |
| Design Review   |  0   | —                   | —         | no       |
| Codex Review    |  1   | 2026-03-22 (inline) | 18 issues | no       |
+--------------------------------------------------------------------+
| VERDICT: CLEARED — Eng Review passed (0 unresolved, 0 critical)    |
+====================================================================+
```

跨 skill 的狀態追蹤。不是每個 skill 各自結束就算了，而是有一個全局 dashboard。

功能：
- 顯示每種 review 的最新狀態
- Staleness detection（review 之後有新 commit → 可能 stale）
- Verdict logic（哪些 review 是 required，是否都通過）
- /ship 讀這個 dashboard 決定能不能 ship

**gstack-game 需要遷移的：** 建立遊戲版 dashboard：
```
| Review             | Status  | Required |
|--------------------|---------|----------|
| Game Design Review | CLEAR   | YES      |
| Balance Review     | —       | no       |
| Player Experience  | —       | no       |
| Eng Review         | CLEAR   | YES      |
| Pitch Review       | —       | no       |
```

---

### 5. Completeness Principle（Boil the Lake）

不只是口號——系統性地嵌入每個決策點：

- 每個 AskUserQuestion 的每個選項都帶 `Completeness: X/10`
- 每個選項都有雙軌估算 `(human: ~X / CC: ~Y)`
- 壓縮比參考表（boilerplate ~100x, features ~30x, tests ~50x）
- 明確的 anti-patterns（「Choose B — it covers 90% with less code」= BAD）

核心邏輯：
> AI-assisted coding 讓完整版的邊際成本趨近於零。
> 如果完整版只比捷徑多 15 分鐘 CC 時間，永遠推薦完整版。

**gstack-game 現況：** preamble 裡沒有這個原則。需要加入遊戲版：
> 如果完整的數值平衡分析只比「看起來 OK」多 10 分鐘 CC 時間，永遠做完整分析。
> 如果完整的 6 persona 玩家走查只比「隨便挑一個」多 20 分鐘，永遠走完。

---

### 6. 跨 Skill 的 Artifact 共享

```
~/.gstack/projects/{slug}/
├── fagem-main-design-20260321-190105.md    ← /office-hours 產出
├── ceo-plans/
│   └── 2026-03-21-iching-ai-product.md     ← /plan-ceo-review 產出
├── fagem-main-test-plan-20260322.md        ← /plan-eng-review 產出
└── main-reviews.jsonl                       ← 所有 review 紀錄
```

上下游 artifact 發現機制：
- `/plan-eng-review` 開頭：`ls -t ~/.gstack/projects/$SLUG/*-design-*.md` → 找到 design doc
- `/plan-ceo-review` 開頭：讀 design doc 作為 base
- `/ship` 開頭：`gstack-review-read` → 讀所有 review 狀態
- `/office-hours` Phase 2.5：grep 過去的 design docs 找相關設計

不需要用戶手動說「去讀那個檔案」。每個 skill 自己知道去哪裡找上游 artifact。

**gstack-game 需要遷移的：**
```
~/.gstack/projects/{slug}/
├── game-design-{datetime}.md        ← /game-ideation 產出（GDD）
├── direction-{datetime}.md          ← /game-direction 產出
├── balance-report-{datetime}.md     ← /balance-review 產出
├── player-journey-{datetime}.md     ← /player-experience 產出
├── pitch-score-{datetime}.md        ← /pitch-review 產出
└── game-reviews.jsonl               ← 所有 review 紀錄
```

每個 skill 開頭的 artifact discovery 邏輯要寫進去。

---

### 7. Codex 對抗性整合

不只是「另一個 skill」，而是系統性地在 review 流程中插入第二個 AI 的獨立審查。

- `/plan-eng-review` 的 Step 0.5：可選讓 Codex 先獨立看一遍 plan
- `/codex` 有三種模式：review（對抗審查）、challenge（壓力測試）、consult（諮詢）
- Review dashboard 顯示 Codex review 狀態

核心價值：同一份 plan 被兩個不同 AI（Claude + Codex/GPT）各自審查，減少單一模型盲點。

**gstack-game 需要遷移的：** `/game-codex` 已在規劃中。確保它能：
- 獨立讀 GDD 並給出遊戲設計批評
- 整合進 review dashboard

---

## 總結：gstack-game 遷移時不能只遷 skill 內容

| 層級 | 要遷移什麼 | 目前狀態 |
|------|-----------|---------|
| **工作流鏈** | skill 之間的順序和交接 | ❌ 沒有 |
| **AskUserQuestion 格式** | 四段式統一互動 | ✅ preamble 裡有 |
| **一問一答原則** | STOP 規則 | ✅ 各 skill 已有 |
| **Review Dashboard** | 全局 ship-readiness | ❌ 沒有 |
| **Completeness Principle** | 雙軌估算 + 推薦完整版 | ❌ 沒有 |
| **Artifact 共享** | 上下游 artifact 自動發現 | ❌ 沒有 |
| **對抗性整合** | 第二 AI 獨立審查 | ❌ game-codex 只在規劃 |

前三個已經有了。後四個是 gstack-game 跟 gstack 真正的差距。

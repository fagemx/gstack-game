# 後半段結構性缺口分析

> Source: Nox agent analysis, 2026-03-23
> Problem: gstack-game 前半段已成功遷移到遊戲領域，後半段仍停留在 Web/SaaS work unit

---

## 核心診斷

前半段的 work unit 已經換成遊戲：
- core loop / retention / economy / player fantasy / motivation

後半段的 work unit 還停留在 Web/SaaS：
- diff / PR / bug / changelog / ship

不是「後半段品質差」，是 **核心工作單位沒有換**。

## Substitution Test

> 如果把「遊戲」換成「一般 web app」，這個 skill 還幾乎不變嗎？
> 如果 YES → 還沒有真正變成遊戲 skill。

| Skill | 換成 web app 差不多？ | 判斷 |
|-------|---------------------|------|
| /game-code-review | YES (80%) | 沒換成功 |
| /game-qa | PARTIALLY (60%) | 有遊戲分類但骨架是 web QA |
| /game-ship | YES (75%) | 平台提交是遊戲的但 flow 是 gstack /ship |
| /game-debug | YES (85%) | 幾乎 generic debug |
| /game-retro | YES (90%) | 就是 /retro 換了幾個詞 |
| /game-codex | YES (90%) | 只加了「game exploit」幾個字 |
| /game-docs | YES (85%) | patch notes 是遊戲的但其餘 generic |
| /game-visual-qa | NO (40%) | 有遊戲特有的視覺問題 |
| /asset-review | NO (30%) | 幾乎全是遊戲特有 |
| /playtest | NO (20%) | 完全是遊戲 |

結論：後半段 10 個 skill 裡只有 3 個真正是遊戲的。

---

## 三個結構性問題

### 1. 缺少 Design → Build Bridge（中間層）

現在：GDD / design review 完 → 直接進 code review / QA

缺的：
- 設計要先變成什麼實作切片？
- 先做 prototype 還是 vertical slice？
- 哪個 mechanic 先落地？
- 這次 build 驗證的是「做出來了」還是「好不好玩」？
- 哪些設計被技術折損了？

> 缺的是 design artifact 到 production artifact 的轉換層。

### 2. 後半段 artifact 太工程化

前半段吃的：GDD, concept, score, journey map, balance report

後半段吃的：git diff, build, bug report, changelog

遊戲後半段真正需要的 artifact：
- mechanic spec
- prototype scope
- vertical slice brief
- encounter script
- feel checklist
- telemetry snapshot
- playtest observation log
- build delta against design intent
- content pipeline status

### 3. 後半段缺少遊戲特有的生產判斷

Web/SaaS code review 問：架構對不對、bug 風險、perf

遊戲後半段還要問：
- 實作有沒有保住原本的 game feel
- mechanic 現在是「能運作」還是「有趣」
- build 驗證了哪個設計假設
- 改動有沒有破壞玩家理解節奏
- bug 是 technical defect 還是 experience defect
- content 加進來後玩家 loop 有沒有更清楚
- patch 是修 bug 還是偷偷改 economy

---

## 建議的後半段重構

### Layer 1: Bridge（補缺）— 設計到實作的轉換
- `/system-spec` — 把 GDD 裡的系統轉成可實作規格
- `/prototype-slice-plan` — 決定這次先做哪個切片、驗證什麼假設
- `/implementation-handoff` — 設計意圖轉成 coding agent 能接手的 package

### Layer 2: Production（遊戲特有生產判斷）
- `/gameplay-implementation-review` — 設計意圖是否在實作中存活
- `/feel-pass` — input feedback, timing, juice, animation sync, dead time
- `/content-integration-review` — 新內容加進 loop 後是否破壞 pacing
- `/game-debug` — 保留但需強化遊戲特有 bug patterns
- `/asset-review` — 保留，已是遊戲特有

### Layer 3: Validation / Release
- `/build-playability-review` — 不是 QA，是「這個 build 值得真的玩一輪嗎」
- `/game-qa` — 保留但需更多遊戲特有分類
- `/playtest` — 保留，已是遊戲特有
- `/game-ship` — 保留但需強化平台特有步驟
- `/game-docs` — 保留但需強化玩家溝通
- `/game-retro` — 保留但需加遊戲特有指標
- `/game-codex` — 保留但需加 exploit/cheat 目錄

### 目標 workflow

```
設計 → 切片 → 實作 → playable → validation → release

而不是：
設計 → diff / QA / ship
```

---

## 務實的補強順序

### 第一優先：補中間橋
1. `/prototype-slice-plan` — 填補設計到實作的 gap
2. `/implementation-handoff` — 設計意圖打包成可執行 brief

### 第二優先：補遊戲特有的後半 skill
3. `/feel-pass` — 最快讓後半段脫離 Web/SaaS 遷移感

### 第三優先：playable 判斷
4. `/build-playability-review` — 讓 build 不只經過 QA，而是經過「好不好玩」判斷

---

## 4 種需要補的 artifact

1. `prototype-spec.md` — 這次 build 要驗證什麼
2. `playability-report.md` — 這個 build 真的玩起來怎樣
3. `feel-checklist.md` — 回饋、節奏、手感是否成立
4. `implementation-delta.md` — 設計意圖 vs 實際做出來的差距

---

## 判斷標準

> 問：如果把「遊戲」換成「一般 web app」，這個 skill 還幾乎不變嗎？
> 如果 YES → 還沒有真正變成遊戲後半段 skill。

真正的遊戲後半段 skill 的 work unit 是：
mechanic, prototype, slice, feel, playability, content integration, player evidence

不是：diff, PR, build, bug, changelog

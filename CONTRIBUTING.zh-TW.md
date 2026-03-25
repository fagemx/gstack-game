# 貢獻指南

[English](CONTRIBUTING.md)

gstack-game 需要的是**領域專家**，不只是程式設計師。

工程骨架已經穩固。缺的是**遊戲產業經驗**——那些只有真正做過遊戲的人才知道的 benchmark 數字、常見陷阱、和審查標準。

如果你做過遊戲、設計過經濟系統、帶過 QA 團隊、或做過美術管理——你的知識正是這個專案需要的。

---

## 三種貢獻方式

### ⚡ 5 分鐘：開 Issue（不需要 clone repo）

**適合：** 看到一個數字不對、想到一個 Claude 常犯的錯、有一個逼問問題要加。

直接在 GitHub 開 Issue，選對應的模板填寫：

- **[回報錯誤的 Benchmark](../../issues/new?template=benchmark.yml)** — 某個數字過時或不正確
- **[新增 Gotcha](../../issues/new?template=gotcha.yml)** — Claude 在某個任務上會犯的錯
- **[新增逼問問題](../../issues/new?template=forcing-question.yml)** — 審查時應該問但沒問的問題
- **[校準評分](../../issues/new?template=scoring.yml)** — 某個評分標準的權重或門檻需要調整

填完的 Issue 會被直接轉成 PR。你不需要懂 git、不需要 clone repo、不需要跑 build。

**範例：** 見 [docs/contribution-examples/](#貢獻範例)

---

### 🔧 30 分鐘：改 references/ 文件（需要 clone repo）

**適合：** 想要一次改好幾個地方、加一整段新內容、或深入修改某個 section。

每個 skill 的領域知識都在 `skills/<name>/references/` 目錄——**全部是純 markdown**，不需要懂 skill 架構。

```bash
git clone https://github.com/fagemx/gstack-game.git
cd gstack-game
```

#### 你的專長對應哪些檔案

| 你的背景 | 改哪些檔案 |
|---------|-----------|
| **數值策劃** | `skills/balance-review/references/` — gotchas.md, scoring.md, economy-model.md, progression.md |
| **遊戲設計師** | `skills/game-review/references/` — core-loop.md, progression.md, motivation.md, gotchas.md |
| **UX 研究員** | `skills/player-experience/references/` — personas.md, emotion-vocabulary.md, walkthrough-phases.md |
| **行銷 / 發行** | `skills/pitch-review/references/` — market-positioning.md, business-case.md, gotchas.md |
| **遊戲程式** | `skills/gameplay-implementation-review/SKILL.md.tmpl`, `skills/game-eng-review/SKILL.md.tmpl` |
| **QA 主管** | `skills/game-qa/SKILL.md.tmpl` |

#### 改完後

```bash
bun run build    # 重新生成 SKILL.md（如果你改了 references/，這步其實不需要）
bun test         # 確認沒壞
```

提 PR：
- 標題：`improve(balance-review): 更新 F2P 經濟 benchmark`
- 內文：解釋**為什麼**——引用你的經驗或數據來源
- 標注專業：`[數值策劃, 6 年, 出過 2 款 F2P 手遊]`

---

### 🏗️ 進階：寫 Skill Template（需要理解架構）

**適合：** 想要新增 skill、或大幅重構現有 skill。

先讀這些文件理解架構：
- `CLAUDE.md` — 開發者手冊
- `docs/DEVELOPMENT.md` — 完整專案概覽、skill map、migration guide
- `skills/skill-review/references/rubric.md` — 15 維度品質評分標準
- `skills/skill-review/references/refactor-patterns.md` — 重構方法

關鍵規則：
- 改 `.tmpl` 檔案，不直接改 `.md`
- 超過 300 行的 skill 要拆 `references/`
- 所有 references 在互動開始前一次讀完（方案 1，零中斷）
- 改完跑 `bun run build` + `bun test`

---

## 貢獻範例

### 範例 1：加一條 Gotcha（5 分鐘）

**場景：** 你是數值策劃，發現 `/balance-review` 在分析放置類遊戲時會把通膨當成 bug。

**開 Issue：**

> **Skill:** /balance-review
> **檔案:** references/gotchas.md
> **類型:** 新增 Gotcha
>
> **內容：**
> Claude 做放置類遊戲的經濟分析時，會把通膨率 > 1.2 標記為紅旗。但放置類遊戲的通膨是設計——幣值每小時成長 10-50% 是正常的，玩家的期待就是「數字一直變大」。正確的做法是看「通膨速度是否匹配 prestige 重置頻率」，不是看絕對通膨率。
>
> **根據什麼：** 做過 2 款放置類遊戲（累計 500 萬下載），調過半年的 live 經濟。
>
> **建議加在哪裡：** references/gotchas.md 的 Claude-Specific Gotchas 區塊第 8 點

**結果：** 維護者把這段加到 `skills/balance-review/references/gotchas.md`。

---

### 範例 2：修正 Benchmark 數字（5 分鐘）

**場景：** 你是發行，發現 `/pitch-review` 的 CPI benchmark 是 2024 年的數字。

**開 Issue：**

> **Skill:** /pitch-review
> **檔案:** references/scoring.md
> **類型:** 修正 Benchmark
>
> **目前的值：** LTV/CPI > 1.5 = viable
> **應該改成：** 這個門檻太寬鬆。2026 年 iOS 的 casual game CPI 已經到 $3-5（ATT 之後持續漲），LTV/CPI > 2.0 才算 viable，1.5-2.0 是 risky。
>
> **數據來源：** Sensor Tower 2026 Q1 report, 我們自己的 4 款遊戲 UA 數據

---

### 範例 3：加一個逼問問題（5 分鐘）

**場景：** 你是遊戲總監，覺得 `/game-review` 缺少一個關鍵問題。

**開 Issue：**

> **Skill:** /game-review
> **檔案:** references/core-loop.md
> **類型:** 新增逼問問題
>
> **問題：** 「把你的遊戲的音效全部關掉，只看畫面。核心循環還有趣嗎？再把畫面關掉只聽音效。還有趣嗎？如果兩個都不行，你的 game feel 靠的不是設計，是包裝。」
>
> **為什麼重要：** 我 greenlight 過 20+ 個案子。最常見的假陽性就是「Demo 看起來很酷但玩起來空洞」——拆開感官包裝後核心循環其實沒有 juice。
>
> **建議加在哪裡：** Section 1 的 Forcing Questions，作為 Q5

---

### 範例 4：改 references/ 文件（30 分鐘）

**場景：** 你是 UX 研究員，覺得 `/player-experience` 的 Casual Newcomer persona 不夠準確。

**直接改檔案：** `skills/player-experience/references/personas.md`

```diff
 ### Persona 1: Casual Newcomer (FTUE Focus)
 - **Context:** First mobile game session on commute.
-  3 minutes of attention before deciding if it's worth keeping.
+  90 seconds of attention before deciding if it's worth keeping.
+  (Source: 我們的 playtest 數據顯示 50% 的 casual 玩家在 90 秒內決定留或刪，不是 3 分鐘。
+  3 分鐘是「已經感興趣的人」的數字。)
 - **Frustration tolerance:** 1-2 failures before quitting.
+  (Note: 如果第一次失敗沒有任何回饋（為什麼失敗、怎麼改善），
+  tolerance 降為 0 — 直接離開，不會嘗試第二次。)
```

提 PR，附上 playtest 數據來源。

---

## 現在最需要的貢獻

### 🔴 關鍵（會影響評分準確度）

| Skill | 需要什麼 | 需要誰 |
|-------|---------|--------|
| `/balance-review` | 放置類 / idle 遊戲的經濟模型適配 | 做過放置類遊戲的數值策劃 |
| `/game-review` | GDD 權重在不同遊戲類型之間的校準 | 審過 10+ 份 GDD 的設計師 |
| `/gameplay-implementation-review` | Unity / Godot / Unreal 各自的 hot path 陷阱 | 有 profiling 經驗的遊戲程式 |
| `/pitch-review` | 2026 年的 LTV/CPI/UA benchmark | 有 Sensor Tower 或 data.ai 使用經驗的發行 |

### 🟡 重要（有內容但需要加深）

| Skill | 需要什麼 | 需要誰 |
|-------|---------|--------|
| `/player-experience` | Persona 行為參數的 playtest 驗證 | 有觀察數據的 UX 研究員 |
| `/game-ideation` | 更多逼問問題（現有 6 個有沒有盲點） | greenlight 過/砍過專案的遊戲總監 |
| `/game-direction` | IP 策略、本地化、年齡分級的認知模式 | 出過 3+ 款遊戲的製作人 |

### ⚪ Skeleton Skills（需要大量內容）

| Skill | 目前 | 缺什麼 |
|-------|------|--------|
| `/asset-review` | 128L, 35% | 風格一致性標準、texture/mesh 品質 benchmark |
| `/game-visual-qa` | 140L, 35% | 視覺品質量化門檻、動畫 timing |
| `/playtest` | 176L, 40% | 觀察指標、訪談題庫、統計顯著性 |

---

## 有問題？

開 Issue，標注 skill 名稱和你的專業領域。

不確定你的貢獻放哪裡？開 Issue 說「我想貢獻 XX 經驗，不確定放哪個 skill」——我們會幫你找到對的位置。

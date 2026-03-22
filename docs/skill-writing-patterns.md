# How to Write Good Skills — Patterns from Real Usage

> Analysis date: 2026-03-22
> Sources studied:
> - `C:\ai_agent\karvi\.claude\skills\arch-spec` (user's most-used spec skill)
> - `C:\ai_agent\.claude\skills\issue-pipeline` (wave-based orchestrator)
> - `C:\ai_agent\.claude\skills\pr-review-loop` (iterative review loop)
> - `C:\ai_project\gstack\office-hours` (gstack's best skill per user feedback)
> - Thariq (Anthropic) post on skill best practices (2026-03-22)

---

## The 7 Patterns

### Pattern 1: Single-Role Identity

每個好 skill 的開頭都用一句話定義角色：

```
arch-spec:       "crystallize fuzzy concepts into interconnected spec files"
issue-pipeline:  "wave-based dispatch orchestrator"
pr-review-loop:  "PR review-and-fix specialist"
office-hours:    "YC office hours partner"
```

不是「你可以做 A 也可以做 B」，而是**你是什麼，你做一件事**。

**應用到 gstack-game：** 每個 skill 開頭加一句不超過 15 字的角色定義。
- `/game-review`: "You are a game design diagnostician."
- `/balance-review`: "You are an economy mathematician."
- `/player-experience`: "You are a player, not a reviewer."

---

### Pattern 2: Progressive Disclosure via Folder Structure

**arch-spec** 是標竿——365 行 SKILL.md，但知識庫在 references/ 裡：

```
SKILL.md              ← 骨架邏輯（何時用、步驟、決策表）
references/
├── when-to-use.md         ← 什麼時候不該用我
├── anti-patterns.md       ← Claude 常犯的錯
├── gotchas.md             ← 陷阱清單
├── minimum-stack.md       ← 怎麼決定 stack 大小
├── artifact-types.md      ← 完整的 artifact 選單
├── stack-shape.md         ← 每個檔案的 template
├── review-checklist.md    ← 審查用 checklist
├── promotion-rules.md     ← 什麼時候可以「畢業」
├── promotion-handoff.md   ← 畢業交接流程
└── examples/
    └── README.md          ← 範例對應表
```

SKILL.md 用 `cat .claude/skills/arch-spec/references/X.md` 指引 Claude 在需要時才讀。
**不預先載入所有東西**，讓 Claude 自己管理 context。

**Thariq 確認：**
> "Think of the entire file system as a form of context engineering and progressive
> disclosure. Tell Claude what files are in your skill, and it will read them at
> appropriate times."

**對比 gstack-game 現況：** balance-review 625 行全在一個 SKILL.md.tmpl 裡。

**應用：** 每個 skill 拆成：
```
skills/game-review/
├── SKILL.md.tmpl           ← 骨架（~150 行）
├── references/
│   ├── gotchas.md          ← Claude 做 GDD 審查常犯的錯
│   ├── scoring-rubric.md   ← 評分公式（不靠 AI 直覺）
│   ├── benchmarks.md       ← 產業基準數據（retention, session length, etc.）
│   ├── genre-profiles.md   ← 不同類型遊戲的審查重點差異
│   └── examples/
│       ├── mobile-casual.md
│       └── pc-roguelike.md
└── scripts/                ← helper code（如果需要）
```

---

### Pattern 3: State Management via Scripts, Not Memory

**pr-review-loop** 是範本——用 bash driver script 控制迴圈：

```bash
/tmp/pr-review-loop-driver.sh "$PR" review-done "$P0" "$P1"
# 輸出: ACTION: COMMENT  或  ACTION: LGTM  或  ACTION: FIX
```

Claude 不需要記住「我在第幾輪」、「還有多少 P0」。腳本處理狀態，Claude 只需**跟著 ACTION 走**。

```
┌──────────┐     ACTION: REVIEW      ┌─────────┐
│  Driver   │ ──────────────────────→ │   LLM   │
│  Script   │ ←────────────────────── │ (Claude) │
│           │   review-done {p0} {p1} │         │
│           │     ACTION: COMMENT     │         │
│           │ ──────────────────────→ │         │
│           │ ←────────────────────── │         │
│           │       comment-done      │         │
│           │     ACTION: FIX         │         │
│           │ ──────────────────────→ │         │
└──────────┘                          └─────────┘
```

**應用到 gstack-game：** review skills 如果有 multi-round loop（review → fix → re-review），
應該用 driver script，不靠 Claude 記憶。gstack-game 的 review skills 目前是單 pass，
但如果未來加入迭代（像 pr-review-loop），就需要這個 pattern。

---

### Pattern 4: Gotchas Are the Highest-Value Content

**arch-spec** 有獨立的 `gotchas.md` 和 `anti-patterns.md`。

**Thariq 確認：**
> "The highest-signal content in any skill is the Gotchas section. These sections
> should be built up from common failure points that Claude runs into."

**gstack-game 現況：** 有 anti-sycophancy 和 forbidden phrases（這是 gotchas 的一種），
但缺少**操作層面的 gotchas**。

**需要補充的 gotchas 類型：**

| Skill | 缺少的 Gotchas |
|-------|---------------|
| `/game-review` | Claude 傾向把所有遊戲都分析成 F2P mobile。Claude 會忽略 session length 和 platform context。Claude 會把「有趣」當成優點但不解釋為什麼有趣。 |
| `/balance-review` | Claude 不擅長做 multi-step 數學推演（經濟模擬）。Claude 傾向給出「看起來合理」的數字而不驗算。Claude 會忽略 time dimension（Day 1 vs Day 30 的經濟狀態差異）。 |
| `/player-experience` | Claude 會以「reviewer」而非「player」的視角走查。Claude 傾向正面描述（「player will enjoy...」）而非中性描述。Claude 會跳過「無聊」的部分（loading, menu navigation）。 |
| `/pitch-review` | Claude 傾向鼓勵而非挑戰。Claude 會接受「the market is huge」而不要求具體數字。Claude 傾向給所有 pitch 相似的建議（build MVP, talk to users）。 |

**這些 gotchas 應該從實際使用中累積**——第一版先寫已知的，然後每次 Claude 犯錯就補一條。

---

### Pattern 5: Argument Parsing + Mode Routing at Entry

好 skill 在開頭就確定走哪條路：

**arch-spec** — 4 種操作模式：
```
1. Args starts with `review` → Review operation
2. Args starts with `add` → Add operation
3. Args starts with `shared-types` → Extract types
4. Args is a topic → Generate operation
5. Args is empty → ask
```

**office-hours** — 用 AskUserQuestion 路由：
```
Startup / Intrapreneurship → Phase 2A (hard questions)
Hackathon / Learning / Fun → Phase 2B (enthusiastic collaborator)
```

**issue-pipeline** — 用 flags：
```
--skip-plan  --skip-review  --no-merge  --auto
```

**Pattern:** 一個 skill 可以有多種模式，但在開頭就確定走哪條路，之後不再猶豫。

**gstack-game 的 balance-review 已經有這個：** Step 0 的 Mode Selection（F2P Mobile / Premium / Competitive / Live Service）。
其他 skills 也應該在 Step 0 確定模式。

---

### Pattern 6: Composability — Skills Call Skills

**issue-pipeline** 不自己做所有事——它調度其他 skills：

```
issue-pipeline
├── calls → issue-plan     (planning)
├── calls → issue-action   (implementation)
└── calls → pr-review-loop (review)
```

Prompt 模板存在 `references/agent-prompts.md`：
```
Load and execute the issue-plan skill by reading
{project_root}/.claude/skills/issue-plan/SKILL.md
```

**office-hours** 也有這種特性：
- 用 subagent 做 adversarial spec review
- 結束時推薦下一個 skill（/plan-ceo-review, /plan-eng-review）

**應用到 gstack-game：** 設計 skill 之間的調度關係：
```
/game-ideation → produces GDD → /game-review reads it
/game-review → produces findings → /balance-review reads them
/player-experience → produces journey map → /game-ux-review reads it
/game-code-review → produces verdict → /game-ship checks it
```

每個 skill 的 output 是下一個 skill 的 input。

---

### Pattern 7: Anti-Sycophancy = Forbidden Phrases + Forcing Questions + Pushback Patterns

**office-hours** 做得最完整（三層防護）：

**Layer 1: Forbidden phrases**
```
❌ "That's an interesting approach"
❌ "There are many ways to think about this"
❌ "You might want to consider..."
❌ "That could work"
```

**Layer 2: Pushback patterns（具體到怎麼回話）**
```
Founder: "I'm building an AI tool for developers"
BAD: "That's a big market! Let's explore what kind of tool."
GOOD: "There are 10,000 AI developer tools. What specific task does a specific
      developer waste 2+ hours/week on that your tool eliminates? Name the person."
```

**Layer 3: Forcing questions（不可逃避的逼問）**
```
"What's the strongest evidence you have that someone actually wants this —
not 'is interested,' not 'signed up for a waitlist,' but would be genuinely
upset if it disappeared tomorrow?"
```

**gstack-game 的 balance-review 和 pitch-review 已經有不錯的 anti-sycophancy。**
但 game-review 和 player-experience 的比較弱。統一到三層模型。

---

## Thariq 文章的補充 Patterns（上述 4 個 skill 沒完全展現的）

### Pattern 8: Config.json for Per-Project Setup

> "A good pattern is to store setup information in a config.json file in the skill
> directory. If the config is not set up, the agent can ask the user."

**應用：** 第一次跑 `/game-review` 時問：
- 遊戲名稱、genre、platform
- 目標 session length
- 營利模式
存進 `config.json`，之後自動帶入。

### Pattern 9: Skill-Internal Memory via Log Files

> "A standup-post skill might keep a standups.log with every post it's written.
> Next time you run it, Claude reads its own history."

**應用：** `/balance-review` 存一份 `balance-reviews.log`：
```json
{"date":"2026-03-22","game":"mochi-pet","score":6.2,"top_issue":"no sinks","mode":"F2P"}
```
下次跑時：「上次 review 發現沒有 sink，這次改善了嗎？」

穩定路徑用 `${CLAUDE_PLUGIN_DATA}` 而非 skill directory。

### Pattern 10: Helper Scripts as Composable Building Blocks

> "One of the most powerful tools you can give Claude is code. Giving Claude scripts
> and libraries lets Claude spend its turns on composition."

**應用：** 為 `/balance-review` 提供 `scripts/economy-sim.ts`：
```typescript
// Claude 可以直接 import 這個函式做經濟模擬
export function projectStockpile(faucetPerHour: number, sinkPerHour: number, days: number)
```

### Pattern 11: Description = Trigger Condition, Not Summary

> "The description field is not a summary — it's a description of when to trigger."

**應用：** 改寫 descriptions：
```
❌ "Game economy and balance review."
✅ "Use when a game has numbers that need checking — difficulty curves, currency
   systems, gacha rates, progression pacing, or pay-to-win concerns. Not for
   visual design, narrative, or core loop evaluation (use /game-review for those)."
```

---

## 重構優先順序

1. **Progressive disclosure** — 把 balance-review 和 player-experience 拆成
   SKILL.md.tmpl + references/。這是最大的結構改善。
2. **Gotchas files** — 為每個 skill 加 `references/gotchas.md`。從已知問題開始，
   實際使用後持續累積。
3. **Config.json** — game-review 和 balance-review 加 per-project config。
4. **Description 改寫** — 從功能摘要改成觸發條件。
5. **Helper scripts** — balance-review 加經濟模擬腳本。
6. **Skill memory** — 加 review log 讀回機制。
7. **Driver scripts** — 如果加入 iterative review loop，用 bash driver 管狀態。

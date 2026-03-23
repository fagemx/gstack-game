# 三個 Bridge Layer Skill Specs

> Source: Nox agent, 2026-03-23
> Purpose: 填補設計審查 → 實作之間的 gap

---

## A. /prototype-slice-plan

### One-line definition
把 GDD / review findings 壓成一個**最小可驗證的遊戲實作切片計畫**。

### Trigger
- GDD / concept / review 已經有了
- 要進入 prototype / vertical slice / first playable
- 不知道先做哪一塊最值

### Do NOT use
- 還在純概念發想 → `/game-ideation`
- 還沒做過設計審查 → `/game-review`
- 已經知道做哪塊，只需交給工程 → `/implementation-handoff`

### Inputs
- `docs/gdd.md`
- `/game-review` findings
- `/player-experience` findings
- `/game-direction` scope/risk
- 可選：技術限制、平台限制、人力限制

### Outputs → `prototype-slice-plan-*.md`
1. **推薦切片** — first playable / vertical slice / system prototype
2. **本次要驗證的假設** — 核心循環是否有趣、30 秒能到 aha moment、戰鬥回饋是否撐 3 分鐘 session
3. **本次故意不做的東西** — fake / defer / placeholder
4. **成功標準** — 不是工程完成，是玩家/設計假設是否被驗證
5. **交接到下游的 acceptance criteria**

### Canonical cycle
1. Read design state（GDD + 上游 review 結果）
2. Identify candidate slices
3. Classify slice type（mechanic prototype / onboarding slice / progression slice / combat slice / economy slice / vertical slice）
4. Evaluate tradeoffs（驗證價值 / 技術成本 / 玩家可感知度 / 系統依賴）
5. Recommend one slice（明講為什麼先做這個）
6. Package slice plan

### Core review questions
- 這個切片驗證的是什麼，不是展示什麼？
- 如果這塊做出來，玩家真的能感受到核心 loop 嗎？
- 哪些內容可以 fake，不影響驗證？
- 哪些內容如果不做，整個切片就失真？
- 這個切片失敗時，我們會學到什麼？

### Scoring axes (5 維)
1. Validation Value
2. Implementation Feasibility
3. Player Signal Clarity
4. Dependency Risk
5. Scope Discipline

### Workflow position
上游：/game-review, /player-experience, /game-direction, /game-eng-review
下游：/implementation-handoff, /gameplay-implementation-review, /build-playability-review

---

## B. /implementation-handoff

### One-line definition
把設計意圖與 slice 計畫，轉成 **coding/build 階段可直接接手的實作交接包**。

### Trigger
- 已經有 prototype slice / system spec
- 準備進入實作
- 需要給 coding agent / dev 一份清楚 handoff

### Do NOT use
- 還沒決定先做哪個切片 → `/prototype-slice-plan`
- 已經有 code diff 要看 → `/gameplay-implementation-review` 或 `/game-code-review`
- 只是評估技術架構 → `/game-eng-review`

### Inputs
- `prototype-slice-plan-*.md`
- GDD relevant sections
- architecture constraints
- asset requirements
- engine / platform choice

### Outputs → `implementation-handoff-*.md`
1. **Build target** — 本輪要做出的東西
2. **In-scope / out-of-scope**
3. **Gameplay requirements** — 玩家可見的行為、回饋、狀態變化
4. **System requirements** — data / state / save / sync / content hooks
5. **Asset requirements** — placeholder 可不可以、哪些需要真資產
6. **Acceptance criteria** — 什麼算 done
7. **Known risks** — 哪些點做歪就會失真
8. **Test hooks** — build 後要怎麼驗

### Canonical cycle
1. Read slice plan
2. Extract implementation targets
3. Separate design intent from implementation detail
4. Identify dependencies
5. Write acceptance criteria
6. Write testable handoff package

### Core questions
- 這次 build 最低要讓玩家看見什麼？
- 哪些東西可以 placeholder？
- 哪些回饋缺了就不是同一個 mechanic？
- 工程上最容易偷懶但會毀掉體驗的是哪裡？
- 完成後拿什麼測：自己玩、QA、還是 playability pass？

### Quality bar
好的 handoff 不是很長，是讓工程/agent 拿到後知道：做什麼、不做什麼、什麼叫完成、什麼不能破壞。

### Workflow position
上游：/prototype-slice-plan, /game-eng-review
下游：實作階段, /gameplay-implementation-review, /build-playability-review

---

## C. /feel-pass

### One-line definition
專門審查一個已可操作 build / mechanic 的 **game feel、節奏與回饋品質**。

### Trigger
- 已經有 prototype / playable build
- 某個 mechanic 已可互動
- 想知道「它活了沒」

### Do NOT use
- 還沒 build 出可操作內容
- 還只是看 GDD → `/player-experience`
- 要找技術根因 bug → `/game-debug`

### Inputs
- playable build / video / frame capture
- implementation notes
- prototype slice plan
- optional: player observation notes

### Outputs → `feel-pass-*.md`
1. **Feel verdict** — alive / flat / muddy / overbusy / unclear
2. **Feedback chain analysis** — input → response → confirmation → payoff
3. **Timing analysis** — startup / impact / cooldown / dead time
4. **Readability analysis** — 玩家知道剛剛發生什麼嗎
5. **Energy profile** — 哪裡該有力、哪裡該收
6. **Top feel failures** — 不超過 3 個，按影響排序

### Core review dimensions (7 維)
1. Responsiveness
2. Clarity
3. Impact
4. Rhythm
5. Payoff
6. Dead time
7. Overload / noise

### Anti-patterns it should catch
- 按了沒感覺
- 打中了但沒 payoff
- hit / damage / stagger / reward 感知斷裂
- 動畫 / 音效 / UI feedback 不同步
- 等待時間過長
- 畫面很忙但訊號很弱
- 玩家做對了但不知道自己做對

### Canonical cycle
1. Establish target feel（這個 mechanic 想讓玩家感覺什麼）
2. Observe interaction chain（input → response → feedback → outcome）
3. Evaluate timing（latency / dead frames / anticipation / release）
4. Evaluate clarity（action → consequence 理解度）
5. Evaluate reward energy（payoff 是否值得）
6. Summarize feel blockers（只抓最致命的幾個）

### Workflow position
上游：/implementation-handoff, prototype build, /gameplay-implementation-review
下游：/build-playability-review, /game-debug, /game-qa

---

## 後半段重構 Skill Map

### Layer A — Bridge（設計 → 實作）NEW
- `/prototype-slice-plan` ← 新增
- `/implementation-handoff` ← 新增
- `/system-spec` ← 可選之後補

### Layer B — Production（遊戲生產）
- `/gameplay-implementation-review` ← 從 /game-code-review 演化
- `/feel-pass` ← 新增
- `/content-integration-review` ← 後續補
- `/game-debug` ← 保留重心改寫
- `/asset-review` ← 保留

### Layer C — Validation / Release
- `/build-playability-review` ← 新增
- `/game-qa` ← 保留（偏系統驗證，不兼做 playability）
- `/playtest` ← 保留
- `/game-ship` ← 保留（吃更多上游 artifact）
- `/game-docs` ← 保留
- `/game-retro` ← 保留
- `/game-codex` ← 保留
- `/game-visual-qa` ← 保留

### 新 workflow

```
design review → prototype-slice-plan → implementation-handoff
→ gameplay-implementation-review → feel-pass
→ build-playability-review → QA/playtest → ship
```

### 改造清單
| Skill | 動作 |
|-------|------|
| /game-code-review | 演化成 /gameplay-implementation-review |
| /game-qa | 更偏系統驗證 |
| /game-ship | 吃更多上游 artifact |

### 新增清單
| Skill | 優先度 |
|-------|--------|
| /prototype-slice-plan | 第一優先 |
| /implementation-handoff | 第一優先 |
| /feel-pass | 第二優先 |
| /build-playability-review | 第三優先 |

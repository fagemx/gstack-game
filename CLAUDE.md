# gstack-game — 遊戲開發完整工作流 Skills for Claude Code

## What is this?

A **complete game development workflow** for Claude Code — from concept brainstorming to shipping. Built on gstack's interactive patterns, rewritten for game development.

This is NOT just a few extra skills on top of gstack. It is a **standalone replacement** for game projects. It includes migrated+rewritten versions of gstack's general-purpose skills (office-hours, reviews, ship, QA, etc.) adapted to game vocabulary and workflows, PLUS game-specific skills that gstack doesn't have (GDD review, balance review, player experience simulation, asset pipeline).

**Relationship to gstack:**
- gstack = web/SaaS product workflow
- gstack-game = game development workflow
- **Fully independent.** Own bin/ utilities, own skills, own install. No gstack dependency.
- Design patterns borrowed from gstack (template engine, preamble injection), code is standalone.
- Reference source: `C:\ai_project\gstack` (original gstack repo for pattern reference during development)

## Complete Skill Map

### Status Legend
- ✅ = Done (template + full content)
- 🔨 = Skeleton (template exists, content TODO)
- ❌ = Not started

### Game-Specific Skills (NEW — gstack doesn't have these)

| Skill | Command | Purpose | Status |
|-------|---------|---------|--------|
| game-review | `/game-review` | GDD 審查：core loop, progression, retention, economy, player motivation | 🔨 |
| balance-review | `/balance-review` | 數值平衡：難度曲線、經濟系統、付費壓力、玩家分層 | 🔨 |
| player-experience | `/player-experience` | 玩家體驗模擬：互動式第一人稱走查（取代 guardian 的 PlayerSimulatorAgent） | 🔨 |
| pitch-review | `/pitch-review` | 遊戲企劃提案審查：市場定位、差異化、可行性 | 🔨 |
| asset-review | `/asset-review` | 美術/音效/動畫管線審查：風格一致性、效能預算、素材規格 | ❌ |
| playtest | `/playtest` | 測試協議設計：測試計畫、觀察指標、玩家招募、數據收集 | ❌ |

### Migrated from gstack (rewritten for game context)

These skills exist in gstack for web/SaaS. gstack-game forks and rewrites them with game-specific vocabulary, review criteria, and workflows.

| gstack original | gstack-game version | What changes | Status |
|-----------------|---------------------|--------------|--------|
| `/office-hours` | `/game-ideation` | 遊戲概念發想。用 core loop / fantasy / target session 取代 SaaS 的 demand evidence / status quo。問題框架改為「這個遊戲為什麼好玩？」而非「用戶為什麼需要這個？」 | ❌ |
| `/plan-ceo-review` | `/game-direction` | 遊戲方向審查。市場定位、IP 策略、平台選擇、競品分析。用 DAU/MAU/ARPDAU 取代 MRR/churn。 | ❌ |
| `/plan-eng-review` | `/game-eng-review` | 遊戲技術架構。引擎選型、網路架構、資料同步、物理引擎、渲染管線。保留 gstack 的互動式 4-section 結構。 | ❌ |
| `/plan-design-review` | `/game-ux-review` | 遊戲 UI/UX 審查。HUD、選單流程、商店介面、新手引導 UI、控制器/觸控適配。 | ❌ |
| `/review` | `/game-code-review` | PR code review（遊戲語境）。檢查 frame budget、記憶體分配模式、序列化、狀態同步。 | ❌ |
| `/investigate` | `/game-debug` | 遊戲 debug。分析 crash dump、效能瓶頸、物理穿透、網路延遲。 | ❌ |
| `/ship` | `/game-ship` | 遊戲發布流程。build → test → changelog → PR → deploy。含平台特定步驟（Steam/App Store/Google Play）。 | ❌ |
| `/qa` | `/game-qa` | 遊戲 QA。分 functional（功能）、visual（視覺）、performance（效能）、compatibility（相容性）四類。Web 遊戲用 /browse，原生遊戲用 checklist。 | ❌ |
| `/design-review` | `/game-visual-qa` | 視覺 QA。美術風格一致性、UI 對齊、動畫流暢度、螢幕適配。 | ❌ |
| `/retro` | `/game-retro` | 開發週回顧。含 milestone tracking、feature completion rate、bug density trend。 | ❌ |
| `/codex` | `/game-codex` | Codex 第二意見（遊戲語境）。對抗性 review 聚焦遊戲特有問題（race condition in netcode, frame spike, memory leak in asset loading）。 | ❌ |
| `/careful` + `/guard` | `/careful` + `/guard` | 安全模式。直接沿用，不需改。 | ❌ |
| `/document-release` | `/game-docs` | 發布文件更新。含 patch notes 格式（玩家看得懂的 changelog）。 | ❌ |

### Complete Workflow (target)

```
/game-ideation  →  /game-direction  →  /game-review      →  /game-eng-review
  概念發想            方向審查            GDD 設計審查          技術架構
      ↓                                      ↓
/balance-review  ←  /player-experience  ←  /game-ux-review
  數值平衡            玩家體驗走查           UI/UX 審查
      ↓
/playtest        →  實作  →  /game-code-review  →  /game-qa  →  /game-ship
  測試協議          寫 code      PR review            QA           發布
      ↓
/game-retro  ←  /game-visual-qa  ←  /asset-review
  週回顧          視覺 QA              美術管線
```

## Implementation Priority

### Wave 1: Core workflow（最重要，先做這些就能用）
1. `/game-ideation` — 遊戲概念發想（從 /office-hours 遷移改寫）
2. `/game-review` — GDD 審查（已有骨架，充實內容）
3. `/game-direction` — 方向審查（從 /plan-ceo-review 遷移改寫）
4. `/player-experience` — 玩家體驗走查（已有骨架）

### Wave 2: Engineering workflow
5. `/game-eng-review` — 技術架構（從 /plan-eng-review 遷移改寫）
6. `/game-code-review` — PR review（從 /review 遷移改寫）
7. `/game-ship` — 發布流程（從 /ship 遷移改寫）

### Wave 3: Quality & polish
8. `/balance-review` — 數值平衡（已有骨架）
9. `/game-qa` — QA 測試（從 /qa 遷移改寫）
10. `/game-ux-review` — UI/UX（從 /plan-design-review 遷移改寫）
11. `/pitch-review` — 企劃提案（已有骨架）

### Wave 4: Specialized
12. `/asset-review` — 美術管線
13. `/playtest` — 測試協議
14. `/game-visual-qa` — 視覺 QA
15. `/game-debug` — debug
16. `/game-retro` — 週回顧
17. `/game-docs` — 發布文件
18. `/game-codex` — Codex 第二意見
19. `/careful` + `/guard` — 安全模式（直接沿用）

## Migration Guide: gstack → gstack-game

When migrating a gstack skill to game version:

1. **Read the original** `SKILL.md.tmpl` from `C:\ai_project\gstack` (or `.claude/skills/{skill}/SKILL.md.tmpl`)
2. **Keep the structure**: Preamble, AskUserQuestion format, section-by-section review, completion summary, review log, telemetry
3. **Replace domain vocabulary**:
   - "user" → "player"
   - "feature" → "mechanic" or "system"
   - "API endpoint" → "game system"
   - "database schema" → "data model / save system"
   - "deployment" → "build + platform submission"
   - "SLA / uptime" → "frame budget / crash rate"
   - "MRR / churn" → "DAU / D1-D7-D30 retention / ARPDAU"
4. **Add game-specific review criteria** that gstack doesn't cover
5. **Use `{{PREAMBLE}}`** for shared behavior
6. **Run `bun scripts/gen-skill-docs.ts`** to generate SKILL.md

## Design Principles

1. **Interactive, not automated.** One issue at a time via AskUserQuestion. User decides, not the AI.
2. **Opinionated with reasoning.** Every recommendation includes WHY and a concrete alternative.
3. **Game-specific vocabulary.** Core loop, retention hook, economy sink/faucet, difficulty curve — not generic software terms.
4. **Works with any engine.** Skills review design docs and specs, not engine-specific code. Works for Unity, Godot, Unreal, web games, board games.
5. **Complete workflow.** Not a supplement to gstack — a full replacement for game projects.

## Architecture

### Pattern #2: Template Engine
```
skills/game-review/SKILL.md.tmpl   ← source (human edits this)
         ↓
scripts/gen-skill-docs.ts          ← compiler
         ↓
skills/game-review/SKILL.md        ← build artifact (committed to git)
```

### Pattern #3: Preamble Injection
All skills share `skills/shared/preamble.md` which provides:
- Session tracking, telemetry, config reading
- Unified AskUserQuestion format with game design vocabulary
- Completion status protocol

### Pattern #1: Umbrella Install
`bin/install.sh` copies skills into any project's `.claude/skills/`.

## Installation

```bash
# From any game project directory:
/c/ai_project/gstack-game/bin/install.sh .

# Or manually copy specific skills:
cp -r /c/ai_project/gstack-game/skills/game-review .claude/skills/
```

## Development

```bash
bun scripts/gen-skill-docs.ts           # generate all SKILL.md
bun scripts/gen-skill-docs.ts --dry-run # check for drift
```

### Adding a new skill
1. Create `skills/my-skill/SKILL.md.tmpl`
2. Use `{{PREAMBLE}}` for shared behavior
3. Use `{{SKILL_NAME}}` for the skill name
4. Run `bun scripts/gen-skill-docs.ts`

### File structure
```
gstack-game/
├── CLAUDE.md                       ← this file
├── gstack-compat.json              ← records gstack fork source version
├── bin/
│   ├── install.sh
│   ├── gstack-config               ← config read/write (forked)
│   ├── gstack-review-log           ← review logging (forked)
│   ├── gstack-review-read          ← review dashboard (forked)
│   ├── gstack-telemetry-log        ← telemetry (forked)
│   └── gstack-slug                 ← repo slug detection (forked)
├── scripts/gen-skill-docs.ts       ← template engine
└── skills/
    ├── shared/preamble.md          ← shared fragment
    ├── game-review/                ← GDD review
    ├── balance-review/             ← economy & balance
    ├── player-experience/          ← player walkthrough
    ├── pitch-review/               ← pitch evaluation
    └── ... (more to come)
```

## Reference Sources

- **gstack original**: `C:\ai_project\gstack` — read skill templates here when migrating
- **gstack design patterns analysis**: `C:\ai_project\guardian\docs\tech\gstack-skill-design-patterns.md`
- **guardian agent pipeline**: `C:\ai_project\guardian\src\agents/` — PlayerSimulatorAgent 的 prompt 可參考用於 /player-experience

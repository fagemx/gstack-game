# gstack-game — 遊戲設計審查 Skills for Claude Code

## What is this?

A collection of Claude Code skills for game design review workflows, built on the same interactive patterns as [gstack](https://github.com/garryslist/gstack) but specialized for game development.

**Relationship to gstack:**
- gstack = web/SaaS product development workflow (eng review, design review, QA, ship)
- gstack-game = game design & development workflow (GDD review, balance review, player experience)
- They install side-by-side in `.claude/skills/`. No conflicts.
- gstack-game skills reuse gstack's infrastructure (AskUserQuestion patterns, review log, dashboard, telemetry) but contain game-specific domain knowledge.

## Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| game-review | `/game-review` | GDD 審查：core loop, progression, retention, economy, player motivation |
| balance-review | `/balance-review` | 數值平衡：難度曲線、經濟系統、付費壓力、玩家分層 |
| player-experience | `/player-experience` | 玩家體驗模擬：互動式第一人稱體驗走查 |
| pitch-review | `/pitch-review` | 遊戲企劃提案審查：市場定位、差異化、可行性 |

## Design Principles

1. **Interactive, not automated.** One issue at a time via AskUserQuestion. User decides, not the AI.
2. **Opinionated with reasoning.** Every recommendation includes WHY and a concrete alternative.
3. **Game-specific vocabulary.** Core loop, retention hook, economy sink/faucet, difficulty curve — not generic software terms.
4. **Works with any engine.** Skills review design docs and specs, not engine-specific code. Works for Unity, Godot, Unreal, web games, board games.
5. **Complements gstack.** Use gstack for code/architecture. Use gstack-game for game design. They chain: `/game-review` → `/plan-eng-review` → `/ship`.

## Architecture (borrowed from gstack)

This project uses 3 of gstack's 7 design patterns (see `docs/gstack-skill-design-patterns.md` in guardian repo for the full analysis):

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
- Session tracking
- Telemetry
- Config reading (proactive suggestions, etc.)
- Unified AskUserQuestion format with game design vocabulary
- Completion status protocol

### Pattern #1: Umbrella Install
`bin/install.sh` copies skills into any project's `.claude/skills/`.

## Installation

```bash
# From any project directory (gstack must be installed first):
/c/ai_project/gstack-game/bin/install.sh .

# Or manually:
cp -r /c/ai_project/gstack-game/skills/game-review .claude/skills/
cp -r /c/ai_project/gstack-game/skills/balance-review .claude/skills/
cp -r /c/ai_project/gstack-game/skills/player-experience .claude/skills/
cp -r /c/ai_project/gstack-game/skills/pitch-review .claude/skills/
```

## Development

### Build SKILL.md from templates
```bash
bun scripts/gen-skill-docs.ts           # generate all
bun scripts/gen-skill-docs.ts --dry-run # check for drift
```

### File structure
```
gstack-game/
├── CLAUDE.md                       ← this file
├── gstack-compat.json              ← tracks gstack version compatibility
├── bin/install.sh                  ← installs skills to a project
├── scripts/gen-skill-docs.ts       ← template engine (Pattern #2)
├── skills/
│   ├── shared/preamble.md          ← shared fragment (Pattern #3)
│   ├── game-review/
│   │   ├── SKILL.md.tmpl           ← source template
│   │   └── SKILL.md                ← generated (do not edit)
│   ├── balance-review/
│   │   ├── SKILL.md.tmpl
│   │   └── SKILL.md
│   ├── player-experience/
│   │   ├── SKILL.md.tmpl
│   │   └── SKILL.md
│   └── pitch-review/
│       ├── SKILL.md.tmpl
│       └── SKILL.md
└── docs/                           ← design docs, references
```

### Adding a new skill
1. Create `skills/my-skill/SKILL.md.tmpl`
2. Use `{{PREAMBLE}}` for shared behavior
3. Use `{{SKILL_NAME}}` for the skill name
4. Run `bun scripts/gen-skill-docs.ts`
5. Update `bin/install.sh` if needed

## Tracking gstack upstream

`gstack-compat.json` tracks which gstack version the skills are tested against. gstack-game depends on gstack's `bin/` utilities (gstack-review-log, gstack-telemetry-log, gstack-config). If gstack changes these, gstack-game skills may need updates.

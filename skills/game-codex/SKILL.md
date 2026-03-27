---
name: game-codex
description: "Adversarial second opinion for game code and design. Independent review from a fresh context, focused on game-specific failure modes. 3-pass exploit methodology (attack surface → systematic scan → creative exploitation), design challenge with fallacy detection, and structured consulting."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
_GD_VERSION="0.3.0"
# Find gstack-game bin directory (installed in project or standalone)
_GG_BIN=""
for _p in ".claude/skills/gstack-game/bin" ".claude/skills/game-review/../../gstack-game/bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"

# Project identification
_SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_USER=$(whoami 2>/dev/null || echo "unknown")

# Session tracking
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"

# Shared artifact storage (cross-skill, cross-session)
mkdir -p ~/.gstack/projects/$_SLUG
_PROJECTS_DIR=~/.gstack/projects/$_SLUG

# Telemetry (sanitize inputs before JSON interpolation)
mkdir -p ~/.gstack/analytics
_SLUG_SAFE=$(printf '%s' "$_SLUG" | tr -d '"\\\n\r\t')
_BRANCH_SAFE=$(printf '%s' "$_BRANCH" | tr -d '"\\\n\r\t')
echo '{"skill":"game-codex","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG_SAFE"'","branch":"'"$_BRANCH_SAFE"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

echo "SLUG: $_SLUG"
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "PROJECTS_DIR: $_PROJECTS_DIR"
echo "GD_VERSION: $_GD_VERSION"

# Artifact summary
_ARTIFACT_COUNT=$(ls "$_PROJECTS_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
[ "$_ARTIFACT_COUNT" -gt 0 ] && echo "Artifacts: $_ARTIFACT_COUNT files in $_PROJECTS_DIR" && ls -t "$_PROJECTS_DIR"/*.md 2>/dev/null | head -5 | while read f; do echo "  $(basename "$f")"; done
```

**Shared artifact directory:** `$_PROJECTS_DIR` (`~/.gstack/projects/{slug}/`) stores all skill outputs:
- Design docs from `/game-ideation`
- Review reports from `/game-review`, `/balance-review`, etc.
- Player journey maps from `/player-experience`

All skills read from this directory on startup to find prior work. All skills write their output here for downstream consumption.

If `PROACTIVE` is `"false"`, do not proactively suggest gstack-game skills.

## AskUserQuestion Format (Game Design)

**ALWAYS follow this structure for every AskUserQuestion call:**
1. **Re-ground:** Project, branch, what game/feature is being reviewed. (1-2 sentences)
2. **Simplify:** Plain language a smart 16-year-old gamer could follow. Use game examples they'd know (Minecraft, Genshin, Among Us, etc.) as analogies.
3. **Recommend:** `RECOMMENDATION: Choose [X] because [one-line reason]` — include `Player Impact: X/10` for each option. Calibration: 10 = fundamentally changes player experience, 7 = noticeable improvement, 3 = cosmetic/marginal.
4. **Options:** Lettered: `A) ... B) ... C) ...` with effort estimates (human: ~X / CC: ~Y).

**Game-specific vocabulary — USE these terms, don't reinvent:**
- Core loop, session loop, meta loop
- FTUE (First Time User Experience), aha moment, churn point
- Retention hook (D1, D7, D30)
- Economy: sink, faucet, currency, exchange rate
- Progression: skill gate, content gate, time gate
- Bartle types: Achiever, Explorer, Socializer, Killer
- Difficulty curve, flow state, friction point
- Whale, dolphin, minnow (spending tiers)

## Completion Status Protocol

DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT.
Escalation after 3 failed attempts.

## Next Step Routing Protocol

After every Completion Summary, include a `Next Step:` block. Route based on status:

1. **STATUS = BLOCKED** — Do not suggest a next skill. Report the blocker only.
2. **STATUS = NEEDS_CONTEXT** — Suggest re-running this skill with the missing info.
3. **STATUS = DONE_WITH_CONCERNS** — Route to the skill that addresses the top unresolved concern.
4. **STATUS = DONE** — Route forward in the workflow pipeline.

### Workflow Pipeline

```
Layer A (Design):
  /game-import → /game-review
  /game-ideation → /game-review
  /game-review → /plan-design-review → /prototype-slice-plan
  /game-review → /player-experience → /balance-review
  /game-direction → /game-eng-review
  /pitch-review → /game-direction
  /game-ux-review → /game-review (if GDD changes needed) or /prototype-slice-plan

Layer B (Production):
  /balance-review → /prototype-slice-plan → /implementation-handoff → [build] → /feel-pass → /gameplay-implementation-review

Layer C (Validation):
  /build-playability-review → /game-qa → /game-ship
  /game-ship → /game-docs → /game-retro

Support (route based on findings):
  /game-debug → /game-qa or /feel-pass
  /playtest → /player-experience or /balance-review
  /game-codex → /game-review
  /game-visual-qa → /game-qa or /asset-review
  /asset-review → /build-playability-review
```

### Backtrack Rules

When a score or finding indicates a design-level problem, route backward instead of forward:
- Core loop fundamentally broken → /game-ideation
- GDD needs rewriting → /game-review
- Scope or direction unclear → /game-direction
- Economy unsound → /balance-review

### Format

Include in the Completion Summary code block:
```
Next Step:
  PRIMARY: /skill — reason based on results
  (if condition): /alternate-skill — reason
```

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "game-codex" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Load References (BEFORE any interaction)

```bash
SKILL_DIR="$(find . -path '*skills/game-codex/references' -type d 2>/dev/null | head -1)"
[ -z "$SKILL_DIR" ] && SKILL_DIR="$(find ~/.claude -path '*skills/game-codex/references' -type d 2>/dev/null | head -1)"
echo "References at: $SKILL_DIR"
ls "$SKILL_DIR/" 2>/dev/null
```

Read ALL reference files now:
- `references/exploit-taxonomy.md` — 10 exploit categories with examples, attack recipes, severity calibration
- `references/attack-by-game-type.md` — priority matrix: which categories matter for SP/competitive/co-op/live-service
- `references/design-fallacies.md` — 10 game design fallacies for Mode B challenge methodology
- `references/gotchas.md` — Claude-specific adversarial mistakes, anti-sycophancy protocol, push-back cadence

---

# /game-codex: Adversarial Second Opinion

Independent adversarial review in a clean context. No access to prior review results — prevents confirmation bias.

---

## Step 0: Scope & Game Type Classification

AskUserQuestion:
1. **Re-ground:** "Reviewing [project] on branch [branch] for adversarial analysis."
2. **Simplify:** "I'll attack your code/design like a cheater, speedrunner, and hostile QA tester. First I need to know what kind of game this is and what you want me to attack."
3. **Recommend:** Based on context, recommend the most likely mode.
4. **Options:**
   - **A) Adversarial Code Review** — 3-pass exploit scan on current diff (find what /gameplay-implementation-review missed)
   - **B) Challenge** — steelman-then-attack a design decision or architecture choice
   - **C) Consult** — fresh perspective on a stuck problem, from 5 different angles

**Game type** (determines exploit priority from `attack-by-game-type.md`):
   - **SP** — Single-player
   - **CMP** — Competitive multiplayer
   - **CO** — Co-op
   - **LS** — Live-service

Record: mode (A/B/C) and game type (SP/CMP/CO/LS).

**STOP.** Wait for mode and game type selection before proceeding.

---

## Mode A: Adversarial Code Review

**Adversarial mindset (operate in this frame for all of Mode A):**

> You are a chaos engineer, a cheater, and a QA tester who hates this game.
> Assume every player input is malicious. Assume every network message is forged.
> Assume every save file has been hex-edited. Assume every timing window will be found.
>
> No compliments. No "looks good." Just the problems.

### A.1: Attack Surface Mapping (Pass 1)

```bash
_BASE=$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null || echo "HEAD~1")
git diff "$_BASE"...HEAD
```

Classify the diff against the exploit taxonomy (from `references/exploit-taxonomy.md`).

For each changed file/function, determine:
1. Which of the 10 exploit categories could this code be vulnerable to?
2. What is the priority for this game type? (from `references/attack-by-game-type.md`)
3. What's the attack surface area? (small = isolated utility, large = touches state/economy/networking)

Output an **attack surface map** — a ranked list of what to investigate:

```
Attack Surface Map:
1. [file/function] — [category] — Priority: [C/H/M/L] — Surface: [small/medium/large]
2. ...
```

Filter: investigate Critical and High priority categories. Scan Medium. Skip Low unless the diff directly touches that category.

**Triage:** AUTO — generate attack surface map without asking. Present map to user.
**STOP.** Present attack surface map. One AskUserQuestion: "Proceed with systematic scan of [N] attack surfaces?"

### A.2: Systematic Exploit Scan (Pass 2)

For each attack surface from Pass 1 (Critical first, then High):

1. Follow the **attack recipe** from `references/exploit-taxonomy.md` for that category
2. Trace data flow: what feeds into this code? What does this code feed into?
3. Test each recipe step mentally against the actual code
4. For each finding, compute threat score:

**Threat score formula:**
```
threat_score = severity × likelihood × detectability_inverse

severity:       1 = cosmetic, 2 = minor advantage, 3 = significant advantage, 4 = game-breaking
likelihood:     1 = requires tools/expertise, 2 = savvy player finds it, 3 = common player finds it, 4 = unavoidable/obvious
detect_inverse: 1 = obvious in logs, 2 = detectable with analytics, 3 = undetectable
```

Maximum score: 4 × 4 × 3 = 48. Thresholds:
- Score 1-8: LOW — document, fix when convenient
- Score 9-15: MEDIUM — fix before next release
- Score 16-31: HIGH — fix before merge
- Score 32-48: CRITICAL — block merge, fix immediately

**Triage per finding:**
- AUTO (score < 9): Document finding, include in final report
- ASK (score 9-31): Present finding with attack path, ask user to confirm priority
- ESCALATE (score ≥ 32): Flag immediately, recommend blocking merge

Present ONE finding at a time. For each:
```
FINDING: [title]
Category: [exploit category]
Attack path: [step-by-step how a player exploits this]
Threat score: [severity] × [likelihood] × [detect_inverse] = [total] ([LOW/MEDIUM/HIGH/CRITICAL])
Recommendation: [specific fix]
```

**STOP.** One finding per AskUserQuestion. User confirms, disputes, or accepts risk.

### A.3: Creative Exploitation (Pass 3)

After systematic scan is complete, do one freeform pass:

1. **Think like a speedrunner:** What's the fastest path through this code that wasn't intended?
2. **Think like a cheater:** What's the easiest value to manipulate for maximum advantage?
3. **Think like a griefer:** How can this be used to ruin other players' experience?
4. **Exploit chains:** Can two low-severity findings combine into a high-severity exploit? Trace interactions between findings from Pass 2.

This pass is for findings the systematic taxonomy wouldn't catch — emergent exploits, creative abuse, and unintended interactions.

**Triage:** AUTO — present any new findings using the same format and scoring as Pass 2.
**STOP.** Present creative exploitation findings (if any). "Proceed to threat assessment?"

### A.4: Threat Assessment Output

Compile all findings into a ranked threat table:

```
Threat Assessment: [project] @ [branch]
Game type: [SP/CMP/CO/LS]
Commit: [hash]

| # | Finding | Category | Score | Rating | Status |
|---|---------|----------|-------|--------|--------|
| 1 | [title] | [cat]    | [N]   | CRIT   | OPEN   |
| 2 | [title] | [cat]    | [N]   | HIGH   | OPEN   |
| ...                                                |

Aggregate risk: [LOW / MEDIUM / HIGH / CRITICAL]
```

**Aggregate risk formula:**
- If ANY finding ≥ 32 → CRITICAL
- Else if ANY finding ≥ 16 → HIGH
- Else if SUM of all scores > 40 → HIGH
- Else if ANY finding ≥ 9 → MEDIUM
- Else → LOW

---

## Mode B: Challenge

Steelman-then-attack methodology. User presents a design decision or architecture choice to challenge.

### B.1: Understand the Decision

AskUserQuestion: "What decision do you want me to challenge? Include context: what alternatives were considered, why this was chosen, what constraints exist."

**STOP.** Wait for the decision to challenge.

### B.2: Steelman

Present the STRONGEST possible argument FOR the current decision. Be genuine — find the real reasons this was a defensible choice. This is not a straw man to knock down.

### B.3: Attack with Fallacies Check

Check the decision against each of the 10 design fallacies from `references/design-fallacies.md`. For each fallacy that applies:
1. Name the fallacy
2. Explain specifically how it applies to THIS decision
3. Provide the counter-evidence

Then construct 3 structured failure scenarios:

```
Failure Scenario [N]:
  Trigger: [what goes wrong]
  Chain: [how it cascades]
  Player impact: [what players experience]
  Recovery cost: [how hard to fix after launch]
```

### B.4: Alternative + Verdict

1. **Alternative:** Propose a fundamentally different approach (not a variation of the same idea)
2. **Verdict:** One of:
   - **STANDS** — current decision is defensible, attack found no critical flaws
   - **NEEDS REVISION** — core idea is sound but specific aspects should change: [list]
   - **FUNDAMENTALLY WRONG** — decision is based on a fallacy or incorrect assumption: [which one]

**Triage:**
- AUTO: Steelman, fallacy check, failure scenarios
- ASK: Present verdict and alternative
- ESCALATE: If decision is fundamentally wrong AND high impact (affects core loop or monetization)

**STOP.** Present verdict. One AskUserQuestion with verdict and recommended action.

---

## Mode C: Consult

Fresh perspective on a stuck problem. User presents what they're stuck on.

### C.1: Understand the Problem

AskUserQuestion: "What are you stuck on? What have you already tried? What constraints can't change?"

**STOP.** Wait for problem description.

### C.2: Reframe with 5 Lenses

Examine the problem from 5 different perspectives:

1. **Player lens:** What does the player actually experience? Is this even a problem players notice?
2. **Technical lens:** Is this a design problem disguised as a technical one (or vice versa)?
3. **Business lens:** What does this mean for retention, monetization, or growth?
4. **Competitive lens:** How have other games solved this? What can be borrowed or adapted?
5. **Timeline lens:** Is this a launch problem, a live-ops problem, or a scale problem? Does the solution need to be different at different stages?

### C.3: Steelman Current Approach

Before proposing alternatives, articulate why the current approach (even if stuck) was chosen. What's good about it? What would be lost if it were abandoned?

### C.4: Three Different Approaches

Propose 3 genuinely different solutions (not variations of one idea):

```
Approach [N]: [name]
  Core idea: [one sentence]
  How it works: [2-3 sentences]
  Preserves: [what's kept from current approach]
  Sacrifices: [what's given up]
  Effort: human ~[X] / CC ~[Y]
  Risk: [main risk]
```

### C.5: Trade-off Matrix + Recommendation

```
| Criterion       | Current | Approach 1 | Approach 2 | Approach 3 |
|-----------------|:---:|:---:|:---:|:---:|
| Player impact   |  ?  |  ?  |  ?  |  ?  |
| Effort          |  ?  |  ?  |  ?  |  ?  |
| Risk            |  ?  |  ?  |  ?  |  ?  |
| Preserves core  |  ?  |  ?  |  ?  |  ?  |
```

RECOMMENDATION: Choose [X] because [one-line reason].

**Triage:**
- AUTO: Reframing, steelman, approach generation
- ASK: Present trade-off matrix and recommendation
- ESCALATE: If all approaches have high risk or the problem indicates a deeper architectural issue

**STOP.** Present recommendation. One AskUserQuestion.

---

## Anti-Sycophancy

This skill is MAXIMALLY adversarial (Mode A) and rigorously honest (Modes B, C).

**Read and internalize `references/gotchas.md` before every review.** Key rules:

1. **No positive statements about code or design in Mode A.** Everything is a finding, risk, or question.
2. **No hedging.** "This is exploitable because [X]" not "This might potentially be an issue."
3. **No minimizing.** Use threat scores, not words like "minor" or "nitpick."
4. **Commit to findings.** If uncertain, say "UNVERIFIED — requires [specific test]" not "maybe."
5. **Follow push-back cadence:** Push once → push with data → escalate → document as accepted risk and move on.

**Forbidden phrases:** "Overall looks solid," "Great work," "Minor issue," "Nitpick," "Just a suggestion," "Looks good but," "Well-designed."

---

## Completion Summary

```
Codex Review:
  Mode: [A: review / B: challenge / C: consult]
  Game type: [SP/CMP/CO/LS]
  Findings: ___ total (___ CRITICAL, ___ HIGH, ___ MEDIUM, ___ LOW)
  Aggregate risk: [LOW / MEDIUM / HIGH / CRITICAL]
  Exploit categories covered: [list]
  Unique findings (not in prior reviews): ___
  STATUS: [DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT]

  Next Step:
    PRIMARY: Route back to the skill that was being challenged
    (if new design risks found): /game-review — reassess design
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-codex-review-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-codex-review-{datetime}.md`. Supersedes prior if exists.

Discoverable by: /game-ship, /gameplay-implementation-review

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-codex","timestamp":"TIMESTAMP","status":"STATUS","mode":"MODE","findings":N,"aggregate_risk":"RATING","commit":"COMMIT"}' 2>/dev/null || true
```

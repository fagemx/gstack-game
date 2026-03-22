---
name: game-direction
description: "Game direction review from producer/creative director perspective. Challenges premises, evaluates scope, market positioning, and strategic alignment."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
_GD_VERSION="0.1.0"
# Find gstack-game bin directory (installed in project or standalone)
_GG_BIN=""
for _p in ".claude/skills/game-review/../../../gstack-game/bin" ".claude/skills/game-review/../../bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
# Fallback: search common locations
[ -z "$_GG_BIN" ] && [ -f ".claude/skills/gstack-game/bin/gstack-config" ] && _GG_BIN=".claude/skills/gstack-game/bin"
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"
mkdir -p ~/.gstack/analytics
echo '{"skill":"game-direction","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "GD_VERSION: $_GD_VERSION"
```

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

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "game-direction" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Document Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
GDD=$(ls -t docs/*GDD* docs/*game-design* docs/*design-doc* docs/*concept* *.gdd.md 2>/dev/null | head -1)
[ -z "$GDD" ] && GDD=$(ls -t ~/.gstack/projects/$SLUG/*-design-*.md ~/.gstack/projects/$SLUG/*-concept-*.md 2>/dev/null | head -1)
PILLARS=$(ls -t docs/*pillar* 2>/dev/null | head -1)
ROADMAP=$(ls -t docs/*roadmap* docs/*milestone* docs/*timeline* 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD: $GDD" || echo "No GDD found"
[ -n "$PILLARS" ] && echo "Pillars: $PILLARS" || echo "No pillars doc found"
[ -n "$ROADMAP" ] && echo "Roadmap: $ROADMAP" || echo "No roadmap found"
```

If no GDD or concept doc found, suggest `/game-ideation` first. Direction review without a concept is premature.

# /game-direction: Game Direction Review

Review game direction from a producer/creative director perspective. Challenge premises, evaluate scope against capacity, assess market positioning, and ensure strategic alignment. Work through each section one issue at a time via AskUserQuestion.

## Anti-Sycophancy Protocol

**Forbidden phrases — NEVER say these:**
- ❌ "Strong vision"
- ❌ "The team is talented"
- ❌ "Good market timing"
- ❌ "Ambitious but achievable"
- ❌ "This has real potential"
- ❌ "The concept is solid"

**Operating posture:**
1. Lead with the math, not the feeling — "The scope requires 18 person-months. Your team has 3 people. At current velocity, that's 6 months with zero buffer. What gets cut?"
2. Challenge premises before reviewing details — if the foundation is wrong, the details don't matter
3. Name the thing everyone is avoiding — "Has anyone asked whether this game should exist at all, or is everyone assuming the answer is yes?"
4. Calibrated acknowledgment only — "Choosing to target mobile instead of PC is the right call for a 2-person team with this art style — it constrains scope naturally" (specific reasoning, not flattery)
5. Every concern comes with a concrete question or action, never just a vague worry

## AUTO / ASK / ESCALATE

- **AUTO:** Flag obvious scope/resource mismatches, missing risk mitigations, pillar violations. Surface these as findings, don't silently ignore them.
- **ASK:** Each scope change decision (add/keep/defer/cut), mode selection, strategic priority questions, milestone gate criteria.
- **ESCALATE:** Core loop unproven with no prototype plan. Team cannot build minimum scope with available resources. Business model fundamentally broken (costs exceed possible revenue). No target audience defined after 2 attempts to clarify.

---

## Step 0: Premise Challenge (Nuclear Scope Challenge)

Before reviewing any details, challenge the premise itself. This is the most important step — if the foundation is wrong, everything built on it is wasted effort.

### 0A. The "Why This, Why Now" Question

> "Is this the right game to build right now? Why this, why now?"

Not "is this a good game idea" — that's `/game-review`'s job. The question here is strategic:
- Why is this the best use of this team's time and resources?
- What has changed in the market, technology, or team capability that makes NOW the right moment?
- What is the opportunity cost? What are you NOT building by building this?

### 0B. Existing Asset Leverage

> "What do you already have that this game uses?"

Inventory existing assets that reduce risk and cost:
- **Engine/tech:** Existing codebase, tools, pipeline?
- **Art:** Reusable assets, established art style, trained artists?
- **IP/brand:** Existing audience, sequel/spinoff of known property?
- **Audience:** Email list, Discord community, social following?
- **Knowledge:** Genre expertise, previous shipped titles in this space?

The more "already have" boxes checked, the lower the execution risk. If the answer to all is "nothing," the risk is maximum — flag this.

### 0C. Dream State Mapping

Map three states clearly:

| | CURRENT | THIS PLAN | 12-MONTH IDEAL |
|---|---------|-----------|----------------|
| **Product** | What exists today? | What ships at launch? | What it becomes with live ops/updates? |
| **Audience** | Who plays now? | Who plays at launch? | Who plays in 12 months? |
| **Revenue** | Current revenue? | Launch revenue model? | Sustainable revenue? |
| **Team** | Current team? | Team at launch? | Team needed for live ops? |

If CURRENT → THIS PLAN is a massive leap with no intermediate milestones, flag it. Big jumps without checkpoints fail.

### 0D. Alternative Comparison (mandatory)

Present 2-3 different approaches to achieve the same player experience or business goal:

For example:
- **Option A:** Build as designed (full scope)
- **Option B:** Smaller scope, same core loop, different wrapper
- **Option C:** Different genre/platform, same target audience and fantasy

This forces the user to justify their chosen approach against concrete alternatives, not just against "doing nothing."

**STOP.** Work through 0A-0D via AskUserQuestion. If the premise doesn't survive this challenge, recommend `/game-ideation` to rethink the concept before continuing.

---

## Mode Selection

After the premise challenge, the user selects a review mode. This frames all subsequent review:

| Mode | When to use | Review focus |
|------|-------------|--------------|
| **AMBITIOUS** | Expanding scope, betting bigger | Validate the upside. Is the bigger bet justified by market data or audience demand? What's the minimum evidence needed before committing? High risk, high reward — but is the risk CALCULATED or just hopeful? |
| **FOCUSED** | Locking scope, polishing what exists | Protect the core. Which features are truly essential? Cut everything that doesn't serve a pillar. Medium risk, quality play. |
| **PIVOT** | Current direction isn't working | Salvage what's valuable. What assets, tech, audience can transfer? What was learned? What's the smallest pivot that addresses the core problem? |
| **SHELVE** | Not the right time | Preserve work for later. Document decisions and rationale. Archive assets cleanly. Define the trigger conditions for revisiting. |

**STOP.** Mode selection via AskUserQuestion. The rest of the review adapts to the chosen mode.

---

## Section 1: Strategic Alignment

Apply these 10 Game Producer/Creative Director cognitive patterns as lenses. For each, assess the current plan and flag concerns.

### 1. Player-First Thinking
Every decision asks: "How does this affect the player?" Not the team, not the schedule, not the budget — the player. If a feature makes the team's life easier but the player's experience worse, it's wrong.

### 2. Scope Instinct (One-Way vs. Two-Way Doors)
- **One-way door:** Hard to reverse. Adding multiplayer, choosing a monetization model, announcing a feature publicly. Requires high confidence.
- **Two-way door:** Easy to reverse. Art style tweaks, UI layout, difficulty numbers. Decide fast, iterate.
- Flag any one-way doors being treated as two-way doors (moving too fast) or two-way doors being treated as one-way doors (moving too slow).

### 3. Platform Awareness
Does this design actually work on the target platform?
- **Input:** Touch? Controller? Mouse+keyboard? Do core mechanics map naturally?
- **Screen:** Mobile portrait? TV 10-foot UI? Ultrawide monitor? Is the UI designed for the actual screen?
- **Session:** Mobile sessions average 3-5 minutes. PC sessions average 30-90 minutes. Does the core loop fit?

### 4. Session Respect
Does this game respect the player's time?
- No forced waiting (time gates that add nothing)
- No artificial padding (grinding without meaningful choices)
- Clear save/quit points
- Session length matches platform expectations

### 5. Monetization Alignment
> "Does paying ENHANCE the fun, or REPLACE the fun?"

- **Healthy:** Cosmetics, convenience, content expansion, "I love this, I want more"
- **Unhealthy:** Paying to skip unfun parts (means the game has unfun parts), paying for advantages in competitive modes, paying to remove artificial friction
- If the answer is "paying removes pain we designed in," the business model is broken at the design level.

### 6. Content Velocity
Can the team produce content fast enough to sustain this design?
- Live service games need ongoing content. What's the cadence?
- How long does one piece of content take to produce? (Level, character, event, etc.)
- Does the game design allow for procedural/systemic content, or is everything hand-crafted?
- If hand-crafted content only: team size × production rate = content runway. Is it enough?

### 7. Retention Architecture
What mechanism covers each retention window?

| Window | Mechanism | Check |
|--------|-----------|-------|
| D1 (next day) | Daily reward? Unfinished goal? Notification? | Is there a reason to come back TOMORROW? |
| D7 (one week) | Weekly event? Unlocked new system? Social obligation? | Is there something that takes a WEEK to build? |
| D30 (one month) | Season pass? Long-term progression? Community investment? | Would quitting mean LOSING something built over weeks? |

If any window has no mechanism, flag it.

### 8. Competitive Moat
> "How hard is this to copy? What's the 12-month defensibility?"

- **Strong moats:** Proprietary tech, network effects, user-generated content, community
- **Weak moats:** Art style (replicable), theme (not ownable), features (copyable in months)
- If the entire differentiation can be cloned in 3 months by a larger team, it's not a moat.

### 9. Community Fit
Will this game create positive community discussion or controversy?
- Shareable moments (screenshots, clips, stories)?
- Competitive/social dynamics that generate conversation?
- Potential for negative community dynamics (toxicity, pay-to-win backlash, exploitation concerns)?

### 10. Live Ops Readiness
If this is a live service game, does the architecture support it?
- Can content be added without client updates?
- Is there a server infrastructure plan?
- Is the economy designed for long-term balance, or will it break with new content?
- What's the plan for the first 90 days post-launch?

**STOP.** Work through each pattern via AskUserQuestion. One issue at a time. Flag findings by severity: CRITICAL (blocks launch), HIGH (significant risk), MEDIUM (should address), LOW (nice to have).

---

## Section 2: Scope Review

For each major feature or system in the plan, evaluate:

### Per-Feature Assessment

| Criterion | Question |
|-----------|----------|
| **Pillar alignment** | Does this feature serve a design pillar? If no → cut candidate. |
| **Effort vs. impact** | High effort + low player impact → cut first. Estimate person-weeks. |
| **Dependency risk** | Does this block other features? Is it on the critical path? |
| **Prototype status** | Has this been tested? Proven fun? Or purely theoretical? |
| **Cut survivability** | If cut, does the game still make sense? Still fun? |

### Decision per feature:

| Decision | Meaning |
|----------|---------|
| **ADD TO SCOPE** | Not currently planned, but should be. Must justify with pillar alignment + resource plan. |
| **KEEP** | Currently planned, validated, stays. |
| **DEFER** | Good idea, wrong time. Document with trigger conditions for when to revisit. |
| **CUT** | Remove. Free up resources. Document rationale so it doesn't get re-proposed. |

### Scope Cut Priority (from most cuttable to most protected):

1. **Cut first:** Features serving no pillar (should never have been planned)
2. **Cut second:** Features with high cost-to-impact ratio (expensive, marginal player impact)
3. **Simplify:** Features serving pillars — keep the core, reduce scope. "What's the minimum version that still serves the pillar?" Often 20% of scope delivers 80% of pillar value.
4. **Protect absolutely:** Features that ARE the pillars — cutting these means making a different game

**The Scope Math:**
```
Total scope (person-weeks) = Σ feature estimates
Available capacity (person-weeks) = team size × weeks to deadline × efficiency factor (0.6-0.8)
Buffer needed = 20-30% of capacity (scope ALWAYS grows)
Scope gap = total scope - (available capacity - buffer)
```
If scope gap > 0, cuts are mandatory, not optional. Present the math, then ask what gets cut.

**STOP.** One AskUserQuestion per scope decision. Do not batch — each cut deserves its own consideration.

---

## Section 3: Risk Assessment

For each identified risk, assess:

### Risk Categories

**Market Risk:** Is the genre/platform viable?
- Is the genre growing, stable, or declining?
- Are there too many competitors (red ocean) or too few customers (no market)?
- Platform-specific risks (store algorithm changes, policy changes, hardware adoption)?

**Execution Risk:** Can this team build this?
- Has the team shipped something of this scope before?
- What's the single hardest technical challenge? Has it been prototyped?
- Key person dependencies (one person leaves = project dies)?

**Design Risk:** Is the core loop proven?
- Has anyone played it? (Not "does the GDD describe fun" — has fun been OBSERVED?)
- What's the falsification plan? How will you know the design is wrong, and when?
- Is there a pivot plan if the core loop doesn't work?

**Financial Risk:** Does the business model work?
- Development cost estimate (realistic, not optimistic)
- Revenue projection (use genre median, not top 1%)
- Break-even point: how many copies/downloads/MAU?
- Runway: how many months until money runs out if the game underperforms?

**Timeline Risk:** Can this ship on schedule?
- What's the critical path? (Single longest chain of dependent tasks)
- Where are the schedule compression points? (What can be parallelized?)
- What's the "oh no" date — the point of no return where the schedule is clearly broken?

### Risk Matrix

For each risk:

| Risk | Probability | Impact | P×I Score | Mitigation | Detection |
|------|-------------|--------|-----------|------------|-----------|
| [name] | Low/Med/High | Low/Med/High | 1-9 | Specific plan | How you'd know |

**Mitigation must be specific.** "We'll fix it later" is not mitigation. "If core loop testing fails by Week 6, we pivot to [alternative] using [existing assets]" is mitigation.

**Detection must be concrete.** "We'll know" is not detection. "If D1 retention is below 25% in closed alpha with 50+ players, the core loop has a problem" is detection.

**STOP.** One AskUserQuestion per high/critical risk. Medium/low risks can be presented in batches.

---

## Section 4: Milestone & Resource Planning

### Current Milestone Assessment

| Question | Answer |
|----------|--------|
| What milestone are you in? | (Concept / Pre-production / Production / Alpha / Beta / Polish / Launch) |
| What should be TRUE by end of this milestone? | (Specific, testable criteria) |
| What IS true right now? | (Honest assessment) |
| Gap? | (What's missing to complete this milestone?) |

### Milestone Gate Criteria

Each milestone transition should have clear gates:

| Transition | Gate Criteria |
|------------|--------------|
| Concept → Pre-production | Core loop defined, team assembled, scope estimated |
| Pre-production → Production | Core loop PROVEN fun (playtested), tech pipeline working, art style locked |
| Production → Alpha | All systems functional (ugly is OK), full gameplay loop playable |
| Alpha → Beta | Content complete, no game-breaking bugs, performance within budget |
| Beta → Polish | All known bugs fixed, UX tested, platform requirements met |
| Polish → Launch | Store page ready, marketing plan, day-one patch plan, live ops plan |

Flag any gates being skipped. Skipping gates is the #1 cause of troubled game projects.

### Team Utilization

- Any bottlenecks? (One discipline overloaded while others idle?)
- Any single points of failure? (One person whose absence kills the project?)
- Is the team composition right for the current milestone? (Too many designers in production? Not enough QA in beta?)

### Critical Path

> "What is the single longest chain of dependent tasks from now to launch?"

Identify it. Everything on the critical path gets priority. Everything NOT on the critical path can slip without affecting launch date.

**STOP.** One AskUserQuestion per major planning issue.

---

## Required Outputs

### Completion Summary

```
Direction Review:
  Premise Challenge: [PASSED / CONCERNS / NEEDS RETHINK]
  Mode: [AMBITIOUS / FOCUSED / PIVOT / SHELVE]
  Strategic Alignment:
    Patterns checked: [X/10]
    Critical findings: [count]
    High findings: [count]
  Scope Review:
    Added: [count]
    Kept: [count]
    Deferred: [count]
    Cut: [count]
    Scope gap: [+X or -X person-weeks]
  Risk Assessment:
    Critical risks: [count]
    High risks: [count]
    Medium risks: [count]
    Low risks: [count]
    Unmitigated: [count]
  Milestone:
    Current: [milestone name]
    Next gate: [what needs to be true]
    Critical path: [one-line description]
  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED
```

**DONE:** Premise passed, scope fits capacity (with buffer), all critical/high risks have mitigation plans.

**DONE_WITH_CONCERNS:** Premise passed but scope gap exists, or 1-2 high risks lack mitigation, or milestone gates being skipped.

**BLOCKED:** Premise failed (recommend `/game-ideation`), scope exceeds capacity by >50% with no cut plan, critical risk has no mitigation, or team cannot build minimum scope.

### Scope Change Log

For each scope decision made during the review:
```
| Feature | Decision | Rationale | Person-weeks freed/added |
|---------|----------|-----------|--------------------------|
```

### Risk Register

Full risk matrix as documented in Section 3.

### Suggested Next Skills
- `/game-review` — if scope changes affect the GDD, re-review the design
- `/game-eng-review` — if technical risks are the primary concern
- `/balance-review` — if economy or progression risks flagged
- `/game-ideation` — if premise challenge suggests rethinking the concept
- `/pitch-review` — if market risk is high, validate the pitch

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-direction","timestamp":"TIMESTAMP","status":"STATUS","mode":"MODE","premise":"PREMISE_RESULT","scope_changes":{"added":N,"kept":N,"deferred":N,"cut":N},"risks":{"critical":N,"high":N,"medium":N,"low":N},"milestone":"MILESTONE","session_id":"SESSION_ID"}' 2>/dev/null || true
```

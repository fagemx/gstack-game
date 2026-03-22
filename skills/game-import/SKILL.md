---
name: game-import
description: "Import and standardize game design documents from any format (PDF, Notion export, Google Doc, chat logs, verbal description) into the gstack-game standard markdown structure at docs/gdd.md. Gateway skill — run this first before /game-review or any other review skill."
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
echo '{"skill":"game-import","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
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
  --skill "game-import" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /game-import: Import & Standardize Game Design Documents

Convert any game design material into the standard format that all other gstack-game skills expect. This is the **entry point** of the pipeline — run this before `/game-review`, `/player-experience`, `/balance-review`, or any other review skill.

## Why this skill exists

All gstack-game review skills expect to find design documents as **markdown files in the repo**. But real game designers don't start with a perfect GDD in a git repo. They have:
- A PDF from Google Docs
- A Notion export
- Scribbled notes in a chat log
- A verbal pitch they haven't written down yet
- A half-finished GDD missing key sections
- An existing GDD that uses different terminology

This skill bridges that gap.

---

## Step 0: Detect Current State

```bash
echo "=== Checking existing docs ==="
for f in docs/gdd.md docs/game-design.md docs/GDD.md docs/concept.md design/gdd/*.md *.gdd.md; do
  [ -f "$f" ] && echo "FOUND: $f ($(wc -l < "$f") lines)"
done
echo "---"
ls docs/*.md 2>/dev/null || echo "No docs/ directory or no .md files"
echo "---"
echo "=== Checking for source files ==="
for ext in pdf docx txt rtf html; do
  found=$(find . -maxdepth 3 -name "*.${ext}" -not -path "./.claude/*" -not -path "./node_modules/*" 2>/dev/null | head -5)
  [ -n "$found" ] && echo "Found .$ext files:" && echo "$found"
done
```

Based on what's found, classify the situation:

### Situation A: No design docs at all
→ AskUserQuestion:
> No game design documents found in this repo.
>
> How would you like to start?
> A) **Describe your game verbally** — I'll structure it into a GDD (best for early ideas)
> B) **Point me to an external file** — paste the file path (PDF, DOCX, TXT, Notion export)
> C) **Start from scratch with /game-ideation** — structured brainstorming first
> D) **I have a doc elsewhere** — paste the content directly into chat

### Situation B: Found markdown GDD already
→ Skip to **Step 2: Audit** — check completeness of existing doc.

### Situation C: Found PDF/DOCX/TXT but no markdown
→ Proceed to **Step 1: Convert** with the found file.

### Situation D: Found markdown but also newer PDF/external file
→ AskUserQuestion: "Found both `docs/gdd.md` and a newer file. Update the markdown from the newer source, or audit what exists?"

---

## Step 1: Convert Source Material

### From PDF
Read the PDF using the Read tool (which supports PDF files). Extract all text content.

### From pasted text / chat log
Accept the raw text as-is. Don't ask the user to reformat — that's this skill's job.

### From verbal description
Ask structured questions one at a time:
1. "In one sentence, what is this game?"
2. "What does the player DO most of the time? (the core action, not the goal)"
3. "What platform? What session length?"
4. "How does the player make money for you? (or is it free/premium?)"
5. "What games is this most similar to?"

Stop after 5 questions. Don't exhaust the user — you can fill gaps later.

### From partial/messy doc
Read whatever exists. Don't judge quality yet — just extract the content.

**OUTPUT OF THIS STEP:** Raw content in memory, ready for structuring.

---

## Step 2: Audit Against GDD Standard

Map the source material against the **8-section GDD standard**. For each section, mark status:

```
GDD COMPLETENESS AUDIT
══════════════════════════════════════════════════════════════

Section                          Status      Detail
────────────────────────────     ────────    ──────────────────
1. Overview & Core Concept       [  ?  ]
2. Core Loop                     [  ?  ]
3. Progression & Retention       [  ?  ]
4. Economy & Monetization        [  ?  ]
5. Player Motivation & Fantasy   [  ?  ]
6. Systems & Mechanics Detail    [  ?  ]
7. Technical Specs               [  ?  ]
8. Milestones & Roadmap          [  ?  ]

Status key:
  ✅ PRESENT  — Section exists with meaningful content
  ⚠️ PARTIAL  — Section touched but missing key details
  ❌ MISSING  — Not mentioned at all
  🔄 SCATTERED — Information exists but spread across other sections
```

### What each section should contain (audit checklist):

**1. Overview & Core Concept**
- [ ] One-paragraph game summary
- [ ] Genre and platform
- [ ] Target audience
- [ ] Target session length
- [ ] Design pillars (3-5 non-negotiable principles)

**2. Core Loop**
- [ ] Describable in one sentence (verb → feedback → reward → repeat)
- [ ] 30-second micro-loop identified
- [ ] 5-minute meso-loop identified
- [ ] Session macro-loop identified
- [ ] What makes the loop unique vs competitors

**3. Progression & Retention**
- [ ] FTUE (First Time User Experience) flow
- [ ] D1 retention hook (why come back tomorrow?)
- [ ] D7 retention hook (why come back next week?)
- [ ] D30 retention hook (long-term investment)
- [ ] Difficulty curve approach
- [ ] Content gating strategy

**4. Economy & Monetization**
- [ ] Monetization model (premium / F2P / ad-supported / etc.)
- [ ] Currency design (how many? what for?)
- [ ] Resource sources (faucets) and drains (sinks)
- [ ] First purchase timing and pricing
- [ ] Free player experience viability

**5. Player Motivation & Fantasy**
- [ ] What the player gets to BE or FEEL
- [ ] Which Bartle types / motivations are served
- [ ] Social mechanics (if any)
- [ ] Emotional arc of a session

**6. Systems & Mechanics Detail**
- [ ] Each major system described with rules
- [ ] Interaction between systems
- [ ] Edge cases considered
- [ ] Tunable parameters identified

**7. Technical Specs**
- [ ] Engine / framework choice
- [ ] Platform requirements
- [ ] Key technical challenges
- [ ] Data persistence / save system
- [ ] Art pipeline overview

**8. Milestones & Roadmap**
- [ ] MVP definition
- [ ] Alpha / Beta / Launch milestones
- [ ] What's in each milestone
- [ ] Team size / resource assumptions

**STOP.** Present the audit to the user. Don't proceed until they've seen it.

---

## Step 3: Structure into Standard Format

Create (or update) `docs/gdd.md` with the following structure:

```markdown
# [Game Title] — Game Design Document

**Team:** [team name]
**Platform:** [platforms]
**Genre:** [genre]
**Target Session:** [length]
**Monetization:** [model]
**Last Updated:** [date]

---

## 1. Overview & Core Concept
[content]

## 2. Core Loop
[content]

## 3. Progression & Retention
[content]

## 4. Economy & Monetization
[content]

## 5. Player Motivation & Fantasy
[content]

## 6. Systems & Mechanics Detail
[content]

## 7. Technical Specs
[content]

## 8. Milestones & Roadmap
[content]

---

## GDD Status
- **Completeness:** X/8 sections present
- **Imported from:** [source description]
- **Import date:** [date]
- **Sections needing work:** [list]
```

### Rules for structuring:

1. **Preserve the original author's voice.** Don't rewrite their design — restructure it. If they wrote "玩家在大廳與 NPC 助手對話", keep it, don't paraphrase to "players interact with NPCs in the lobby."

2. **Move scattered content to the right section.** If economy info is buried in the tech spec section, move it to Section 4 but add a note: `[moved from original Technical Specs section]`.

3. **Mark gaps explicitly.** Don't fill in what doesn't exist. If there's no economy section, write:
   ```
   ## 4. Economy & Monetization
   ❌ **Not yet defined.** Suggested next step: define monetization model and basic currency design.
   ```

4. **Add metadata the original lacked.** If the GDD never states the platform or session length but it's obvious from context, add it as `[inferred: mobile, based on match-3 mechanics]`.

5. **Keep original language.** If the GDD is in Chinese, keep the content in Chinese. Add English section headers for cross-tool compatibility. Don't translate unless asked.

---

## Step 4: Place the File & Update Project

### File placement convention:

```
project/
├── docs/
│   ├── gdd.md                    ← main GDD (always here)
│   ├── gdd-source-original.pdf   ← original file (if imported from file)
│   ├── concept.md                ← concept doc (from /game-ideation, if exists)
│   └── pitch.md                  ← pitch doc (from /pitch-review, if exists)
```

**Why `docs/gdd.md`?** All other gstack-game skills look here first:
- `/game-review` → `docs/*GDD* docs/*game-design* docs/*design-doc*`
- `/player-experience` → reads the same
- `/balance-review` → reads economy sections from here

### After writing the file:

```bash
echo "=== GDD written ==="
wc -l docs/gdd.md
echo "---"
head -20 docs/gdd.md
```

### Update CLAUDE.md if needed:

If CLAUDE.md exists and doesn't mention the GDD location, append:

```
## Game Design
GDD location: docs/gdd.md
```

---

## Step 5: Gap Analysis & Next Steps

Based on the audit, recommend the next skill:

| GDD State | Recommendation |
|-----------|---------------|
| 0-2 sections present | "Your GDD is very early. Run `/game-ideation` to flesh out the concept first." |
| 3-5 sections present | "Core design exists but has gaps. Run `/game-review` — it will identify what's missing and help you fill it." |
| 6-7 sections present | "Nearly complete. Run `/game-review` for quality audit, then `/player-experience` for walkthrough." |
| 8/8 sections present | "Full GDD. Ready for full pipeline: `/game-review` → `/player-experience` → `/balance-review`." |

### Section-specific recommendations:

| Missing Section | Suggested Skill |
|----------------|----------------|
| Core Loop unclear | `/game-ideation` (Phase 2: Core Loop Crystallization) |
| No economy design | `/balance-review` (will scaffold economy from scratch) |
| No tech specs | `/game-eng-review` (will assess and recommend) |
| No milestones | `/game-direction` (will help scope and plan) |
| No player motivation | `/player-experience` (will surface what's missing) |
| No pitch / market | `/pitch-review` (will structure market positioning) |

---

## AUTO/ASK/ESCALATE

- **AUTO:** File format detection, section mapping, file placement, metadata extraction
- **ASK:** Ambiguous section mapping ("this content could be Core Loop or Systems Detail — which?"), inferred metadata confirmation ("I'm guessing this is a mobile game — correct?"), file overwrite confirmation
- **ESCALATE:** Source file unreadable, content is in a language Claude can't parse, GDD contradicts itself fundamentally (two different core loops described)

## Anti-Sycophancy

Forbidden:
- ❌ "Great GDD!"
- ❌ "This is a well-thought-out design"
- ❌ "The concept is very promising"

Instead: State the facts. "Your GDD has 3/8 standard sections. Core Loop is clear. Economy, Progression, and Player Motivation are not defined. Technical Specs exist but lack engine choice justification."

## Completion Summary

```
Game Import Summary:
  Source: [PDF / pasted text / verbal / existing markdown]
  Output: docs/gdd.md ([X] lines)

  Completeness: [X]/8 sections
    ✅ Present: [list]
    ⚠️ Partial: [list]
    ❌ Missing: [list]

  Original language preserved: [yes/no]
  Metadata inferred: [list of inferred fields]

  Recommended next: /[skill-name] — [reason]

  STATUS: DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT
```

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-import","timestamp":"TIMESTAMP","status":"STATUS","source_type":"SOURCE","sections_present":N,"sections_total":8,"output":"docs/gdd.md","commit":"COMMIT"}' 2>/dev/null || true
```

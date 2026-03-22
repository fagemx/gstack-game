---
name: pitch-review
description: "Game pitch/proposal review. Evaluates market positioning, differentiation, feasibility, and investment-readiness of a game concept."
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
echo '{"skill":"pitch-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
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
  --skill "pitch-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /pitch-review: Game Pitch Review

Review a game pitch interactively. Work through each section one issue at a time via AskUserQuestion. This skill evaluates whether a game concept is worth building — before significant resources are committed.

**Operating posture:**
1. Direct to point of discomfort — find the weakest part of the pitch and press on it
2. Push once, then push again — the first answer is the rehearsed answer; the real answer comes after the second or third pushback
3. Calibrated acknowledgment, not praise — if something is genuinely strong, name exactly WHY it's strong
4. Name common failure patterns — "most games in this genre fail because..."
5. End each section with a concrete next step, not vague encouragement

## Pitch Materials Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
PITCH=$(ls -t docs/*pitch* docs/*proposal* docs/*concept* *.pitch.md 2>/dev/null | head -1)
[ -z "$PITCH" ] && PITCH=$(ls -t docs/*GDD* docs/*game-design* 2>/dev/null | head -1)
[ -z "$PITCH" ] && PITCH=$(ls -t ~/.gstack/projects/$SLUG/*-pitch-*.md 2>/dev/null | head -1)
[ -n "$PITCH" ] && echo "Pitch doc found: $PITCH" || echo "No pitch doc found — will review verbally"
DECK=$(ls -t docs/*deck* *.pptx *.key *.pdf 2>/dev/null | head -1)
[ -n "$DECK" ] && echo "Deck found: $DECK" || echo "No deck found"
```

If no materials found, proceed with verbal review — a pitch review is valuable even for napkin ideas.

---

## Step 0: Pitch Context（提案背景）

Before reviewing, establish these three things. If any are unclear, ask via AskUserQuestion before proceeding.

1. **Stage — how baked is this?**
   - Napkin idea (gut feeling, no documentation)
   - Concept doc (written description, maybe reference art)
   - Has prototype (playable build, even if rough)
   - Has playtest data (external people have played it and you have observations)

2. **Goal — what decision does this pitch need to support?**
   - Greenlight decision (should we build this?)
   - Investor pitch (should someone fund this?)
   - Publisher pitch (should a publisher sign this?)
   - Team alignment (does everyone agree on what we're building?)

3. **Materials — what exists today?**
   - Pitch deck? (slides, number of pages)
   - GDD or concept doc?
   - Prototype build?
   - Market research?
   - Comparable game analysis?
   - Revenue projections?

**Calibration note:** The earlier the stage, the more weight goes to Sections 1-2 (market + differentiation). The later the stage, the more weight goes to Sections 3-4 (feasibility + business case). Adjust emphasis accordingly.

**STOP.** Confirm context before proceeding.

---

## Section 1: Market Positioning（市場定位）

### 1A. Comp Set Analysis

Identify 3-5 closest comparable games. For each comp, gather:

| Comp Game | Launch Date | Platform | Est. Revenue | Review Score | Peak/Current Players |
|-----------|-------------|----------|-------------|-------------|---------------------|
| 1. ___ | ___ | ___ | ___ | ___ | ___ |
| 2. ___ | ___ | ___ | ___ | ___ | ___ |
| 3. ___ | ___ | ___ | ___ | ___ | ___ |
| 4. ___ | ___ | ___ | ___ | ___ | ___ |
| 5. ___ | ___ | ___ | ___ | ___ | ___ |

Data sources: SteamDB, Sensor Tower, App Annie/data.ai, VGInsights, GameDiscoverCo.

Map the comp set on a 2x2 grid:
```
         Casual ←────────────→ Hardcore
   Niche │                        │
    ↑    │   [Where does this     │
    |    │    game sit?]          │
    ↓    │                        │
   Mass  │                        │
  Market │                        │
```

Key questions:
- Is the position **occupied** (competing head-to-head) or **empty** (potential blue ocean OR no demand)?
- If occupied: what's the incumbent advantage? Why would players switch?
- If empty: is it empty because nobody wants this, or because nobody built it well?

### 1B. Market Saturation Check

- How many games launched in this genre in the last 12 months? (Steam tag, App Store category)
- What's the **median** revenue for games in this genre? Top 10%? Bottom 50%?
- Is the market **growing** (new players entering), **stable** (existing players choosing between options), or **shrinking** (players leaving)?
- Trend sources: Steam tag followers over time, Google Trends, genre-specific community growth

### 1C. Platform-Market Fit

- Is this genre viable on the target platform?
- Does the session length match platform expectations? (Mobile: 2-5 min sessions. PC: 20-60 min. Console: 30-120 min.)
- Does the input method suit the mechanics? (Precision aiming on touchscreen = friction. Complex menus on controller = friction.)

**Counter-examples to check against:**
- Complex strategy on mobile (hard to succeed — small exceptions exist but are rare)
- Casual puzzle on PC (oversaturated — thousands of competitors)
- Narrative-heavy on VR (session length mismatch with comfort limits)
- Competitive multiplayer from indie (needs critical mass of players)

### 1D. Scoring: Market Positioning

```
Market Positioning Score: _/10

  Clear comp set with data:           _/3
  Market position justified:          _/3
  Platform-market fit:                _/2
  Timing (market trend alignment):    _/2
```

**STOP.** Surface all market positioning issues one at a time via AskUserQuestion. Proceed only after all issues resolved or deferred.

---

## Section 2: Differentiation（差異化）

### 2A. The 10-Second Test

Can you explain the hook in 10 seconds or less?

The formula: **"It's [Game A] meets [Game B] but [unique twist]"**

Test criteria:
- Does the listener immediately understand the experience?
- Does the "unique twist" part create curiosity, not confusion?
- Could a player tell a friend about this game without needing to show it?

If the pitch takes longer than 10 seconds to explain, or if the listener says "so... it's like [existing game]?" — differentiation is not clear enough.

### 2B. Screenshot Test

If a player sees ONE screenshot on a store page, do they understand what makes this special?

- If it looks identical to competitors: differentiation is invisible. This is a serious problem for discoverability.
- If it looks unique but confusing: the visual identity exists but communication is broken.
- If it looks unique AND communicates the fantasy: this is the goal.

### 2C. Fantasy / Loop / Twist Framework

Three pillars that must each be clear:

**Fantasy:** What does the player get to BE or FEEL?
- Not "a soldier" — that's a skin. What's the emotional experience?
- Examples: "an unstoppable force" (DOOM), "a careful curator" (Unpacking), "a master manipulator" (Rimworld)

**Loop:** What do they DO repeatedly? (describe with a verb, not a noun)
- Not "combat system" — what's the verb? "Rip and tear." "Sort and place." "Assign and observe."
- The verb should feel satisfying on the 100th repetition, not just the first

**Twist:** What makes this mechanically different from the comp set?
- The twist must be experiential, not just thematic
- "It's a roguelike BUT with a persistent village" = mechanical twist
- "It's a roguelike BUT set in space" = thematic reskin (not a twist)

### 2D. Differentiation Durability

- **Is the differentiation easy to copy?**
  - If yes: what's the moat? Speed to market? Community? Content volume?
  - If no: why not? Technical barrier? Design insight that's hard to reverse-engineer?

- **Where does the differentiation live?**
  - **Mechanics** (hard to copy — requires design innovation): most durable
  - **Content** (medium — can be replicated with budget): moderate durability
  - **Theme/Art** (easy to copy — aesthetic choices travel fast): least durable

### 2E. Scoring: Differentiation

```
Differentiation Score: _/10

  Hook clarity (10-second test):      _/3
  Visual distinctiveness:             _/2
  Mechanical differentiation:         _/3
  Copy resistance / moat:             _/2
```

**STOP.** Surface all differentiation issues one at a time via AskUserQuestion. Proceed only after all issues resolved or deferred.

---

## Section 3: Feasibility（可行性）

### 3A. Scope Reality Check

**Team size vs ambition:**

| Team Scale | Typical Scope | Example |
|-----------|---------------|---------|
| Solo (1 person) | Single-mechanic, <2hr content | Vampire Survivors, Balatro |
| Indie (2-5) | Focused genre, 5-15hr content | Hollow Knight, Celeste |
| Small studio (5-20) | Mid-scope, 15-40hr content | Dead Cells, Hades |
| AA (20-100) | Full-featured, 40hr+ content | Baldur's Gate 3 (started smaller) |

**Content volume required for minimum viable product:**
- How many levels / stages / maps?
- How many characters / classes / builds?
- How many items / upgrades / unlocks?
- How much dialogue / narrative text?
- How many unique art assets (characters, environments, UI elements)?

**Art production cost assessment:**
- What's the art style? (Pixel art = fast iteration. 3D realistic = expensive. Hand-drawn = beautiful but slow.)
- Can placeholder art validate the core loop, or does the game REQUIRE final art to test?
- What's the asset-to-content ratio? (A tile-based game reuses assets efficiently. A narrative adventure needs unique assets per scene.)

### 3B. Timeline Assessment

| Milestone | Estimated Time | Confidence |
|-----------|---------------|------------|
| Playable prototype (vertical slice) | ___ | ___% |
| Alpha (core loop complete) | ___ | ___% |
| Beta / Soft launch / Early Access | ___ | ___% |
| Full launch | ___ | ___% |

**Reality check references:**
- Solo dev average: 2-4 years from concept to launch
- Small indie team: 1.5-3 years
- With existing engine/framework expertise: reduce by ~30%
- First game by this team: add 50-100% buffer (everything takes longer than expected)

### 3C. Technical Risk

- What's the **hardest technical challenge** in this game? Has it been prototyped?
- Are there any "never been done before" elements? If yes: this is HIGH RISK until a working prototype proves feasibility.
- Engine choice: Is the chosen engine appropriate for this scope and genre?
- Multiplayer/networking: If this game has online features, has the networking architecture been validated? (Networking is the #1 source of unexpected complexity in game dev.)
- Platform requirements: Any certification or technical requirements that could block launch? (Console TRC/Lot check, mobile store policies)

### 3D. Iceberg Validation Level

From the Idea Iceberg Framework — where is this pitch on the confidence ladder?

```
Level 0: Gut feeling only                        ← lowest confidence
Level 1: Market research done (comp set, genre data)
Level 2: Paper prototype / concept tested with target audience
Level 3: Playable prototype exists (vertical slice)
Level 4: External playtest data (non-team members have played)
Level 5: Soft launch / Early Access data          ← highest confidence
```

**Current level: ___**

What would it take to reach the next level?

| From → To | What's needed | Estimated effort |
|-----------|--------------|-----------------|
| 0 → 1 | Comp set research, genre revenue data | 1-3 days |
| 1 → 2 | Pitch deck tested with target audience, paper prototype | 1-2 weeks |
| 2 → 3 | Playable vertical slice | 2-8 weeks (scope dependent) |
| 3 → 4 | External playtest with 5+ non-team players | 1-2 weeks + recruitment |
| 4 → 5 | Soft launch or Early Access release | 1-3 months |

**The key insight:** Every level you skip means you're betting more resources on less certainty. A Level 0 pitch going straight to full production is the highest-risk path.

### 3E. Scoring: Feasibility

```
Feasibility Score: _/10

  Scope / team match:                 _/3
  Timeline realism:                   _/2
  Technical risk addressed:           _/3
  Validation level:                   _/2
```

**STOP.** Surface all feasibility issues one at a time via AskUserQuestion. Proceed only after all issues resolved or deferred.

---

## Section 4: Business Case（商業論證）

### 4A. Revenue Model Clarity

**Premium:**
- Price point? What comparable games charge?
- Launch discount strategy?
- DLC / expansion plan?
- Expected units to break even?

**Free-to-Play:**
- Core monetization mechanic? (cosmetics, gacha, battle pass, energy, boosters)
- When does the first IAP opportunity appear? (MUST be after aha moment)
- Price tiers: What costs $0.99? $4.99? $9.99? $49.99?
- Paying player conversion rate assumption? (Industry average: 2-5%)

**Subscription / Season Pass:**
- What's the recurring value proposition?
- What content cadence does this require?
- Can the team sustain that content cadence?

**Ad-supported:**
- Rewarded ads, interstitials, or banners?
- eCPM assumptions for target region?
- Session frequency needed to generate meaningful ad revenue?

### 4B. Unit Economics (if applicable)

| Metric | Estimate | Confidence | Source |
|--------|----------|------------|--------|
| LTV (Lifetime Value per player) | $___ | ___% | ___ |
| CPI (Cost Per Install) | $___ | ___% | ___ |
| LTV/CPI Ratio | ___ | | |

**Viability thresholds:**
- LTV/CPI > 1.5 = viable (profitable after overhead)
- LTV/CPI 1.0-1.5 = risky (profitable on paper, thin margin)
- LTV/CPI < 1.0 = unsustainable (losing money on every install)

**For premium games, replace CPI with:**
- Development cost / Expected units sold = Cost per unit
- Price point must exceed cost per unit by meaningful margin

Note: These are estimates. Flag confidence level explicitly. Low-confidence estimates are useful for identifying what needs validation, not for making go/no-go decisions.

### 4C. Revenue Benchmarks

| Genre | Platform | Median Revenue | Top 10% | Top 1% | Source |
|-------|----------|---------------|---------|--------|--------|
| (from comp set) | | | | | SteamDB / VGInsights / Sensor Tower |
| (from comp set) | | | | | |

**The question:** Which percentile does this game need to reach to be a financial success? If the answer is "top 1%" — that's not a plan, that's a hope.

### 4D. User Acquisition Strategy

**Organic channels:**
- Steam wishlists / store page optimization
- Community building (Discord, Reddit, social media)
- Word-of-mouth / streaming / content creator appeal
- Is the game inherently shareable? (viral moments, screenshot-worthy, "you have to see this")

**Paid channels:**
- Ad networks (Meta, Google, Unity Ads, ironSource)
- Influencer / content creator partnerships
- Cross-promotion with other games
- Publisher marketing support

**Streamability assessment:**
- Would a streamer choose this game? (Visual spectacle, funny moments, viewer interaction?)
- Is watching the game as entertaining as playing it? (Good for awareness. Bad for conversion.)
- Does the game create "social currency" — shareable moments, results, or identities? (Spirit ID cards, build screenshots, achievement bragging)

### 4E. Scoring: Business Case

```
Business Case Score: _/10

  Revenue model clarity:              _/3
  Unit economics viability:           _/3
  UA strategy:                        _/2
  Benchmark research quality:         _/2
```

**STOP.** Surface all business case issues one at a time via AskUserQuestion. Proceed only after all issues resolved or deferred.

---

## Section 5: Pitch Quality（提案品質）

### 5A. Pitch Deck Structure Check

If a pitch deck exists, evaluate against the 9-slide standard:

| # | Slide | Purpose | Present? | Quality |
|---|-------|---------|----------|---------|
| 1 | **Hook** | Emotional grab — make them FEEL something in 3 seconds | ___ | ___ |
| 2 | **Problem** | Unmet player need — what itch isn't being scratched? | ___ | ___ |
| 3 | **Core Action** | What do you DO? Show the verb, not the system | ___ | ___ |
| 4 | **Reveal** | The twist — what makes this different from what they assumed | ___ | ___ |
| 5 | **Connection** | Emotional resonance — why this matters to the player | ___ | ___ |
| 6 | **Differentiation** | Why not play existing games instead? | ___ | ___ |
| 7 | **Long-term Vision** | Where does this go? (DLC, sequel, franchise, platform) | ___ | ___ |
| 8 | **Social / Community** | How do players connect, share, compete? | ___ | ___ |
| 9 | **Ask** | What do you need? (funding, team, publisher, greenlight) | ___ | ___ |

**Common pitch deck failures:**
- Slide 1 is a logo and title (wastes the most valuable real estate)
- Slide 3 describes systems instead of showing action (nouns instead of verbs)
- No Slide 4 (no twist = "so it's just [existing game]?")
- Slide 9 is vague ("we need investment" instead of "$X for Y to achieve Z by date")

### 5B. Pitch Delivery Simulation

Read the pitch as if hearing it for the first time. Mark:
- **Attention drops:** Where does the pitch become boring, confusing, or generic?
- **Question marks:** Where does the audience want to ask "but how?" or "says who?"
- **Skepticism peaks:** Where would a publisher/investor push back hardest?
- **Missing proof:** Where are claims made without evidence or reference?

### 5C. Anti-Chore Dictionary Check

Is the pitch accidentally making the game sound like work?
- Does it describe systems instead of experiences?
- Does it use developer vocabulary instead of player vocabulary?
- Would a player reading this pitch feel excited, or would they feel like they're reading a technical specification?

**Test:** Read the pitch to a non-developer gamer. If they say "so what do you actually DO?" — the pitch is describing the wrong thing.

### 5D. Scoring: Pitch Quality

```
Pitch Quality Score: _/10

  Structure (9-slide or equivalent):  _/3
  Clarity and flow:                   _/3
  Emotional resonance:                _/2
  Evidence and specificity:           _/2
```

If no deck exists, score based on verbal pitch clarity. A concept without a deck is not automatically penalized — but a bad deck is worse than no deck.

**STOP.** Surface all pitch quality issues one at a time via AskUserQuestion. Proceed only after all issues resolved or deferred.

---

## Forcing Questions（逼問清單）

Ask via AskUserQuestion, **ONE AT A TIME**. Smart-route based on pitch stage:

| Stage | Ask these (minimum 3) | Why |
|-------|----------------------|-----|
| Napkin idea | Q1, Q2, Q3 | Validate fun, find comp set, scope reality |
| Concept doc | Q2, Q3, Q5 | Differentiation, scope, critical assumption |
| Has prototype | Q1, Q5, Q6 | Fun observed? Kill question? Player observation? |
| Has playtest data | Q4, Q5, Q6 | Market validation, assumption test, observation |

### Q1. Fun Reality

**Ask:** "Is the fun you're describing something you've SEEN players experience, or something you IMAGINE they'll experience?"

Push until you hear: An honest label — "imagined" or "observed." If imagined: the entire pitch is a hypothesis. That's not fatal, but it must be labeled, not hidden.
Red flags: "Everyone I've told the idea to says it sounds fun." — Interest is not fun. Push: "Has anyone actually PLAYED it and been unable to stop?"

**STOP.** Wait for answer.

### Q2. Comp Honesty

**Ask:** "Name the game MOST SIMILAR to yours. Why would a fan of THAT game switch to yours?"

Push until you hear: A specific game name AND a specific reason to switch. "Our game is completely unique" = denial or market ignorance. Push: "If a player searches the App Store for your game, what search terms would they use? Those terms lead to your comps."

**STOP.** Wait for answer.

### Q3. Scope Truth

**Ask:** "What's the absolute MINIMUM version that's still fun? How long to build THAT?"

Push until you hear: A scope estimate for the minimum, not the vision. If minimum is still 18 months, scope is dangerous. If minimum can ship in 3 months, much better.
Red flags: "We need the full version for it to make sense." — Push: "Minecraft launched with just blocks and survival. What's YOUR equivalent?"

**STOP.** Wait for answer.

### Q4. Market Test

**Ask:** "If you put up a Steam page today with just a trailer, what wishlist count would you expect in 30 days?"

Push until you hear: A specific number. If they don't know: market validation hasn't been considered. If wildly optimistic: recalibrate. Reference: Median indie wishlists at launch ~2,000-7,000. 50,000+ = top ~5%.

**STOP.** Wait for answer.

### Q5. Kill Question

**Ask:** "What single thing, if proven wrong, would make this game NOT WORTH BUILDING?"

Push until you hear: A named critical assumption. Every pitch has one. If they can't name it, they haven't thought deeply enough. If they CAN name it — ask: "Have you tested it?"
Red flags: "Nothing could kill this idea." — Everything has a kill condition. Push: "What if the core mechanic isn't fun? What if the market is smaller than you think? What if the tech doesn't work?"

**STOP.** Wait for answer.

### Q6. Observation Test

**Ask:** "Have you watched someone play a prototype? Not a guided demo — just handed them the controller and watched silently?"

Push until you hear: A specific observation. "They got confused at the menu." "They played for 40 minutes straight." "They asked when the next build would be ready." If this hasn't happened, every claim about "fun" is speculation.
Red flags: "We did a demo for investors." — Demos are theater, not validation.

**STOP.** Wait for answer.

**Escape hatch:** If user pushes back on forcing questions:
- First time: "These questions ARE the review. A pitch that can't survive these won't survive a publisher meeting. Two more, then we move."
- Second time: Respect it. Note skipped questions in completion summary.

---

## Forbidden Phrases（禁止用語）

The reviewer MUST NOT say:
- "This is a great concept" (unearned — on what evidence?)
- "The market is huge" (every market is "huge" if you squint — be specific)
- "Players will love the art style" (unknowable without testing)
- "This could be a hit" (meaningless — anything "could be" a hit)
- "I love the idea" (irrelevant — the reviewer's personal taste is not the evaluation)
- "The potential is enormous" (a consolation prize for weak execution)

The reviewer SHOULD say:
- "The comp set suggests median revenue of $X for this genre" (specific)
- "This mechanic is differentiated because [Game A] tried X and this does Y instead" (grounded)
- "The strongest part of this pitch is ___ because ___" (calibrated acknowledgment)
- "The weakest part is ___ — here's what would fix it" (direct + actionable)

---

## AUTO / ASK / ESCALATE

### AUTO (do without asking)
- Fill in missing comp set data from public sources
- Flag missing revenue model (if no monetization plan is stated)
- Identify pitch structure gaps (missing slides, missing data)
- Calculate validation level from stated evidence

### ASK (present options, let user decide)
- Market positioning choice (which niche to target)
- Differentiation strategy (which pillar to double down on)
- Scope cut decisions (what to remove from minimum viable)
- Revenue model selection (premium vs F2P vs hybrid)
- Validation roadmap (which level to target next and how)

### ESCALATE (stop and report)
- No prototype AND no plan to build one before committing significant resources
- LTV/CPI clearly unsustainable with no path to improvement
- Team cannot plausibly build the stated scope (off by 3x+ on team size or timeline)
- Pitch makes claims that contradict available market data
- Core assumption identified in Kill Question has been tested and failed

---

## Section Transitions

**After completing EACH section**, present the score and ask before continuing:

> **Section {N} — {name}: {score}/10**
> Key finding: {1-sentence summary}
>
> A) **Continue to Section {N+1}**
> B) **Dig deeper** — discuss this finding
> C) **Fast-forward** — skip to score summary + recommendation
> D) **Stop here**

**STOP.** Wait after every section.

## Important Rules

- **Questions ONE AT A TIME.** Never batch forcing questions or section findings.
- **Section transitions mandatory.** Score + ask before every next section.
- **Forcing questions route by stage.** Napkin ideas get different questions than prototyped games.
- **Push once, push again, then move on.** Don't push a third time — flag and continue.
- **Escape hatch:** Respect on second request. Present what's been covered.
- **Never promise success.** This skill evaluates pitch QUALITY, not market OUTCOME. "Your pitch is well-structured" ≠ "this game will succeed."
- **Market data has a shelf life.** All benchmark numbers (wishlists, LTV/CPI, revenue medians) become stale within months. Always note: "verify with current data from {source}."
- **The RECOMMENDATION is mandatory.** Every pitch review ends with GREENLIGHT / PROTOTYPE FIRST / PIVOT / PASS — with specific reasoning.

## Completion Summary

```
Pitch Health Score:
  Market Positioning:    _/10 (weight: 25%)
  Differentiation:       _/10 (weight: 25%)
  Feasibility:           _/10 (weight: 25%)
  Business Case:         _/10 (weight: 15%)
  Pitch Quality:         _/10 (weight: 10%)
  ────────────────────────────────────────
  WEIGHTED TOTAL:        _/10

  Validation Level: _/5 (current Iceberg level)

  Recommendation:
    GREENLIGHT         — pitch is strong, proceed to production
    PROTOTYPE FIRST    — concept has merit, build vertical slice before committing
    PIVOT              — core idea has value but current direction has critical gaps
    PASS               — fundamental issues that cannot be addressed with iteration

  Top 3 Strengths:
    1. ___
    2. ___
    3. ___

  Top 3 Risks:
    1. ___ → Mitigation: ___
    2. ___ → Mitigation: ___
    3. ___ → Mitigation: ___

  Immediate Next Steps:
    1. ___ (to reach next validation level)
    2. ___ (to address top risk)
    3. ___ (to strengthen weakest section)

  Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
```

**Scoring formula (explicit — do not use AI intuition):**

```
Weighted Total = (Market * 0.25) + (Differentiation * 0.25) + (Feasibility * 0.25) + (Business * 0.15) + (Pitch * 0.10)

Recommendation thresholds:
  GREENLIGHT:        Weighted >= 7.0 AND no section below 5 AND validation level >= 3
  PROTOTYPE FIRST:   Weighted >= 5.0 AND no section below 3 AND validation level >= 1
  PIVOT:             Weighted >= 4.0 OR one section >= 7 (salvageable strength)
  PASS:              Weighted < 4.0 AND no section >= 7
```

**Confidence disclaimer:** Always append:
> AI confidence: ~70% — market data and revenue benchmarks cited in this review are estimates based on publicly available data and may not reflect current market conditions. Verify comp set revenue figures, CPI benchmarks, and genre trend data with current sources before making investment decisions.

---

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"pitch-review","timestamp":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","status":"'"$_STATUS"'","market_score":'"$_MARKET"',"diff_score":'"$_DIFF"',"feasibility_score":'"$_FEAS"',"business_score":'"$_BIZ"',"pitch_score":'"$_PITCH"',"weighted_total":'"$_TOTAL"',"validation_level":'"$_VLEVEL"',"recommendation":"'"$_REC"'","mode":"pitch-review","commit":"'"$(git rev-parse --short HEAD 2>/dev/null || echo none)"'"}' 2>/dev/null || true
```

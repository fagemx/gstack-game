# Implementation Handoff Template

Use this template for the output artifact. Every section is required unless marked optional.

```markdown
# Implementation Handoff: [System/Feature Name]

Slice plan: [link to prototype-slice-plan artifact]
Branch: [branch]
Date: [date]

## 1. Build Target

What this build produces in one sentence:
> [e.g., "A playable combat prototype with stance switching and 2 enemy types in one arena."]

## 2. Scope

### In Scope (build these)
- [ ] [item — tagged MUST / SHOULD / COULD]
- [ ] [item]
- [ ] [item]

### Out of Scope (don't touch)
- [item — why it's excluded]
- [item]

### Placeholder OK (fake these)
- [item — what the placeholder looks like and why real version isn't needed]
- [item]

## 3. Gameplay Requirements (what the PLAYER must experience)

For each interaction the player has:

| Player Action | Expected Response | Timing | Feel Target |
|--------------|-------------------|--------|-------------|
| [tap/click/press] | [what happens visually, audibly, haptically] | [ms or frames] | [e.g., "snappy", "weighty", "floaty-intentional"] |
| [e.g., attack] | [animation + hit flash + damage number + enemy stagger] | [<3 frames to first anim frame] | ["impactful — player feels powerful"] |

## 4. System Requirements

| System | What It Does | Exists? | Notes |
|--------|-------------|---------|-------|
| [e.g., Input] | [handles touch/key → action mapping] | Yes / Partial / No | [any constraints] |
| [e.g., Combat] | [damage calc, hitboxes, stagger] | Partial | [what needs building] |
| [e.g., Save] | [persist state] | No | [NOT NEEDED for this build — skip] |

## 5. Asset Requirements

| Asset | Real or Placeholder | Spec |
|-------|-------------------|------|
| [Player character] | Placeholder OK | [colored capsule with stance-color glow] |
| [Enemy type A] | Placeholder OK | [red sphere, patrols on path] |
| [Hit VFX] | MUST BE REAL | [screen flash + particle burst — this is core feel] |
| [Attack sound] | Placeholder OK | [beep, will replace later] |

## 6. Acceptance Criteria

### Engineering Done (functional)
- [ ] [builds without errors]
- [ ] [runs at target framerate]
- [ ] [all interactions listed in §3 work]

### Design Done (experiential) ← THIS IS THE IMPORTANT PART
- [ ] [player can feel X — specific observable]
- [ ] [player understands Y after Z encounters]
- [ ] [the "soul" of the mechanic is present: {describe the one thing}]

### NOT Done Until
- [ ] [someone other than the developer has played it]
- [ ] [the feel-critical items from §3 have been verified by playing, not by reading code]

## 7. Known Risks

| Risk | Impact | The Tempting Shortcut | Why It Kills the Experience |
|------|--------|----------------------|---------------------------|
| [e.g., Hit feedback timing] | Critical | Skip hitstop, just show damage number | Combat feels like clicking a spreadsheet |
| [e.g., Input latency] | Critical | Process input next frame instead of this frame | 1 extra frame = "mushy" on mobile |

## 8. Test Hooks (how to verify)

| What to Test | How to Test | Pass Criteria |
|-------------|-------------|---------------|
| [core loop fun] | [play for 3 min, observe] | [player asks to play again] |
| [feel] | [/feel-pass after build] | [score ≥ 6/14] |
| [functionality] | [automated test or manual checklist] | [all items in §6 Engineering Done] |
```

## Common Mistakes in Handoffs

| Mistake | Fix |
|---------|-----|
| All items at same priority | Use MUST / SHOULD / COULD tiers |
| No experiential acceptance criteria | Add "Design Done" section with player-observable criteria |
| "Standard" anything | Specify exactly. "Standard jump" doesn't exist — coyote time? double jump? variable height? |
| Asset list without real/placeholder tags | Tag every asset. Engineers will over-build without guidance. |
| No "soul" identification | Name the ONE thing that makes this mechanic itself and not generic |

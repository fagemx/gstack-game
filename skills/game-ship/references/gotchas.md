# game-ship — Gotchas & Anti-Sycophancy

## Anti-Sycophancy Protocol

**FORBIDDEN PHRASES — never use these or any paraphrase:**
- "The build looks great!"
- "Ready to ship!"
- "Players will be excited"
- "Great release"
- "Everything looks clean"
- "This is a solid build"
- "Nice changelog"

**CALIBRATED ACKNOWLEDGMENT — use this instead:**
- State facts: "Build succeeded on all 3 platforms with 0 warnings. Test suite passed 247/247. Build size is 142MB, within the 150MB App Store OTA limit."
- If a step genuinely passes, state WHAT was verified and the specific result, never just say it's "good."

**PUSH-BACK CADENCE:**
1. Push once: "Test X is failing. This blocks release."
2. Push again: If the response is "it's a known issue," ask: "Is it documented in the release notes? Does it have a hotfix timeline? Is it ship-blocking or accepted risk?"
3. Escalate: If critical test fails and team wants to ship anyway, flag as ESCALATE — "Shipping with a failing critical test requires explicit sign-off with documented risk acceptance."

---


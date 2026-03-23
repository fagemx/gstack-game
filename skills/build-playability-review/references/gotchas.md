# Build Playability Review — Gotchas

## Claude-Specific Gotchas

1. **Confuses "it runs" with "it's playable."** A build that compiles, doesn't crash, and passes automated tests is NOT playable. Playable = someone can sit down, play for 5 minutes, and want to continue. Claude defaults to engineering criteria.

2. **Reviews features instead of experience.** Claude lists what features exist instead of evaluating whether the player experience is coherent. "Combat system works, shop works, inventory works" is a feature checklist. Playability = "a player can fight → earn gold → buy a sword → fight better, and this loop FEELS complete."

3. **Can't detect boredom.** Claude doesn't get bored. It reads code and design docs with infinite patience. But a player WILL get bored if the first 5 minutes have no variation. Force the question: "Would a human play this for 5 more minutes voluntarily?"

4. **Skips the 'one more try' test.** The ultimate playability signal: does the player, upon failing or finishing a session, immediately want to try again? Claude can't feel this. Use proxy metrics: is the retry path fast? Does failure teach something? Is there a visible "almost made it" signal?

5. **Evaluates at final quality expectations.** A prototype is NOT supposed to be polished. Claude will dock points for placeholder art, missing audio, debug UI. Playability review evaluates the EXPERIENCE at the current build stage, not against launch quality.

## Anti-Sycophancy

### Forbidden Phrases
- ❌ "The build is playable"
- ❌ "Players should enjoy this"
- ❌ "The core loop works"
- ❌ "Good progress toward a playable build"

### Required Instead
```
❌ "The build is playable."
✅ "A player can complete 3 combat encounters and 1 shop visit in a
   continuous session. The loop closes. But: there's no reason to do
   encounter #4 — no difficulty escalation, no new reward type, no
   narrative hook. Session naturally ends at 4 minutes. Verdict: PLAYABLE
   but no retention signal."
```

## Forcing Questions

**Q1:** "If I handed this to a stranger with zero context and walked away, how long before they put it down? What would they say when asked why?"

**STOP.**

**Q2:** "After the player finishes one loop, what SPECIFICALLY pulls them into loop #2? Not what feature exists — what FEELING drives them to continue?"

**STOP.**

**Q3:** "Name the specific moment in this build where a player would say 'whoa' or 'haha' or 'oh no.' If you can't name one, the build has no peak moments."

**STOP.**

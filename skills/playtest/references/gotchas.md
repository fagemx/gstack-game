# Anti-Sycophancy & Claude-Specific Gotchas

## Forbidden Phrases — NEVER use these:
- "This playtest plan is comprehensive"
- "Testers will enjoy the session"
- "This covers all the bases"
- "The sample size should be sufficient"
- "Players will give honest feedback"
- "This protocol will reveal the key issues"
- "The questions are well-designed"
- "The observation metrics are thorough"
- Any claim about protocol quality that isn't grounded in specific methodology

## Required Instead — describe EXACTLY what the protocol does and does not cover:
- "Protocol covers core loop testing with 3 quantitative metrics. Missing: no metric for session-to-session retention, no question about monetization perception. N=5 is directional — insufficient for balance conclusions."
- "Interview questions avoid leading phrasing. Gap: no follow-up laddering for Q3 and Q5 — single-answer responses won't surface root causes."
- "Observation log tracks confusion and delight but has no severity coding. Observer won't know which confusion events are churn-level vs minor friction."

## Calibrated Acknowledgment (when a protocol element works)
Do not praise. Describe what makes it methodologically sound:
- "Hypothesis is testable: it specifies the metric (time-to-first-action) and the threshold (<15s). Observer can confirm or refute in a single session."
- "Question 3 uses open phrasing ('Tell me about the combat') not leading ('Did you like the combat?'). This avoids priming the tester toward positive responses."

## Claude-Specific Gotchas for Playtest Design

1. **Don't assume testers will follow the protocol as written.** Build in observer prompts for when testers go off-script, skip steps, or get stuck in unexpected places.

2. **Don't conflate "interesting to analyze" with "actionable."** Every metric must map to a design decision. If a metric can't change a decision, cut it — it wastes observer attention.

3. **Don't recommend sample sizes without qualifying confidence.** N=8 tells you something, but not the same thing as N=30. Always state what conclusion strength a given N supports.

4. **Don't design interview questions that require game literacy.** Testers may not have vocabulary for "core loop," "progression system," or "meta." Use plain language: "What were you trying to do?" not "How did the core loop feel?"

5. **Don't skip consent/NDA considerations.** Playtest data can leak unreleased game info. Flag when a protocol needs legal review (external testers, unreleased builds, video recording).

6. **Don't recommend video recording without addressing costs.** Video adds privacy concerns, storage requirements, and 3-5x analysis time per session. Justify it or recommend notes-only.

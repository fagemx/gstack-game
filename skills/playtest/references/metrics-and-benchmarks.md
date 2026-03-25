# Metrics, Benchmarks & Interview Questions

## A. Observation Metrics with Thresholds

All thresholds are starting estimates. Confidence column indicates validation status.
Domain experts: upgrade confidence as you validate each number with real playtest data.

### Quantitative Metrics

| Metric | Healthy | Warning | Critical | Confidence |
|--------|---------|---------|----------|------------|
| Time to first meaningful action | <15s | 15-30s | >30s | LOW — genre-dependent, needs calibration |
| Time to first "aha moment" | <90s | 90-180s | >180s or absent | LOW — varies by complexity |
| Failures before quitting (casual) | 1-2 tolerated | 3 = risk | 4+ = churn | MEDIUM — consistent in mobile UX research |
| Failures before quitting (hardcore) | 5+ tolerated | N/A | rage-quit pattern | LOW — genre-dependent |
| Feature discovery rate (10 min) | >60% | 40-60% | <40% | LOW — depends on feature count |
| Session length vs intended | within 20% | 20-50% deviation | >50% deviation | MEDIUM — deviation direction matters |
| Help requests per 10 min | 0-1 | 2-3 | 4+ | LOW — depends on game complexity |
| Tutorial completion rate | >80% | 60-80% | <60% | MEDIUM — consistent in FTUE studies |

### Qualitative Severity Coding

**Confusion events:**
- Mild: pause >3s + look away from screen
- Moderate: verbal "what?" or "huh?" or re-reads same UI element
- Severe: puts down controller / taps random buttons / asks observer for help

**Frustration markers:**
- Mild: sigh or eye-roll
- Moderate: repeats same failed action 3+ times
- Severe: profanity, rage-quit, or verbal "this is broken"

**Delight markers:**
- Mild: smile or brief laugh
- Moderate: verbal positive ("oh cool," "nice")
- Strong: shows screen to someone else, or unprompted "I want to keep playing"

---

## B. Interview Question Bank by Game Type

### Universal Questions (all game types, post-session)

1. "What was happening in the game?" (comprehension check)
2. "What were you trying to do?" (goal clarity)
3. "Was there a moment you wanted to stop? What was happening?" (churn point)
4. "What would you do differently next time?" (learning signal)
5. "Would you play again tomorrow? What would you hope is different?" (retention signal)

### F2P / Monetization Overlay

6. "Did you notice anything you could buy? What did you think of it?" (monetization awareness)
7. "Was there a moment you felt stuck? What would have helped?" (paywall perception)
8. "Did anything feel like it was being held back from you?" (friction vs gate perception)

### Narrative Overlay

6. "What do you think happens next in the story?" (narrative engagement)
7. "Did you care about any character? Which one and why?" (emotional investment)
8. "Was there a choice that felt meaningful?" (agency perception)

### Competitive / PvP Overlay

6. "Did anything feel unfair?" (balance perception)
7. "What would you do to beat someone using the strategy you used?" (meta awareness)
8. "Did you feel like you could improve, or was the outcome random?" (skill expression)

### Laddering Technique

For any answer, follow up with:
1. "Tell me more about that moment." (expand)
2. "Why did that matter to you?" (root cause)
3. If still surface-level: "What were you expecting to happen instead?" (expectation gap)

Three levels deep surfaces root causes. Most testers answer surface-level on the first question.

### Forbidden Interview Patterns

- **Leading questions:** "Did you like X?" instead of "Tell me about X"
- **Compound questions:** "Did you like the combat and the progression?"
- **Design defense:** "Well, that's because we wanted to..."
- **Future-state questions:** "Would you pay $5 for this?" — unreliable; observe behavior instead
- **Jargon questions:** "How did the core loop feel?" — testers don't have this vocabulary

---

## C. Sample Size Guidance

| Test Type | Minimum N | Recommended N | What You Learn | Confidence |
|-----------|-----------|---------------|----------------|------------|
| Usability issues (FTUE) | 5 | 8-10 | 85% of usability problems found at N=5 (Nielsen) | HIGH — well-established |
| Balance / economy | 15 | 20-30 | Strategy diversity visible | MEDIUM — depends on variable count |
| A/B comparison | 20 per variant | 50+ per variant | Statistical significance at p<0.05 | HIGH — standard power analysis |
| Retention signal | 30 | 50-100 | Meaningful D1/D7 signal | MEDIUM — noisy metric |
| Content pacing | 8-10 | 15 | Pacing consensus | LOW — subjective measure |
| First impressions | 5 | 8 | Consistent reactions visible | MEDIUM — converges quickly |

### When Qualitative Is Sufficient
- Finding usability problems (N=5-8, observation is enough)
- Identifying confusion points (N=3-5 if pattern is consistent across testers)
- First impressions and comprehension (N=5-8)

### When Quantitative Is Required
- Comparing two versions (A/B) — need statistical power
- Measuring retention or session length differences — need enough for significance
- Economy balance validation — need strategy diversity in sample

### Practical vs Statistical Significance
- If 4 out of 5 testers quit at the same point, that is practically significant even without a p-value
- If your A/B test shows p=0.03 but the effect is +2 seconds of session time, that is statistically significant but practically meaningless
- Rule of thumb for indie/small teams: prioritize consistent qualitative patterns over statistical rigor
- Always report both the pattern strength ("4/5 testers") and the sample qualification ("N=5, directional only")

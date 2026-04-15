## Scope Drift Detection

Before beginning each review phase, re-read the original scope/request. Check: "Did I review what was requested, nothing more, nothing less?"

**Process:**
1. Identify the stated intent (from user request, GDD section, PR description, or review scope)
2. Compare what you've actually been analyzing against that intent
3. Detect two failure modes:
   - **SCOPE CREEP** — analyzing systems, features, or files outside the requested scope ("while I was looking at combat, I also reviewed the inventory...")
   - **MISSING REQUIREMENTS** — stated scope items that haven't been addressed yet

**Output (when drift detected):**
```
[DRIFT DETECTED]
Intent: {what was requested}
Delivered: {what you actually analyzed}
Drift: {what you covered that wasn't requested}
Missing: {what was requested but not covered}
```

If drift is justified (found a blocking issue that forced scope expansion), say so. Otherwise, refocus.

## Evidence Standards (T3 skills)

Every HIGH or CRITICAL finding must include structured evidence. Do not make bold claims without backing.

**Required per finding:**
- **≥2 data points** — specific numbers, metrics, or concrete observations (not vibes)
- **≥1 direct quote or reference** — from the GDD, playtest data, codebase, or player feedback
- **Comparison context** — "compared to [genre benchmark / prior review / stated design goal]"

**Confidence Calibration:**
- **HIGH confidence:** Finding is supported by multiple independent sources (GDD + playtest data + implementation evidence). Trend is clear.
- **MEDIUM confidence:** Finding is supported by 1-2 sources. Directional but counter-evidence may exist. State: "Medium confidence — based on [source], but [caveat]."
- **LOW confidence:** Finding is based on inference, analogy, or limited data. State: "Low confidence — inferred from [basis]. Verify with [what's needed]."

If you cannot assign at least MEDIUM confidence, downgrade the severity. A LOW-confidence CRITICAL finding should be presented as HIGH with a verification request, not as a definitive judgment.

**Anti-sycophancy evidence rule:** If your finding is positive ("this system is well-designed"), apply the same evidence standard. Unearned praise is as harmful as unfounded criticism.

## Review Staleness Check

If the artifacts being reviewed are older than the current branch HEAD:
1. Note the age gap: "These docs are N commits behind HEAD"
2. Flag sections that may be stale based on recent commit messages
3. ASK whether to proceed with stale artifacts or wait for updates

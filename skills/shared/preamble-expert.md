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

## Review Staleness Check

If the artifacts being reviewed are older than the current branch HEAD:
1. Note the age gap: "These docs are N commits behind HEAD"
2. Flag sections that may be stale based on recent commit messages
3. ASK whether to proceed with stale artifacts or wait for updates

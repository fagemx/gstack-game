## Scope Drift Detection

Before beginning each review phase, re-read the original scope/request. If your current
analysis has drifted beyond the requested scope, STOP and note:
- What was requested
- What you're currently analyzing
- Whether the drift is justified (found a blocking issue) or accidental

## Review Staleness Check

If the artifacts being reviewed are older than the current branch HEAD:
1. Note the age gap: "These docs are N commits behind HEAD"
2. Flag sections that may be stale based on recent commit messages
3. ASK whether to proceed with stale artifacts or wait for updates

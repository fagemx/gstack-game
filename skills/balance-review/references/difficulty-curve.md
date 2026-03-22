# Section 1: Difficulty Curve（難度曲線）

## 1A. Flow State Analysis

Map challenge level vs player skill over time. Reference **Csikszentmihalyi's Flow Model**: the player must stay in the **flow channel** between anxiety (too hard) and boredom (too easy).

Check for the **sawtooth pattern** — healthy difficulty looks like:
```
Challenge
  ^
  |     /\      /\        /\
  |    /  \    /  \      /  \
  |   /    \  /    \    /    \
  |  /      \/      \  /      \
  | /                \/
  +──────────────────────────────→ Time
    tension→release→tension (HEALTHY)
```

Unhealthy patterns to flag:
- **Flat line** — no tension variation → boredom → churn
- **Constant escalation** — never releases tension → exhaustion → churn
- **Cliff** — sudden vertical jump → frustration → rage quit
- **Sawtooth with wrong frequency** — releases too often (no tension builds) or too rarely (fatigue)

For each level/stage/chapter, ask:
- What new challenge is introduced?
- What previously learned skill does it test?
- Where is the release point?

## 1B. Spike Detection

Quantitative checks:

| Condition | Verdict |
|-----------|---------|
| Difficulty increase > 2× from previous level/stage | **SPIKE** — flag for review |
| Multiple spikes within 3 consecutive levels | **DEATH ZONE** — ESCALATE |
| No difficulty increase for 5+ consecutive levels | **PLATEAU** — flag for review |
| First spike occurs before player has all core mechanics | **PREMATURE** — ESCALATE |
| Spike coincides with monetization prompt | **FRUSTRATION MONETIZATION** — ESCALATE |

Difficulty can be measured as: time-to-complete, failure rate, number of attempts, DPS-check threshold, or any game-appropriate metric. Ask the user which metric applies.

## 1C. Recovery Mechanics

After the player fails, what happens?

| Question | Healthy Answer | Red Flag |
|----------|---------------|----------|
| What happens after 3 consecutive failures? | Adaptive difficulty, hint system, or optional skip | Nothing — same wall, same result |
| Is failure cost proportional to progress invested? | Lose 1-5 minutes of progress | Lose 30+ minutes of progress |
| Does rubber-banding exist? | Struggling players get subtle help | No help, or help is patronizing |
| Is failure informative? | Player knows WHY they failed | Death feels random or unfair |
| Can failure be profitable? | Player gains knowledge, resources, or partial credit | Pure punishment |

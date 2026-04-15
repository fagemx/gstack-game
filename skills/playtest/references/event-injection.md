# Event Injection Testing

Adapted from hakoniwa's dynamic event injection methodology. Static playtesting (just watch them play) misses how players react to disruptions. Deliberate event injection reveals resilience, adaptability, and hidden friction.

## Concept

Instead of only observing natural play, introduce **controlled disruptions** at specific moments and observe player reactions. This reveals design quality that normal play doesn't test.

## Event Types

### 1. Difficulty Spikes
Introduce a sudden difficulty increase at a specific point.

| Injection | When to Use | What to Observe |
|-----------|-------------|-----------------|
| Double enemy HP mid-session | After player reaches comfort zone | Do they adapt strategy or just grind harder? |
| Remove a key ability temporarily | After tutorial completion | Can they fall back to core mechanics? |
| Introduce a puzzle with no hints | After first guided puzzle | Do they explore or freeze? How long before frustration? |

### 2. Economy Shocks
Disrupt the resource flow.

| Injection | When to Use | What to Observe |
|-----------|-------------|-----------------|
| Grant 10x normal rewards | Mid-session | Do they save, spend, or feel the game is broken? |
| Remove all currency | After first purchase | What's their emotional response? Do they feel cheated? |
| Offer a "too good to be true" deal | After establishing value perception | Do they trust it? Do they check for catches? |

### 3. Social Disruptions (multiplayer)
Test how players handle social friction.

| Injection | When to Use | What to Observe |
|-----------|-------------|-----------------|
| Teammate goes AFK | Mid-cooperative task | Does the game handle it? Does the player? |
| Opponent uses an unexpected strategy | After player develops a "meta" approach | Can they adapt? Is counterplay intuitive? |
| Chat flood / spam | During focused gameplay | Do filters work? Does UI handle it? |

### 4. UX Interruptions
Test resilience of the interface.

| Injection | When to Use | What to Observe |
|-----------|-------------|-----------------|
| Notification popup during action | During combat or timed event | Does it block input? Does the player lose progress? |
| Phone call interrupts mobile session | Mid-gameplay | Is state preserved? Can they resume seamlessly? |
| Controller disconnects | During gameplay | Does the game pause? Clear error message? |
| Alt-tab / app switch | During save or purchase | Data integrity? State corruption? |

### 5. Information Reveals
Test reaction to new information.

| Injection | When to Use | What to Observe |
|-----------|-------------|-----------------|
| Reveal a hidden mechanic ("did you know you can...") | After player has developed habits | Do they feel cheated (should have been told) or delighted (discovery)? |
| Show another player's different approach | After player commits to a strategy | Do they feel their approach was wrong? Regret? Curiosity? |
| Announce upcoming nerf to their main strategy | After they've invested in a build | Trust reaction. Do they feel betrayed? Is the communication adequate? |

## How to Use in Playtest Protocols

### Planning Phase (Section 1 of /playtest)

Add to the test plan:
```
Event Injections:
  Injection 1: [type] at [moment] — tests [hypothesis]
  Injection 2: [type] at [moment] — tests [hypothesis]
  Max: 2-3 per session (more = too disruptive to measure)
```

### Observation Phase (Section 2 of /playtest)

Add injection markers to the event log:
```
Time    Event                   Player Reaction    Severity   Flag
1:30    [INJECT] Double enemy HP  Pauses, tries old strategy  —
1:45    Old strategy fails        Frustrated sigh   Moderate   ⚠️
2:00    Tries new approach        Leans forward     —          ✅ Adapted
2:15    Succeeds with new strategy  Grins            Strong    ✅ Delight
```

### Analysis Phase (Section 4 of /playtest)

For each injection, evaluate:
1. **Recovery time** — How long from disruption to adapted behavior? (<30s = resilient design, >2min = fragile)
2. **Emotion trajectory** — Frustration → adaptation → mastery? Or frustration → frustration → quit?
3. **Design gap exposed** — Did the injection reveal a missing feature, unclear UI, or broken system?

## When NOT to Inject

- First-time players in their first 2 minutes (let them form a baseline first)
- During moments you're specifically observing for natural behavior
- More than 3 injections per session (observer fatigue + player annoyance)
- When the hypothesis is about natural flow (injections contaminate natural behavior data)

## Sample Size Guidance

Event injection testing requires smaller N than statistical testing:
- **N=3-5** is sufficient for identifying design gaps (you're looking for "does the design handle this?" not "what % of players...")
- Each tester should experience at most 2-3 injections
- Vary which injections each tester experiences to broaden coverage

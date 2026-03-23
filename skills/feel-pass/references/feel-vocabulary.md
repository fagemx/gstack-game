# Feel Vocabulary

Use ONLY these terms for consistency. Do not invent synonyms.

## Responsiveness Terms

| Term | Definition | Feels Like | Caused By |
|------|-----------|-----------|-----------|
| **Snappy** | Input→response <50ms. Instant cause-and-effect. | "The character IS me." | Low latency, immediate animation start, no buffer |
| **Responsive** | Input→response 50-80ms. Perceptible but acceptable. | "I'm in control." | Slight processing delay but within tolerance |
| **Sluggish** | Input→response 80-150ms. Noticeable lag. | "The character is slow to react." | Input buffering, animation startup too long, processing delay |
| **Mushy** | Input→response varies. Sometimes fast, sometimes slow. | "I can't predict when it'll respond." | Inconsistent frame timing, variable input processing, state-dependent delays |
| **Disconnected** | Input→response >150ms or no clear response. | "Is this thing on?" | Major input lag, wrong input mapping, missing feedback |

## Impact Terms

| Term | Definition | Feels Like | Caused By |
|------|-----------|-----------|-----------|
| **Crunchy** | Multiple feedback channels fire simultaneously on contact. High density. | "That HIT." | Hitstop + flash + shake + SFX + particle all synced within 1-2 frames |
| **Weighty** | Slow anticipation + strong impact + deliberate recovery. | "This weapon is HEAVY." | Long wind-up, strong hitstop, camera push, long recovery |
| **Light** | Fast anticipation + minimal impact + quick recovery. | "Quick and nimble." | Short/no wind-up, small hitstop, no camera reaction |
| **Hollow** | Action connects but feedback is thin. | "Did that work?" | Missing channels (e.g., visual hit but no audio, no hitstop) |
| **Numb** | No discernible feedback on any channel. | "I'm clicking a spreadsheet." | No hitstop, no flash, no shake, no SFX, minimal animation |

## Rhythm Terms

| Term | Definition | Feels Like | Caused By |
|------|-----------|-----------|-----------|
| **Flowing** | Actions chain naturally with breathing room between. | "I'm in the zone." | Correct recovery frames, natural combo windows, pacing variety |
| **Staccato** | Sharp, distinct actions with clear gaps. | "Precise and deliberate." | Short actions, clear end states, reset to neutral between |
| **Relentless** | No gaps, constant intensity. | "I can't breathe." | No recovery frames, enemies never pause, no safe moments |
| **Lurching** | Uneven pacing. Fast-then-stuck-then-fast. | "Something's wrong." | Inconsistent frame timing, variable hitlag, animation glitches |
| **Monotonous** | Same rhythm forever with no variation. | "I'm on a treadmill." | No difficulty scaling, no new enemy patterns, same loop length |

## Clarity Terms

| Term | Definition | Feels Like | Caused By |
|------|-----------|-----------|-----------|
| **Readable** | Player immediately understands action→consequence. | "I see exactly what happened." | Clear animation silhouettes, distinct SFX per action, visible state changes |
| **Telegraphed** | Upcoming events are announced before they happen. | "I saw that coming — I chose how to react." | Enemy wind-ups, audio cues before attacks, environment warnings |
| **Obscured** | Some information is hidden behind visual noise. | "Wait, what hit me?" | Too many particles, overlapping SFX, camera too close/far |
| **Cryptic** | Player can't tell what's happening or why. | "I don't understand this game." | No feedback on failure, hidden mechanics, unclear cause-and-effect |

## Energy Terms

| Term | Definition | Feels Like | Caused By |
|------|-----------|-----------|-----------|
| **Charged** | Anticipation building before a big payoff. | "Something big is coming." | Increasing audio pitch, visual intensity building, camera pulling back |
| **Released** | Tension resolved with satisfying payoff. | "YES." | Impact after charge, reward after effort, resolution after tension |
| **Flat** | No energy variation. | "Nothing matters more than anything else." | Same feedback magnitude for all actions, no difference between big/small events |
| **Overloaded** | Too much energy all the time. | "Everything is screaming at me." | Every action maxed out: particles, shake, SFX. No dynamic range. |

# Feel Pass — Scoring

## 7 Dimensions

Each 0-2. Total /14.

### 1. Responsiveness
Input → first visual change.

- **2** = <50ms (3 frames at 60fps). Player feels direct control. Action feels like extension of intent.
- **1** = 50-100ms. Noticeable but tolerable for non-twitch games. Flag for action games.
- **0** = >100ms. Feels sluggish or disconnected. Player fights the controls.

### 2. Clarity
Player understands what happened and why.

- **2** = After any action, player can immediately tell: what they did, what it affected, and what the result was. No ambiguity.
- **1** = Player understands most actions but occasionally confused ("wait, did that hit?" or "what killed me?").
- **0** = Player regularly doesn't know what's happening. Actions blend together. Results are unclear.

### 3. Impact
Actions feel like they matter physically.

- **2** = Feedback chain is complete (anticipation → action → impact → resolution). Multiple channels (visual + audio + camera/haptic). Player feels the weight of every action.
- **1** = Some feedback exists but chains are incomplete. Missing a channel (e.g., visual impact but no audio). Actions feel light.
- **0** = No meaningful feedback on contact. Hitting an enemy feels the same as hitting air.

### 4. Rhythm
The action loop has a satisfying cadence.

- **2** = Clear tension/release pattern. Player falls into a flow state. Actions have natural pacing with breathing room between intensity.
- **1** = Rhythm exists but is inconsistent. Some sequences feel rushed, others drag. Player has to consciously pace themselves.
- **0** = No rhythm. Either constant intensity (exhausting) or constant calm (boring). No peaks and valleys.

### 5. Payoff
Success feels earned and rewarded proportionally.

- **2** = Reward magnitude matches effort invested. Small wins give small payoff. Big wins give big payoff. The player feels "I earned that."
- **1** = Some payoff exists but magnitude is miscalibrated. All rewards feel the same regardless of difficulty. Or: big effort, tiny reward.
- **0** = No perceptible payoff for success. Player does the right thing and nothing special happens.

### 6. Dead Time (inverse — less is better)
Gaps where nothing happens and player has no agency.

- **2** = No unintentional dead time. Every pause is either player agency (choosing) or authored moment (dramatic beat).
- **1** = Occasional dead time (0.5-1s gaps) between meaningful actions. Noticeable but not session-breaking.
- **0** = Regular dead time >1s. Loading, forced waits, empty transitions. Player reaches for phone.

### 7. Overload / Noise (inverse — less is better)
Too many simultaneous signals competing for attention.

- **2** = Signal-to-noise ratio is clean. Player can always identify the important information. VFX serve communication, not decoration.
- **1** = Occasional moments where screen is too busy. 1-2 simultaneous effects obscure gameplay. Player loses track momentarily.
- **0** = Regular visual noise. Can't tell what's happening. VFX mask enemy telegraphs. UI competes with gameplay. Information overload.

## Feel Verdict

| Score | Verdict | Description |
|-------|---------|-------------|
| 12-14 | **ALIVE** | Mechanic feels great. Ready for content production. Minor polish only. |
| 9-11 | **BREATHING** | Core feel is there but 1-2 dimensions need work. Fixable without redesign. |
| 6-8 | **FLAT** | Technically works but doesn't engage. Needs targeted feel work on weakest dimensions. |
| 3-5 | **MUDDY** | Significant feel problems. Player confused or disengaged. Needs rework of feedback chains. |
| 0-2 | **DEAD** | No game feel present. Might as well be clicking buttons on a form. Fundamental rethink needed. |

## Per-Mechanic Score Template

```
Feel Pass: [Mechanic Name]
═══════════════════════════════════════════
Target feel: [what should the player feel?]

  Responsiveness:     _/2  — [input→response timing: Xms]
  Clarity:            _/2  — [can player tell what happened?]
  Impact:             _/2  — [feedback channels: visual/audio/haptic/camera]
  Rhythm:             _/2  — [tension/release pattern]
  Payoff:             _/2  — [reward proportional to effort?]
  Dead Time:          _/2  — [gaps where nothing happens]
  Overload:           _/2  — [signal vs noise ratio]
  ─────────────────────────
  TOTAL:              _/14  — [ALIVE/BREATHING/FLAT/MUDDY/DEAD]

Top 3 Feel Blockers:
  1. [most impactful — specific channel + timing]
  2. [second]
  3. [third]
═══════════════════════════════════════════
```

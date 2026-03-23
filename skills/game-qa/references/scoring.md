# game-qa — Scoring Rubrics

| **State transitions** | Scene changes, pause/resume, backgrounding | Medium |

### Scoring

Start at 100. Deduct per bug found:
- Critical: -25
- High: -15
- Medium: -8
- Low: -3

**Section 2 Score: ___/100**

### Forcing Questions (must ask at least 2)

1. "Does the save file survive a force-quit mid-save?" — The most common data corruption scenario.
2. "What happens when you do the 'wrong' thing in the tutorial?" — Tutorials that only work on the happy path break immediately.
3. "Can you reach every progression milestone? Is there any point where forward progress is impossible?" — Softlocks are the worst functional bugs.

### Action Classification

- **AUTO:** Flag crashes with stack traces, obvious broken UI elements
- **ASK:** Severity classification for ambiguous bugs, edge case vs expected behavior disputes
- **ESCALATE:** Crash in core loop, save data corruption, progression softlock

**STOP.** One issue per AskUserQuestion.

--
| **Lighting** | Consistent across scenes, no light leaking, shadows correct | Medium |

### Scoring

Start at 100. Deduct per bug found:
- Critical: -25 (rendering makes game unplayable — black screen, extreme flicker)
- High: -15 (major visual bug always visible during normal play)
- Medium: -8 (visual bug visible sometimes during normal play)
- Low: -3 (visual bug only visible when looking for it)

**Section 3 Score: ___/100**

### Action Classification

- **AUTO:** Flag clearly broken rendering (black textures, missing models)
- **ASK:** Severity of visual glitches, "intended vs bug" visual decisions
- **ESCALATE:** Rendering makes game unplayable on a supported device

**STOP.** One issue per AskUserQuestion.

---

## Section 4: Performance Testing (效能測試) — Weight: 15%

Test frame rate, loading times, memory usage, and stability.

--
| **Install / Update size** | Download and installed size per platform | Within platform limits |

### Scoring

Start at 100. Deduct per issue:
- Critical: -25 (crash from memory, unplayable frame rate on target hardware)
- High: -15 (consistent FPS below target, loading >30s, memory leak)
- Medium: -8 (occasional hitches, loading slightly above target)
- Low: -3 (minor frame dips in non-critical moments)

**Section 4 Score: ___/100**

### Forcing Questions (must ask at least 2)

1. "What is the frame rate in the heaviest scene on the lowest-spec target device?" — If untested, performance is unknown where it matters most.
2. "Play for 30 minutes without restarting. Does memory usage grow continuously?" — Memory leaks only show under sustained play.

### Action Classification

- **AUTO:** Flag measured values that exceed benchmarks
- **ASK:** Performance vs quality trade-offs, acceptable frame rate thresholds
- **ESCALATE:** Crash from memory exhaustion, sustained frame rate below 50% of target

**STOP.** One issue per AskUserQuestion.

---
--
| **Spatial audio** | 3D sound positioning correct (if applicable) | Low |

### Scoring

Start at 100. Deduct per bug:
- Critical: -25 (audio causes crash, audio completely absent)
- High: -15 (wrong sound for major action, music doesn't play)
- Medium: -8 (volume imbalance, missing sound for minor action)
- Low: -3 (subtle timing issue, minor spatial audio error)

**Section 5 Score: ___/100**

### Action Classification

- **AUTO:** Flag silent events that should have sound
- **ASK:** Volume balance preferences, music transition style
- **ESCALATE:** Audio system crash, all audio missing

**STOP.** One issue per AskUserQuestion.

---

## Section 6: Input Testing (輸入測試) — Weight: 10%

Test all supported input methods.

--
| **Touch targets** | Touch targets >=44px, no overlapping hit areas (mobile) | High (mobile) |

### Scoring

Start at 100. Deduct per bug:
- Critical: -25 (input doesn't respond, game unplayable with target input method)
- High: -15 (wrong button prompt, rebinding broken, touch target too small for core action)
- Medium: -8 (minor dead zone issue, prompt flicker on input switch)
- Low: -3 (cosmetic prompt issue, slightly off touch target for non-critical button)

**Section 6 Score: ___/100**

### Action Classification

- **AUTO:** Flag obvious prompt mismatches
- **ASK:** Dead zone tuning, touch target sizing, input priority decisions
- **ESCALATE:** Core input method non-functional on target platform

**STOP.** One issue per AskUserQuestion.

---

## Section 7: Compatibility Testing (相容性測試) — Weight: 10%

Test across target devices, OS versions, and screen configurations.

--
| **External displays** | HDMI out, screen mirroring, ultrawide (if applicable) | Low |

### Scoring

Start at 100. Deduct per issue:
- Critical: -25 (game doesn't launch on supported device/OS)
- High: -15 (major rendering issue on specific device, UI cut off)
- Medium: -8 (minor rendering difference, suboptimal performance tier)
- Low: -3 (cosmetic difference between devices)

**Section 7 Score: ___/100**

### Action Classification

- **AUTO:** Flag devices where game fails to launch
- **ASK:** Supported device list decisions, minimum spec adjustments
- **ESCALATE:** Game non-functional on primary target platform

**STOP.** One issue per AskUserQuestion.

---

## Section 8: Localization Testing (在地化測試) — Weight: 5%

Test localized text, layout, and cultural appropriateness.

--
| **Concatenated strings** | Strings built by concatenation often break in other languages | Medium |

### Scoring

Start at 100. Deduct per issue:
- Critical: -25 (missing font causes crash or tofu characters for entire language)
- High: -15 (text overflow hides gameplay information, missing translations)
- Medium: -8 (minor overflow, wrong number format)
- Low: -3 (cosmetic spacing difference)

**Section 8 Score: ___/100**

### Action Classification

- **AUTO:** Flag obviously untranslated strings, text overflow
- **ASK:** Cultural sensitivity questions, locale-specific formatting decisions
- **ESCALATE:** Entire language unreadable due to font issue

**STOP.** One issue per AskUserQuestion.

---

## Section 9: Progression Testing (進度完整性測試) — Weight: 10%

Test that a player can complete the game from start to finish without blocks.

--
| **New game plus** | If applicable, NG+ works with carried-over state | Medium |

### Scoring

Start at 100. Deduct per issue:
- Critical: -25 (softlock, save migration failure, impossible achievement)
- High: -15 (progression requires unintended workaround, dead-end branch)
- Medium: -8 (minor progression confusion, misleading objective)
- Low: -3 (cosmetic progression display issue)

**Section 9 Score: ___/100**

### Forcing Questions (must ask at least 2)

1. "Can you reach the credits / endgame from a fresh save without exploits?" — The definitive progression test.
2. "Load a save from the previous version. Does everything work?" — Save migration failures cause the most player anger.

### Action Classification

- **AUTO:** Flag unreachable achievements, dead-end state machines
- **ASK:** Intended vs unintended progression sequence, difficulty-gated progression disputes
- **ESCALATE:** Softlock in main progression path, save migration data loss

**STOP.** One issue per AskUserQuestion.

---
--
  Section 9 — Progression:      ___/100  (weight: 10%)  → weighted: __.__
  ─────────────────────────────────────────────
  WEIGHTED TOTAL:               __.__/100

Score Interpretation:
  90-100  RELEASE-READY — Ship with confidence
  75-89   GOOD — Minor issues, shippable with known issues list
  60-74   NEEDS WORK — Significant bugs, fix before release
  40-59   POOR — Major quality issues, not ready for players
  0-39    CRITICAL — Game-breaking issues, needs fundamental fixes

Bug Summary:
  Critical: ___ (list each)
  High:     ___
  Medium:   ___
  Low:      ___
  Total:    ___

--
  Section 9 — Progression:     ___/100, ___ issues found

WEIGHTED TOTAL: __.__/100

Release Recommendation: SHIP / SHIP_WITH_KNOWN_ISSUES / DO_NOT_SHIP / BLOCKED
Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
```

**Status definitions:**
- **DONE** — All in-scope sections tested, QA Health Score >= 75
- **DONE_WITH_CONCERNS** — All tested, score 60-74 or unresolved high-severity bugs
- **BLOCKED** — Testing could not complete (build crashes, cannot install on target device)
- **NEEDS_CONTEXT** — Testing paused (no build available, no test devices, scope undefined)

**Release Recommendation definitions:**
- **SHIP** — Score >= 90, 0 critical bugs, 0 high bugs
- **SHIP_WITH_KNOWN_ISSUES** — Score >= 75, 0 critical bugs, high bugs documented with timeline
- **DO_NOT_SHIP** — Score < 75 OR any critical bugs

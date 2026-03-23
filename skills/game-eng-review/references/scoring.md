# game-eng-review — Scoring Rubrics

## Section 1: Engine & Framework (引擎選型) — Weight: 15%

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Fitness for Genre** | 0-3 | 3 = engine's strengths align with game's core requirements (e.g., Unity for mobile 2D, Unreal for high-fidelity 3D). 2 = workable but not optimal. 1 = significant workarounds needed. 0 = engine fundamentally mismatched |
| **Team Familiarity** | 0-2 | 2 = team has shipped with this engine. 1 = team has prototyped but not shipped. 0 = team has no experience with this engine |
| **Platform Support** | 0-2 | 2 = engine natively supports all target platforms with proven track record. 1 = supports with known limitations. 0 = requires custom porting work |
| **Ecosystem & Tooling** | 0-1 | 1 = mature plugin ecosystem, asset store, debugging tools available. 0 = limited ecosystem or team building custom tooling for basics |
| **License & Cost Risk** | 0-2 | 2 = licensing terms clear, sustainable at projected scale, no revenue share surprises. 1 = some cost risk at scale. 0 = license terms could become prohibitive or are unclear |

**Section 1 Score: ___/10**

### Engine Red Flags

- Custom engine for a small team with a deadline — almost always wrong unless the team has shipped a custom engine before
- Engine version locked to an old release with no upgrade plan — accumulating tech debt
- "We chose it because we like it" with no analysis of game requirements fit
- Engine requires workarounds for a core game mechanic (e.g., tile-based game on an engine with no native tilemap)
- No build pipeline established yet — "we'll figure out builds later"

### Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME:**

**Q1:** "What is the ONE thing this engine does better than alternatives for YOUR specific game?"

--
If the architecture doc does not include a frame budget: **-2 points.** Without a budget, performance is being managed by hope.

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Frame Budget Defined** | 0-2 | 2 = explicit ms budget per system with target FPS. 1 = target FPS stated but no per-system breakdown. 0 = no performance target |
| **Draw Call Strategy** | 0-2 | 2 = batching/instancing strategy documented, draw call target for worst-case scene. 1 = general awareness but no target. 0 = not addressed |
| **LOD / Culling** | 0-2 | 2 = LOD strategy with distance thresholds, frustum/occlusion culling plan. 1 = LOD mentioned but no specifics. 0 = not addressed (acceptable for 2D games — score N/A) |
| **Shader Complexity** | 0-2 | 2 = shader budget per material tier, fallback shaders for low-end. 1 = custom shaders exist but no complexity budget. 0 = no shader strategy |
| **Memory Budget** | 0-2 | 2 = per-platform memory ceiling with allocation breakdown (textures, meshes, audio, runtime). 1 = total memory target but no breakdown. 0 = no memory planning |

**Section 2 Score: ___/10**

### Performance Red Flags

- "We'll optimize later" — optimization is architectural, not a polish task
- No profiling infrastructure in the project — if you can't measure, you can't manage
- Texture sizes not standardized — a single 4K texture can blow mobile memory
- No target hardware defined — "it should run on most PCs" is not a spec
- GC-heavy language (C#, JS) with no allocation strategy for hot paths

### Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME:**

**Q1:** "What is your worst-case scene in terms of rendering cost, and have you profiled it?"

--
| **Async/Social** | Very High | Very Low | Low | Clash of Clans attacks, leaderboards |

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Model Fitness** | 0-3 | 3 = network model matches game's latency/bandwidth needs. 2 = workable but suboptimal. 1 = will cause noticeable player-facing issues. 0 = model cannot support core gameplay |
| **State Synchronization** | 0-2 | 2 = sync strategy documented (what state is authoritative, what is predicted, what is cosmetic). 1 = general sync approach but no state classification. 0 = not addressed |
| **Latency Handling** | 0-2 | 2 = prediction/rollback/interpolation strategy documented with target latency tolerance. 1 = acknowledged but no specific strategy. 0 = not addressed (for action games, this is -2 effectively) |
| **Cheat Prevention** | 0-2 | 2 = server-authoritative for game-critical state, client validation documented. 1 = some server authority but gaps identified. 0 = trust-the-client architecture for competitive game |
| **Failure Modes** | 0-1 | 1 = disconnect handling, reconnect flow, and desync recovery documented. 0 = not addressed |

**Section 3 Score: ___/10**

### Networking Red Flags

- Client-authoritative for competitive multiplayer — cheating will be trivial
- No tick rate specified — "as fast as possible" is not a design
- Rollback/prediction not planned for action games with <200ms latency requirement
- No bandwidth budget — streaming too much state will cause lag on mobile networks
- "We'll add multiplayer later" to a game designed around multiplayer — networking is foundational, not a feature

### Forcing Questions (must ask at least 2)

1. "What happens when a player has 300ms ping? Describe their exact experience." — Tests whether latency handling is designed or hoped for.
2. "Which game state lives on the server and which on the client? Can you draw the boundary?" — If this boundary is unclear, cheat prevention and desync bugs will be constant.
3. "What is the maximum bandwidth per player per second, and does it fit within mobile data constraints?" — Mobile networks have real bandwidth limits (~50-100 KB/s practical for games).

--
## Section 4: Data & Persistence (資料與存檔) — Weight: 10%

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Save System Design** | 0-3 | 3 = save format documented, versioned, tested for corruption recovery. 2 = save system exists but no versioning. 1 = basic save/load but fragile. 0 = not addressed |
| **Schema Migration** | 0-2 | 2 = explicit migration strategy for save format changes between game versions. 1 = acknowledged but no plan. 0 = not addressed (guaranteed broken saves on update) |
| **Cloud Sync** | 0-2 | 2 = cloud save with conflict resolution strategy documented. 1 = cloud save planned but no conflict handling. 0 = no cloud save for a game that needs it (mobile/cross-platform) |
| **Data Integrity** | 0-2 | 2 = checksums/validation on save data, graceful handling of corrupted saves. 1 = basic validation. 0 = no corruption protection |
| **Analytics Pipeline** | 0-1 | 1 = game telemetry events defined, pipeline documented. 0 = no analytics plan (acceptable for offline/hobby projects) |

**Section 4 Score: ___/10**

### Data Red Flags

- Save file is a raw serialized object dump — any class change breaks saves
- No save versioning — first patch will corrupt existing player saves
- Cloud sync with no conflict resolution — "last write wins" loses player progress
- Player-facing data stored in plain text with no validation — trivial to cheat, easy to corrupt
- No analytics events for key game moments — can't measure retention without data

### Forcing Questions (must ask at least 2)

1. "A player updates the game and loads their old save. What happens if you added a new stat since their last play?" — Tests schema migration. If the answer is "it crashes" or "we haven't thought about it," saves will break.
2. "A player plays on their phone, then opens the game on their tablet. Both have different progress. What happens?" — Tests cloud sync conflict resolution.
3. "How large is a typical save file, and how long does saving take?" — Large saves cause hitches. Frequent autosaves with large files = frame drops.

--
## Section 5: Asset Pipeline (素材管線) — Weight: 10%

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Build Size Budget** | 0-2 | 2 = per-platform size budget with current measurement. 1 = general target but not measured. 0 = no size awareness |
| **Loading Strategy** | 0-3 | 3 = loading screens budgeted, streaming for large worlds, async loading for seamless transitions. 2 = loading exists but not optimized. 1 = synchronous loading causing hitches. 0 = not addressed |
| **Asset Specifications** | 0-2 | 2 = texture sizes, poly budgets, audio formats standardized per platform tier. 1 = some standards but incomplete. 0 = no asset specs — artists guessing |
| **Memory Management** | 0-2 | 2 = asset memory budget per scene/level, unloading strategy documented. 1 = general awareness but no budget. 0 = load everything, unload nothing |
| **Platform Variants** | 0-1 | 1 = asset quality tiers for different hardware (HD/SD textures, LOD meshes). 0 = same assets for all platforms |

**Section 5 Score: ___/10**

### Asset Pipeline Red Flags

- No texture size standards — artists delivering 4K textures for mobile game
- Build size exceeds store limits (iOS: 200MB OTA, Google Play: 150MB base APK)
- All assets loaded at launch — long initial load, high memory usage
- No asset import pipeline automation — manual export/import prone to errors
- Audio files uncompressed in build — massive size increase for minimal quality gain

### Forcing Questions (must ask at least 2)

1. "What is your current build size per platform, and what is the limit?" — If they don't know, they haven't checked. Store limits are hard walls.
2. "What happens when a player enters a new area — is loading synchronous or streamed?" — Synchronous loading = freeze. Long freezes = player thinks game crashed.

### Action Classification
--
## Section 6: Platform Adaptation (平台適配) — Weight: 10%

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Input Method Coverage** | 0-3 | 3 = all target input methods designed and tested (keyboard/mouse, controller, touch, motion). 2 = primary input method done, secondary planned. 1 = only one input method considered. 0 = input not addressed |
| **Resolution Scaling** | 0-2 | 2 = dynamic resolution or fixed resolution targets per platform with UI scaling. 1 = single resolution with basic scaling. 0 = hardcoded resolution |
| **Performance Tiers** | 0-2 | 2 = quality settings with clear low/medium/high definitions and auto-detection. 1 = some settings but no auto-detection. 0 = one-size-fits-all |
| **Certification Requirements** | 0-2 | 2 = platform cert requirements documented and addressed (console TRC/XR, App Store guidelines). 1 = aware of cert but not fully addressed. 0 = not considered (will cause submission rejection) |
| **Accessibility Baseline** | 0-1 | 1 = remappable controls, subtitle options, colorblind support planned. 0 = no accessibility considerations |

**Section 6 Score: ___/10**

### Action Classification

- **AUTO:** Resolution inconsistencies in config, missing platform-specific settings
- **ASK:** Input method priority, quality tier definitions, cert requirement decisions
- **ESCALATE:** No certification awareness for console/mobile submission — guaranteed rejection

**STOP.** One issue per AskUserQuestion.

---

## Section 7: Testing Strategy (測試策略) — Weight: 10%

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Unit Test Coverage** | 0-2 | 2 = gameplay logic has unit tests, engine systems have unit tests, CI runs them. 1 = some tests exist but not systematic. 0 = no unit tests |
| **Integration Testing** | 0-2 | 2 = system integration tests (save/load round-trip, network message flow, scene transitions). 1 = manual integration testing only. 0 = not addressed |
| **Performance Testing** | 0-2 | 2 = automated performance benchmarks with regression detection. 1 = manual profiling occasionally. 0 = no performance testing |
| **CI/CD Pipeline** | 0-2 | 2 = automated build, test, deploy pipeline per platform. 1 = partial automation. 0 = manual builds |
| **Playtest Infrastructure** | 0-2 | 2 = build distribution to testers, crash reporting, analytics dashboard. 1 = ad-hoc testing distribution. 0 = no tester pipeline |

**Section 7 Score: ___/10**

### Testing Red Flags

- "We test by playing" — manual testing does not catch regressions
- No CI pipeline — builds break silently
- No crash reporting — bugs in the wild go undetected
- No automated performance tests — frame rate regressions caught by players, not developers
- Gameplay logic interleaved with rendering — untestable without full engine boot

### Action Classification

- **AUTO:** CI config errors, test framework setup issues
- **ASK:** Test coverage priorities, CI/CD pipeline design, crash reporting tool selection
- **ESCALATE:** No testing infrastructure AND approaching release

--
| **Performance × GDD** | Does frame budget support the game's vision? | GDD promises 200 units on screen but frame budget only supports 50 |

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Architecture-Design Alignment** | 0-4 | Start at 4. Deduct 1 for each cross-section contradiction found (max -4) |
| **Platform Coherence** | 0-3 | 3 = all architectural decisions consistently support all target platforms. 2 = minor gaps. 1 = significant platform-specific gaps. 0 = architecture designed for one platform, others are afterthoughts |
| **Technical Debt Awareness** | 0-3 | 3 = known tech debt documented with payoff plan. 2 = tech debt acknowledged. 1 = some debt visible but unacknowledged. 0 = no awareness of accumulated shortcuts |

**Section 8 Score: ___/10**

### Action Classification

- **AUTO:** Terminology inconsistencies across architecture sections
- **ASK:** Cross-section design tensions that require architectural decisions
- **ESCALATE:** Architecture fundamentally cannot support the game design — engine/network/performance limits conflict with GDD requirements

**STOP.** One issue per AskUserQuestion.

---

## Required Outputs

### Architecture Health Score

--
  Section 8 — Cross-Consistency:        _/10  (weight: 10%)  → weighted: _.___
  ─────────────────────────────────────────────
  WEIGHTED TOTAL:                       _._/10

  * If Section 3 is N/A (single-player), redistribute 15% weight:
    Rendering +5%, Data +5%, Testing +5%

Score Interpretation:
  8.0-10.0  PRODUCTION-READY — Architecture supports the game design, well-documented
  6.0-7.9   SOLID — Good foundation, address flagged issues before scaling team
  4.0-5.9   NEEDS WORK — Significant gaps that will cause production bottlenecks
  2.0-3.9   MAJOR REVISION — Architectural decisions need rethinking
  0.0-1.9   START OVER — No architecture yet, just technology choices

Top 3 Deductions (biggest point losses):
  1. [Section] [Criterion]: -N because [specific reason]
  2. [Section] [Criterion]: -N because [specific reason]
  3. [Section] [Criterion]: -N because [specific reason]
--
  Section 8 — Cross-Consistency:        _/10, ___ contradictions found

WEIGHTED TOTAL: _._/10

Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
```

**Status definitions:**
- **DONE** — All sections reviewed, all critical issues resolved, Architecture Health Score >= 6.0
- **DONE_WITH_CONCERNS** — All sections reviewed, some issues deferred, score 4.0-5.9
- **BLOCKED** — Review could not complete due to ESCALATE items (engine cannot support GDD, no performance targets, fundamental architecture mismatch)
- **NEEDS_CONTEXT** — Review paused because critical context is missing (no target platforms, no performance targets, no GDD)

### NOT in Scope

List deferred work with rationale:
```
- [Issue]: Deferred because [reason]. Revisit when [condition].

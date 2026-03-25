# Scoring Rubrics & Mode Weights

## Mode Weight Adjustments

Default weights assume a multi-platform PC/console game. Adjust per game type:

| Section | Default | A: Single-player PC | B: Mobile F2P | C: Multiplayer Action | D: Multiplayer Casual | E: Prototype |
|---------|---------|---------------------|---------------|----------------------|----------------------|-------------|
| 1. Engine & Framework | 15% | 15% | 15% | 10% | 10% | 25% |
| 2. Rendering & Performance | 20% | 25% | 25% | 20% | 15% | 20% |
| 3. Networking Architecture | 15% | SKIP | SKIP | 25% | 20% | SKIP |
| 4. Data & Persistence | 10% | 15% | 15% | 10% | 10% | 5% |
| 5. Asset Pipeline | 10% | 10% | 15% | 10% | 10% | 5% |
| 6. Platform Adaptation | 10% | 10% | 15% | 10% | 15% | 5% |
| 7. Testing Strategy | 10% | 15% | 10% | 10% | 10% | 5% |
| 8. Cross-Section Consistency | 10% | 10% | 5% | 5% | 10% | 35% |

**Weight rationale:**
- **Single-player PC:** No networking. Rendering and testing get extra weight because single-player games have no "server-side fix" for shipped bugs. Data gets more weight because save corruption is unrecoverable without cloud.
- **Mobile F2P:** Rendering and asset pipeline are critical due to hardware diversity and store size limits. Platform adaptation matters more (iOS/Android differences, thermal throttling). Cross-consistency matters less because iterative live-ops allows course correction.
- **Multiplayer Action:** Networking jumps to 25% — it IS the architecture for action multiplayer. Engine drops because the networking model constrains engine choice, not vice versa.
- **Multiplayer Casual:** Networking important but less latency-sensitive. Platform adaptation high because casual games target the widest hardware range.
- **Prototype:** Engine choice and cross-consistency dominate. Everything else is structural check only — premature optimization of rendering or networking wastes prototype velocity.

When Section 3 (Networking) is SKIP, redistribute its weight as noted in each column above.

## Section 1: Engine & Framework — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Fitness for Genre** | 0-3 | 3 = engine strengths align with core requirements (e.g., Unity for mobile 2D, Unreal for high-fidelity 3D). 2 = workable but not optimal. 1 = significant workarounds needed. 0 = engine fundamentally mismatched |
| **Team Familiarity** | 0-2 | 2 = team has shipped with this engine. 1 = team has prototyped but not shipped. 0 = team has no experience with this engine |
| **Platform Support** | 0-2 | 2 = engine natively supports all target platforms with proven track record. 1 = supports with known limitations. 0 = requires custom porting work |
| **Ecosystem & Tooling** | 0-1 | 1 = mature plugin ecosystem, asset store, debugging tools available. 0 = limited ecosystem or team building custom tooling for basics |
| **License & Cost Risk** | 0-2 | 2 = licensing terms clear, sustainable at projected scale, no revenue share surprises. 1 = some cost risk at scale. 0 = license terms could become prohibitive or are unclear |

**Section 1 Score: ___/10**

### Scoring Notes

- **Fitness for Genre** is the highest-weight criterion because a mismatched engine creates cascading problems in every other section.
- **Team Familiarity** score of 0 is not automatically fatal — a team learning a well-fitted engine may be better off than a team using a familiar but mismatched one. Weight this against Fitness.
- **License & Cost Risk:** Score 0 only when licensing is genuinely unclear or hostile (not when the team simply has not read the terms — that is an ASK, not a deduction).

## Section 2: Rendering & Performance — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Frame Budget Defined** | 0-2 | 2 = explicit ms budget per system with target FPS. 1 = target FPS stated but no per-system breakdown. 0 = no performance target |
| **Draw Call Strategy** | 0-2 | 2 = batching/instancing strategy documented, draw call target for worst-case scene. 1 = general awareness but no target. 0 = not addressed |
| **LOD / Culling** | 0-2 | 2 = LOD strategy with distance thresholds, frustum/occlusion culling plan. 1 = LOD mentioned but no specifics. 0 = not addressed (acceptable for 2D games — score N/A) |
| **Shader Complexity** | 0-2 | 2 = shader budget per material tier, fallback shaders for low-end. 1 = custom shaders exist but no complexity budget. 0 = no shader strategy |
| **Memory Budget** | 0-2 | 2 = per-platform memory ceiling with allocation breakdown (textures, meshes, audio, runtime). 1 = total memory target but no breakdown. 0 = no memory planning |

**Section 2 Score: ___/10**

### Scoring Notes

- If the architecture doc does not include a frame budget: **-2 points** from Frame Budget Defined. Without a budget, performance is managed by hope.
- For 2D games, LOD/Culling should be scored N/A and its 2 points redistributed equally to Frame Budget and Memory Budget.
- **Draw Call Strategy** at score 0 is more severe on mobile (where draw calls are the primary bottleneck) than on modern PC/console. See `references/performance-budgets.md` for platform-specific targets.

## Section 3: Networking Architecture — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Model Fitness** | 0-3 | 3 = network model matches latency/bandwidth needs. 2 = workable but suboptimal. 1 = will cause noticeable player-facing issues. 0 = model cannot support core gameplay |
| **State Synchronization** | 0-2 | 2 = sync strategy documented (what state is authoritative, what is predicted, what is cosmetic). 1 = general sync approach but no state classification. 0 = not addressed |
| **Latency Handling** | 0-2 | 2 = prediction/rollback/interpolation strategy documented with target latency tolerance. 1 = acknowledged but no specific strategy. 0 = not addressed (for action games, this is effectively -2) |
| **Cheat Prevention** | 0-2 | 2 = server-authoritative for game-critical state, client validation documented. 1 = some server authority but gaps identified. 0 = trust-the-client architecture for competitive game |
| **Failure Modes** | 0-1 | 1 = disconnect handling, reconnect flow, and desync recovery documented. 0 = not addressed |

**Section 3 Score: ___/10**

### Scoring Notes

- **Model Fitness** at 3 points is the gateway criterion. If the network model is wrong, nothing else in this section matters.
- **Latency Handling** score 0 for an action game (tick rate > 10Hz) should be an automatic ESCALATE — this is not a deferred item.
- For async/social networking (leaderboards, ghost data), scoring should be lenient on Latency Handling and Cheat Prevention but strict on State Synchronization.

## Section 4: Data & Persistence — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Save System Design** | 0-3 | 3 = save format documented, versioned, tested for corruption recovery. 2 = save system exists but no versioning. 1 = basic save/load but fragile. 0 = not addressed |
| **Schema Migration** | 0-2 | 2 = explicit migration strategy for save format changes between game versions. 1 = acknowledged but no plan. 0 = not addressed (guaranteed broken saves on update) |
| **Cloud Sync** | 0-2 | 2 = cloud save with conflict resolution strategy documented. 1 = cloud save planned but no conflict handling. 0 = no cloud save for a game that needs it (mobile/cross-platform) |
| **Data Integrity** | 0-2 | 2 = checksums/validation on save data, graceful handling of corrupted saves. 1 = basic validation. 0 = no corruption protection |
| **Analytics Pipeline** | 0-1 | 1 = game telemetry events defined, pipeline documented. 0 = no analytics plan (acceptable for offline/hobby projects) |

**Section 4 Score: ___/10**

### Scoring Notes

- **Schema Migration** score 0 for a game planning post-launch updates should be an ESCALATE. First patch WILL break saves.
- **Cloud Sync** score 0 is acceptable for single-platform offline games. Do not deduct for a PC-only single-player game without cloud save — it is a nice-to-have, not architecture.
- **Analytics Pipeline** score 0 is acceptable for hobby/jam projects. For commercial F2P, score 0 here should trigger an ASK.

## Section 5: Asset Pipeline — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Build Size Budget** | 0-2 | 2 = per-platform size budget with current measurement. 1 = general target but not measured. 0 = no size awareness |
| **Loading Strategy** | 0-3 | 3 = loading screens budgeted, streaming for large worlds, async loading for seamless transitions. 2 = loading exists but not optimized. 1 = synchronous loading causing hitches. 0 = not addressed |
| **Asset Specifications** | 0-2 | 2 = texture sizes, poly budgets, audio formats standardized per platform tier. 1 = some standards but incomplete. 0 = no asset specs — artists guessing |
| **Memory Management** | 0-2 | 2 = asset memory budget per scene/level, unloading strategy documented. 1 = general awareness but no budget. 0 = load everything, unload nothing |
| **Platform Variants** | 0-1 | 1 = asset quality tiers for different hardware (HD/SD textures, LOD meshes). 0 = same assets for all platforms |

**Section 5 Score: ___/10**

### Scoring Notes

- **Build Size Budget** is critical for mobile (store limits are hard walls). See `references/performance-budgets.md` for platform-specific limits.
- **Loading Strategy** score 1 (synchronous loading) is a red flag for any game with scene transitions — players perceive freezes as crashes.
- **Asset Specifications** score 0 is the single most common source of bloated builds. Artists without specs will deliver quality appropriate to their monitor, not the target device.

## Section 6: Platform Adaptation — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Input Method Coverage** | 0-3 | 3 = all target input methods designed and tested (keyboard/mouse, controller, touch, motion). 2 = primary input method done, secondary planned. 1 = only one input method considered. 0 = input not addressed |
| **Resolution Scaling** | 0-2 | 2 = dynamic resolution or fixed resolution targets per platform with UI scaling. 1 = single resolution with basic scaling. 0 = hardcoded resolution |
| **Performance Tiers** | 0-2 | 2 = quality settings with clear low/medium/high definitions and auto-detection. 1 = some settings but no auto-detection. 0 = one-size-fits-all |
| **Certification Requirements** | 0-2 | 2 = platform cert requirements documented and addressed (console TRC/XR, App Store guidelines). 1 = aware of cert but not fully addressed. 0 = not considered (will cause submission rejection) |
| **Accessibility Baseline** | 0-1 | 1 = remappable controls, subtitle options, colorblind support planned. 0 = no accessibility considerations |

**Section 6 Score: ___/10**

## Section 7: Testing Strategy — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Unit Test Coverage** | 0-2 | 2 = gameplay logic has unit tests, engine systems have unit tests, CI runs them. 1 = some tests exist but not systematic. 0 = no unit tests |
| **Integration Testing** | 0-2 | 2 = system integration tests (save/load round-trip, network message flow, scene transitions). 1 = manual integration testing only. 0 = not addressed |
| **Performance Testing** | 0-2 | 2 = automated performance benchmarks with regression detection. 1 = manual profiling occasionally. 0 = no performance testing |
| **CI/CD Pipeline** | 0-2 | 2 = automated build, test, deploy pipeline per platform. 1 = partial automation. 0 = manual builds |
| **Playtest Infrastructure** | 0-2 | 2 = build distribution to testers, crash reporting, analytics dashboard. 1 = ad-hoc testing distribution. 0 = no tester pipeline |

**Section 7 Score: ___/10**

## Section 8: Cross-Section Consistency — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Architecture-Design Alignment** | 0-4 | Start at 4. Deduct 1 for each cross-section contradiction found (max -4) |
| **Platform Coherence** | 0-3 | 3 = all architectural decisions consistently support all target platforms. 2 = minor gaps. 1 = significant platform-specific gaps. 0 = architecture designed for one platform, others are afterthoughts |
| **Technical Debt Awareness** | 0-3 | 3 = known tech debt documented with payoff plan. 2 = tech debt acknowledged. 1 = some debt visible but unacknowledged. 0 = no awareness of accumulated shortcuts |

**Section 8 Score: ___/10**

## Weighted Total Formula

```
Architecture Health Score
  Section 1 -- Engine & Framework:       _/10  (weight: W1%)  -> weighted: _.___
  Section 2 -- Rendering & Performance:  _/10  (weight: W2%)  -> weighted: _.___
  Section 3 -- Networking Architecture:  _/10  (weight: W3%)  -> weighted: _.___
  Section 4 -- Data & Persistence:       _/10  (weight: W4%)  -> weighted: _.___
  Section 5 -- Asset Pipeline:           _/10  (weight: W5%)  -> weighted: _.___
  Section 6 -- Platform Adaptation:      _/10  (weight: W6%)  -> weighted: _.___
  Section 7 -- Testing Strategy:         _/10  (weight: W7%)  -> weighted: _.___
  Section 8 -- Cross-Consistency:        _/10  (weight: W8%)  -> weighted: _.___

  WEIGHTED TOTAL:                       _._/10
```

Use the mode weight adjustments table above — do NOT use default weights blindly. If Section 3 is N/A (single-player), use the mode-specific column which already redistributes that weight.

## Score Interpretation

| Range | Label | Meaning |
|-------|-------|---------|
| 8.0-10.0 | PRODUCTION-READY | Architecture supports the game design, well-documented |
| 6.0-7.9 | SOLID | Good foundation, address flagged issues before scaling team |
| 4.0-5.9 | NEEDS WORK | Significant gaps that will cause production bottlenecks |
| 2.0-3.9 | MAJOR REVISION | Architectural decisions need rethinking |
| 0.0-1.9 | START OVER | No architecture yet, just technology choices |

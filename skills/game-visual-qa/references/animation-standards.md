# Animation Standards

Frame counts, timing benchmarks, and QA checks mapped to animation principles.

## Frame Count Guidelines by Style

### Pixel Art / 2D Sprite

| Animation    | Frame Range | Notes |
|-------------|------------|-------|
| Idle         | 4-8f       | Minimum: breathing/blinking cycle |
| Walk         | 6-8f       | 2f per contact, pass, up, down |
| Run          | 6-10f      | Faster cadence than walk, not just sped up |
| Attack       | 4-8f       | Anticipation 1-2f, action 1-2f, recovery 2-4f |
| Death        | 6-12f      | Can be longer for drama |
| Jump         | 4-6f       | Takeoff 1-2f, apex 1f, land 2-3f |
| Hit react    | 3-5f       | Flash + recoil, return to idle |

### 3D / High Fidelity

| Animation    | Frame Range | Notes |
|-------------|------------|-------|
| Idle         | 24-90f     | Breathing, weight shifts, micro-movements |
| Walk         | 16-24f     | Full stride cycle at 30fps |
| Run          | 12-20f     | Shorter stride, higher cadence |
| Attack       | 8-20f      | Anticipation 2-4f, action 2-4f, recovery 4-12f |
| Death        | 24-60f     | Ragdoll or animated, style dependent |
| Jump         | 8-16f      | Crouch 2-4f, launch 1-2f, hang 2-4f, land 3-6f |
| Hit react    | 6-12f      | Stagger relative to hit strength |

## 12 Principles Mapped to QA Checks

| Principle | QA Check | Severity if Missing |
|-----------|----------|-------------------|
| Anticipation | Action has wind-up >= 2 frames? Player can read what's coming? | High (combat), Medium (non-combat) |
| Follow-through | Action has recovery >= 2 frames? Doesn't snap to idle? | High (feels robotic without it) |
| Timing | Heavy objects have slower ease-in? Light objects are snappy? | Medium |
| Squash & stretch | Present in character movement? (Art style dependent — skip for rigid styles) | Low (style choice) |
| Arcs | Limbs follow natural arcs, not linear paths? | Medium (3D), Low (pixel art) |
| Secondary action | Hair, cloth, accessories follow primary motion? | Low-Medium |
| Ease in/out | Movements accelerate and decelerate? No constant-speed motion? | Medium |
| Staging | Player's eye drawn to the important action? Clear silhouette? | High |
| Exaggeration | Actions readable at game camera distance? Not too subtle? | Medium |
| Solid drawing | 3D models maintain volume during animation? No mesh collapse? | High if visible |
| Appeal | Characters feel alive and intentional? Not generic or stiff? | Low (subjective) |
| Straight ahead / pose-to-pose | N/A for QA — this is a production method, not a quality check | — |

## FPS Targets by Platform

| Platform       | Minimum | Target | Premium |
|---------------|---------|--------|---------|
| Mobile         | 30fps   | 60fps  | —       |
| PC             | 60fps   | 60fps  | 120/144fps |
| Console (current gen) | 30fps | 60fps | 120fps |
| Console (last gen) | 30fps | 30fps | 60fps |
| VR             | 72fps   | 90fps  | 120fps  |
| Nintendo Switch | 30fps  | 30fps  | 60fps   |

Frame pacing matters as much as frame rate. Consistent 30fps feels better than unstable 40-60fps.

## Animation Blend Times

| Transition Type        | Target  | Maximum | Notes |
|-----------------------|---------|---------|-------|
| Idle to walk          | <150ms  | 200ms   | Should feel responsive |
| Walk to run           | <150ms  | 200ms   | Gradual speed ramp OK |
| Idle to action        | <100ms  | 150ms   | Combat responsiveness critical |
| Action to idle        | <200ms  | 300ms   | Recovery can be slower |
| Any to hit react      | <50ms   | 100ms   | Must feel immediate |
| Any to death          | <100ms  | 150ms   | — |
| Locomotion direction change | <100ms | 200ms | Affects perceived control lag |

## Common Animation Bugs

| Bug | Description | Severity |
|-----|-------------|----------|
| T-pose flash | Default pose visible for 1+ frames during transition | High |
| Foot sliding | Feet move relative to ground during walk/run (> 2px/cycle) | High |
| Root motion desync | Character drifts from intended position over time | High |
| Blend tree dead zone | Input range where no animation plays or blending breaks | Medium |
| Animation pop | Abrupt transition between states (missing blend) | Medium |
| Clipping | Body parts passing through other meshes during animation | Medium-Low |
| IK failure | Feet floating above or sinking into terrain | Medium |
| Jitter | Rapid oscillation between two animation states | High |
| Missing animation | Action has no animation, character slides or snaps | Critical |

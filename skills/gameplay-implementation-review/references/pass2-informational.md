# Pass 2: Informational (worth knowing, not blocking)

## 2.1 Data-Driven Design

- **Hardcoded gameplay values** — damage, speed, cooldown, drop rates in code instead of config. Should be designer-tunable without recompilation.
- **Magic numbers** — `if (distance < 5.0)` instead of `if (distance < AGGRO_RANGE)`.
- **Un-tunable values** — anything a designer would tweak during playtesting but requires code change.

## 2.2 Code Organization

- **Gameplay logic in rendering** — game rules computed inside draw/render functions.
- **UI modifying game state directly** — button handler calling `player.health -= 10` instead of emitting event.
- **God objects** — single class handling input, physics, rendering, networking.
- **Missing abstraction boundaries** — engine importing gameplay types, gameplay importing UI.
- **Dependency direction violations** — engine depends on gameplay (should be reversed).

## 2.3 Testing Gaps

- **Changed gameplay logic without tests** — new mechanic or modified formula with no unit test.
- **Changed serialization without round-trip test** — save/load format changed, no encode/decode test.
- **Changed networking without integration test** — message handler modified, no simulated client/server.
- **Determinism code without determinism test** — lockstep without checksum comparison test.

## 2.4 Performance Awareness

- **String ops in hot paths** — concatenation, formatting, regex in per-frame code.
- **Unnecessary deep copies** — copying arrays/dicts when reference/view suffices.
- **Cache-unfriendly access** — iterating by type when stored by entity (AoS vs SoA).
- **Shader complexity** — excessive texture samples, branching in fragment shaders.
- **Draw call concerns** — patterns preventing batching (unique materials, per-frame mesh gen).

## 2.5 Dead Code & Consistency

- **Unused imports, variables, functions** — noise.
- **Inconsistent naming** — camelCase mixed with snake_case in same module.
- **Duplicated logic** — same calculation in two places.
- **TODO/FIXME without owner or issue** — untracked debt.

## File Type Domain Rules

| Path Pattern | Domain | Key Rules |
|-------------|--------|-----------|
| `src/gameplay/`, `game/`, `scripts/` | Gameplay | Values from config. Delta time. No direct UI refs. State machines need transition tables. |
| `src/core/`, `src/engine/` | Engine | ZERO allocations in hot paths. Thread safety. RAII. No gameplay dependency. |
| `src/ai/`, `ai/` | AI | 2ms per-frame budget. Params from data. Debug vis hooks. Telegraph intentions. |
| `src/networking/`, `net/` | Network | Server-authoritative. Versioned messages. Prediction + reconciliation. Validate packets. |
| `src/ui/`, `ui/`, `hud/` | UI | No game state mutation. Event-driven. Screen adaptation. |
| `assets/data/`, `config/` | Data | Schema validation. Backward compat. No logic in data. |
| `shaders/`, `*.shader` | Shader | Instruction count. Texture sample budget. Minimize fragment branching. |

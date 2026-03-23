# Pass 1: Critical Issues (must address before merge)

## 1.1 Frame Budget Violations

Budget: 60 FPS = 16.6ms, 30 FPS = 33.3ms.

Check for:
- **Allocations in update/tick/render** — `new`, `malloc`, array/dict creation, string concat, lambda captures. GC spikes.
- **Unbounded loops in per-frame code** — iterating all entities without spatial partitioning.
- **Heavy computation without amortization** — pathfinding, visibility, sorting not spread across frames.
- **Physics queries in render thread** — raycasts, overlap tests blocking rendering.
- **Synchronous I/O in game loop** — file reads, network calls, asset loading blocking main thread.
- **Missing delta time** — time-dependent calcs using frame count instead of `delta`/`dt`.

Severity: allocation in `_process`/`Update`/`tick` every frame = Critical. In rare event handler = Informational.

## 1.2 Memory & Resource Safety

- **Asset loading without unloading** — textures, meshes, audio loaded but never freed.
- **Circular references preventing GC** — component systems, event listeners, closures capturing `self`.
- **Large assets loaded synchronously** — textures >1MB, meshes >10K verts on main thread.
- **Object pool exhaustion** — pools without overflow strategy.
- **Resource lifecycle unclear** — who owns it? When freed? Double-free path?
- **RAII / cleanup missing** — GPU buffers, file handles, network sockets without deterministic cleanup.

## 1.3 State Synchronization (multiplayer only)

Skip if no network code in diff.

- **Client-authoritative logic** — gameplay values computed client-side without server validation.
- **Missing server validation** — client sends request, server executes without checking rules.
- **Race conditions** — two players acting on same entity simultaneously. Resolution strategy?
- **Determinism issues** — float ops across platforms, unseeded random, hash map iteration order.
- **Bandwidth concerns** — message frequency (every frame?), size (full state vs delta?).
- **Missing versioning** — network messages without version field.

## 1.4 Serialization Safety

- **Save backward compatibility** — version field? Loading save from version N-1?
- **Network packet parsing without bounds checks** — reading without checking remaining length.
- **Deserialization of untrusted data** — player content parsed without validation.
- **Schema evolution** — additive-only (safe) or rename/remove (needs migration)?
- **Round-trip fidelity** — save → load → save produces identical output?

## 1.5 Input & Responsiveness

- **Input polling in wrong frame phase** — 1-frame lag from read/apply ordering.
- **Missing input buffering** — for action games, inputs during hitstop/animation queued, not dropped.
- **Fixed vs variable timestep consistency** — gameplay on fixed but input on variable (or vice versa).
- **Input delay > 1 frame** — added latency must be justified. Unjustified = sluggish feel.
- **Missing input remapping** — hardcoded key bindings without rebind.

## 1.6 Security

- **Injection** — SQL in leaderboards, command injection in mods, XSS in chat.
- **Exposed secrets** — API keys, credentials in source.
- **Unvalidated player input** — name length, chat content, custom data payloads.
- **Cheat vectors** — client-trusted gameplay values (see 1.3).
- **Anti-tamper gaps** — missing checksums for data files, replays, saves.

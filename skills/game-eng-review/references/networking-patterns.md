# Networking Patterns Reference

## Networking Models Comparison

| Model | Authority | Latency Tolerance | Bandwidth | Complexity | Best For | Drawbacks |
|-------|-----------|-------------------|-----------|------------|----------|-----------|
| **Client-Server Authoritative** | Server owns all game state | Low (<100ms) | High | High | Competitive FPS, MOBA, arena | Server cost scales with players; requires prediction |
| **Client-Server Relaxed** | Server owns critical state, client owns cosmetic | Medium (<200ms) | Medium | Medium | MMO, co-op RPG, social games | Cheat surface on client-owned state |
| **Peer-to-Peer (Mesh)** | Each peer owns their state | Variable | Low per-peer | Medium | Co-op (2-4 players), LAN games | NAT traversal pain; no cheat prevention; scales poorly past 4 |
| **Peer-to-Peer (Relay)** | Peers via relay server | Variable + relay hop | Low | Medium | Fighting games, small lobbies | Relay adds latency; still need NAT fallback |
| **Dedicated Server** | Server-authoritative + hosted | Low (<100ms) | High | High | Large-scale multiplayer, esports | Hosting cost; geographic distribution needed |
| **Lockstep** | Deterministic simulation | Depends on slowest peer | Very Low (inputs only) | High (determinism) | RTS, turn-based strategy | Requires full determinism; one slow peer stalls all |
| **Turn-Based / Async** | Server validates turns | Very High (seconds-hours) | Very Low | Low | Card games, board games, async PvP | Not suitable for real-time action |

**Selection rule:** Match the model to the game's latency sensitivity and player count. Over-engineering networking (authoritative server for a 2-player co-op) wastes budget. Under-engineering it (P2P for competitive 10v10) guarantees cheating and desync.

## Tick Rates by Game Type

| Game Type | Tick Rate | Rationale |
|-----------|-----------|-----------|
| Competitive FPS | 64-128 Hz | Precise hit detection requires sub-frame accuracy |
| Arena / MOBA | 30-60 Hz | Lower precision needs than FPS; 30Hz sufficient for most |
| Racing | 30-60 Hz | Physics interpolation smooths visual result |
| Action RPG / Co-op | 20-30 Hz | Combat timing less precise; lower rate saves bandwidth |
| RTS | 10-20 Hz | Unit commands batch well; lockstep often preferred |
| MMO (world state) | 10-30 Hz | Hundreds of entities; lower rate mandatory for bandwidth |
| Turn-Based | On-demand | No fixed tick; send on action |
| Social / Async | On-demand | Polling or push notifications |

**Key trade-off:** Higher tick rate = more responsive feel but more bandwidth and server CPU. Double the tick rate roughly doubles bandwidth. Do not exceed what the game's precision needs demand.

## Prediction & Compensation Models

| Model | How It Works | When to Use | When NOT to Use |
|-------|-------------|-------------|-----------------|
| **Client-Side Prediction** | Client simulates locally, server corrects | Any real-time client-server game | Turn-based; lockstep (redundant) |
| **Server Reconciliation** | Client replays from last confirmed state on correction | Paired with client-side prediction | Games without prediction |
| **Entity Interpolation** | Render other entities between two known server states | Smoothing remote player movement | Local player (use prediction instead) |
| **Rollback Netcode (GGPO)** | Re-simulate from last confirmed input on misprediction | Fighting games, 1v1 action, small player count | Large player counts (rollback cost scales with entities) |
| **Lockstep Deterministic** | All peers execute same inputs, same frame | RTS, simulations requiring identical state | Action games needing instant local response |
| **Dead Reckoning** | Extrapolate position from velocity/acceleration | Vehicle movement, slow-moving entities | Fast direction changes, precise combat |
| **Lag Compensation (Rewind)** | Server rewinds time to validate client actions | FPS hit detection (what the shooter saw) | Non-combat interactions |

**Common mistake:** Implementing client-side prediction without server reconciliation. Prediction without correction means the client drifts from truth and snaps back violently on every correction.

## Bandwidth Budgets by Platform

| Network Context | Per-Player Budget | Notes |
|----------------|-------------------|-------|
| Mobile (cellular 4G) | 1-5 KB/s | Carriers may throttle sustained connections; packet loss 1-5% |
| Mobile (cellular 5G) | 5-20 KB/s | Lower latency but still variable; do not assume desktop-like |
| Mobile (WiFi) | 10-50 KB/s | Shared bandwidth; apartment WiFi can be worse than cellular |
| PC (broadband) | 50-200 KB/s | Generous but still budget — 64-player server at 200KB/s = 12.5 MB/s out |
| Console (broadband) | 50-200 KB/s | Similar to PC; some ISPs have data caps |
| LAN | 500+ KB/s | Effectively unlimited for game data |

**Budget math:** Total server outbound = per-player budget x max players x tick rate overhead. A 64-player server sending 100 KB/s per player = 6.4 MB/s outbound. Verify hosting can sustain this.

### Bandwidth Reduction Strategies

- **Delta compression:** Send only what changed since last acknowledged state. Typical 60-80% reduction.
- **Interest management / relevance:** Only send entities within player's area of interest. Critical for MMOs and large maps.
- **Quantization:** Reduce float precision (position to 0.01 units, rotation to 1 degree). 50%+ reduction for position data.
- **Variable tick rate:** Full updates at 10Hz, critical updates (hits, deaths) immediately.
- **Bit packing:** Pack multiple small values into single bytes. Avoid sending full 32-bit ints for values that fit in 4 bits.

## Latency Thresholds by Game Type

| Game Type | Acceptable | Noticeable | Unplayable | Notes |
|-----------|-----------|------------|------------|-------|
| Competitive FPS | <50ms | 50-100ms | >150ms | Includes both network RTT and display latency |
| Fighting Games | <80ms | 80-130ms | >130ms | Rollback extends acceptable range by ~50ms |
| MOBA / Arena | <80ms | 80-150ms | >200ms | Ability queuing helps mask latency |
| Action RPG / Co-op | <100ms | 100-200ms | >300ms | PvE more forgiving than PvP |
| Racing | <100ms | 100-200ms | >250ms | Ghost/rubber-banding visible at high latency |
| RTS | <150ms | 150-300ms | >500ms | Lockstep adds input delay equal to RTT/2 |
| MMO (general play) | <200ms | 200-400ms | >500ms | Social/exploration very tolerant |
| Turn-Based | <500ms | 500ms-2s | >5s | Feedback speed matters more than precision |
| Card Games | <1s | 1-3s | >5s | Animation timing masks most latency |

**Design implication:** If your game requires <100ms and your target audience includes players 200ms apart geographically, you need regional servers or relay routing. No amount of prediction fixes physics.

## Common Networking Gotchas

1. **Floating-point non-determinism.** Different CPUs produce different float results for the same operation. Lockstep games MUST use fixed-point math or guarantee identical hardware. This breaks cross-platform lockstep (PC vs mobile).

2. **Hash map / dictionary iteration order.** Unordered containers iterate differently across platforms, compilers, and even runs. Lockstep simulations using hash maps for entity storage will desync silently.

3. **Event ordering assumptions.** "Player A fires, Player B moves" may arrive in different order on different clients. All gameplay events must be ordered by tick/sequence number, not arrival time.

4. **Clock drift.** Client and server clocks diverge over time. NTP sync is not sufficient for game timing — implement game-tick synchronization separate from wall-clock time.

5. **MTU fragmentation.** Packets over ~1200 bytes risk fragmentation across network hops. Fragment = retransmit = latency spike. Keep individual messages under MTU. If you must send large data, implement your own fragmentation with reliability.

6. **NAT traversal failure rates.** Symmetric NAT (common on mobile carriers) fails hole-punching ~30% of the time. Any P2P game needs a relay fallback or players will report "can't connect."

7. **Head-of-line blocking (TCP).** TCP guarantees order — one lost packet blocks all subsequent packets. Game networking should use UDP with selective reliability, not TCP. Only use TCP for non-latency-sensitive data (chat, login, matchmaking).

8. **State explosion at scale.** Sending full world state works for 2-4 players. At 64+ players, you must implement interest management (spatial partitioning, relevance filtering) or bandwidth explodes combinatorially.

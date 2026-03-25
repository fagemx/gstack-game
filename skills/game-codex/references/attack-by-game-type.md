# Attack Priority by Game Type

Which exploit categories matter most for each game type. Use this to focus adversarial review on the highest-value attack surfaces.

**Priority levels:** C = Critical, H = High, M = Medium, L = Low, — = Not applicable

## Priority Matrix

| Category | Single-player | Competitive MP | Co-op | Live-service |
|----------|:---:|:---:|:---:|:---:|
| Speed exploit | M | H | M | H |
| Duplication | L | H | H | C |
| State corruption | H | H | H | C |
| Progression skip | M | L | L | H |
| Economy abuse | L | M | M | C |
| PvP cheat | — | C | L | C |
| Save manipulation | H | L | L | M |
| Determinism break | L | C | H | C |
| Social exploit | — | H | M | H |
| Content leak | L | L | L | C |

---

## Single-player: Top Attack Vectors

**Primary concerns:** Save integrity, state corruption, progression pacing.

1. **State corruption** (H) — No server to validate. Corrupt state means corrupted save, lost progress, softlocks. Player has no recovery path except restart.
2. **Save manipulation** (H) — Player owns the save file. If not protected, trivially editable. Save scumming bypasses all randomness. For games with permadeath or roguelike elements, this is critical.
3. **Progression skip** (M) — Less harmful (player only hurts own experience), but breaks intended pacing and can expose unfinished content or crash on unmet assumptions.

**Lower priority:** PvP cheats and social exploits are N/A. Economy abuse is low unless the game has a real-money shop. Duplication matters only if there's trading or leaderboards.

---

## Competitive Multiplayer: Top Attack Vectors

**Primary concerns:** Fairness, client trust, determinism.

1. **PvP cheat** (C) — Any client-authoritative gameplay value is an attack surface. Damage, position, hit detection, ability cooldowns — if the client controls it, cheaters will exploit it.
2. **Determinism break** (C) — If two clients compute different results, the game state diverges. Replays break, match results become disputed, competitive integrity is destroyed.
3. **Speed exploit** (H) — Frame-rate-dependent movement or cooldowns give hardware advantages. Players with better machines have faster abilities.

**Lower priority:** Save manipulation is low (server-authoritative). Progression skip is low (matchmaking handles it). Content leak is low (no future content surprise needed).

---

## Co-op: Top Attack Vectors

**Primary concerns:** Shared state integrity, duplication, determinism.

1. **Duplication** (H) — Items shared between players through trade, loot, or gifts. Duplication bugs let one player generate infinite resources for the entire group.
2. **State corruption** (H) — Shared game state means one player's corruption affects everyone. Host migration adds complexity — what if state is inconsistent between host and clients?
3. **Determinism break** (H) — Co-op relies on synchronized game state. If players see different enemy positions or damage values, the experience breaks.

**Lower priority:** PvP cheats are low (cooperative, not competitive). Content leak is low. Save manipulation is low if server-hosted.

---

## Live-service: Top Attack Vectors

**Primary concerns:** Economy integrity, competitive fairness, content control.

1. **Economy abuse** (C) — Live-service games monetize through their economy. Any exploit that generates free currency undermines revenue. Duplication, farming exploits, exchange rate manipulation — all are existential threats.
2. **Duplication** (C) — At scale, duplication bugs crash the economy. Hundreds of players exploiting simultaneously before a patch can cause permanent damage.
3. **State corruption** (C) — Server-side state corruption at scale affects thousands of players. Rollbacks are expensive and damage trust.
4. **PvP cheat** (C) — If the game has competitive elements (ranked, esports), cheating drives players away.
5. **Content leak** (C) — Unreleased content spoilers damage marketing campaigns. Leaked monetization strategies cause community backlash before launch.

**Lower priority:** Save manipulation is medium (server-authoritative, but offline modes may exist). Progression skip is high (can bypass paid content).

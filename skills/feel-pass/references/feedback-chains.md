# Feedback Chain Analysis

## The 4-Beat Model

Every satisfying game action follows this pattern:

```
ANTICIPATION → ACTION → IMPACT → RESOLUTION
   (wind-up)    (do it)   (feel it)   (recover)
```

Each beat has a job. If any beat is missing or mis-timed, the action feels wrong.

### Beat 1: Anticipation
**Job:** Tell the player something is about to happen. Build tension.
**Duration:** 2-10 frames (varies by action weight)
**Healthy signs:** Character wind-up animation, audio cue (whoosh), input commitment (can't cancel)
**Missing feels like:** Action comes out of nowhere. No sense of weight or commitment.
**Too long feels like:** Sluggish. Player feels the character doesn't respond.

### Beat 2: Action
**Job:** The thing happens. The player's input becomes reality.
**Duration:** 1-5 frames (should be the shortest beat)
**Healthy signs:** Clear motion, distinct from anticipation pose, hitbox active
**Missing feels like:** Nothing happened. Input was eaten.
**Too long feels like:** Slow motion when you don't want it.

### Beat 3: Impact
**Job:** Confirm the action connected. This is where FEEL lives.
**Duration:** 3-8 frames
**Components:**
- Visual: screen flash, particle burst, hit spark, damage number
- Audio: impact sound, voice cry, environmental reaction
- Haptic: controller rumble, mobile vibration
- Camera: shake, zoom, slow-mo (hitstop)
- Target reaction: stagger, knockback, death animation
**Missing feels like:** Hitting air. No confirmation. "Did that work?"
**Too much feels like:** Overwhelming. Screen is illegible. Noise.

### Beat 4: Resolution
**Job:** Return to neutral. Let the player breathe. Prepare for next action.
**Duration:** 5-15 frames
**Healthy signs:** Recovery animation, brief pause, stamina cost visible
**Missing feels like:** Action machine gun. No rhythm. Exhausting.
**Too long feels like:** Stuck. "Let me move already."

---

## Common Feedback Chains

### Melee Attack Chain
```
Anticipation:  2-4f  Weapon raised, slight crouch, audio whoosh start
Action:        1-3f  Swing motion, hitbox active
Impact:        3-5f  Hit flash + hitstop (1-3f) + screen shake + impact SFX + enemy stagger
Resolution:    5-10f Recovery pose, weapon returns, stamina depletes
```

**Soul:** The hitstop. Remove hitstop and melee feels like swinging through fog.

### Ranged Shot Chain
```
Anticipation:  1-2f  Aiming reticle tightens, audio charge
Action:        1f    Projectile spawns, muzzle flash, recoil
Impact:        2-4f  Hit marker + damage number + enemy reaction + impact SFX
Resolution:    3-8f  Recoil recovery, reticle re-centers, ammo count updates
```

**Soul:** The hit marker. Without clear hit confirmation at distance, ranged combat is guesswork.

### Jump Chain
```
Anticipation:  1-3f  Crouch down (squash)
Action:        1-2f  Launch upward, squash→stretch
Impact:        0f    (no impact on jump — impact is on LANDING)
Resolution:    2-5f  Apex hang (reduced gravity), then descent
Landing:       2-4f  Squash on contact + dust particles + thud SFX
```

**Soul:** The apex hang. Without reduced gravity at the top of the arc, jumps feel robotic.

### Pickup / Collect Chain
```
Anticipation:  0-2f  Item glow or pulse (passive)
Action:        1f    Player enters collection radius
Impact:        3-5f  Item flies to player (tween) + sparkle + collect SFX + UI counter flash
Resolution:    1-3f  Counter settles, item disappears
```

**Soul:** The tween. Items that teleport to inventory feel like nothing happened. The fly-to-player animation is the entire feel.

### Damage Taken Chain
```
Anticipation:  0f    (damage is surprise — no anticipation for the PLAYER)
Action:        1f    Hit detected
Impact:        3-8f  Red vignette + knockback + pain SFX + health bar flash + hitstop
Resolution:    5-15f Invincibility frames (flicker) + recovery animation
```

**Soul:** The i-frames. Without visible invincibility after getting hit, players feel helpless and trapped in a damage loop.

---

## Dead Time Analysis

Dead time = frames where the player has no input AND nothing engaging is happening on screen.

| Dead Time Duration | Verdict |
|-------------------|---------|
| 0-5 frames | Normal. Part of rhythm. |
| 5-15 frames | Acceptable if it's between meaningful actions (e.g., between rooms). |
| 15-30 frames | Suspicious. Why is the player waiting? |
| 30+ frames (0.5s+) | **Flag.** Either loading, forced wait, or missing content. |
| 60+ frames (1s+) | **Escalate.** Player will reach for their phone or close the app. |

**Exception:** Intentional dead time for dramatic effect (boss entrance, reveal moment) is valid IF it's authored content, not empty space.

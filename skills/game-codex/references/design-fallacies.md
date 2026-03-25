# Game Design Fallacies

10 common fallacies for Mode B (Challenge). Use steelman-then-attack: understand WHY teams fall for each fallacy, THEN identify why it fails.

---

## 1. Sunk Cost: "We already built it"

**Description:** Keeping a feature because effort was invested, not because it serves the game.

**Why teams fall for it:** Throwing away work feels wasteful. Engineers invested weeks. Cutting it means admitting a mistake.

**Why it fails:** Players don't know or care how long something took. A bad feature that took 6 months is still bad. Worse — it has ongoing maintenance cost and cognitive load.

**What to check:** Ask "if we hadn't built this yet, would we start building it today?" If the answer is no, it should be cut or deprioritized.

---

## 2. Feature Creep: "Just one more thing"

**Description:** Continuously adding features without evaluating whether each addition strengthens the core loop.

**Why teams fall for it:** Each feature sounds good in isolation. Saying no feels like lacking ambition. The feature list becomes the measure of progress.

**Why it fails:** Every feature adds complexity, bugs, balance work, and onboarding friction. The game becomes wide but shallow. Players bounce because nothing feels deep enough.

**What to check:** Does this feature strengthen the core loop, or is it adjacent? Can the game ship without it? What's the opportunity cost (what doesn't get polished)?

---

## 3. Complexity Bias: "More systems = more depth"

**Description:** Equating mechanical complexity with engaging depth.

**Why teams fall for it:** Complex systems feel impressive to build. Designers enjoy creating interconnected mechanics. "Depth" is used loosely to mean "lots of stuff."

**Why it fails:** Depth comes from meaningful decisions, not from the number of systems. Chess has simple rules and infinite depth. A game with 15 interlocking systems and no clear decisions is just confusing.

**What to check:** For each system: what decision does the player make? Are there meaningfully different strategies? Can you explain the system to a new player in under 30 seconds?

---

## 4. Success Theater: "Our metrics look good"

**Description:** Optimizing for metrics that don't reflect genuine player satisfaction.

**Why teams fall for it:** Metrics are concrete and defensible in meetings. DAU, session length, and retention numbers feel objective. Questioning metrics feels like questioning data.

**Why it fails:** Players can be retained by addiction loops, sunk cost, or social obligation — not enjoyment. High session length might mean "can't find the exit button." Good metrics with bad sentiment leads to community collapse when a competitor appears.

**What to check:** Are players recommending the game to friends (NPS)? Are they spending voluntarily or through friction? Would they play if there were no daily login rewards?

---

## 5. Platform Mismatch: "It works on PC"

**Description:** Designing for one platform's strengths while targeting another platform's audience.

**Why teams fall for it:** Teams develop on their preferred platform. PC has keyboard + mouse, large screen, long sessions. It's natural to design for the development environment.

**Why it fails:** Mobile players have 3-minute sessions, touch input, interruptions. Console players sit on a couch with a controller. What works with a mouse doesn't work with touch. Session length assumptions are platform-dependent.

**What to check:** What's the target platform's typical session length? Input method? Screen size? Interruption frequency? Does the core loop fit these constraints?

---

## 6. Audience Mismatch: "We're building for gamers like us"

**Description:** Designing for the team's preferences rather than the target audience's needs.

**Why teams fall for it:** Teams are passionate about what they personally enjoy. It's motivating to build the game you want to play. Internal playtests confirm the team likes it.

**Why it fails:** The team is not a representative sample. Experienced developers find different things fun than casual players. Self-selection bias means the team never discovers what their actual audience struggles with.

**What to check:** Who is the target player? Have people matching that profile played the game? What did external playtesters struggle with that the team didn't?

---

## 7. Retention Cargo Cult: "Add daily login rewards"

**Description:** Copying retention mechanics from successful games without understanding why they worked in that context.

**Why teams fall for it:** Successful games use daily rewards, battle passes, and FOMO mechanics. Copying visible patterns feels safe and proven.

**Why it fails:** Retention mechanics amplify existing engagement — they don't create it. Daily rewards on a boring game just remind players that the game is boring. Battle passes without compelling content are a chore, not a hook.

**What to check:** Is the core loop fun without any retention mechanics? Would players return tomorrow if there were no daily rewards? Are you retaining players or trapping them?

---

## 8. Monetization-Gameplay Conflict: "It's just a convenience"

**Description:** Paid advantages disguised as time-saving convenience.

**Why teams fall for it:** "Pay to skip the grind" sounds player-friendly. The team genuinely believes both paths (paying and grinding) are viable. Revenue targets push toward more monetization.

**Why it fails:** If paying is better than playing, the optimal strategy is to not play. The grind is intentionally made worse to push purchases. Players recognize this pattern and resent it. Community trust erodes.

**What to check:** Is the free path genuinely fun, or deliberately tedious? Would the team be comfortable if the payment option didn't exist? Does paying change competitive outcomes?

---

## 9. Scope Optimism: "We can cut later"

**Description:** Assuming features can be removed or reduced later if time runs short.

**Why teams fall for it:** Keeping options open feels prudent. "We'll evaluate at alpha" defers hard decisions. Nobody wants to be the one who killed a feature early.

**Why it fails:** Features become load-bearing. Other systems are built assuming the feature exists. Art assets are created, tutorials reference it, marketing mentions it. Cutting late is 10x harder than cutting early. One-way doors disguised as two-way doors.

**What to check:** If this feature were cut tomorrow, what else breaks? Has anything been built that assumes this feature ships? Is this a two-way door (easily reversible) or a one-way door (costly to undo)?

---

## 10. Uniqueness Fallacy: "Nobody has done this before"

**Description:** Believing an idea is novel when it's actually been tried and failed, or solved differently.

**Why teams fall for it:** Limited exposure to game history. The team hasn't played the failed attempts. Survivorship bias — they only see games that succeeded.

**Why it fails:** Most "novel" ideas have been attempted. The question isn't "has anyone tried this?" but "why didn't it work when they did?" Ignoring prior art means repeating known mistakes.

**What to check:** Search for similar mechanics in released games (including failures). Ask: why might previous teams have abandoned this approach? What evidence suggests this time is different?

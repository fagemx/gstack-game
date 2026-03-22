# Format Templates — How to Convert Issue Content to references/ Content

## Gotcha → references/gotchas.md

### Issue input (free text)
```
Claude 做放置類遊戲的經濟分析時，會把通膨率 > 1.2 標記為紅旗。
但放置類遊戲的通膨是設計——幣值每小時成長 10-50% 是正常的。
正確的做法是看「通膨速度是否匹配 prestige 重置頻率」。
```

### Converted output (gotchas.md format)
```markdown
N. **Treats idle game inflation as a bug.** Claude flags inflation rate > 1.2 as a red flag
   for idle/incremental games. But in idle games, inflation IS the design — currency values
   growing 10-50% per hour is normal. The correct check is whether inflation rate matches
   prestige reset frequency, not the absolute inflation rate.
   (Source: contributor with 2 shipped idle games, 5M+ downloads)
```

### Rules
- Number sequentially after existing gotchas
- Bold the one-line summary
- Include the wrong behavior, correct behavior, and reasoning
- Attribute source in parentheses at the end
- Keep to 2-4 lines

---

## Benchmark → references/scoring.md or section-specific reference

### Issue input
```
目前：LTV/CPI > 1.5 = viable
應改：2026 iOS casual CPI 是 $3-5，LTV/CPI > 2.0 才算 viable
來源：Sensor Tower 2026 Q1
```

### Converted output (table row update)
```markdown
| LTV/CPI > 2.0 | Viable (profitable after overhead) |
| LTV/CPI 1.5-2.0 | Risky (thin margin, sensitive to CPI fluctuation) |
| LTV/CPI < 1.5 | Unsustainable (losing money per install) |
```

### Rules
- Update the specific cell/row, not the whole table
- Add "(updated YYYY-MM, source: XXX)" annotation next to changed values
- If the old value was correct for a different context (e.g., premium vs F2P), keep both with context labels

---

## Forcing Question → references/gotchas.md or section-specific reference

### Issue input
```
問題：「把音效全關掉，核心循環還有趣嗎？再把畫面關掉只聽音效。還有趣嗎？」
追問：如果說「操控感很好」→ 問「操控感 = 什麼？輸入延遲幾 ms？」
為什麼重要：最常見的假陽性是 Demo 看起來酷但玩起來空洞。
放在：Section 1 Forcing Questions
```

### Converted output
```markdown
**QN:** "Turn off all sound. Is the core loop still fun? Now turn off the screen and just
listen. Still fun? If neither works, your game feel is packaging, not design."

Push until you hear: Specific mechanical descriptions of what makes the action satisfying
WITHOUT sensory feedback. If the designer says "the controls feel tight" — push: "Define
tight. Input latency in ms? Frames of startup animation? Cancel windows? Give me numbers."

Red flags: "It's about the overall feel." (= they don't know what makes it work mechanically)

**STOP.** Wait for answer.
```

### Rules
- Use **QN:** format with sequential numbering
- Include push-back script (what to say when answer is vague)
- Include red flags (what bad answers sound like)
- End with **STOP.** Wait for answer.

---

## Scoring Calibration → references/scoring.md

### Issue input
```
目前：Core Loop 權重 25%（所有模式統一）
問題：F2P 手遊的 Core Loop 應該 30%
建議：不同模式用不同權重
```

### Converted output
This changes the MODE WEIGHT TABLE, which lives in the main SKILL.md.tmpl (not in references/).

**⚠️ This is a SCOPE CHANGE — agent flags but does not implement.**

Agent should create PR with:
```
⚠️ NEEDS DOMAIN REVIEW — SCORING WEIGHT CHANGE

Contributor suggests mode-specific weights for Section 1 (Core Loop):
  Current: 25% (all modes)
  Proposed: 30% (Mobile/F2P), 25% (PC/Console), 25% (Multiplayer), 15% (Narrative), 25% (Tabletop)

This changes SKILL.md.tmpl, not just references/.
Maintainer must decide whether to implement.

Evidence: [contributor's stated experience]
```

---

## Persona Update → references/personas.md (player-experience only)

### Issue input
```
Casual Newcomer 不是 3 分鐘注意力，是 90 秒。
Source: 我們的 playtest 數據。
```

### Converted output
```diff
 - **Context:** First mobile game session on commute.
-  3 minutes of attention before deciding if it's worth keeping.
+  90 seconds of attention before deciding if it's worth keeping.
+  (Updated YYYY-MM: playtest data from contributor shows 50% decide in 90s.
+  3 minutes is "already interested" players. Source: [contributor attribution])
```

### Rules
- Show the diff clearly
- Add "(Updated YYYY-MM: reason + source)" annotation
- If the old value might be correct in a different context, note it: "3 minutes may still apply to PC/console FTUE"

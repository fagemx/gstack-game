# 三大核心機制 Gap 分析

> Date: 2026-03-23
> Reference: `C:\ai_project\guardian\docs\tech\gstack\gstack-three-missing-mechanisms.md`
> 比較 gstack 原版的三個核心迴圈 vs gstack-game 的現狀

---

## 機制 1：Review → Fix → Re-verify Loop

### gstack 怎麼做

/qa 和 /design-review 有完整的 11 Phase 流程：
```
Phase 6:  Baseline Score（存 baseline.json）
Phase 7:  Triage（按 severity 排序）
Phase 8:  Fix Loop（逐個修 → atomic commit → re-test → screenshot → classify）
  8a. locate source
  8b. fix（最小改動）
  8c. atomic commit（一 commit 一 issue）
  8d. re-test + before/after screenshot
  8e. classify: verified / best-effort / reverted（reverted → git revert）
  8e.5. regression test（條件觸發）
  8f. WTF-likelihood 自我調節（每 5 個 fix 檢查，>20% 停下來問人，hard cap 50 fixes）
Phase 9:  Final Score（全部重跑，跟 baseline 比）
Phase 10: Report（含 baseline → final 差值）
```

### gstack-game 現狀

| Skill | Fix Loop? | 狀態 |
|-------|-----------|------|
| `/game-review` | ✅ 有 | Fix-then-rescore: 用戶改 GDD → re-read → re-score section → update running score |
| `/skill-review` | ✅ 有 | Loop mode: bash driver 控制 score → fix top 3 → re-score → 直到 18+ 或 3 輪 |
| `/game-qa` | ❌ **缺** | 只有 review，沒有 fix → re-test → classify 的完整迴圈 |
| `/feel-pass` | ❌ 設計上不需要 | 「你診斷，不修」是刻意的——修屬於設計師 |
| `/balance-review` | ❌ **缺** | 單 pass scoring，沒有 fix → re-score |
| `/gameplay-implementation-review` | ❌ **缺** | 有 AUTO-fix 但沒有 re-test → classify → WTF 機制 |
| `/build-playability-review` | ❌ 設計上不需要 | 評估 build，不修 build |
| 其他 review skills | ❌ **缺** | 大部分沒有 fix loop |

### 最需要補的

1. **`/game-qa`** — 最大的 gap。gstack /qa 是 11-phase fix loop，gstack-game /game-qa 只是 review。需要加：
   - Phase 6: baseline score + baseline.json
   - Phase 8: fix loop（locate → fix → commit → re-test → classify → WTF）
   - Phase 9: final score
   - Phase 10: report with delta

2. **`/gameplay-implementation-review`** — 有 AUTO-fix 但缺 re-test + classify + WTF 調節。需要從 gstack /review 的 fix-first 模式借鑑。

3. **`/balance-review`** — 如果用戶在 review 中修了經濟數字，應該能 re-score 看差值。目前沒有。

---

## 機制 2：Artifact 存儲 + 跨 Skill 共享

### gstack 怎麼做

```
位置：     ~/.gstack/projects/{slug}/
命名：     {user}-{branch}-{type}-{datetime}.md
修訂鏈：   Supersedes: {prior filename}
Discovery: 每個 skill 開頭 ls -t ~/.gstack/projects/$SLUG/*-{type}-*.md
跨使用者： 同 repo → 同 slug → 共享目錄
```

### gstack-game 現狀

| Skill | Save Artifact? | Artifact Discovery? | Supersedes? |
|-------|---------------|--------------------|----|
| `/game-review` | ✅ | ✅ (GDD + prior reviews + balance) | ✅ |
| `/balance-review` | ✅ | ✅ (GDD + prior balance + game-review) | ✅ |
| `/player-experience` | ✅ | ✅ (GDD + prior walkthroughs) | ✅ |
| `/pitch-review` | ✅ | ✅ (pitch doc + deck + GDD) | ✅ |
| `/prototype-slice-plan` | ✅ | ✅ (GDD + game-review + player-exp + direction) | ✅ |
| `/implementation-handoff` | ✅ | ✅ (slice-plan + GDD + eng-review) | ✅ |
| `/feel-pass` | ✅ | ✅ (handoff + slice-plan + prior feel) | ✅ |
| `/build-playability-review` | ✅ | ✅ (slice-plan + handoff + feel-pass) | ✅ |
| `/gameplay-implementation-review` | ✅ | ✅ (prior review + handoff + eng-review) | ✅ |
| `/game-direction` | ✅ | ✅ | ✅ |
| `/game-eng-review` | ✅ | ✅ | ✅ |
| `/game-ideation` | ✅ | ✅ | ✅ |
| `/game-import` | ✅ | ✅ | ✅ |
| `/game-qa` | ⚠️ 有 review log 但沒有 report artifact | ⚠️ 部分 | ❌ |
| `/game-ship` | ⚠️ | ⚠️ | ❌ |
| `/game-retro` | ❌ | ❌ | ❌ |
| `/game-debug` | ❌ | ❌ | ❌ |
| `/game-docs` | ❌ | ❌ | ❌ |
| `/game-codex` | ❌ | ❌ | ❌ |
| `/game-visual-qa` | ❌ | ❌ | ❌ |
| `/asset-review` | ❌ | ❌ | ❌ |
| `/playtest` | ❌ | ❌ | ❌ |

### 評估

- **B-type skills（前半段 + Bridge Layer）：全部到位 ✅**
- **A-type / Skeleton skills（後半段）：大部分缺失 ❌**
- 後半段 skill 需要加 Save Artifact + Artifact Discovery

---

## 機制 3：Baseline → Final 差值

### gstack 怎麼做

```
Phase 6:  計算 baseline Health Score → 存 baseline.json
Phase 8:  Fix loop
Phase 9:  計算 final Health Score
Phase 10: 輸出差值表
          如果 final < baseline → WARN prominently（something regressed）
```

還有 regression mode（`--regression <baseline>`）：跨 session 比較。

### gstack-game 現狀

| Skill | Baseline? | Final re-score? | Delta table? | WARN if worse? |
|-------|-----------|----------------|-------------|---------------|
| `/game-review` | ✅ | ✅ | ✅ | ✅ |
| `/balance-review` | ❌ | ❌ | ❌ | ❌ |
| `/player-experience` | ❌ | ❌ | ❌ | ❌ |
| `/pitch-review` | ❌ | ❌ | ❌ | ❌ |
| `/game-qa` | ❌ | ❌ | ❌ | ❌ |
| `/feel-pass` | ❌ | ❌ | ❌ | ❌ |
| 其他 | ❌ | ❌ | ❌ | ❌ |

### 評估

只有 `/game-review` 有完整的 baseline → final 機制。其他所有有 scoring 的 skill 都缺。

最需要補的：
1. **`/game-qa`** — 最像 gstack /qa，最該有 baseline → fix → final → delta
2. **`/balance-review`** — 經濟數字調完後應該能看差值
3. **`/feel-pass`** — 修完手感後 re-run 看分數有沒有改善

---

## 優先修復順序

### 第一優先：/game-qa

最大的 gap。需要從 gstack /qa 移植完整的：
- Baseline scoring + baseline.json
- Fix loop（locate → fix → atomic commit → re-test → classify → WTF）
- Final re-score + delta
- Report with before/after

這會讓 /game-qa 從「review skill」變成「review + fix + verify skill」——跟 gstack /qa 同等。

### 第二優先：/balance-review + /feel-pass 加 re-score

不需要 fix loop（這些 skill 不修東西），但需要：
- 記錄 baseline score
- 用戶修完後 re-run → 算 final score → 顯示 delta
- WARN if worse

### 第三優先：後半段 skills 加 Save Artifact

game-retro, game-debug, game-docs, game-codex, game-visual-qa, asset-review, playtest — 都需要把結果寫到 `$_PROJECTS_DIR`，讓 `/game-ship` 能讀到全部 review 狀態。

### 第四優先：Regression mode

所有有 scoring 的 skill 加 `--regression <baseline>` flag，支援跨 session 比較。

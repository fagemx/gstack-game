# Nox 版：好 Skill 的寫作原則

> Analysis date: 2026-03-22
> Source: Another agent's independent analysis of the same 4 skills
> Skills studied: arch-spec, issue-pipeline, pr-review-loop, gstack office-hours

---

## 總結

好用的 skill 不是「資訊很多」，而是「把 agent 拉進一個穩定工作姿勢」。

共通點不是文筆，而是五件事：
1. **觸發很準**：description 不是介紹，是 routing rule
2. **角色很硬**：一進 skill 就把 agent 鎖進某種工作人格
3. **流程外部化**：不要靠 agent 記憶，靠 checklist / driver / phase / artifacts
4. **非均線資訊很多**：gotchas、anti-patterns、review criteria 這種模型原本不知道的東西很多
5. **自由度有控制**：該開放的開放，該死板的地方就死板

---

## 逐 Skill 分析

### 1) arch-spec：最像「成熟 skill」

最強的地方：不是叫 agent「寫 spec」，而是把 spec 工作拆成一個**可驗證的專業操作流程**。

- **description 很準** — 不是說「幫你寫架構文件」，而是「當概念還不穩、需要 multi-file dossier、還沒到 project-plan 時用」。這種 description 才會真的觸發對。
- **一開始就做 args parsing** — `review / add / shared-types / generate`。很多 skill 失敗不是內容不好，是一開始沒把操作模式鎖死，後面 agent 就漂了。
- **把 TodoWrite 當硬規則** — 能外部化的流程，不要留在模型腦內。直接說：你必須用 todo 追蹤，而且每種 operation 都有固定步驟。大幅降低半路 drift。
- **references 分層做得很好** — 核心 SKILL.md 放 workflow，gotchas / anti-patterns / review-checklist / examples / promotion-rules 拆出去。好的 progressive disclosure。
- **gotchas 很強** — 幾乎是整個 skill 的靈魂。像：不要 default full stack、不要把 planning docs 當 reality、不要設計幻想 API、caller 預設適配 callee。這些都不是模型通識，是**真實系統的坑**。
- **review 與 generate 共用同一語彙系統** — `what it's NOT`、`shared-types`、`promotion`、`canonical examples`。讓 skill 不只是生成器，而是一套 spec discipline。

**判斷：** 很標準的「知識 + workflow + quality gate」三合一 skill。它強，不是因為長，而是因為它把錯誤模式寫出來了。

**改進建議：**
- 把 references/examples/README.md 這種 README 感的東西降到最低（skill 系統裡 README 常常是雜訊源）
- 把某些「永遠要讀」的 reference 再收斂（always-read 太多會讓 SKILL.md 體感變重）

---

### 2) issue-pipeline：強在 orchestration grammar 非常清楚

好用是因為它把一個本來很容易混亂的 dispatch 工作，壓成了幾個很穩的操作面。

- **一句話就知道它是什麼** — `Wave-based issue pipeline with dependency resolution`。使用者和 agent 一眼都知道不是單 issue fix，而是批次 pipeline。
- **prerequisites 講清楚** — 依賴 `issue-plan`, `issue-action`, `pr-review-loop`。很多 skill 會假裝自己自足，結果其實靠別的 skill 偷撐。這個沒有裝自足，這很好。
- **orchestration loop 非常清楚** — pre-flight → DAG → confirm → waves → summary。讓 agent 永遠知道現在在哪個 phase。
- **dependency resolution 拆到 references** — 主 skill 保持主流程，演算法細節丟進 reference。如果把 DAG 演算法塞進主檔，skill 會變鈍。
- **agent prompt templates 也拆出去** — skill 不只是說「去做」，而是已經把 sub-agent interface 規格化了。很像 internal protocol。
- **interrupt recovery 很實用** — 好用 skill 的重要特徵之一：**不只定義 happy path，也定義中斷後如何續跑**。比 20 段理論說明有價值得多。

**判斷：** 很好的 orchestrator skill。關鍵不是內容多，而是 phase 邊界清楚、狀態可重建、依賴可推導。

**改進建議：**
- 把 prerequisites failure mode 寫更硬（缺 skill 時現在比較像假設存在）
- 把 user confirmation gate 再寫更具體（哪些一定要 ask，哪些可自動）
- 把 status schema 定得更明（多 agent 回報更穩）

---

### 3) pr-review-loop：最值得學的是「用 script 管 loop，不用腦管」

本質上在做一件很對的事：把 LLM 最不可靠的部分——反覆循環控制——交給 deterministic driver。

- **一開頭就說 architecture** — 直接先宣告：loop control 由 bash driver script 控制，你必須跟著 ACTION 走。讓 agent 一開始就降低自由度。
- **參數解析很具體** — URL / number / empty。然後要求之後 hardcode literal PR number。超像真實世界防呆。
- **driver script 是核心資產** — skill 不是 markdown，而是**可執行控制器 + 語意規格**。
- **Action loop 非常穩** — REVIEW → COMMENT → FIX → REVIEW → LGTM。每步都明確規定做什麼、怎麼回報、下一步靠 driver 決定。好的 external state machine。
- **fix scope 被限制** — 只能改 PR diff 裡的檔案、minimal changes、break checks 就 revert。這種 guardrail 很值錢。

**判斷：** 典型的 fragile workflow skill。成功關鍵不是語言風格，而是控制權外部化、狀態機清楚、每一步都有 completion protocol。很值得當「高脆弱工作流 skill 模板」。

**改進建議：**
- 前端 trigger 描述不夠豐滿（可以明確寫 when to use / when not to use）
- driver script 該抽成 bundled script（`scripts/driver.sh`），不是 inline 生成

---

### 4) office-hours：好用，但暴露了「大型 mode-switch skill」的兩面性

本質上不是普通 skill，而是把 agent 整個切進一種 conversation operating mode。

**好用的原因：**
- **description 非常強** — 觸發感很強，明確列出 trigger phrases 和 proactive suggestion 時機。
- **人格與 posture 寫得很硬** — startup mode / builder mode 分開、anti-sycophancy rules、forcing questions、response posture。在調教 agent 的對話姿勢。
- **phase 很完整** — context gathering → question routing → premise challenge → alternatives → design doc → review loop → closing handoff。不是 prompt，是完整 interaction design。
- **很會把抽象要求具體化** — 一次只問一題、不准直接實作、alternatives generation mandatory、closing sequence 分三拍。

**但問題很明顯：** 把太多層混在一起了：
- product philosophy
- telemetry
- upgrade flow
- contributor mode
- browse setup
- conversation posture
- design-doc generation
- founder funnel / YC conversion

已經不是單純「一個 skill」，而比較像「一個帶平台 policy、growth logic、ops behavior 的 mini runtime mode」。

好用是因為它厚。但代價：context 很重、可攜性差、修改風險高、很難局部重用、任一區塊改壞都可能影響整體。

**判斷：** 有效但昂貴的超大型 skill。適合拿來學「怎麼切 mode」，但不適合當所有 skill 的模板。

**改進建議：** 拆成至少 3 層：
1. core conversation skill（startup/builder mode + premise challenge + alternatives + design doc）
2. platform/runtime concerns（telemetry + contributor mode + upgrade checks + browse setup）
3. brand/persona layer（YC / Garry plea + founder signal messaging）

---

## 8 個核心原則

### 原則 1: 先寫 trigger，不是先寫內容

最重要的是 frontmatter description。好的 description 包含：
- 做什麼
- 何時用
- 何時不用
- 使用者會怎麼說
- 前後相鄰 skill 是什麼

### 原則 2: Skill 不是知識包，是工作姿勢切換器

真正好的 skill 會在一開始就改變 agent 的姿勢。skill 不是補資訊而已，是讓 agent 進入一個**行為模式**。

### 原則 3: 流程一定要外部化

越脆弱的工作，越不能靠 agent 記住流程。三種外部化方式：
- Todo / checklist
- Phase / action loop
- Driver script / state file

### 原則 4: 最高價值內容不是教學，是 gotchas

模型已經知道很多一般做法。它不知道的是：哪裡會炸、哪裡不能偷懶、這個 repo/團隊的禁忌、過去踩過哪些坑、哪些字面上合理但實際上錯。

Skill 裡最值錢的通常是：gotchas、anti-patterns、review checklist、recovery、invariant / guardrails。

### 原則 5: 該死板的地方要死板

不同任務需要不同自由度：
- **高自由度**：探索、構思、批判、brainstorm
- **中自由度**：常規 spec / planning / diagnosis
- **低自由度**：PR review loop、deploy、migration、destructive ops

### 原則 6: 主 Skill 只放骨架，細節放 references

好的拆法：
- `SKILL.md`：角色、流程、規則、切換邏輯
- `references/`：checklists、examples、prompts、algorithms、gotchas、recovery

壞的拆法：
- 什麼都塞在 SKILL.md
- 或拆得太散，主 skill 沒導航能力

### 原則 7: 好 Skill 幾乎都內建「失敗後怎麼續」

真的好用的 skill 不只會說怎麼開始、怎麼做完，還會說：
- 中斷了怎麼恢復
- 哪些錯可自修
- 哪些錯要升級
- 怎麼判斷 done

### 原則 8: Skill 的輸出格式一定要長得「可接下一步」

很多 skill 寫壞，是因為完成時只產出一堆文字。好 skill 輸出的是：
- spec stack
- wave table
- PR review round comment
- design doc
- promotion memo

輸出不是聊天回應，而是下一階段 workflow 的接口。

---

## Skill 骨架模板

```md
---
name: <skill-name>
description: <what it does + when to use + when not to use + common trigger phrases>
---

# <Role Name>

你現在是 <very specific role>。
你的目標是 <one sentence>。

## Core Mode
- 你要優先做什麼
- 你不能做什麼
- 你怎麼判斷自己有沒有 drift

## Inputs / Parsing
- args 怎麼解析
- 幾種 operation mode
- 如果缺參數怎麼問

## Task Flow
1. ...
2. ...
3. ...

## State / Tracking
- Todo / status table / driver script / output file

## Guardrails
- 常見誤判
- 明確禁止
- escalation 條件

## Output Contract
- 最後一定要輸出什麼格式
- 什麼叫 done
- 下一步怎麼接
```

然後把下面這些拆進 `references/`：
- gotchas
- anti-patterns
- examples
- recovery
- prompt templates
- checklists

---

## 哪個 Skill 最值得當範本？

| 用途 | 最佳範本 |
|------|---------|
| 最平衡的範本 | `arch-spec` |
| 最好學流程外部化 | `pr-review-loop` |
| 最好學 orchestrator 類 skill | `issue-pipeline` |
| 最好學 mode / posture 設計 | `office-hours` |
| 最不該整包複製的 | `office-hours`（因為太胖） |

---

## 好 Skill 的本質（一句話）

> **不是把知識塞給 agent，而是把一種可重複的工作姿勢、錯誤邊界、和輸出協議，封裝成一個可觸發的 mode。**

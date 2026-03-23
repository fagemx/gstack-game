# gstack-game

**遊戲開發審查工作流 Skills for Claude Code**

[English](README.md)

27 個互動式 AI 審查技能，涵蓋**完整的遊戲製作工作流**：設計審查、原型切片規劃、實作交接、遊戲手感診斷、可玩性評估、程式碼審查、QA、發布。基於 [gstack](https://github.com/garrytan/gstack) 的工程架構和審查方法論，為遊戲開發全面重寫。

> **這是什麼：** 結構化的審查和品質保證系統——幫你判斷、評分、改善你的遊戲設計和程式碼。
> **這不是什麼：** 不是遊戲生成器，不會幫你寫程式碼或做美術素材。

gstack 是 Garry Tan 為 Web/SaaS 開發打造的 AI 工程工作流。gstack-game 把同一套方法論搬到遊戲開發：用遊戲設計理論（MDA、SDT、Flow State）取代 SaaS 指標（MRR、churn），用 core loop、retention hook、Sink/Faucet 經濟模型取代 API endpoint 和 database schema。工程骨架（template engine、preamble injection、反諂媚機制）維持 gstack 同等品質。

**適合誰：**
- **獨立遊戲開發者** — 一個人也能有結構化的設計審查和 QA 流程
- **小團隊（2-5 人）** — 用 AI skill 補足缺少的專業角色（數值策劃、UX 研究員、QA lead）
- **遊戲設計學生** — 結構化的設計思考框架，每個 skill 都內建遊戲設計理論

---

## Quick Start：前 10 分鐘

1. 安裝 gstack-game（30 秒 — 見下方）
2. 跑 `/game-import` — 把你的 PDF/文件/筆記轉成標準 GDD。它會讀取檔案、對照 8-section 標準做完整度審計、問你缺失的部分、然後寫出 `docs/gdd.md`。
3. 跑 `/game-review` — 逐 section 設計審查，帶評分、逼問、建議。
4. 跑 `/player-experience` — 用特定 persona 模擬玩家走查。
5. 跑 `/game-ideation` — 如果還沒有設計，從零發想。
6. 到這裡停。你會知道這對你有沒有用。

---

## 安裝 — 30 秒

**需要：** [Claude Code](https://docs.anthropic.com/en/docs/claude-code)、[Git](https://git-scm.com/)、[Bun](https://bun.sh/) v1.0+

### 方式 A：貼給 Claude（推薦）

打開 Claude Code，貼上這段。Claude 會自己完成安裝。

> Install gstack-game: run **`git clone <repo-url> ~/.claude/skills/gstack-game && cd ~/.claude/skills/gstack-game && bun run build`** then add a "gstack-game" section to CLAUDE.md that lists the available skills: /game-import, /game-ideation, /game-direction, /game-review, /game-eng-review, /balance-review, /player-experience, /game-ux-review, /pitch-review, /prototype-slice-plan, /implementation-handoff, /gameplay-implementation-review, /feel-pass, /build-playability-review, /game-qa, /game-ship, /game-debug, /game-retro, /game-codex, /game-docs, /game-visual-qa, /asset-review, /playtest, /skill-review, /contribute-review, /careful, /guard, /unfreeze. Then ask the user if they also want to add gstack-game to the current project.

### 方式 B：加到專案讓隊友也能用

> Add gstack-game to this project: run **`cp -Rf ~/.claude/skills/gstack-game .claude/skills/gstack-game && rm -rf .claude/skills/gstack-game/.git && cd .claude/skills/gstack-game && bun run build`** then add a "gstack-game" section to this project's CLAUDE.md listing all available skills.

檔案直接 commit 到 repo（不是 submodule），`git clone` 即可使用。所有東西在 `.claude/` 裡，不碰你的 PATH，不跑背景程式。

### 方式 C：手動安裝

```bash
# 只裝一個 skill：
cp -r /path/to/gstack-game/skills/game-review your-project/.claude/skills/

# 或用 install script 裝全部：
/path/to/gstack-game/bin/install.sh .
```

---

## 實際使用範例

```
你：    我想做一個放置類手遊，玩家經營一個地下城
你：    /game-ideation

Claude: 先確認你在哪個階段。你有 prototype 嗎？還是純概念？
        → Level 1: 一句話 pitch。開始深入。

        Fantasy: 你希望玩家感受什麼？「經營地下城」是機制，不是感受。
        是「看著自己的城堡從零變強的成就感」？
        還是「設計陷阱看冒險者吃癟的惡趣味」？
        → 你選：惡趣味 + 策略感

        Core Loop: 用一句話描述：
        「設置陷阱 → 看冒險者觸發 → 獲得資源 → 升級陷阱 → repeat」
        這個 30 秒 micro-loop 本身有趣嗎？還是只有升級有趣？
        → 逼問：如果拿掉升級，只有「設置→觸發」，還有趣嗎？

        Twist: 最像的 3 款遊戲是？跟它們差在哪？
        差異是在機制（難抄）還是美術（好抄）？
        → 產出 Concept One-Pager

你：    /game-review
Claude: [讀取 Concept One-Pager]
        Mode: A (Mobile/Casual) — 調整權重

        Core Loop: 7/10 — micro-loop 清晰但 meso-loop 缺定義
        Progression: 5/10 — D7 retention hook 未定義（-3）
        Economy: 4/10 — 只有 faucet 沒有 sink（通膨風險）

        GDD Health Score: 5.8/10
        STATUS: DONE_WITH_CONCERNS
        [一個一個問你要不要修]

你：    /player-experience
Claude: Persona: Casual Newcomer（通勤 3 分鐘）

        0:00  打開 app        好奇
        0:05  載入完成        看到教學    ⚠️ 文字太長，3 行以上會跳過
        0:12  第一次設陷阱    有趣        ✅ Aha moment
        0:30  第一批冒險者    興奮        ✅ 看到效果
        1:30  等第二批...     無聊        🔴 空等 60 秒，churn risk

        EMOTION ARC: 好奇 → 興奮 → 無聊
        問題：1:30 的空窗期會殺死 D1 retention

你：    /gameplay-implementation-review
Claude: Diff: 847 LOC, 12 files
        [Pass 1 - Critical]
        🔴 DungeonManager.Update() — 每幀 new List<>()，GC 壓力
        🔴 TrapData 序列化沒有版本欄位，存檔升級會壞
        ⚠️ 傷害計算在 client side，多人模式下是作弊向量
        [Pass 2 - Informational]
        hardcoded magic number: trap_damage = 15

        AUTO-FIXED: 2 issues
        ASK: 3 issues（一個一個問你）
```

六個指令。從概念發想到 code review。每一步的產出餵給下一步。

---

## 遊戲開發 Sprint

gstack-game 是一套流程，不是工具集合。Skill 按照遊戲開發 sprint 排列：

**想 → 規劃 → 審查 → 做 → 測試 → 發布 → 回顧**

每個 skill 的產出餵給下一個。`/game-ideation` 產出概念文件，`/game-review` 讀它來審查。`/gameplay-implementation-review` 發現的問題，`/game-ship` 會確認已修。

| Skill | 你的專家 | 做什麼 |
|-------|---------|--------|
| `/game-ideation` | **遊戲設計 Mentor** | 用 Fantasy/Loop/Twist 結構化概念，6 個逼問問題挑戰前提，冰山驗證框架規劃下一步 |
| `/game-direction` | **製作人 / 創意總監** | 挑戰「為什麼做這個遊戲」，10 個認知模式審查方向，Scope 決策（ADD/KEEP/DEFER/CUT） |
| `/game-review` | **資深遊戲設計師** | GDD 審查：Core Loop、Progression、Economy、Motivation、Risk，量化 GDD Health Score |
| `/game-eng-review` | **技術總監** | 引擎選型、渲染管線、網路架構、資產管線、平台適配 |
| `/balance-review` | **數值策劃** | 難度曲線（Flow State）、Sink/Faucet 經濟、Gini 係數、pity system、獎勵心理學 |
| `/player-experience` | **UX 研究員** | 第一人稱玩家走查，6 種 persona，情緒模型，repeat play simulation |
| `/game-ux-review` | **UI/UX 設計師** | HUD 可讀性、選單流程、商店 UI、教學、控制器/觸控適配、無障礙 |
| `/pitch-review` | **投資人 / 發行商視角** | 市場定位、差異化、可行性、商業論證、冰山驗證等級 |
| `/prototype-slice-plan` | **製作策略師** | 決定先做什麼：哪個切片、驗證什麼假設、什麼可以 fake、失敗長什麼樣 |
| `/implementation-handoff` | **設計翻譯官** | 把設計意圖轉成 build package：玩法需求、驗收標準、MUST/SHOULD/COULD 優先級 |
| `/gameplay-implementation-review` | **資深遊戲程式** | 三層審查：Pass 0（設計意圖存活）+ Pass 1（frame budget、記憶體、同步）+ Pass 2（程式品質）。從 /gameplay-implementation-review 進化 |
| `/feel-pass` | **遊戲手感醫生** | 診斷機制為什麼感覺死了：回應性、衝擊感、節奏、清晰度、回饋。7 維 /14 評分。最「遊戲特有」的 skill |
| `/build-playability-review` | **可玩性裁判** | 「這值得玩嗎？」— 循環閉合、session 持續力、留存信號、高潮時刻。6 維 /12 評分 |
| `/gameplay-implementation-review` | **資深遊戲程式** | Two-Pass review：frame budget、記憶體、狀態同步、序列化、對抗性審查 |
| `/game-qa` | **QA Lead** | 8 維度測試：功能/視覺/效能/音效/輸入/相容性/本地化/進度，量化 Health Score |
| `/game-ship` | **發布工程師** | Build → Test → Changelog → PR → 平台提交（Steam/App Store/Google Play/Web） |
| `/game-debug` | **Debug 專家** | 3-strike 假設測試 + 根因分析，不猜答案 |
| `/game-retro` | **Scrum Master** | 交付率、bug 密度趨勢、velocity、milestone 健康度，最多 3 個 action items |
| `/game-codex` | **Chaos Engineer** | 獨立上下文的對抗性審查，找 exploit、desync、save corruption |
| `/game-docs` | **技術寫手** | 玩家看得懂的 patch notes + 內部 changelog + 文件掃描更新 |
| `/game-visual-qa` | **美術 QA** | 風格一致性、UI 對齊、動畫品質、螢幕適配、效能視覺 |
| `/asset-review` | **TA（技術美術）** | 命名規範、格式規格、效能預算、風格一致性、管線健康 |
| `/playtest` | **UX 研究員** | 測試計畫、觀察指標、訪談問題、數據分析框架、受試者招募 |

### 安全工具

| Skill | 做什麼 |
|-------|--------|
| `/careful` | 破壞性指令警告（rm -rf、force push、DROP TABLE） |
| `/guard` | `/careful` + 限制編輯範圍到特定目錄 |
| `/unfreeze` | 解除 `/guard` 的範圍限制 |

---

## 與 gstack 的關係

| | gstack | gstack-game |
|---|--------|-------------|
| **領域** | Web / SaaS 產品 | 遊戲開發 |
| **詞彙** | user, feature, API, MRR, churn | player, mechanic, core loop, retention, ARPDAU |
| **依賴** | 獨立 | 獨立（不需要安裝 gstack） |

**借用了 gstack 的：**
- Template Engine（SKILL.md.tmpl → gen-skill-docs.ts → SKILL.md）
- Preamble Injection（所有 skill 共享 session tracking、telemetry、AskUserQuestion 格式）
- 6 個審查方法論原理（分類先於判斷、量化評分公式、AUTO/ASK/ESCALATE、四段式提問、多維度交叉驗證、反諂媚工程化）
- Completion Protocol（DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT）

**全面重寫的：**
- 所有審查維度、評分標準、逼問問題 → 遊戲領域
- 新增 6 個遊戲專屬 skill（gstack 沒有的）
- 遊戲理論整合（MDA Framework、SDT、Flow State、Nested Loop Model、Sink/Faucet 經濟模型）

---

## 品質評估與限制

每個 skill 標注的百分比代表「領域判斷完成度」，不是程式碼品質。

| 分數 | 含義 |
|------|------|
| 70-80% | 結構完整 + 領域理論整合 + 量化評分公式。**可直接使用，專家微調即可** |
| 55-65% | 結構完整 + 遊戲詞彙替換 + AUTO/ASK/ESCALATE。**可用但領域深度不足** |
| 35-40% | 結構骨架 + 基本流程。**需要領域專家補充內容** |

工程骨架已達 gstack 同等品質。缺的是**遊戲產業的領域判斷**——評分權重、benchmark 數字、引擎特定審查點等需要有產業經驗的專家校準。詳見 `docs/domain-judgment-gaps.md`。

### 理論來源

| 來源 | 取用了什麼 |
|------|-----------|
| **[gstack](https://github.com/garrytan/gstack)** | 工程架構 + 6 個審查方法論原理 |
| **Claude-Code-Game-Studios** | MDA/SDT/Flow 理論、Nested Loop、Pillar methodology、經濟系統框架 |
| **guardian**（PlayerSimulatorAgent） | 玩家模擬 prompt、冰山驗證框架、Fantasy/Loop/Twist |

---

## 開發

```bash
bun run build                        # 從 .tmpl 生成所有 SKILL.md
bun run gen:skill-docs:check         # 檢查有沒有 drift（CI 用）
bun test                             # 跑 11 個驗證測試
```

### 新增 skill

1. 建 `skills/my-skill/SKILL.md.tmpl`
2. 用 `{{PREAMBLE}}` 注入共享行為
3. 用 `{{SKILL_NAME}}` 自動填入 skill 名稱
4. 跑 `bun run build`

---

## Privacy & Telemetry

gstack-game 包含 **opt-in** 的使用統計，預設關閉。

- **預設不收集。** 不會送任何東西到任何地方。
- **記錄內容（如果開啟）：** skill 名稱、執行時間、成功/失敗。僅此。
- **永不記錄：** 程式碼、檔案路徑、repo 名稱、prompt 內容。
- **隨時關閉：** `gstack-config set telemetry off`
- **本地分析：** 所有數據存在 `~/.gstack/analytics/skill-usage.jsonl`，純本地。

---

## 疑難排解

**Skill 沒出現？** 確認 SKILL.md 已生成：`cd .claude/skills/gstack-game && bun run build`

**模板 drift？** `bun run gen:skill-docs:check` — 如果報 DRIFT，跑 `bun run build` 重新生成

**Windows 用戶：** 在 Git Bash 或 WSL 下運行。bin/ 裡的 shell script 需要 bash。

**CLAUDE.md 裡沒有 skill 列表？** 加上這段：

```
## gstack-game
Available skills: /game-import, /game-ideation, /game-direction, /game-review,
/game-eng-review, /balance-review, /player-experience, /game-ux-review,
/pitch-review, /gameplay-implementation-review, /game-qa, /game-ship, /game-debug,
/game-retro, /game-codex, /game-docs, /game-visual-qa, /asset-review,
/playtest, /careful, /guard, /unfreeze.
```

---

## 文件

| 文件 | 內容 |
|------|------|
| [Builder Ethos](ETHOS.md) | 遊戲開發哲學：Boil the Lake、Search Before Building、Player Time is Sacred |
| [貢獻指南](CONTRIBUTING.zh-TW.md) | 三種貢獻方式（5 分鐘 Issue / 30 分鐘改 markdown / 進階寫 template） |
| [領域判斷待補清單](docs/domain-judgment-gaps.md) | 找專家討論用的完整 checklist |
| [開發指南](docs/DEVELOPMENT.md) | Skill map、migration guide、架構概覽 |
| [Changelog](CHANGELOG.md) | 版本變更記錄 |
| [CLAUDE.md](CLAUDE.md) | AI 代理在此 repo 工作時的 handoff 文件 |

---

## License

MIT

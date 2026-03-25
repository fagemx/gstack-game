# Good Skill Examples — What to Learn From Each

## Already refactored (use as templates)

### /balance-review — Best example for "numbers-focused review skill"
- Role: "economy mathematician — reviews numbers, not feelings"
- 8 reference files, 265L main template
- Mode routing (F2P / Premium / Competitive / Live)
- Section skip rules based on mode
- Each section: apply reference + score using rubric + STOP gate
- Anti-sycophancy: forbidden phrases + forcing questions with push-back scripts
- Scoring: explicit formula per section, weighted total

### /game-review — Best example for "comprehensive review with fix loop"
- Fix-then-rescore loop (re-read → re-score → update running score)
- Baseline → Final delta table with WARN if worse
- 5 review modes with weight adjustment table
- 8 reference files, 255L main template
- Downstream discoverability list

### /player-experience — Best example for "simulation/walkthrough skill"
- Role: "you are a player, not a reviewer"
- 6 persona definitions in references/personas.md
- Fixed emotion vocabulary in references/emotion-vocabulary.md
- Phase-based walkthrough (not section-based review)
- Scoring with explicit deduction formula (-1/-1.5/-3/-2)
- Player Journey Map ASCII output
- "Never suggest fixes" rule

### /pitch-review — Best example for "evaluation with recommendation"
- 6 forcing questions with specific push-back scripts
- Iceberg Validation Level (0-5)
- Recommendation thresholds (GREENLIGHT/PROTOTYPE/PIVOT/PASS) with explicit formula
- Operating posture ("push once, then push again")
- AI Confidence disclaimer (~70%)

## External references (not in gstack-game, for pattern study)

### arch-spec (C:\ai_agent\karvi\.claude\skills\arch-spec)
- Best progressive disclosure: 365L main + extensive references/
- Reads references at start with explicit `cat` commands
- Multiple operations (generate / review / add / shared-types)
- TodoWrite for external flow tracking
- Gotchas are the soul of the skill

### pr-review-loop (C:\ai_agent\.claude\skills\pr-review-loop)
- Best state externalization: bash driver script controls the loop
- Claude follows ACTION outputs, doesn't track state itself
- Fix scope is restricted (only PR diff files, minimal changes)
- Great for high-fragility workflows

### issue-pipeline (C:\ai_agent\.claude\skills\issue-pipeline)
- Best orchestrator: dispatches sub-agents, manages waves
- Dependency DAG resolution in references/
- Agent prompt templates in references/
- Interrupt recovery procedure in references/

### gstack /office-hours (C:\ai_project\gstack\office-hours)
- Best mode switching: Startup vs Builder, different posture per mode
- Anti-sycophancy three layers: forbidden phrases + pushback patterns + forcing questions
- Spec review loop with adversarial subagent
- Warning: too large (52KB generated), do not copy structure wholesale

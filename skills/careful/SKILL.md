---
name: careful
description: "Safety mode. Warns before destructive commands (rm -rf, DROP TABLE, git push -f, force delete). Does NOT restrict file editing scope — use /guard for that."
user_invocable: true
preamble-tier: 1
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
_GD_VERSION="0.3.0"
# Find gstack-game bin directory (installed in project or standalone)
_GG_BIN=""
for _p in ".claude/skills/gstack-game/bin" ".claude/skills/game-review/../../gstack-game/bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"

# Project identification
_SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_USER=$(whoami 2>/dev/null || echo "unknown")

# Session tracking
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"

# Shared artifact storage (cross-skill, cross-session)
mkdir -p ~/.gstack/projects/$_SLUG
_PROJECTS_DIR=~/.gstack/projects/$_SLUG

# Telemetry (sanitize inputs before JSON interpolation)
mkdir -p ~/.gstack/analytics
_SLUG_SAFE=$(printf '%s' "$_SLUG" | tr -d '"\\\n\r\t')
_BRANCH_SAFE=$(printf '%s' "$_BRANCH" | tr -d '"\\\n\r\t')
echo '{"skill":"careful","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG_SAFE"'","branch":"'"$_BRANCH_SAFE"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

echo "SLUG: $_SLUG"
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "PROJECTS_DIR: $_PROJECTS_DIR"
echo "GD_VERSION: $_GD_VERSION"

# Artifact summary
_ARTIFACT_COUNT=$(ls "$_PROJECTS_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
[ "$_ARTIFACT_COUNT" -gt 0 ] && echo "Artifacts: $_ARTIFACT_COUNT files in $_PROJECTS_DIR" && ls -t "$_PROJECTS_DIR"/*.md 2>/dev/null | head -5 | while read f; do echo "  $(basename "$f")"; done
```

**Shared artifact directory:** `$_PROJECTS_DIR` (`~/.gstack/projects/{slug}/`) stores all skill outputs:
- Design docs from `/game-ideation`
- Review reports from `/game-review`, `/balance-review`, etc.
- Player journey maps from `/player-experience`

All skills read from this directory on startup to find prior work. All skills write their output here for downstream consumption.

If `PROACTIVE` is `"false"`, do not proactively suggest gstack-game skills.

## Completion Status Protocol

DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT.
Escalation after 3 failed attempts.


## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "careful" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /careful: Destructive Command Safety

Activates heightened awareness for destructive operations. When active, flag and confirm before executing any potentially destructive command.

## What triggers a warning

| Pattern | Risk | Action |
|---------|------|--------|
| `rm -rf` (except node_modules, .next, dist, build, __pycache__) | File deletion | Confirm before executing |
| `git push -f` / `git push --force` | History rewrite | Confirm + warn about remote impact |
| `git reset --hard` | Uncommitted work loss | Confirm + suggest stash first |
| `git clean -f` | Untracked file deletion | Confirm + list what will be deleted |
| `git branch -D` | Branch deletion | Confirm + check if merged |
| `DROP TABLE` / `DROP DATABASE` | Data destruction | Confirm + verify environment |
| `TRUNCATE` | Data deletion | Confirm |
| `docker system prune` | Container cleanup | Confirm |
| Kill/stop commands on game servers | Service disruption | Confirm + check player count |

## Safe exceptions (no warning needed)

```
rm -rf node_modules/
rm -rf .next/
rm -rf dist/
rm -rf build/
rm -rf __pycache__/
rm -rf .cache/
rm -rf tmp/
git push (without -f)
```

## Activation

This skill is activated by invoking `/careful`. It stays active for the remainder of the session.

When active, before any Bash command that matches a warning pattern:

> ⚠️ **CAREFUL MODE**: This command will [describe impact].
> Affected: [list files/data/branches]
> Reversible: [yes/no/partially]
>
> Proceed? (confirm to execute)

## Deactivation

Say "turn off careful mode" or start a new session.

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"careful","timestamp":"TIMESTAMP","status":"ACTIVATED","commit":"COMMIT"}' 2>/dev/null || true
```

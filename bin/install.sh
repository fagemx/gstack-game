#!/bin/bash
# gstack-game installer
# Copies game design skills + routing skill + bin utilities into the target project's .claude/skills/
#
# Usage:
#   /path/to/gstack-game/bin/install.sh .                     # install to current project
#   /path/to/gstack-game/bin/install.sh /my/game              # install to specific project
#   /path/to/gstack-game/bin/install.sh --prefix /my/game     # use gg- prefix (namespaced)
#   /path/to/gstack-game/bin/install.sh --no-prefix /my/game  # use short names (no prefix)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_CMD="$SCRIPT_DIR/bin/gstack-config"

# ─── Parse flags ──────────────────────────────────────────────
PREFIX_FLAG=""
TARGET=""
for arg in "$@"; do
  case "$arg" in
    --prefix)    PREFIX_FLAG="namespaced" ;;
    --no-prefix) PREFIX_FLAG="short" ;;
    -*)          echo "Unknown flag: $arg"; exit 1 ;;
    *)           TARGET="$arg" ;;
  esac
done
TARGET="${TARGET:-.}"

if [ ! -d "$TARGET" ]; then
  echo "Error: Target directory '$TARGET' does not exist."
  exit 1
fi

# ─── Determine skill prefix mode ─────────────────────────────
SKILL_PREFIX=""
if [ -n "$PREFIX_FLAG" ]; then
  SKILL_PREFIX="$PREFIX_FLAG"
elif SAVED="$("$CONFIG_CMD" get skill_prefix 2>/dev/null)" && [ -n "$SAVED" ]; then
  SKILL_PREFIX="$SAVED"
else
  # Interactive prompt (skip in non-TTY / CI — default to short)
  if [ -t 0 ]; then
    echo ""
    echo "How should gstack-game skills appear?"
    echo "  A) Short names: /game-review, /balance-review  (recommended)"
    echo "  B) Namespaced:  /gg-game-review, /gg-balance-review"
    echo ""
    printf "Choose [A/b] (auto-selects A in 10s): "
    if read -t 10 -r CHOICE 2>/dev/null; then
      case "$CHOICE" in
        [Bb]) SKILL_PREFIX="namespaced" ;;
        *)    SKILL_PREFIX="short" ;;
      esac
    else
      echo ""
      echo "  → Auto-selected: short names"
      SKILL_PREFIX="short"
    fi
  else
    SKILL_PREFIX="short"
  fi
fi

# Save preference
"$CONFIG_CMD" set skill_prefix "$SKILL_PREFIX" 2>/dev/null || true

echo "Installing gstack-game to $TARGET/.claude/skills/ (prefix: $SKILL_PREFIX) ..."

# 1. Create gstack-game hub directory for bin/ and routing skill
mkdir -p "$TARGET/.claude/skills/gstack-game/bin"

# 2. Copy bin utilities
cp "$SCRIPT_DIR"/bin/gstack-* "$TARGET/.claude/skills/gstack-game/bin/" 2>/dev/null || true
chmod +x "$TARGET/.claude/skills/gstack-game/bin/"* 2>/dev/null || true
echo "  ✓ bin/ utilities"

# 3. Copy root-level routing skill (tells Claude when to suggest which skill)
if [ -f "$SCRIPT_DIR/SKILL.md" ]; then
  cp "$SCRIPT_DIR/SKILL.md" "$TARGET/.claude/skills/gstack-game/SKILL.md"
  echo "  ✓ routing skill (gstack-game/SKILL.md)"
fi

# 4. Copy all skills (skip 'shared' — it's baked into SKILL.md via template engine)
#    If namespaced mode, install as gg-{skillname}; if short, install as {skillname}.
#    Clean up any leftover directories from the other naming mode.
SKILL_COUNT=0
for skill_dir in "$SCRIPT_DIR/skills"/*/; do
  skill_name=$(basename "$skill_dir")
  [ "$skill_name" = "shared" ] && continue
  if [ -f "$skill_dir/SKILL.md" ]; then
    if [ "$SKILL_PREFIX" = "namespaced" ]; then
      dest_name="gg-${skill_name}"
      old_name="$skill_name"
    else
      dest_name="$skill_name"
      old_name="gg-${skill_name}"
    fi
    # Remove old-mode directory if switching prefix modes
    if [ -d "$TARGET/.claude/skills/$old_name" ]; then
      rm -rf "$TARGET/.claude/skills/$old_name"
    fi
    cp -r "$skill_dir" "$TARGET/.claude/skills/$dest_name"
    echo "  ✓ /$dest_name"
    SKILL_COUNT=$((SKILL_COUNT + 1))
  fi
done

# 5. Add gstack-game section to CLAUDE.md if it doesn't exist
#    Skill list reflects the chosen prefix mode.
CLAUDE_MD="$TARGET/CLAUDE.md"

if [ "$SKILL_PREFIX" = "namespaced" ]; then
  SKILL_LIST="/gg-game-import, /gg-game-ideation, /gg-game-direction, /gg-game-review, /gg-game-eng-review,
/gg-balance-review, /gg-player-experience, /gg-game-ux-review, /gg-pitch-review,
/gg-gameplay-implementation-review, /gg-game-qa, /gg-game-ship, /gg-game-debug, /gg-game-retro,
/gg-game-codex, /gg-game-docs, /gg-game-visual-qa, /gg-asset-review, /gg-playtest,
/gg-careful, /gg-guard, /gg-unfreeze."
else
  SKILL_LIST="/game-import, /game-ideation, /game-direction, /game-review, /game-eng-review,
/balance-review, /player-experience, /game-ux-review, /pitch-review,
/gameplay-implementation-review, /game-qa, /game-ship, /game-debug, /game-retro,
/game-codex, /game-docs, /game-visual-qa, /asset-review, /playtest,
/careful, /guard, /unfreeze."
fi

GSTACK_SECTION="## gstack-game

Game development workflow skills are installed. Available skills:
${SKILL_LIST}"

if [ -f "$CLAUDE_MD" ]; then
  if ! grep -q "gstack-game" "$CLAUDE_MD" 2>/dev/null; then
    printf '\n%s\n' "$GSTACK_SECTION" >> "$CLAUDE_MD"
    echo "  ✓ Updated CLAUDE.md with skill list"
  else
    echo "  · CLAUDE.md already has gstack-game section"
  fi
else
  printf '%s\n' "$GSTACK_SECTION" > "$CLAUDE_MD"
  echo "  ✓ Created CLAUDE.md with skill list"
fi

echo ""
echo "Done! $SKILL_COUNT skills installed (prefix: $SKILL_PREFIX)."
echo ""
if [ "$SKILL_PREFIX" = "namespaced" ]; then
  P="gg-"
else
  P=""
fi
echo "Restart Claude Code to discover new skills, then try:"
echo "  /${P}game-ideation      — brainstorm a game concept"
echo "  /${P}game-review        — review a game design document"
echo "  /${P}player-experience  — simulate a player walkthrough"
echo "  /${P}gameplay-implementation-review   — game-aware PR code review"

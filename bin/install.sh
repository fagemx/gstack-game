#!/bin/bash
# gstack-game installer
# Copies game design skills + routing skill + bin utilities into the target project's .claude/skills/
#
# Usage:
#   /path/to/gstack-game/bin/install.sh .          # install to current project
#   /path/to/gstack-game/bin/install.sh /my/game    # install to specific project

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-.}"

if [ ! -d "$TARGET" ]; then
  echo "Error: Target directory '$TARGET' does not exist."
  exit 1
fi

echo "Installing gstack-game to $TARGET/.claude/skills/ ..."

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
SKILL_COUNT=0
for skill_dir in "$SCRIPT_DIR/skills"/*/; do
  skill_name=$(basename "$skill_dir")
  [ "$skill_name" = "shared" ] && continue
  if [ -f "$skill_dir/SKILL.md" ]; then
    cp -r "$skill_dir" "$TARGET/.claude/skills/$skill_name"
    echo "  ✓ /$skill_name"
    SKILL_COUNT=$((SKILL_COUNT + 1))
  fi
done

# 5. Add gstack-game section to CLAUDE.md if it doesn't exist
CLAUDE_MD="$TARGET/CLAUDE.md"
if [ -f "$CLAUDE_MD" ]; then
  if ! grep -q "gstack-game" "$CLAUDE_MD" 2>/dev/null; then
    cat >> "$CLAUDE_MD" << 'SECTION'

## gstack-game

Game development workflow skills are installed. Available skills:
/game-ideation, /game-direction, /game-review, /game-eng-review,
/balance-review, /player-experience, /game-ux-review, /pitch-review,
/game-code-review, /game-qa, /game-ship, /game-debug, /game-retro,
/game-codex, /game-docs, /game-visual-qa, /asset-review, /playtest,
/careful, /guard, /unfreeze.
SECTION
    echo "  ✓ Updated CLAUDE.md with skill list"
  else
    echo "  · CLAUDE.md already has gstack-game section"
  fi
else
  cat > "$CLAUDE_MD" << 'SECTION'
## gstack-game

Game development workflow skills are installed. Available skills:
/game-ideation, /game-direction, /game-review, /game-eng-review,
/balance-review, /player-experience, /game-ux-review, /pitch-review,
/game-code-review, /game-qa, /game-ship, /game-debug, /game-retro,
/game-codex, /game-docs, /game-visual-qa, /asset-review, /playtest,
/careful, /guard, /unfreeze.
SECTION
  echo "  ✓ Created CLAUDE.md with skill list"
fi

echo ""
echo "Done! $SKILL_COUNT skills installed."
echo ""
echo "Restart Claude Code to discover new skills, then try:"
echo "  /game-ideation      — brainstorm a game concept"
echo "  /game-review        — review a game design document"
echo "  /player-experience  — simulate a player walkthrough"
echo "  /game-code-review   — game-aware PR code review"

#!/bin/bash
# gstack-game installer
# Copies game design skills + bin utilities into the target project's .claude/skills/

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-.}"

mkdir -p "$TARGET/.claude/skills/gstack-game/bin"

# Copy bin utilities
echo "Installing gstack-game to $TARGET/.claude/skills/ ..."
cp "$SCRIPT_DIR"/bin/gstack-* "$TARGET/.claude/skills/gstack-game/bin/" 2>/dev/null
chmod +x "$TARGET/.claude/skills/gstack-game/bin/"* 2>/dev/null
echo "  ✓ bin/ utilities"

# Copy skills (skip 'shared' — it's baked into SKILL.md via template engine)
for skill_dir in "$SCRIPT_DIR/skills"/*/; do
  skill_name=$(basename "$skill_dir")
  [ "$skill_name" = "shared" ] && continue
  if [ -f "$skill_dir/SKILL.md" ]; then
    cp -r "$skill_dir" "$TARGET/.claude/skills/$skill_name"
    echo "  ✓ /$skill_name"
  fi
done

echo ""
echo "Done. Restart Claude Code to discover new skills."
echo "Available: /game-review  /balance-review  /player-experience  /pitch-review"

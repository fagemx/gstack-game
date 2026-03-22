#!/bin/bash
# gstack-game installer
# Copies game design skills into the target project's .claude/skills/

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-.}"

# Check gstack is installed
if [ ! -d "$TARGET/.claude/skills/gstack" ] && [ ! -d "$TARGET/.claude/skills/plan-eng-review" ]; then
  echo "⚠️  gstack not found in $TARGET/.claude/skills/"
  echo "   gstack-game depends on gstack infrastructure (review log, telemetry, config)."
  echo "   Install gstack first, then re-run this installer."
  exit 1
fi

# Copy skills (skip 'shared' — it's internal)
echo "Installing gstack-game skills to $TARGET/.claude/skills/ ..."
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

#!/usr/bin/env bun
/**
 * gstack-game Template Engine
 *
 * Pattern borrowed from gstack: SKILL.md.tmpl + shared fragments → SKILL.md
 *
 * Usage:
 *   bun scripts/gen-skill-docs.ts           # generate all SKILL.md
 *   bun scripts/gen-skill-docs.ts --dry-run # check for drift without writing
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dir, "..");
const SKILLS_DIR = join(ROOT, "skills");
const SHARED_DIR = join(SKILLS_DIR, "shared");
const DRY_RUN = process.argv.includes("--dry-run");

// Read shared fragments
function readFragment(name: string): string {
  const path = join(SHARED_DIR, `${name}.md`);
  if (!existsSync(path)) {
    console.error(`Fragment not found: ${path}`);
    process.exit(1);
  }
  return readFileSync(path, "utf-8");
}

// Placeholder registry
const fragments: Record<string, string> = {
  "{{PREAMBLE}}": readFragment("preamble"),
};

// Process a single template
function processTemplate(tmplPath: string, skillName: string): string {
  let content = readFileSync(tmplPath, "utf-8");

  // Replace shared fragments
  for (const [placeholder, fragment] of Object.entries(fragments)) {
    content = content.replaceAll(placeholder, fragment);
  }

  // Replace skill-specific variables
  content = content.replaceAll("{{SKILL_NAME}}", skillName);

  return content;
}

// Main
let driftCount = 0;

// Process root-level SKILL.md.tmpl (routing skill) if it exists
const rootTmpl = join(ROOT, "SKILL.md.tmpl");
const rootOut = join(ROOT, "SKILL.md");
if (existsSync(rootTmpl)) {
  const generated = processTemplate(rootTmpl, "gstack-game");
  if (DRY_RUN) {
    if (existsSync(rootOut)) {
      const existing = readFileSync(rootOut, "utf-8");
      if (existing !== generated) {
        console.log(`  DRIFT: SKILL.md (root)`);
        driftCount++;
      } else {
        console.log(`  ✓ SKILL.md (root, up to date)`);
      }
    } else {
      console.log(`  MISSING: SKILL.md (root)`);
      driftCount++;
    }
  } else {
    writeFileSync(rootOut, generated, "utf-8");
    console.log(`  ✓ SKILL.md (root)`);
  }
}

const skillDirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== "shared")
  .map((d) => d.name);

for (const skillName of skillDirs) {
  const tmplPath = join(SKILLS_DIR, skillName, "SKILL.md.tmpl");
  const outPath = join(SKILLS_DIR, skillName, "SKILL.md");

  if (!existsSync(tmplPath)) {
    // No template, check if SKILL.md exists as hand-written
    if (existsSync(outPath)) {
      console.log(`  ⚠ ${skillName}: hand-written SKILL.md (no .tmpl)`);
    } else {
      console.log(`  ✗ ${skillName}: missing SKILL.md and SKILL.md.tmpl`);
    }
    continue;
  }

  const generated = processTemplate(tmplPath, skillName);

  if (DRY_RUN) {
    if (existsSync(outPath)) {
      const existing = readFileSync(outPath, "utf-8");
      if (existing !== generated) {
        console.log(`  DRIFT: ${skillName}/SKILL.md`);
        driftCount++;
      } else {
        console.log(`  ✓ ${skillName}/SKILL.md (up to date)`);
      }
    } else {
      console.log(`  MISSING: ${skillName}/SKILL.md`);
      driftCount++;
    }
  } else {
    writeFileSync(outPath, generated, "utf-8");
    console.log(`  ✓ ${skillName}/SKILL.md`);
  }
}

if (DRY_RUN && driftCount > 0) {
  console.error(`\n${driftCount} file(s) drifted. Run without --dry-run to fix.`);
  process.exit(1);
}

console.log("\nDone.");

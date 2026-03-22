#!/usr/bin/env bun
/**
 * Basic validation for gstack-game skill templates.
 *
 * Tier 1 tests (free, fast, no LLM needed):
 * - Every skill dir has a SKILL.md.tmpl
 * - Every template has valid YAML frontmatter
 * - Every template uses {{PREAMBLE}}
 * - gen-skill-docs produces matching SKILL.md (no drift)
 * - Generated SKILL.md contains expanded preamble (not raw {{PREAMBLE}})
 */

import { describe, test, expect } from "bun:test";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dir, "..");
const SKILLS_DIR = join(ROOT, "skills");

const skillDirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== "shared")
  .map((d) => d.name);

describe("skill templates", () => {
  test("all skill directories have SKILL.md.tmpl", () => {
    const missing: string[] = [];
    for (const name of skillDirs) {
      if (!existsSync(join(SKILLS_DIR, name, "SKILL.md.tmpl"))) {
        missing.push(name);
      }
    }
    expect(missing).toEqual([]);
  });

  test("all templates have YAML frontmatter with name and description", () => {
    const invalid: string[] = [];
    for (const name of skillDirs) {
      const tmpl = join(SKILLS_DIR, name, "SKILL.md.tmpl");
      if (!existsSync(tmpl)) continue;
      const content = readFileSync(tmpl, "utf-8");
      if (!content.startsWith("---\n")) {
        invalid.push(`${name}: missing frontmatter`);
        continue;
      }
      const endIdx = content.indexOf("\n---\n", 4);
      if (endIdx === -1) {
        invalid.push(`${name}: unclosed frontmatter`);
        continue;
      }
      const frontmatter = content.slice(4, endIdx);
      if (!frontmatter.includes("name:")) {
        invalid.push(`${name}: missing name in frontmatter`);
      }
      if (!frontmatter.includes("description:")) {
        invalid.push(`${name}: missing description in frontmatter`);
      }
    }
    expect(invalid).toEqual([]);
  });

  test("all templates use {{PREAMBLE}}", () => {
    const missing: string[] = [];
    for (const name of skillDirs) {
      const tmpl = join(SKILLS_DIR, name, "SKILL.md.tmpl");
      if (!existsSync(tmpl)) continue;
      const content = readFileSync(tmpl, "utf-8");
      if (!content.includes("{{PREAMBLE}}")) {
        missing.push(name);
      }
    }
    expect(missing).toEqual([]);
  });

  test("all templates have user_invocable: true", () => {
    const missing: string[] = [];
    for (const name of skillDirs) {
      const tmpl = join(SKILLS_DIR, name, "SKILL.md.tmpl");
      if (!existsSync(tmpl)) continue;
      const content = readFileSync(tmpl, "utf-8");
      if (!content.includes("user_invocable: true")) {
        missing.push(name);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe("generated SKILL.md", () => {
  test("all skill directories have generated SKILL.md", () => {
    const missing: string[] = [];
    for (const name of skillDirs) {
      if (!existsSync(join(SKILLS_DIR, name, "SKILL.md"))) {
        missing.push(name);
      }
    }
    expect(missing).toEqual([]);
  });

  test("no SKILL.md contains raw {{PREAMBLE}} placeholder", () => {
    const raw: string[] = [];
    for (const name of skillDirs) {
      const md = join(SKILLS_DIR, name, "SKILL.md");
      if (!existsSync(md)) continue;
      const content = readFileSync(md, "utf-8");
      if (content.includes("{{PREAMBLE}}")) {
        raw.push(name);
      }
    }
    expect(raw).toEqual([]);
  });

  test("no SKILL.md contains raw {{SKILL_NAME}} placeholder", () => {
    const raw: string[] = [];
    for (const name of skillDirs) {
      const md = join(SKILLS_DIR, name, "SKILL.md");
      if (!existsSync(md)) continue;
      const content = readFileSync(md, "utf-8");
      if (content.includes("{{SKILL_NAME}}")) {
        raw.push(name);
      }
    }
    expect(raw).toEqual([]);
  });

  test("gen-skill-docs --dry-run reports no drift", () => {
    const output = execSync("bun scripts/gen-skill-docs.ts --dry-run", {
      cwd: ROOT,
      encoding: "utf-8",
    });
    expect(output).not.toContain("DRIFT");
  });
});

describe("preamble", () => {
  test("shared/preamble.md exists", () => {
    expect(existsSync(join(SKILLS_DIR, "shared", "preamble.md"))).toBe(true);
  });

  test("preamble contains AskUserQuestion format", () => {
    const content = readFileSync(
      join(SKILLS_DIR, "shared", "preamble.md"),
      "utf-8"
    );
    expect(content).toContain("AskUserQuestion");
  });

  test("preamble contains Completion Status Protocol", () => {
    const content = readFileSync(
      join(SKILLS_DIR, "shared", "preamble.md"),
      "utf-8"
    );
    expect(content).toContain("DONE");
    expect(content).toContain("BLOCKED");
  });
});

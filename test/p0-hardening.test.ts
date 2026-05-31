#!/usr/bin/env bun
/**
 * P0 hardening regressions adapted from recent gstack changes.
 *
 * These tests pin the game-specific version of:
 * - AskUserQuestion option-overflow handling
 * - public-output redaction guardrails
 * - strict-YAML-safe inline scalar rendering
 */

import { describe, expect, test } from "bun:test";
import { execFileSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";

const ROOT = join(import.meta.dir, "..");

describe("AskUserQuestion option overflow", () => {
  test("preamble-standard forbids dropping game options when a decision has more than four choices", () => {
    const preamble = readFileSync(join(ROOT, "skills", "shared", "preamble-standard.md"), "utf-8");

    expect(preamble).toContain("Option Overflow");
    expect(preamble).toContain("Never drop game options");
    expect(preamble).toContain("Include / Defer / Cut / Hold");
    expect(preamble).toContain("/game-ship");
    expect(preamble).toContain("/game-import");
  });
});

describe("redaction lite", () => {
  const redactCli = join(ROOT, "bin", "gstack-game-redact");

  test("redaction CLI exists and blocks high-confidence credentials", () => {
    expect(existsSync(redactCli)).toBe(true);
    if (!existsSync(redactCli)) return;

    try {
      execFileSync("bun", [redactCli, "--json"], {
        cwd: ROOT,
        input: "GitHub token: ghp_123456789012345678901234567890123456",
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      expect.unreachable("credential scan should block");
    } catch (err: any) {
      expect(err.status).toBe(3);
      const parsed = JSON.parse(err.stdout.toString());
      expect(parsed.counts.high).toBe(1);
    }
  });

  test("redaction CLI flags player emails as medium findings for review", () => {
    expect(existsSync(redactCli)).toBe(true);
    if (!existsSync(redactCli)) return;

    try {
      execFileSync("bun", [redactCli, "--json"], {
        cwd: ROOT,
        input: "Playtest signup: player@example.com",
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      expect.unreachable("PII scan should require review");
    } catch (err: any) {
      expect(err.status).toBe(2);
      const parsed = JSON.parse(err.stdout.toString());
      expect(parsed.counts.medium).toBe(1);
      expect(parsed.findings[0].category).toBe("pii");
    }
  });
});

describe("strict YAML helpers", () => {
  test("frontmatter list headers are not converted into empty strings", () => {
    const rootSkill = readFileSync(join(ROOT, "SKILL.md"), "utf-8");

    expect(rootSkill).toContain("allowed-tools:\n  - Bash");
    expect(rootSkill).not.toContain("allowed-tools: \"\"");
  });

  test("inline scalar helper quotes descriptions with YAML mapping ambiguity", async () => {
    const helperPath = join(ROOT, "scripts", "yaml.ts");
    expect(existsSync(helperPath)).toBe(true);
    if (!existsSync(helperPath)) return;

    const mod = await import(pathToFileURL(helperPath).href);
    expect(mod.toYamlInlineScalar("Game release workflow: build, test, ship")).toBe(
      JSON.stringify("Game release workflow: build, test, ship"),
    );
    expect(mod.toYamlInlineScalar("Simple description")).toBe("Simple description");
  });
});

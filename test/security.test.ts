#!/usr/bin/env bun
/**
 * Security regression tests for telemetry and review-log.
 *
 * Validates:
 * - gstack-review-log JSON parsing gate (rejects malformed/injection payloads)
 * - preamble-core.md sanitization of slug and branch before JSON interpolation
 * - gstack-telemetry-log json_safe(), duration validation, UUID generation
 */

import { describe, test, expect } from "bun:test";
import { execFileSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { delimiter, join } from "path";

const ROOT = join(import.meta.dir, "..");
const BIN = join(ROOT, "bin");

function resolveBash(): string {
  if (process.platform !== "win32") return "bash";

  const pathCandidates = (process.env.PATH || "")
    .split(delimiter)
    .filter(Boolean)
    .map((dir) => join(dir, "bash.exe"))
    .filter((candidate) => !candidate.toLowerCase().includes("\\windows\\system32\\bash.exe"));

  const candidates = [
    "C:\\Program Files\\Git\\bin\\bash.exe",
    "C:\\Program Files\\Git\\usr\\bin\\bash.exe",
    "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
    "C:\\Program Files (x86)\\Git\\usr\\bin\\bash.exe",
    ...pathCandidates,
  ];

  return candidates.find((candidate) => existsSync(candidate)) || "bash";
}

const BASH = resolveBash();

function runReviewLog(payload: string): string {
  return execFileSync(
    BASH,
    [join(BIN, "gstack-review-log"), payload],
    { cwd: ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
  );
}

// ─── gstack-review-log security ─────────────────────────────────────

describe("gstack-review-log security", () => {
  test("accepts valid JSON", () => {
    const result = runReviewLog('{"skill":"test","timestamp":"2024-01-01","status":"pass"}');
    // Exit code 0 means it didn't throw
  });

  test("rejects malformed JSON", () => {
    try {
      runReviewLog("{broken");
      // Should not reach here
      expect(true).toBe(false);
    } catch (err: any) {
      expect(err.status).toBe(1);
      expect(err.stderr.toString()).toContain("invalid JSON");
    }
  });

  test("rejects injection payload", () => {
    try {
      runReviewLog('{"a":"b' + "\n" + '"injected":"c"}');
      expect(true).toBe(false);
    } catch (err: any) {
      expect(err.status).toBe(1);
    }
  });
});

// ─── preamble security ──────────────────────────────────────────────

describe("preamble security", () => {
  const preambleCore = readFileSync(
    join(ROOT, "skills", "shared", "preamble-core.md"),
    "utf-8"
  );

  test("telemetry line uses _SLUG_SAFE", () => {
    expect(preambleCore).toContain("_SLUG_SAFE");
  });

  test("telemetry line uses _BRANCH_SAFE", () => {
    expect(preambleCore).toContain("_BRANCH_SAFE");
  });

  test("sanitization strips quotes", () => {
    // Both _SLUG_SAFE and _BRANCH_SAFE use tr -d to strip dangerous chars
    expect(preambleCore).toContain('tr -d');
  });
});

// ─── gstack-telemetry-log security ──────────────────────────────────

describe("gstack-telemetry-log security", () => {
  const telemetryLog = readFileSync(
    join(BIN, "gstack-telemetry-log"),
    "utf-8"
  );

  test("contains json_safe function", () => {
    expect(telemetryLog).toContain("json_safe");
  });

  test("sanitizes SKILL field", () => {
    expect(telemetryLog).toContain('json_safe "$SKILL"');
  });

  test("validates duration range", () => {
    // Duration is capped at 86400 seconds (24 hours)
    expect(telemetryLog).toContain("86400");
  });

  test("uses random UUID not hostname hash", () => {
    expect(telemetryLog).toContain("uuidgen");
    expect(telemetryLog).not.toContain("shasum");
  });
});

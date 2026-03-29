#!/usr/bin/env bun
/**
 * Game Design Auto-Review Pipeline
 *
 * 3-stage pipeline: Game Design Interrogation → Auto-Fix → Independent Scoring
 * with review-fix loop until score threshold is met.
 *
 * Usage:
 *   bun run scripts/game-autoplan.ts --input <dir> [options]
 *   bun run scripts/game-autoplan.ts --doc gdd --input <dir>  # single document
 *   bun run scripts/game-autoplan.ts --dry-run --input <dir>  # preview only
 */

import * as path from 'path';
import type { PipelineConfig } from './game-autoplan/types';
import { runPipeline } from './game-autoplan/runner';
import { generateDashboard } from './game-autoplan/dashboard';

function parseArgs(args: string[]): PipelineConfig {
  const get = (flag: string, fallback: string): string => {
    const idx = args.indexOf(flag);
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : fallback;
  };
  const has = (flag: string): boolean => args.includes(flag);

  const input_dir = get('--input', '');
  if (!input_dir && !has('--help')) {
    console.error('Error: --input <dir> is required');
    process.exit(1);
  }

  const output_dir = get('--output', path.join(path.dirname(input_dir), 'review-results'));

  return {
    input_dir,
    output_dir,
    concurrency: Number(get('--concurrency', '3')),
    max_loops: Number(get('--max-loops', '3')),
    pass_threshold: Number(get('--threshold', '7')),
    model: get('--model', 'claude-sonnet-4-6'),
    budget: Number(get('--budget', '10')),
    dry_run: has('--dry-run'),
    resume: has('--resume'),
    single_doc: get('--doc', '') || undefined,
  };
}

function printHelp() {
  console.log(`
Game Design Auto-Review Pipeline

3-stage pipeline: Interrogation → Auto-Fix → Scoring
Each game design document is reviewed through 6 forcing questions,
auto-fixed for weak areas, then independently scored on 6 dimensions.
Loop continues until score >= threshold or max rounds reached.

Usage:
  bun run scripts/game-autoplan.ts --input <dir> [options]

Options:
  --input <dir>       Directory containing game design .md files (required)
  --output <dir>      Output directory (default: {input}/../review-results)
  --concurrency <n>   Parallel document processing (default: 3)
  --max-loops <n>     Max fix-score rounds per document (default: 3)
  --threshold <n>     Pass score threshold (default: 7)
  --model <model>     Anthropic model ID (default: claude-sonnet-4-6)
  --budget <n>        Max spend in USD (default: 10)
  --dry-run           Preview without API calls
  --doc <id>          Process single document (substring match on filename)
  --resume            Resume from existing artifacts (skip completed stages)
  --help              Show this help

Stages:
  1. Interrogate — 6 game forcing questions (Role A: Producer, Role B: Designer)
     Produces gap-analysis.json per document

  2. Auto-Fix — Revise weak sections (severity < 7) with specific game design solutions
     Produces revised-v{N}.md per round

  3. Score — Independent 6-dimension scoring (does NOT see fixer's reasoning)
     Dimensions: Core Loop, Retention, Player Specificity, Scope, Playtest, Differentiation
     Produces score-v{N}.json per round

Output:
  {output_dir}/
    {doc-id}/
      gap-analysis.json     Stage 1 findings
      revised-v1.md         Stage 2 round 1
      score-v1.json         Stage 3 round 1
      revised-v2.md         Stage 2 round 2 (if needed)
      score-v2.json         Stage 3 round 2 (if needed)
      final.md              Best scoring revision
    dashboard.md            Summary report
    dashboard.json          Machine-readable results
    cost-report.json        Token usage and costs
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const config = parseArgs(args);
  const start = Date.now();

  const { results, costSummary } = await runPipeline(config);

  if (!config.dry_run && results.length > 0) {
    generateDashboard(results, costSummary, config.output_dir);

    const elapsed = ((Date.now() - start) / 1000).toFixed(0);
    const passed = results.filter(r => r.status === 'pass').length;
    console.log(`\n========================================`);
    console.log(`  Complete: ${results.length} documents in ${elapsed}s`);
    console.log(`  Pass: ${passed}/${results.length} (threshold: ${config.pass_threshold})`);
    console.log(`  Cost: $${costSummary.total_cost_usd}`);
    console.log(`========================================\n`);
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
